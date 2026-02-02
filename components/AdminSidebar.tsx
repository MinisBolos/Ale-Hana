import React from 'react';
import { LayoutDashboard, ShoppingCart, TrendingUp, LogOut, Package, Settings, X } from 'lucide-react';
import { AppMode, AdminView } from '../types';

interface AdminSidebarProps {
  setMode: (mode: AppMode) => void;
  activeView: AdminView;
  setView: (view: AdminView) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ setMode, activeView, setView, isOpen, onClose }) => {
  const menuItems: { id: AdminView; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Visão Geral', icon: <LayoutDashboard size={20} /> },
    { id: 'orders', label: 'Pedidos (Ao Vivo)', icon: <ShoppingCart size={20} /> },
    { id: 'products', label: 'Produtos', icon: <Package size={20} /> },
    { id: 'financials', label: 'Financeiro', icon: <TrendingUp size={20} /> },
    { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      <div className={`
        w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col z-50 
        transition-transform duration-300 ease-in-out shadow-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold brand-font text-amber-500">PudiMousse<span className="text-white text-sm block font-sans font-normal opacity-70">Painel Admin</span></h1>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white p-1">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => {
                setView(item.id);
                onClose(); // Fecha o menu ao selecionar em mobile
              }}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors font-medium ${
                activeView === item.id 
                  ? 'bg-amber-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={() => setMode(AppMode.CUSTOMER)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-full p-2"
          >
            <LogOut size={18} />
            <span>Sair para o App</span>
          </button>
        </div>
      </div>
    </>
  );
};