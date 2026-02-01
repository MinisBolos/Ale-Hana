import React from 'react';
import { Package, Clock, ChevronRight, Star, Settings, CreditCard, RefreshCw, MapPin, Heart } from 'lucide-react';
import { CartItem, Product, UserOrder } from '../types';
import { MOCK_PRODUCTS, SIZES, MOCK_USER_HISTORY } from '../constants';

interface ProfileProps {
  onReorder: (item: CartItem) => void;
  notify: (msg: string) => void;
  favorites: Product[];
  onProductSelect: (product: Product) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onReorder, notify, favorites, onProductSelect }) => {
  
  const handleReorderOrder = (order: UserOrder) => {
    // Logic to add all items from a past order to the cart
    order.items.forEach(orderItem => {
        const productBase = MOCK_PRODUCTS.find(p => p.id === orderItem.productId);
        if (productBase) {
            // Find size multiplier
            const sizeObj = SIZES.find(s => s.id === orderItem.size) || SIZES[0];
            const item: CartItem = {
                ...productBase,
                size: orderItem.size as any,
                toppings: [], // Simplified: reorder base items
                quantity: orderItem.quantity,
                finalPrice: productBase.basePrice * sizeObj.multiplier * orderItem.quantity
            };
            onReorder(item);
        }
    });
    notify("Itens do pedido anterior adicionados à bandeja!");
  };

  return (
    <div className="pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gray-900 text-white p-6 pt-10 pb-8 rounded-b-3xl mb-6 shadow-xl shadow-amber-900/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-0.5">
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" 
              alt="User" 
              className="w-full h-full rounded-full object-cover border-2 border-gray-900"
            />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold">Julia Silva</h1>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Star size={12} fill="currentColor" />
              <span>Membro Gold</span>
            </div>
          </div>
          <button 
            onClick={() => notify("Configurações atualizadas")}
            className="ml-auto bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-between bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="text-center flex-1 border-r border-white/10">
            <span className="block text-xl font-bold">12</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">Pedidos</span>
          </div>
          <div className="text-center flex-1 border-r border-white/10">
            <span className="block text-xl font-bold">4.9</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">Avaliação</span>
          </div>
          <div className="text-center flex-1">
            <span className="block text-xl font-bold">2</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">Cupons</span>
          </div>
        </div>
      </div>

      <div className="px-6">
        
        {/* Favorites Section */}
        {favorites.length > 0 && (
            <div className="mb-8 animate-in slide-in-from-right-4 duration-300">
                <h2 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                    <Heart size={16} className="text-red-500 fill-red-500" />
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

        {/* Active Order */}
        <div className="mb-8">
          <h2 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
            <Clock size={16} className="text-amber-500" />
            Pedido Atual
          </h2>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-amber-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-bl-xl animate-pulse">
              A CAMINHO
            </div>
            <div className="flex gap-4 mb-4">
              <div className="bg-amber-50 w-12 h-12 rounded-lg flex items-center justify-center text-amber-600">
                <Package size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Pedido #2841</h3>
                <p className="text-xs text-gray-500">2 itens • R$ 58.90</p>
              </div>
            </div>
            <div className="space-y-4">
               {/* Progress Bar */}
               <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-3/4 rounded-full"></div>
               </div>
               <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-gray-800 font-medium">
                     <MapPin size={14} className="text-gray-400" />
                     <span>Chegando em 12 min</span>
                  </div>
                  <button 
                    onClick={() => notify("Rastreamento aberto")}
                    className="text-amber-600 font-bold hover:underline"
                  >
                    Rastrear
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="space-y-3 mb-8">
            <button 
                onClick={() => notify("Formas de pagamento abertas")}
                className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 text-left hover:border-amber-200 transition-colors active:scale-[0.99]"
            >
                <div className="flex items-center gap-3">
                    <CreditCard size={20} className="text-gray-400" />
                    <span className="font-medium text-gray-700">Formas de Pagamento</span>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
            </button>
            <button 
                onClick={() => notify("Endereços abertos")}
                className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 text-left hover:border-amber-200 transition-colors active:scale-[0.99]"
            >
                <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-gray-400" />
                    <span className="font-medium text-gray-700">Endereços</span>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
            </button>
        </div>

        {/* Past Orders */}
        <div>
          <h2 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Histórico de Pedidos</h2>
          <div className="space-y-4">
            {MOCK_USER_HISTORY.map((order) => (
              <div key={order.id} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-amber-100 transition-colors">
                <div className="flex justify-between items-start mb-3 border-b border-gray-50 pb-2">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Pedido #{order.id}</h4>
                    <p className="text-xs text-gray-400">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-bold text-gray-900">R$ {order.total.toFixed(2)}</span>
                    <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold">{order.status}</span>
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
        </div>
      </div>
    </div>
  );
};