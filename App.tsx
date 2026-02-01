import React, { useState } from 'react';
import { MOCK_PRODUCTS } from './constants';
import { Product, CartItem, AppMode, AdminView, ToastNotification } from './types';
import { NavBar } from './components/NavBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './pages/ProductDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { Profile } from './pages/Profile';
import { AdminSidebar } from './components/AdminSidebar';
import { Search, MapPin, ChevronRight, Star, CheckCircle, X, ShoppingBag } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mode, setMode] = useState<AppMode>(AppMode.CUSTOMER);
  const [adminView, setAdminView] = useState<AdminView>('overview');
  
  // Interactivity States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Filter Products Logic
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || 
                            (selectedCategory === 'Pudim' && product.category === 'pudim') ||
                            (selectedCategory === 'Mousse' && product.category === 'mousse') ||
                            (selectedCategory === 'Combos' && product.category === 'combo');
    
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Notification Logic
  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const addToCart = (item: CartItem) => {
    setCartItems(prev => [...prev, item]);
    showNotification(`${item.name} adicionado à bandeja`);
  };

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(prev => prev.filter(id => id !== productId));
      showNotification("Removido dos favoritos", "info");
    } else {
      setFavorites(prev => [...prev, productId]);
      showNotification("Adicionado aos favoritos", "success");
    }
  };

  const handleCheckout = (method: string) => {
    setShowCheckoutSuccess(true);
    setTimeout(() => {
      setCartItems([]);
      setShowCheckoutSuccess(false);
      setPage('home');
      showNotification(`Pedido realizado via ${method}!`, 'success');
    }, 2500);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.finalPrice, 0);

  // If in Admin Mode, render the Dashboard
  if (mode === AppMode.ADMIN) {
    return (
        <div className="flex bg-slate-50 min-h-screen">
            <AdminSidebar setMode={setMode} activeView={adminView} setView={setAdminView} />
            <div className="flex-1 w-full md:ml-0">
               <AdminDashboard activeView={adminView} />
            </div>
            {/* Mobile Admin Warning */}
            <div className="md:hidden fixed inset-0 bg-slate-900 flex items-center justify-center text-white p-8 text-center z-50">
               <div>
                  <h2 className="text-xl font-bold mb-2">Painel Admin</h2>
                  <p className="text-slate-400 mb-4">Por favor, use um computador para acessar o dashboard completo.</p>
                  <button onClick={() => setMode(AppMode.CUSTOMER)} className="bg-amber-600 px-4 py-2 rounded-lg">Voltar ao App</button>
               </div>
            </div>
        </div>
    );
  }

  // Customer Mobile App View
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Toast Notification Container */}
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 w-full max-w-md px-4 pointer-events-none">
          {notifications.map(note => (
            <div key={note.id} className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-top-2 fade-in duration-300">
               <div className="bg-green-500 rounded-full p-1">
                 <CheckCircle size={12} className="text-white" />
               </div>
               <span className="text-sm font-medium">{note.message}</span>
            </div>
          ))}
        </div>

        {/* Checkout Success Modal Overlay */}
        {showCheckoutSuccess && (
          <div className="absolute inset-0 z-50 bg-green-600 flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
             <div className="bg-white p-4 rounded-full mb-6 animate-bounce">
                <CheckCircle size={48} className="text-green-600" />
             </div>
             <h2 className="text-3xl font-serif font-bold mb-2">Delicioso!</h2>
             <p className="opacity-90">Seu pedido está sendo preparado.</p>
          </div>
        )}

        {/* Render Page Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
          
          {selectedProduct ? (
            <ProductDetail 
              product={selectedProduct} 
              onBack={() => setSelectedProduct(null)} 
              onAddToCart={addToCart}
              isFavorite={favorites.includes(selectedProduct.id)}
              onToggleFavorite={() => toggleFavorite(selectedProduct.id)}
            />
          ) : currentPage === 'profile' ? (
            <Profile 
              onReorder={(item) => {
                addToCart(item);
                setPage('cart');
              }} 
              notify={showNotification}
              favorites={MOCK_PRODUCTS.filter(p => favorites.includes(p.id))}
              onProductSelect={setSelectedProduct}
            />
          ) : currentPage === 'cart' ? (
             <div className="p-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h1 className="text-2xl font-serif font-bold mb-6">Sua Bandeja</h1>
                {cartItems.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Sua bandeja está vazia.</p>
                        <button 
                          onClick={() => setPage('home')} 
                          className="mt-4 text-amber-600 font-bold hover:underline"
                        >
                          Começar a Pedir
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 mb-8">
                            {cartItems.map((item, idx) => (
                                <div key={idx} className="flex gap-4 border-b border-gray-100 pb-4 animate-in slide-in-from-bottom-2 fade-in">
                                    <img src={item.image} className="w-16 h-16 rounded-lg object-cover" alt={item.name} />
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h3 className="font-bold text-gray-800">{item.name}</h3>
                                            <span className="font-bold">R$ {item.finalPrice.toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-gray-500">{item.size} • {item.quantity}x</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {item.toppings.map(t => <span key={t} className="text-[10px] bg-amber-50 text-amber-800 px-1.5 rounded">{t}</span>)}
                                        </div>
                                    </div>
                                    <button 
                                      onClick={() => setCartItems(cartItems.filter((_, i) => i !== idx))}
                                      className="text-gray-300 hover:text-red-500"
                                    >
                                      <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4">
                            <div className="flex justify-between text-lg font-bold mb-6">
                                <span>Total</span>
                                <span>R$ {cartTotal.toFixed(2)}</span>
                            </div>
                            <button 
                              onClick={() => handleCheckout('Pix')}
                              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-100 mb-3 active:scale-95 transition-transform"
                            >
                                Pagar (Pix)
                            </button>
                            <button 
                              onClick={() => handleCheckout('Cartão')}
                              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-gray-200 active:scale-95 transition-transform"
                            >
                                Pagar (Cartão)
                            </button>
                        </div>
                    </>
                )}
             </div>
          ) : (
            // HOME PAGE
            <div className="animate-in fade-in duration-300">
              {/* Header */}
              <div className="bg-gray-900 text-white p-6 pb-8 rounded-b-3xl mb-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <div onClick={() => showNotification("Simulação de troca de local", "info")} className="cursor-pointer">
                        <p className="text-xs text-amber-400 uppercase font-bold tracking-wider mb-1">Entregar em</p>
                        <div className="flex items-center gap-1">
                            <MapPin size={16} className="text-amber-500" />
                            <span className="font-medium text-sm">Av. Paulista, 1000</span>
                            <ChevronRight size={14} className="text-gray-500" />
                        </div>
                    </div>
                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold font-serif text-xl">
                        C
                    </div>
                </div>
                <h1 className="text-3xl font-serif leading-tight mb-4">
                    Encontre seu momento de <br/> <span className="text-amber-400 italic">doçura</span>.
                </h1>
                
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar pudins, mousses..." 
                        className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                </div>
              </div>

              {/* Club Banner */}
              <div className="px-6 mb-8" onClick={() => showNotification("Bem-vindo ao Clube do Pudim! 🎉")}>
                  <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-5 text-white flex justify-between items-center shadow-lg shadow-amber-200 cursor-pointer hover:scale-[1.02] transition-transform">
                      <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Star size={16} fill="white" className="text-white" />
                            <span className="font-bold text-sm tracking-wide">CLUBE DO PUDIM</span>
                          </div>
                          <p className="text-xs opacity-90 mb-3">Ganhe 20% OFF e Entrega Grátis.</p>
                          <button className="bg-white text-amber-700 text-xs font-bold px-4 py-2 rounded-full">
                              Entrar
                          </button>
                      </div>
                      <img src="https://images.unsplash.com/photo-1517438322307-e67111335449?q=80&w=200&auto=format&fit=crop" className="w-20 h-20 rounded-full object-cover border-4 border-amber-500/30" alt="Club" />
                  </div>
              </div>

              {/* Categories */}
              <div className="px-6 mb-6">
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {['Todos', 'Pudim', 'Mousse', 'Combos'].map((cat, i) => (
                        <button 
                          key={i} 
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                            selectedCategory === cat 
                              ? 'bg-gray-900 text-white shadow-md transform scale-105' 
                              : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                          }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
              </div>

              {/* Product Grid */}
              <div className="px-6 pb-6 grid grid-cols-2 gap-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                      <ProductCard 
                          key={product.id} 
                          product={product} 
                          onClick={setSelectedProduct} 
                      />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-10 text-gray-400">
                    <p>Nenhum doce encontrado para o seu gosto.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <NavBar 
            currentPage={currentPage} 
            setPage={(p) => {
                setPage(p);
                setSelectedProduct(null);
            }} 
            cartCount={cartItems.length}
            mode={mode}
            setMode={setMode}
        />
      </div>
    </div>
  );
};

export default App;