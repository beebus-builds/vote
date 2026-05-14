import AppShell from '../../components/AppShell';

export const metadata = {
  title: 'Student Portal — iVote'
};

const navItems = [
  { label: 'Dashboard', href: '/student/dashboard' },
  { label: 'Candidates', href: '/student/candidates' },
  { label: 'Vote', href: '/student/vote' },
  { label: 'Results', href: '/student/results' },
  { label: 'My Candidacy', href: '/student/candidacy' }
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell pageTitle="My Dashboard" sidebarRole="Student Portal" navItems={navItems}>
      {children}
    </AppShell>
  );
}
