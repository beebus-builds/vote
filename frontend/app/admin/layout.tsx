import AppShell from '../../components/AppShell';

export const metadata = {
  title: 'Admin Portal — iVote'
};

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Students', href: '/admin/students' },
  { label: 'Elections', href: '/admin/elections' },
  { label: 'Candidates', href: '/admin/candidates' },
  { label: 'Results', href: '/admin/results' },
  { label: 'Audit Logs', href: '/admin/audit' }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell pageTitle="Dashboard" sidebarRole="Election Head" navItems={navItems}>
      {children}
    </AppShell>
  );
}
