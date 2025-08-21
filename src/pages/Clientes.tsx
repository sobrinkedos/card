import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, supabaseError } from '../lib/supabaseClient';
import SupabaseError from '../components/SupabaseError';
import { Cliente } from '../types';

const Clientes: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabaseError) {
      setLoading(false);
      return;
    }

    const fetchClientes = async () => {
      setLoading(true);
      const { data, error } = await supabase!
        .from('clientes')
        .select('*')
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao buscar clientes:', error);
      } else if (data) {
        setClientes(data.map(c => ({...c, data_cadastro: new Date(c.data_cadastro).toLocaleDateString('pt-BR')})));
      }
      setLoading(false);
    };

    fetchClientes();
  }, []);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpf.includes(searchTerm) ||
    (cliente.email && cliente.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNewClient = () => {
    setEditingClient(null);
    setShowModal(true);
  };

  const handleEditClient = (cliente: Cliente) => {
    setEditingClient(cliente);
    setShowModal(true);
  };

  if (supabaseError) {
    return <SupabaseError message={supabaseError} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Clientes</h2>
          <p className="text-gray-600 mt-2">Gerencie seus clientes e seus dados</p>
        </div>
        <button
          onClick={handleNewClient}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Cliente
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limite</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    <div className="flex justify-center items-center">
                      <Loader2 className="w-6 h-6 animate-spin mr-2 text-blue-600" />
                      Carregando clientes...
                    </div>
                  </td>
                </tr>
              ) : filteredClientes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                filteredClientes.map((cliente) => (
                  <tr 
                    key={cliente.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/clientes/${cliente.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{cliente.nome}</div>
                        <div className="text-sm text-gray-500">Cadastro: {cliente.data_cadastro}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cliente.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{cliente.email}</div>
                      <div className="text-sm text-gray-500">{cliente.telefone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {cliente.limite_credito.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        cliente.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                        cliente.status === 'Inativo' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {cliente.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleEditClient(cliente); }}
                          className="text-yellow-600 hover:text-yellow-800 p-1 rounded-md"
                        ><Edit2 className="w-4 h-4" /></button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); console.log('Excluir cliente:', cliente.id); }}
                          className="text-red-600 hover:text-red-800 p-1 rounded-md"
                        ><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                <input type="text" defaultValue={editingClient?.nome || ''} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CPF</label>
                <input type="text" defaultValue={editingClient?.cpf || ''} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" defaultValue={editingClient?.email || ''} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <input type="text" defaultValue={editingClient?.telefone || ''} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Limite de Crédito</label>
                <input type="number" defaultValue={editingClient?.limite_credito || ''} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select defaultValue={editingClient?.status || 'Ativo'} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Bloqueado">Bloqueado</option>
                </select>
              </div>
            </form>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {editingClient ? 'Salvar' : 'Cadastrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
