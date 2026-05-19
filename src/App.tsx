/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Login from './modules/auth/Login';
import Dashboard from './modules/dashboard/Dashboard';
import CompanySetup from './modules/company/CompanySetup';
import AccountsReceivable from './modules/ar/AR.tsx';
import AccountsPayable from './modules/ap/AP';
import GeneralLedger from './modules/gl/GL';
import CashBank from './modules/cashbank/CashBank';
import Inventory from './modules/inventory/Inventory';
import Payroll from './modules/payroll/Payroll';
import FixedAssets from './modules/fixedassets/FixedAssets';
import Budgeting from './modules/budgeting/Budgeting';
import Taxation from './modules/taxation/Taxation';
import Reports from './modules/reports/Reports';
import Masters from './modules/masters/Masters';
import MasterLayout from './components/layout/MasterLayout';

function AppContent() {
  const { isAuthenticated, activeModule } = useAppContext();

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'Dashboard':
        return <Dashboard />;
      case 'CompanySetup':
        return <CompanySetup />;
      case 'AR':
        return <AccountsReceivable />;
      case 'AP':
        return <AccountsPayable />;
      case 'GL':
        return <GeneralLedger />;
      case 'CashBank':
        return <CashBank />;
      case 'Inventory':
        return <Inventory />;
      case 'Payroll':
        return <Payroll />;
      case 'FixedAssets':
        return <FixedAssets />;
      case 'Budgeting':
        return <Budgeting />;
      case 'Taxation':
        return <Taxation />;
      case 'Reports':
        return <Reports />;
      case 'Masters':
        return <Masters />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="w-20 h-20 bg-brand-teal/10 rounded-full flex items-center justify-center">
              <span className="text-3xl">🏗️</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-brand-blue">{activeModule} Module</h2>
            <p className="text-brand-grey-dark/50 max-w-md italic">
              This module is currently under development to integrate specific Indian compliance standards (GST/TDS) and advanced reporting features.
            </p>
          </div>
        );
    }
  };

  return (
    <MasterLayout>
      {renderModule()}
    </MasterLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
