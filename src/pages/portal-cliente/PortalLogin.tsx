import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

// Componente: PortalLogin.tsx
// Descrição: Página de login para o cliente final acessar seu portal.

const PortalLogin: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/portal/dashboard');
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Acessar meu portal</h2>
        <p className="text-center text-gray-600 mb-6">Use seu CPF e senha para entrar.</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF</label>
            <input
              type="text"
              placeholder="000.000.000-00"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="text-right">
            <a href="#" className="text-sm text-blue-600 hover:underline">Esqueceu a senha?</a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-lg"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default PortalLogin;
