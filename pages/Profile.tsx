import React, { useState } from 'react';
import { Package, Settings, RefreshCw, UserCircle, LogOut, ChevronLeft, Camera, Download, Heart } from 'lucide-react';
import { CartItem, Product, User } from '../types';
import { MOCK_PRODUCTS, MOCK_USER_HISTORY } from '../constants';

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
  onInstallApp: () => void;
  canInstall: boolean;
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
  const [view, setView] = useState<'main' | 'login' | 'register' | 'edit'>('main');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleAuth = (isRegister: boolean) => {
    if (!formData.email || !formData.password || (isRegister && !formData.name)) {
      notify("Preencha todos os campos");
      return;
    }

    if (isRegister) {
      const newUser: User = {
        name: formData.name,
        email: formData.email,
        orders: []
      };
      onRegister(newUser);
    } else {
      // Mock Login
      const mockUser: User = {
        name: 'Cliente Exemplo',
        email: formData.email,
        orders: MOCK_USER_HISTORY
      };
      onLogin(mockUser);
    }
    setView('main');
  };

  const handleEditProfile = () => {
    if (!user) return;
    onUpdateUser({ ...user, name: formData.name || user.name });
    setView('main');
    notify("Perfil atualizado!");
  };

  if (!user) {
    return (
      <div className="p-6 animate-in fade-in duration-300">
        <div className="text-center py-10">
          <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserCircle size={40} className="text-amber-600" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            {view === 'register' ? 'Criar Conta' : 'Bem-vindo'}
          </h2>
          <p className="text-gray-500 mb-8">
            {view === 'register' ? 'Cadastre-se para acompanhar pedidos' : 'Faça login para ver seus pedidos e favoritos'}
          </p>

          <div className="space-y-4">
            {view === 'register' && (
              <input 
                type="text" 
                placeholder="Seu Nome"
                className="w-full bg-white border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            )}
            <input 
              type="email" 
              placeholder="Email"
              className="w-full bg-white border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
            <input 
              type="password" 
              placeholder="Senha"
              className="w-full bg-white border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
            
            <button 
              onClick={() => handleAuth(view === 'register')}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
            >
              {view === 'register' ? 'Cadastrar' : 'Entrar'}
            </button>
            
            <div className="flex justify-center gap-1 text-sm pt-4">
              <span className="text-gray-500">{view === 'register' ? 'Já tem conta?' : 'Não tem conta?'}</span>
              <button 
                onClick={() => setView(view === 'register' ? 'login' : 'register')}
                className="text-amber-600 font-bold"
              >
                {view === 'register' ? 'Entrar' : 'Cadastre-se'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-in fade-in duration-300">
      <div className="bg-white p-6 border-b border-gray-100">
        {view === 'edit' ? (
          <div>
            <button onClick={() => setView('main')} className="flex items-center gap-2 text-gray-500 mb-6">
              <ChevronLeft size={20} /> Voltar
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Editar Perfil</h2>
            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-400 border-4 border-white shadow-lg">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="Avatar"/> : user.name.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-amber-500 text-white p-2 rounded-full shadow-md">
                    <Camera size={16} />
                  </button>
                </div>
              </div>
              <input 
                type="text" 
                defaultValue={user.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4"
                placeholder="Nome Completo"
              />
              <button onClick={handleEditProfile} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold">
                Salvar Alterações
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-serif font-bold text-gray-900">Meu Perfil</h1>
              <button onClick={onLogout} className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100">
                <LogOut size={20} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-xl font-bold text-amber-700">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <button onClick={() => setView('edit')} className="text-amber-600 text-xs font-bold mt-1 flex items-center gap-1">
                  <Settings size={12} /> Editar dados
                </button>
              </div>
            </div>

            {canInstall && (
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white flex items-center justify-between shadow-lg shadow-amber-200 mb-8">
                <div>
                  <h4 className="font-bold">Instale o App</h4>
                  <p className="text-xs opacity-90">Acesso rápido e funcionamento offline</p>
                </div>
                <button onClick={onInstallApp} className="bg-white/20 p-2 rounded-lg hover:bg-white/30 backdrop-blur-sm">
                  <Download size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {view === 'main' && (
        <div className="p-6 space-y-8">
          <section>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="text-amber-500" size={18} /> Favoritos
            </h3>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {favorites.map(product => (
                  <div key={product.id} onClick={() => onProductSelect(product)} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <img src={product.image} className="w-full h-24 object-cover rounded-lg mb-2" alt={product.name}/>
                    <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{product.name}</h4>
                    <span className="text-xs text-gray-500">R$ {product.basePrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Você ainda não tem favoritos.</p>
            )}
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="text-amber-500" size={18} /> Meus Pedidos
            </h3>
            {user.orders.length > 0 ? (
              <div className="space-y-4">
                {user.orders.map(order => (
                  <div key={order.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-xs font-bold text-gray-400">#{order.id}</span>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        order.status === 'Entregue' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="space-y-1 mb-4">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm text-gray-700">
                          {item.quantity}x {item.name} ({item.size})
                        </p>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                      <span className="font-bold text-gray-900">R$ {order.total.toFixed(2)}</span>
                      <button 
                        onClick={() => {
                          const product = MOCK_PRODUCTS.find(p => p.id === order.items[0].productId);
                          if(product) {
                            onReorder({
                              ...product,
                              size: order.items[0].size as any,
                              toppings: [],
                              quantity: 1,
                              finalPrice: product.basePrice 
                            });
                          }
                          notify("Item adicionado à bandeja!");
                        }}
                        className="text-amber-600 text-sm font-bold flex items-center gap-1 hover:underline"
                      >
                        <RefreshCw size={14} /> Repetir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-xl">
                <Package size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Nenhum pedido realizado.</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};