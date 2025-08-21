import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase, supabaseError } from '../lib/supabaseClient';
import { Fatura, Cliente } from '../types';
import { ArrowLeft, Download, Eye, Calendar, DollarSign, FileWarning, Loader2 } from 'lucide-react';
import SupabaseError from '../components/SupabaseError';

const FaturasPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Pick<Cliente, 'nome'> | null>(null);
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabaseError || !id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      
      const { data: clienteData, error: clienteError } = await supabase!
        .from('clientes')
        .select('nome')
        .eq('id', id)
        .single();
      
      if (clienteError) console.error("Erro ao buscar cliente:", clienteError);
      else setCliente(clienteData);

      const { data: faturasData, error: faturasError } = await supabase!
        .from('faturas')
        .select('*')
        .eq('cliente_id', id)
        .order('data_vencimento', { ascending: false });

      if (faturasError) console.error("Erro ao buscar faturas:", faturasError);
      else setFaturas(faturasData);

      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (supabaseError) {
    return <SupabaseError message={supabaseError} />;
  }

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  if (!cliente) {
    return <div className="text-center p-8">Cliente não encontrado.</div>;
  }

  const totalEmAberto = faturas
    .filter(f => f.status === 'Aberta' || f.status === 'Atrasada')
    .reduce((sum, f) => sum + f.valor_total, 0);

  const proximoVencimento = faturas.find(f => f.status === 'Aberta')?.data_vencimento;

  return (
    <div className="space-y-6">
      <div>
        <Link to={`/clientes/${id}`} className="flex items-center text-sm text-gray-500 hover:text-gray-800 mb-2"><ArrowLeft className="w-4 h-4 mr-2" />Voltar para Detalhes do Cliente</Link>
        <h2 className="text-3xl font-bold text-gray-900">Faturas de {cliente.nome}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center"><div className="p-3 bg-red-100 rounded-full mr-4"><DollarSign className="w-6 h-6 text-red-600" /></div><div><p className="text-sm font-medium text-gray-600">Total em Aberto</p><p className="text-2xl font-bold text-gray-900 mt-1">R$ {totalEmAberto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center"><div className="p-3 bg-yellow-100 rounded-full mr-4"><Calendar className="w-6 h-6 text-yellow-600" /></div><div><p className="text-sm font-medium text-gray-600">Próximo Vencimento</p><p className="text-2xl font-bold text-gray-900 mt-1">{proximoVencimento ? new Date(proximoVencimento).toLocaleDateString('pt-BR') : 'N/A'}</p></div></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center"><div className="p-3 bg-blue-100 rounded-full mr-4"><FileWarning className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm font-medium text-gray-600">Faturas Atrasadas</p><p className="text-2xl font-bold text-gray-900 mt-1">{faturas.filter(f => f.status === 'Atrasada').length}</p></div></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competência</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {faturas.map((fatura) => (
                <tr key={fatura.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fatura.competencia}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(fatura.data_vencimento).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">R$ {fatura.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${ fatura.status === 'Paga' ? 'bg-green-100 text-green-800' : fatura.status === 'Aberta' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800' }`}>{fatura.status}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <button onClick={() => navigate(`/clientes/${id}/faturas/${fatura.id}`)} className="text-blue-600 hover:text-blue-800 flex items-center text-sm"><Eye className="w-4 h-4 mr-1" /> Ver Detalhes</button>
                      <button className="text-gray-600 hover:text-gray-800 flex items-center text-sm"><Download className="w-4 h-4 mr-1" /> Baixar PDF</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FaturasPage;
