import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit2, Power, Palette, Loader2 } from 'lucide-react';
import { supabase, supabaseError } from '../lib/supabaseClient';
import { Cartao, Cliente } from '../types';
import SupabaseError from '../components/SupabaseError';

const Cartoes: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('lista');
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabaseError) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const { data: cartoesData, error: cartoesError } = await supabase!
        .from('cartoes')
        .select('*, clientes(nome)');
      
      const { data: clientesData, error: clientesError } = await supabase!
        .from('clientes')
        .select('*');

      if (cartoesError) console.error('Erro ao buscar cartões:', cartoesError);
      else if (cartoesData) setCartoes(cartoesData as any);

      if (clientesError) console.error('Erro ao buscar clientes:', clientesError);
      else if (clientesData) setClientes(clientesData);
      
      setLoading(false);
    };
    fetchData();
  }, []);

  const designs = [
    { nome: 'Clássico', cor: 'bg-gradient-to-r from-blue-600 to-blue-800' },
    { nome: 'Premium', cor: 'bg-gradient-to-r from-gray-800 to-black' },
    { nome: 'Personalizado', cor: 'bg-gradient-to-r from-purple-600 to-pink-600' },
  ];

  if (supabaseError) {
    return <SupabaseError message={supabaseError} />;
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Cartões</h2>
          <p className="text-gray-600 mt-2">Gerencie os cartões emitidos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Cartão
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button onClick={() => setActiveTab('lista')} className={`py-4 px-1 border-b-2 font-medium text-sm ${ activeTab === 'lista' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700' }`}>Lista de Cartões</button>
            <button onClick={() => setActiveTab('designs')} className={`py-4 px-1 border-b-2 font-medium text-sm ${ activeTab === 'designs' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700' }`}>Designs Disponíveis</button>
          </nav>
        </div>

        {activeTab === 'lista' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cartoes.map((cartao) => (
                <div key={cartao.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-4 text-white mb-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-8">
                        <div className="text-xs font-medium opacity-80">CardSaaS</div>
                        <div className="text-xs opacity-80">{cartao.design || 'Clássico'}</div>
                      </div>
                      <div className="text-lg font-mono tracking-wider mb-4">{cartao.numero_cartao}</div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs opacity-80">TITULAR</div>
                          <div className="font-medium text-sm">{cartao.clientes?.nome.toUpperCase()}</div>
                        </div>
                        <div className="text-xs opacity-80">{new Date(cartao.data_emissao).toLocaleDateString('pt-BR')}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Status</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${ cartao.status === 'Ativo' ? 'bg-green-100 text-green-800' : cartao.status === 'Inativo' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800' }`}>{cartao.status}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Limite utilizado</span>
                        <span>R$ {cartao.saldo_utilizado.toFixed(2)} / R$ {cartao.limite.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(cartao.saldo_utilizado / cartao.limite) * 100}%` }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between pt-2">
                      <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm"><Eye className="w-4 h-4 mr-1" />Ver</button>
                      <button className="flex items-center text-yellow-600 hover:text-yellow-800 text-sm"><Edit2 className="w-4 h-4 mr-1" />Editar</button>
                      <button className="flex items-center text-red-600 hover:text-red-800 text-sm"><Power className="w-4 h-4 mr-1" />{cartao.status === 'Ativo' ? 'Bloquear' : 'Ativar'}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {designs.map((design, index) => (
                <div key={index} className="text-center">
                  <div className={`${design.cor} rounded-lg p-6 text-white mb-4 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -translate-y-8 translate-x-8"></div>
                    <div className="relative z-10">
                      <div className="text-xs font-medium opacity-80 mb-8">CardSaaS</div>
                      <div className="text-sm font-mono tracking-wider mb-6">•••• •••• •••• 1234</div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs opacity-80">TITULAR</div>
                          <div className="font-medium text-xs">NOME DO CLIENTE</div>
                        </div>
                        <div className="text-xs opacity-80">12/28</div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900">{design.nome}</h3>
                  <button className="mt-2 flex items-center justify-center w-full text-blue-600 hover:text-blue-800 text-sm"><Palette className="w-4 h-4 mr-1" />Personalizar</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Novo Cartão</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cliente</label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Selecione um cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Limite de Crédito</label>
                <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" placeholder="1000.00"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Design do Cartão</label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="Clássico">Clássico</option>
                  <option value="Premium">Premium</option>
                  <option value="Personalizado">Personalizado</option>
                </select>
              </div>
            </form>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancelar</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Emitir Cartão</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cartoes;
