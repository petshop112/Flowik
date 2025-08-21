// src/components/layout/DashboardLayoutRoute.tsx
import { Outlet } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

export default function DashboardLayoutRoute() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
