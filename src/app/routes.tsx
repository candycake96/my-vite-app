import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { OrgSetupPage } from '../modules/master-data/org/pages/OrgSetupPage.tsx'
import { OverviewPage } from '../modules/master-data/overview/pages/OverviewPage.tsx'
import { CompanyPage } from '../modules/master-data/company/pages/CompanyPage.tsx'
import { BranchPage } from '../modules/master-data/branch/pages/BranchPage.tsx'
import { PeoplePage } from '../modules/master-data/people/pages/PeoplePage.tsx'
import { HomePage } from '../modules/home/pages/HomePage.tsx'
import { BudgetPlanPage } from '../modules/budget/pages/BudgetPlanPage.tsx'
import { StockCountPage } from '../modules/inventory/pages/StockCountPage.tsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="master-data/overview" element={<OverviewPage />} />
        <Route path="master-data/org" element={<OrgSetupPage />} />
        <Route path="master-data/company" element={<CompanyPage />} />
        <Route path="master-data/branch" element={<BranchPage />} />

        <Route path="people" element={<PeoplePage />} />

        <Route path="budget/plans" element={<BudgetPlanPage />} />
        <Route path="inventory/stock-count" element={<StockCountPage />} />
      </Route>
    </Routes>
  )
}
