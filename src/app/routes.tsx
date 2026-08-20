import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { OrgSetupPage } from '../modules/master-data/org/pages/OrgSetupPage.tsx'
import { CompanyPage } from '../modules/master-data/company/pages/CompanyPage.tsx'
import { BranchPage } from '../modules/master-data/branch/pages/BranchPage.tsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/master-data/org" replace />} />
        <Route path="master-data/org" element={<OrgSetupPage />} />
        <Route path="master-data/company" element={<CompanyPage />} />
        <Route path="master-data/branch" element={<BranchPage />} />
      </Route>
    </Routes>
  )
}
