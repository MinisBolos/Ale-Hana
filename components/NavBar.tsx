import React from 'react';
import { Home, ShoppingBag, User, LayoutDashboard } from 'lucide-react';
import { AppMode } from '../types';

interface NavBarProps {
  currentPage: string;
  setPage: (page: string) => void;
  cartCount: number;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ currentPage, setPage, cartCount, mode, setMode }) => {
  if (mode === AppMode.ADMIN) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-amber-100 py-3 px-6 pb-6 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] max-w-md mx-auto">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => setPage('home')}
          className={`flex flex-col items-center gap-1 ${currentPage === 'home' ? 'text-amber-600' : 'text-gray-400'}`}
        >
          <Home size={24} strokeWidth={currentPage === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Início</span>
        </button>

        <button 
          onClick={() => setPage('cart')}
          className={`flex flex-col items-center gap-1 relative ${currentPage === 'cart' ? 'text-amber-600' : 'text-gray-400'}`}
        >
          <div className="relative">
            <ShoppingBag size={24} strokeWidth={currentPage === 'cart' ? 2.5 : 2} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Bandeja</span>
        </button>

        <button 
          onClick={() => setPage('profile')}
          className={`flex flex-col items-center gap-1 ${currentPage === 'profile' ? 'text-amber-600' : 'text-gray-400'}`}
        >
          <User size={24} strokeWidth={currentPage === 'profile' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Perfil</span>
        </button>
        
        {/* Hidden trigger for demo purposes to switch to Admin */}
        <button 
          onClick={() => setMode(AppMode.ADMIN)}
          className="flex flex-col items-center gap-1 text-gray-400 opacity-50 hover:opacity-100"
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium">Admin</span>
        </button>
      </div>
    </div>
  );
};