import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import ClienteDetalhes from './pages/ClienteDetalhes';
import Faturas from './pages/Faturas';
import FaturaDetalhes from './pages/FaturaDetalhes';
import Cartoes from './pages/Cartoes';
import Transacoes from './pages/Transacoes';
import Cobrancas from './pages/Cobrancas';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';
import Equipe from './pages/Equipe';
import Convites from './pages/Convites';
import Auditoria from './pages/Auditoria';
import Notificacoes from './pages/Notificacoes';
import Suporte from './pages/Suporte';
import PortalLayout from './pages/portal-cliente/PortalLayout';
import PortalLogin from './pages/portal-cliente/PortalLogin';
import PortalDashboard from './pages/portal-cliente/PortalDashboard';
import PortalHistorico from './pages/portal-cliente/PortalHistorico';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Rotas do Portal do Cliente (sem sidebar/header de admin) */}
        <Route element={<PortalLayout />}>
          <Route path="/portal/login" element={<PortalLogin />} />
          <Route path="/portal/dashboard" element={<PortalDashboard />} />
          <Route path="/portal/historico" element={<PortalHistorico />} />
        </Route>

        {/* Rotas do Painel Administrativo */}
        <Route path="/*" element={
          <div className="min-h-screen bg-gray-50 flex">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col">
              <Header setSidebarOpen={setSidebarOpen} />
              <main className="flex-1 p-4 lg:p-8 mt-16">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/clientes" element={<Clientes />} />
                  <Route path="/clientes/:id" element={<ClienteDetalhes />} />
                  <Route path="/clientes/:id/faturas" element={<Faturas />} />
                  <Route path="/clientes/:id/faturas/:faturaId" element={<FaturaDetalhes />} />
                  <Route path="/cartoes" element={<Cartoes />} />
                  <Route path="/transacoes" element={<Transacoes />} />
                  <Route path="/cobrancas" element={<Cobrancas />} />
                  <Route path="/relatorios" element={<Relatorios />} />
                  <Route path="/configuracoes" element={<Configuracoes />} />
                  <Route path="/equipe" element={<Equipe />} />
                  <Route path="/convites" element={<Convites />} />
                  <Route path="/auditoria" element={<Auditoria />} />
                  <Route path="/notificacoes" element={<Notificacoes />} />
                  <Route path="/suporte" element={<Suporte />} />
                </Routes>
              </main>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
