import React, { useState } from 'react';
import { Package, Star, Settings, RefreshCw, UserCircle, LogOut, ChevronLeft, Camera, Download } from 'lucide-react';
import { CartItem, Product, User, UserOrder } from '../types';
import { MOCK_PRODUCTS, SIZES } from '../constants';

interface ProfileProps {
  user: User | null;
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  onReorder: (item: CartItem) => void;
  notify: (msg: string) => void;
  favorites: Product[];
  onProductSelect: (product: Product) => void;
  onInstallApp?: () => void;
  canInstall?: boolean;
}

export const Profile: React.FC<ProfileProps> = ({ 
  user, 
  onLogin, 
  onRegister, 
  onLogout,
  onUpdateUser,
  onReorder, 
  notify, 
  favorites, 
  onProductSelect,
  onInstallApp,
  canInstall
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      if (formData.email && formData.password) {
        // Simulação de login simples
        onLogin({
          name: 'Cliente Creamy', // Em um app real, viria do backend
          email: formData.email,
          orders: [] // Se fosse real, carregaria do banco
        });
      } else {
        notify("Preencha email e senha");
      }
    } else {
      if (formData.name && formData.email && formData.password) {
        onRegister({
          name: formData.name,
          email: formData.email,
          orders: []
        });
      } else {
        notify("Preencha todos os campos");
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUser = { ...user, avatar: reader.result as string };
        onUpdateUser(updatedUser);
        notify("Foto de perfil atualizada!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReorderOrder = (order: UserOrder) => {
    order.items.forEach(orderItem => {
        const productBase = MOCK_PRODUCTS.find(p => p.id === orderItem.productId);
        if (productBase) {
            const sizeObj = SIZES.find(s => s.id === orderItem.size) || SIZES[0];
            const item: CartItem = {
                ...productBase,
                size: orderItem.size as any,
                toppings: [],
                quantity: orderItem.quantity,
                finalPrice: productBase.basePrice * sizeObj.multiplier * orderItem.quantity
            };
            onReorder(item);
        }
    });
    notify("Itens do pedido anterior adicionados à bandeja!");
  };

  // --- AUTHENTICATION SCREEN ---
  if (!user) {
    return (
      <div className="min-h-screen bg-white p-8 flex flex-col justify-center animate-in fade-in duration-300 pb-24">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
            <UserCircle size={40} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            {authMode === 'login' ? 'Bem-vindo de volta' : 'Criar Conta'}
          </h1>
          <p className="text-gray-500">
            {authMode === 'login' 
              ? 'Entre para acessar seus pedidos e favoritos.' 
              : 'Cadastre-se para começar a pedir suas doçuras.'}
          </p>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="Seu nome"
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-gray-200 hover:bg-gray-800 transition-transform active:scale-95"
          >
            {authMode === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'register' : 'login');
              setFormData({ name: '', email: '', password: '' });
            }}
            className="text-amber-600 font-bold text-sm hover:underline"
          >
            {authMode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Fazer Login'}
          </button>
        </div>
      </div>
    );
  }

  // --- LOGGED IN PROFILE SCREEN ---
  return (
    <div className="pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gray-900 text-white p-6 pt-10 pb-8 rounded-b-3xl mb-6 shadow-xl shadow-amber-900/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 relative overflow-hidden">
               {user.avatar ? (
                 <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover bg-gray-800" />
               ) : (
                 <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold">
                    {user.name.charAt(0)}
                 </div>
               )}
            </div>
            
            {/* Image Upload Input Overlay */}
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
               <Camera size={20} />
               <input 
                 type="file" 
                 accept="image/*" 
                 className="hidden" 
                 onChange={handleImageUpload}
               />
            </label>
            {!user.avatar && (
              <div className="absolute bottom-0 right-0 bg-amber-500 p-1 rounded-full border-2 border-gray-900 pointer-events-none">
                <Camera size={10} className="text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-xl font-serif font-bold">{user.name}</h1>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Star size={12} fill="currentColor" />
              <span>Cliente Creamy</span>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-red-500/20 transition-colors"
            title="Sair"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Stats & Actions */}
        <div className="flex justify-between bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="text-center flex-1 border-r border-white/10">
            <span className="block text-xl font-bold">{user.orders.length}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">Pedidos</span>
          </div>
          {/* Install Button Logic */}
          {canInstall ? (
             <div 
               onClick={onInstallApp}
               className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors rounded"
             >
                <Download size={20} className="mb-1 text-amber-400" />
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Instalar App</span>
             </div>
          ) : (
             <div className="text-center flex-1">
                <span className="block text-xl font-bold">0</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Cupons</span>
             </div>
          )}
        </div>
      </div>

      <div className="px-6">
        
        {/* Favorites Section */}
        {favorites.length > 0 && (
            <div className="mb-8 animate-in slide-in-from-right-4 duration-300">
                <h2 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                    <Star size={16} className="text-amber-500 fill-amber-500" />
                    Meus Favoritos
                </h2>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                    {favorites.map(product => (
                        <div 
                            key={product.id} 
                            onClick={() => onProductSelect(product)}
                            className="min-w-[140px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all"
                        >
                            <div className="h-24 w-full">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-3">
                                <h3 className="font-bold text-gray-800 text-xs line-clamp-1 mb-1">{product.name}</h3>
                                <span className="text-amber-600 font-bold text-xs">R$ {product.basePrice.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Past Orders */}
        <div>
          <h2 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
            <Package size={16} className="text-gray-600" />
            Meus Pedidos
          </h2>
          
          {user.orders.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-100 border-dashed">
               <Package size={32} className="mx-auto text-gray-300 mb-2" />
               <p className="text-gray-500 text-sm">Você ainda não fez nenhum pedido.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {user.orders.slice().reverse().map((order) => (
                <div key={order.id} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-amber-100 transition-colors shadow-sm">
                  <div className="flex justify-between items-start mb-3 border-b border-gray-50 pb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Pedido #{order.id}</h4>
                      <p className="text-xs text-gray-400">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm font-bold text-gray-900">R$ {order.total.toFixed(2)}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        order.status === 'Entregue' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                      {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>{item.quantity}x {item.name}</span>
                              <span className="text-gray-400">({item.size})</span>
                          </div>
                      ))}
                  </div>

                  <div className="flex gap-2">
                      <button 
                          onClick={() => notify(`Avaliação para pedido #${order.id} enviada!`)}
                          className="flex-1 py-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                      >
                          Avaliar
                      </button>
                      <button 
                          onClick={() => handleReorderOrder(order)}
                          className="flex-1 py-2 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 flex items-center justify-center gap-1 hover:bg-amber-100 active:bg-amber-200"
                      >
                          <RefreshCw size={12} /> Repetir
                      </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};