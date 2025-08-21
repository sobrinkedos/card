import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Shield, Eye, UserCog, Loader2 } from 'lucide-react';
import { supabase, supabaseError } from '../lib/supabaseClient';
import SupabaseError from '../components/SupabaseError';
import { MembroEquipe, UserRole } from '../types';

const Equipe: React.FC = () => {
  const [membros, setMembros] = useState<MembroEquipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMembro, setEditingMembro] = useState<MembroEquipe | null>(null);

  useEffect(() => {
    if (supabaseError) {
      setLoading(false);
      return;
    }

    const fetchMembros = async () => {
      setLoading(true);
      const { data, error } = await supabase!
        .from('membros_equipe')
        .select('*')
        .order('nome', { ascending: true });

      if (error) console.error('Erro ao buscar membros da equipe:', error);
      else if (data) setMembros(data);
      setLoading(false);
    };

    fetchMembros();
  }, []);

  if (supabaseError) {
    return <SupabaseError message={supabaseError} />;
  }

  const handleNovoMembro = () => {
    setEditingMembro(null);
    setShowModal(true);
  };

  const handleEditarMembro = (membro: MembroEquipe) => {
    setEditingMembro(membro);
    setShowModal(true);
  };

  const getCargoIcon = (cargo: UserRole) => {
    switch (cargo) {
      case 'Admin': return <Shield className="w-4 h-4 text-red-600" />;
      case 'Operador': return <UserCog className="w-4 h-4 text-blue-600" />;
      case 'Visualizador': return <Eye className="w-4 h-4 text-green-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gerenciamento de Equipe</h2>
          <p className="text-gray-600 mt-2">Adicione e gerencie os usuários do seu time</p>
        </div>
        <button onClick={handleNovoMembro} className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="w-5 h-5 mr-2" /> Adicionar Membro
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Acesso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" /></td></tr>
              ) : (
                membros.map((membro) => (
                  <tr key={membro.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{membro.nome}</div>
                      <div className="text-sm text-gray-500">{membro.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center">{getCargoIcon(membro.cargo)}<span className="ml-2 text-sm text-gray-800">{membro.cargo}</span></div></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{membro.ultimo_acesso ? new Date(membro.ultimo_acesso).toLocaleDateString('pt-BR') : 'Nunca'}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${membro.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{membro.status}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm"><div className="flex space-x-2"><button onClick={() => handleEditarMembro(membro)} className="text-yellow-600 hover:text-yellow-800 p-1 rounded-md"><Edit2 className="w-4 h-4" /></button><button className="text-red-600 hover:text-red-800 p-1 rounded-md"><Trash2 className="w-4 h-4" /></button></div></td>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingMembro ? 'Editar Membro' : 'Novo Membro'}</h3>
            <form className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700">Nome</label><input name="nome" type="text" defaultValue={editingMembro?.nome} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" /></div>
              <div><label className="block text-sm font-medium text-gray-700">Email</label><input name="email" type="email" defaultValue={editingMembro?.email} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" /></div>
              <div><label className="block text-sm font-medium text-gray-700">Cargo</label><select name="cargo" defaultValue={editingMembro?.cargo} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"><option>Admin</option><option>Operador</option><option>Visualizador</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700">Status</label><select name="status" defaultValue={editingMembro?.status} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"><option>Ativo</option><option>Inativo</option></select></div>
              <div className="flex justify-end space-x-3 mt-6"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Salvar</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipe;
