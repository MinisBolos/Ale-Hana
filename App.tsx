import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS, SIZES } from './constants';
import { Product, CartItem, AppMode, AdminView, ToastNotification, PixPaymentResponse, User, UserOrder } from './types';
import { NavBar } from './components/NavBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './pages/ProductDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { Profile } from './pages/Profile';
import { AdminSidebar } from './components/AdminSidebar';
import { createPixPayment } from './services/paymentService';
import { Search, MapPin, ChevronRight, CheckCircle, X, ShoppingBag, Copy, Loader2, QrCode, Download, Lock } from 'lucide-react';

const SHIPPING_COST = 4.00;

interface FlyingItem {
  id: number;
  x: number;
  y: number;
  image: string;
}

const App: React.FC = () => {
  const [currentPage, setPage] = useState('home');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mode, setMode] = useState<AppMode>(AppMode.CUSTOMER);
  const [adminView, setAdminView] = useState<AdminView>('overview');
  
  // Animation State
  const [flyingItem, setFlyingItem] = useState<FlyingItem | null>(null);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Admin Authentication
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [adminPass, setAdminPass] = useState('');
  
  // Interactivity States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Payment States
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [pixData, setPixData] = useState<PixPaymentResponse | null>(null);
  const [showPixModal, setShowPixModal] = useState(false);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Animation Handler
  const triggerFlyAnimation = (startX: number, startY: number, image: string) => {
    setFlyingItem({ id: Date.now(), x: startX, y: startY, image });
    
    // Calculate precise target (Shopping Bag Icon in NavBar)
    const targetEl = document.getElementById('nav-cart-icon');
    let destX = window.innerWidth * 0.5; // Fallback center
    let destY = window.innerHeight - 50; // Fallback bottom

    if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        // Center of the icon
        destX = rect.left + (rect.width / 2);
        destY = rect.top + (rect.height / 2);
    }

    // Start transition after a brief moment to allow DOM render of the flying item at start pos
    setTimeout(() => {
        setFlyingItem(prev => prev ? { ...prev, x: destX, y: destY } : null);
    }, 50);

    // Clean up after animation duration
    setTimeout(() => {
        setFlyingItem(null);
    }, 600);
  };

  // User Management Handlers
  const handleUserLogin = (user: User) => {
    setCurrentUser(user);
    showNotification(`Bem-vindo, ${user.name}!`);
  };

  const handleUserRegister = (user: User) => {
    setCurrentUser(user);
    showNotification("Conta criada com sucesso!");
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    showNotification("Logout realizado.");
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
      showNotification("Obrigado por instalar o Creamy!", "success");
    }
  };

  // Admin Login Handler
  const handleAdminLogin = () => {
    if (adminId === '0808' && adminPass === '7155') {
        setMode(AppMode.ADMIN);
        setShowAdminLogin(false);
        setAdminId('');
        setAdminPass('');
        showNotification("Bem-vindo ao Painel Admin", "success");
    } else {
        showNotification("Credenciais inválidas", "info");
    }
  };

  // Product Management Handlers
  const handleAddProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
    showNotification("Produto adicionado com sucesso!", "success");
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    showNotification("Produto atualizado!", "success");
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
        setProducts(products.filter(p => p.id !== id));
        showNotification("Produto removido.", "info");
    }
  };

  // Filter Products Logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || 
                            (selectedCategory === 'Pudim' && product.category === 'pudim') ||
                            (selectedCategory === 'Mousse' && product.category === 'mousse') ||
                            (selectedCategory === 'Combos' && product.category === 'combo');
    
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

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

  // Quick Add from Card (Logic to add default item + animation)
  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    // 1. Trigger Animation
    triggerFlyAnimation(e.clientX, e.clientY, product.image);
    
    // 2. Add default configuration (Small Size, No toppings)
    const defaultItem: CartItem = {
        ...product,
        size: 'P',
        toppings: [],
        quantity: 1,
        finalPrice: product.basePrice * SIZES[0].multiplier
    };
    addToCart(defaultItem);
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

  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.finalPrice, 0);
  const cartTotal = cartSubtotal > 0 ? cartSubtotal + SHIPPING_COST : 0;

  const handlePixCheckout = async () => {
    if (cartItems.length === 0) return;
    
    setIsProcessingPayment(true);
    const response = await createPixPayment(cartItems, cartTotal);
    setIsProcessingPayment(false);
    
    if (response) {
      setPixData(response);
      setShowPixModal(true);
    } else {
      showNotification("Erro ao gerar Pix. Tente novamente.", "info");
    }
  };

  const copyPixCode = () => {
    if (pixData?.point_of_interaction?.transaction_data?.qr_code) {
      navigator.clipboard.writeText(pixData.point_of_interaction.transaction_data.qr_code);
      showNotification("Código Pix copiado!", "success");
    }
  };

  const confirmPixPayment = () => {
    setShowPixModal(false);
    setPixData(null);
    setShowCheckoutSuccess(true);
    
    // Save order if user is logged in
    if (currentUser) {
      const newOrder: UserOrder = {
        id: Math.floor(Math.random() * 90000 + 10000).toString(),
        date: new Date().toLocaleDateString('pt-BR'),
        total: cartTotal,
        status: 'Em Preparo',
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          size: item.size
        }))
      };
      
      const updatedUser = {
        ...currentUser,
        orders: [...currentUser.orders, newOrder]
      };
      setCurrentUser(updatedUser);
    }

    setTimeout(() => {
      setCartItems([]);
      setShowCheckoutSuccess(false);
      setPage('home');
      showNotification(`Pagamento Confirmado! Preparando pedido.`, 'success');
    }, 2500);
  };

  // If in Admin Mode, render the Dashboard
  if (mode === AppMode.ADMIN) {
    return (
        <div className="flex bg-slate-50 min-h-screen">
            <AdminSidebar setMode={setMode} activeView={adminView} setView={setAdminView} />
            <div className="flex-1 w-full md:ml-0">
               <AdminDashboard 
                 activeView={adminView}
                 products={products}
                 onAddProduct={handleAddProduct}
                 onEditProduct={handleEditProduct}
                 onDeleteProduct={handleDeleteProduct}
               />
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
        
        {/* Flying Item Animation Layer */}
        {flyingItem && (
            <div 
                className="fixed z-[100] w-16 h-16 rounded-full overflow-hidden shadow-2xl pointer-events-none transition-all duration-500 ease-in-out border-2 border-white"
                style={{
                    top: flyingItem.y,
                    left: flyingItem.x,
                    transform: 'translate(-50%, -50%) scale(0.3)',
                    opacity: 0.8
                }}
            >
                <img src={flyingItem.image} alt="" className="w-full h-full object-cover" />
            </div>
        )}

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

        {/* PWA Install Banner */}
        {showInstallBanner && (
          <div className="fixed top-0 left-0 right-0 z-[55] bg-amber-600 text-white p-3 flex justify-between items-center shadow-md animate-in slide-in-from-top-full duration-500">
             <div className="flex items-center gap-3">
                <div className="bg-white p-1 rounded-lg">
                   <Download size={16} className="text-amber-600" />
                </div>
                <div>
                   <p className="text-xs font-bold">Instalar App</p>
                   <p className="text-[10px] opacity-90">Acesso rápido e offline</p>
                </div>
             </div>
             <div className="flex gap-2">
                <button onClick={() => setShowInstallBanner(false)} className="text-amber-200 hover:text-white"><X size={18} /></button>
                <button onClick={handleInstallClick} className="bg-white text-amber-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">Instalar</button>
             </div>
          </div>
        )}

        {/* Admin Login Modal */}
        {showAdminLogin && (
            <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-serif font-bold flex items-center gap-2">
                            <Lock size={20} className="text-amber-600" />
                            Acesso Restrito
                        </h2>
                        <button onClick={() => setShowAdminLogin(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ID de Acesso</label>
                            <input 
                                type="text" 
                                value={adminId}
                                onChange={(e) => setAdminId(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none"
                                placeholder="0000"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha</label>
                            <input 
                                type="password" 
                                value={adminPass}
                                onChange={(e) => setAdminPass(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none"
                                placeholder="••••"
                            />
                        </div>
                        <button 
                            onClick={handleAdminLogin}
                            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold mt-2 hover:bg-gray-800"
                        >
                            Entrar
                        </button>
                    </div>
                </div>
            </div>
        )}

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

        {/* PIX Payment Modal */}
        {showPixModal && pixData && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <QrCode className="text-green-600" />
                        Pagamento via Pix
                    </h3>
                    <button onClick={() => setShowPixModal(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="text-center mb-6">
                    <p className="text-gray-500 text-sm mb-2">Total a pagar</p>
                    <p className="text-3xl font-bold text-gray-900">R$ {cartTotal.toFixed(2)}</p>
                </div>

                <div className="bg-gray-100 p-4 rounded-xl mb-6 flex items-center justify-center">
                    {/* Exibe o QR Code Base64 se disponível, senão um fallback visual */}
                    {pixData.point_of_interaction.transaction_data.qr_code_base64 && pixData.point_of_interaction.transaction_data.qr_code_base64.length > 50 ? (
                        <img 
                            src={`data:image/png;base64,${pixData.point_of_interaction.transaction_data.qr_code_base64}`} 
                            alt="QR Code Pix" 
                            className="w-48 h-48 object-contain mix-blend-multiply"
                        />
                    ) : (
                        <div className="w-48 h-48 bg-white border-2 border-gray-200 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 gap-2">
                           <QrCode size={48} />
                           <span className="text-xs text-center px-4">QR Code Simulado (CORS Bloqueado)</span>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="relative">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1 ml-1">Código Copia e Cola</p>
                        <div className="flex gap-2">
                            <input 
                                readOnly 
                                value={pixData.point_of_interaction.transaction_data.qr_code}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-xs text-gray-600 font-mono truncate"
                            />
                            <button 
                                onClick={copyPixCode}
                                className="bg-gray-900 text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <Copy size={18} />
                            </button>
                        </div>
                    </div>
                    
                    <button 
                        onClick={confirmPixPayment}
                        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-100 mt-4 active:scale-95 transition-transform"
                    >
                        Já realizei o pagamento
                    </button>
                </div>
            </div>
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
              user={currentUser}
              onLogin={handleUserLogin}
              onRegister={handleUserRegister}
              onLogout={handleUserLogout}
              onUpdateUser={handleUpdateUser}
              onReorder={(item) => {
                addToCart(item);
                setPage('cart');
              }} 
              notify={showNotification}
              favorites={products.filter(p => favorites.includes(p.id))}
              onProductSelect={setSelectedProduct}
              onInstallApp={handleInstallClick}
              canInstall={!!deferredPrompt}
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
                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-gray-500 text-sm">
                                <span>Subtotal</span>
                                <span>R$ {cartSubtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 text-sm">
                                <span>Frete (Fixo)</span>
                                <span>R$ {SHIPPING_COST.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold mb-6 text-gray-900 border-t border-dashed border-gray-200 pt-2">
                                <span>Total</span>
                                <span>R$ {cartTotal.toFixed(2)}</span>
                            </div>
                            
                            {/* PIX Button Only */}
                            <button 
                              onClick={handlePixCheckout}
                              disabled={isProcessingPayment}
                              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-100 mb-3 active:scale-95 transition-transform flex items-center justify-center gap-2"
                            >
                                {isProcessingPayment ? <Loader2 className="animate-spin" /> : <QrCode size={20} />}
                                {isProcessingPayment ? 'Gerando Pix...' : 'Pagar com Pix'}
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
                          onQuickAdd={handleQuickAdd}
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
            onAdminClick={() => setShowAdminLogin(true)}
        />
      </div>
    </div>
  );
};

export default App;