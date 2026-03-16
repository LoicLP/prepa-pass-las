import DashboardPage from './DashboardClient';

export const metadata = {
  title: 'Tableau de bord',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DashboardPage />;
}
