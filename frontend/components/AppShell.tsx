'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { clearAuth, fetchNotifications, markNotificationsRead, getStoredUser } from '../lib/api';
import { getInitials } from '../lib/utils';

interface NavItem {
  label: string;
  href: string;
  badge?: string | number;
}

interface AppShellProps {
  pageTitle: string;
  sidebarRole: string;
  navItems: NavItem[];
  children: React.ReactNode;
}

export default function AppShell({ pageTitle, sidebarRole, navItems, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ full_name?: string; role?: string } | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const activePath = useMemo(() => pathname || '/', [pathname]);

  async function toggleNotifications() {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (nextOpen) {
      try {
        const items = await fetchNotifications();
        setNotifications(items || []);
        await markNotificationsRead();
      } catch {
        setNotifications([]);
      }
    }
  }

  function handleLogout() {
    clearAuth();
    router.push('/');
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">i<span>Vote</span></div>
          <div className="brand-sub">{sidebarRole}</div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`nav-item${activePath === item.href ? ' active' : ''}`}>
              <span>{item.label}</span>
              {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="user-avatar" id="sb-avatar">{getInitials(user?.full_name)}</div>
            <div>
              <div className="user-name" id="sb-name">{user?.full_name || 'Loading…'}</div>
              <div className="user-role" id="sb-role">{user?.role === 'election_head' ? 'Election Head' : 'Student'}</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar-title">{pageTitle}</div>
          <div className="topbar-right">
            <div className="notif-wrap">
              <button type="button" className="notif-btn" id="notif-btn" title="Notifications" onClick={toggleNotifications}>
                🔔<span className="notif-dot" style={{ display: notifications.some((item) => !item.is_read) ? 'block' : 'none' }} />
              </button>
              <div className={`notif-panel${isOpen ? ' open' : ''}`} id="notif-panel">
                <div className="notif-panel-header">Notifications</div>
                <div className="notif-list" id="notif-list">
                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--g400)' }}>No notifications</div>
                  ) : (
                    notifications.slice(0, 10).map((notif) => (
                      <div key={notif.id} className={`notif-item${notif.is_read ? '' : ' unread'}`}>
                        <div className="notif-item-title">{notif.title}</div>
                        <div className="notif-item-msg">{notif.message}</div>
                        <div className="notif-item-time">{new Date(notif.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>↪ Logout</button>
          </div>
        </header>
        <main className="page" id="page-main">{children}</main>
      </div>
    </div>
  );
}
