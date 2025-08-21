import React, { useState } from 'react';
import { Save, Palette, Store, Bell, CreditCard, Mail } from 'lucide-react';

const Configuracoes: React.FC = () => {
  const [activeTab, setActiveTab] = useState('loja');
  const [settings, setSettings] = useState({
    // Dados da loja
    nomeEmpresa: 'Loja do João',
    cnpj: '12.345.678/0001-90',
    email: 'admin@lojadojoao.com',
    telefone: '(11) 99999-9999',
    endereco: 'Rua das Flores, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
    logoUrl: 'https://img-wrapper.vercel.app/image?url=https://placehold.co/100x40/000000/FFFFFF/png?text=SuaLogo',
    
    // Configurações de cobrança
    cobrancaAutomatica: true,
    diasVencimento: 5,
    jurosAtraso: 2.5,
    multaAtraso: 10,
    emailCobranca: true,
    smsCobranca: false,
    whatsappCobranca: true,
    
    // Notificações
    notificarNovasTransacoes: true,
    notificarInadimplencia: true,
    notificarNovosClientes: false,
    notificarLimiteCredito: true,
  });

  const tabs = [
    { id: 'loja', name: 'Dados da Loja', icon: Store },
    { id: 'cartoes', name: 'Design dos Cartões', icon: CreditCard },
    { id: 'cobranca', name: 'Cobrança Automática', icon: Mail },
    { id: 'notificacoes', name: 'Notificações', icon: Bell },
  ];

  const handleSave = () => {
    console.log('Configurações salvas:', settings);
    // Simular salvamento
  };

  const designsCartoes = [
    { 
      id: 'classico', 
      nome: 'Clássico', 
      cor: 'bg-gradient-to-r from-blue-600 to-blue-800',
      preview: 'Azul tradicional'
    },
    { 
      id: 'premium', 
      nome: 'Premium', 
      cor: 'bg-gradient-to-r from-gray-800 to-black',
      preview: 'Preto elegante'
    },
    { 
      id: 'personalizado', 
      nome: 'Personalizado', 
      cor: 'bg-gradient-to-r from-purple-600 to-pink-600',
      preview: 'Cores personalizadas'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Configurações</h2>
          <p className="text-gray-600 mt-2">Gerencie as configurações do sistema</p>
        </div>
        <button
          onClick={handleSave}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Save className="w-5 h-5 mr-2" />
          Salvar Configurações
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Dados da Loja */}
          {activeTab === 'loja' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Informações da Empresa</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
                  <input
                    type="text"
                    value={settings.nomeEmpresa}
                    onChange={(e) => setSettings({...settings, nomeEmpresa: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">CNPJ</label>
                  <input
                    type="text"
                    value={settings.cnpj}
                    onChange={(e) => setSettings({...settings, cnpj: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone</label>
                  <input
                    type="text"
                    value={settings.telefone}
                    onChange={(e) => setSettings({...settings, telefone: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Endereço</label>
                  <input
                    type="text"
                    value={settings.endereco}
                    onChange={(e) => setSettings({...settings, endereco: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cidade</label>
                  <input
                    type="text"
                    value={settings.cidade}
                    onChange={(e) => setSettings({...settings, cidade: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <select
                    value={settings.estado}
                    onChange={(e) => setSettings({...settings, estado: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    {/* Outros estados */}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Design dos Cartões */}
          {activeTab === 'cartoes' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Customização Visual dos Cartões</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {designsCartoes.map((design) => (
                  <div key={design.id} className="border border-gray-200 rounded-lg p-4">
                    <div className={`${design.cor} rounded-lg p-6 text-white mb-4 relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -translate-y-8 translate-x-8"></div>
                      <div className="relative z-10">
                        <div className="text-xs font-medium opacity-80 mb-8">{settings.nomeEmpresa}</div>
                        <div className="text-sm font-mono tracking-wider mb-6">
                          •••• •••• •••• 1234
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-xs opacity-80">TITULAR</div>
                            <div className="font-medium text-xs">NOME DO CLIENTE</div>
                          </div>
                          <div className="text-xs opacity-80">
                            12/28
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 text-center">{design.nome}</h4>
                    <p className="text-sm text-gray-500 text-center mt-1">{design.preview}</p>
                    
                    <div className="mt-4 space-y-2">
                      <button className="w-full text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center">
                        <Palette className="w-4 h-4 mr-1" />
                        Personalizar Cores
                      </button>
                      <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm">
                        Definir como Padrão
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Informações no Cartão</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome da Empresa no Cartão</label>
                    <input
                      type="text"
                      value={settings.nomeEmpresa}
                      onChange={(e) => setSettings({...settings, nomeEmpresa: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Logo (URL)</label>
                    <input
                      type="url"
                      placeholder="https://exemplo.com/logo.png"
                      value={settings.logoUrl}
                      onChange={(e) => setSettings({...settings, logoUrl: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cobrança Automática */}
          {activeTab === 'cobranca' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Configurações de Cobrança</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Cobrança Automática</div>
                    <div className="text-sm text-gray-500">Enviar cobranças automaticamente para clientes em atraso</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.cobrancaAutomatica}
                      onChange={(e) => setSettings({...settings, cobrancaAutomatica: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Dias para Vencimento</label>
                    <input
                      type="number"
                      value={settings.diasVencimento}
                      onChange={(e) => setSettings({...settings, diasVencimento: parseInt(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Juros de Atraso (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.jurosAtraso}
                      onChange={(e) => setSettings({...settings, jurosAtraso: parseFloat(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Canais de Cobrança</label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.emailCobranca}
                        onChange={(e) => setSettings({...settings, emailCobranca: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Email</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.smsCobranca}
                        onChange={(e) => setSettings({...settings, smsCobranca: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">SMS</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.whatsappCobranca}
                        onChange={(e) => setSettings({...settings, whatsappCobranca: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">WhatsApp</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notificações */}
          {activeTab === 'notificacoes' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Configurações de Notificação</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Novas Transações</div>
                    <div className="text-sm text-gray-500">Receber notificação a cada nova transação</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notificarNovasTransacoes}
                      onChange={(e) => setSettings({...settings, notificarNovasTransacoes: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Alertas de Inadimplência</div>
                    <div className="text-sm text-gray-500">Receber alertas sobre clientes em atraso</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notificarInadimplencia}
                      onChange={(e) => setSettings({...settings, notificarInadimplencia: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Novos Clientes</div>
                    <div className="text-sm text-gray-500">Receber notificação quando um novo cliente se cadastrar</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notificarNovosClientes}
                      onChange={(e) => setSettings({...settings, notificarNovosClientes: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Limite de Crédito</div>
                    <div className="text-sm text-gray-500">Alertas quando clientes atingem o limite de crédito</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notificarLimiteCredito}
                      onChange={(e) => setSettings({...settings, notificarLimiteCredito: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
