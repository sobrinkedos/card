import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, supabaseError } from '../lib/supabaseClient';
import { Fatura, Transacao, Cliente } from '../types';
import { ArrowLeft, Download, Printer, Barcode, Calendar, FileCheck2, Loader2 } from 'lucide-react';
import SupabaseError from '../components/SupabaseError';

const FaturaDetalhes: React.FC = () => {
  const { id: clienteId, faturaId } = useParams<{ id: string; faturaId: string }>();
  const [cliente, setCliente] = useState<Pick<Cliente, 'nome'> | null>(null);
  const [fatura, setFatura] = useState<Fatura | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabaseError || !clienteId || !faturaId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      const { data: clienteData } = await supabase!.from('clientes').select('nome').eq('id', clienteId).single();
      setCliente(clienteData);

      const { data: faturaData } = await supabase!.from('faturas').select('*').eq('id', faturaId).single();
      setFatura(faturaData);

      if (faturaData) {
        const { data: transacoesData } = await supabase!
          .from('transacoes')
          .select('*')
          .eq('fatura_id', faturaId); // Assuming a fatura_id in transacoes table
        setTransacoes(transacoesData || []);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [clienteId, faturaId]);

  if (supabaseError) {
    return <SupabaseError message={supabaseError} />;
  }

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  if (!cliente || !fatura) {
    return <div className="text-center p-8">Fatura não encontrada.</div>;
  }

  const statusInfo = {
    Paga: { text: 'bg-green-100 text-green-800', icon: FileCheck2 },
    Aberta: { text: 'bg-blue-100 text-blue-800', icon: Calendar },
    Atrasada: { text: 'bg-red-100 text-red-800', icon: Calendar },
  };
  const StatusIcon = statusInfo[fatura.status].icon;

  return (
    <div className="space-y-6">
      <div>
        <Link to={`/clientes/${clienteId}/faturas`} className="flex items-center text-sm text-gray-500 hover:text-gray-800 mb-2"><ArrowLeft className="w-4 h-4 mr-2" />Voltar para Faturas</Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-gray-900">{fatura.competencia}</h2>
            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${statusInfo[fatura.status].text}`}><StatusIcon className="w-4 h-4 mr-2" />{fatura.status}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center"><Printer className="w-4 h-4 mr-2" /> Imprimir</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"><Download className="w-4 h-4 mr-2" /> Baixar PDF</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex justify-between items-start pb-6 border-b border-gray-200">
          <div><h3 className="text-xl font-semibold text-gray-900">{cliente.nome}</h3><p className="text-sm text-gray-500">Fatura do Cartão Private Label</p></div>
          <div className="text-right"><p className="text-sm text-gray-500">Vencimento</p><p className="text-lg font-bold text-red-600">{new Date(fatura.data_vencimento).toLocaleDateString('pt-BR')}</p></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-gray-200">
          <div><p className="text-sm text-gray-500">Valor Total</p><p className="text-xl font-bold text-blue-600">R$ {fatura.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div>
          <div><p className="text-sm text-gray-500">Pagamento Mínimo</p><p className="text-xl font-bold text-gray-800">R$ {fatura.pagamento_minimo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div>
          <div><p className="text-sm text-gray-500">Data de Fechamento</p><p className="text-xl font-bold text-gray-800">{new Date(fatura.data_fechamento).toLocaleDateString('pt-BR')}</p></div>
        </div>
        
        <div className="py-6 text-center border-b border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Linha digitável para pagamento</p>
          <div className="flex items-center justify-center"><Barcode className="w-10 h-10 mr-4 text-gray-700" /><p className="font-mono text-lg tracking-widest text-gray-800">{fatura.linha_digitavel || '12345.67890 12345.678901 12345.678902 1 12345678901234'}</p></div>
        </div>

        <div className="pt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Lançamentos da Fatura</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-gray-200"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th><th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Valor (R$)</th></tr></thead>
              <tbody>
                {transacoes.map((transacao) => (
                  <tr key={transacao.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{new Date(transacao.data_transacao).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{transacao.descricao}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono text-gray-800">{transacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr className="border-t-2 border-gray-300"><td colSpan={2} className="px-4 py-3 text-right text-sm font-bold text-gray-900">Total da Fatura</td><td className="px-4 py-3 text-right text-lg font-bold text-blue-600 font-mono">R$ {fatura.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td></tr></tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaturaDetalhes;
