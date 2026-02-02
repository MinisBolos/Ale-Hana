import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { ShoppingBag, DollarSign, Users, Activity, ArrowLeft, Download, CheckCircle, Clock, CreditCard, TrendingUp, TrendingDown, Plus, Pencil, Trash2, X, Save, Upload, Trash } from 'lucide-react';
import { StatCardProps, AdminView, OrderDetailType, Product, FinancialRecord } from '../types';
import { MOCK_FINANCIALS, MOCK_ORDERS_DETAIL } from '../constants';

// Mock Data for Overview Charts
const revenueData = [
  { name: 'Seg', revenue: 4000 },
  { name: 'Ter', revenue: 3000 },
  { name: 'Qua', revenue: 5500 },
  { name: 'Qui', revenue: 8000 },
  { name: 'Sex', revenue: 12000 },
  { name: 'Sáb', revenue: 18000 },
  { name: 'Dom', revenue: 15000 },
];

const categoryData = [
  { name: 'Pudim', value: 400 },
  { name: 'Mousse', value: 300 },
  { name: 'Combos', value: 200 },
  { name: 'Assinaturas', value: 100 },
];
const COLORS = ['#d97706', '#78350f', '#f59e0b', '#1e293b'];

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, isPositive, icon }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
        {icon}
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {trend}
      </span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
  </div>
);

interface AdminDashboardProps {
  activeView: AdminView;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  activeView, 
  products, 
  onAddProduct, 
  onEditProduct,
  onDeleteProduct 
}) => {
  const [selectedOrder, setSelectedOrder] = useState<OrderDetailType | null>(null);
  
  // Financial State (allows reset)
  const [financials, setFinancials] = useState<FinancialRecord[]>(MOCK_FINANCIALS);

  // Product Management State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({});

  const handleResetFinancials = () => {
    if (window.confirm("ATENÇÃO: Isso irá apagar todos os registros financeiros. Deseja continuar?")) {
      setFinancials([]);
    }
  };

  // Handle Image Upload logic
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm({ ...productForm, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // CSV Export Logic
  const handleExport = () => {
    let dataToExport: any[] = [];
    let filename = `${activeView}_relatorio.csv`;

    switch(activeView) {
        case 'orders': dataToExport = MOCK_ORDERS_DETAIL; break;
        case 'financials': dataToExport = financials; break;
        case 'products': dataToExport = products; break;
        default: dataToExport = revenueData; 
    }

    if (!dataToExport.length) {
      alert("Não há dados para exportar.");
      return;
    }

    // Convert keys to CSV Header
    const headers = Object.keys(dataToExport[0]).join(',');
    // Convert values to CSV Rows
    const rows = dataToExport.map(obj => 
        Object.values(obj).map(val => 
            typeof val === 'string' && val.includes(',') ? `"${val}"` : val 
        ).join(',')
    ).join('\n');

    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenProductForm = (product?: Product) => {
    if (product) {
      setProductForm(product);
    } else {
      setProductForm({
        id: Math.random().toString(36).substr(2, 9),
        rating: 5.0,
        isPopular: false,
        category: 'pudim'
      });
    }
    setIsEditingProduct(true);
  };

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.basePrice || !productForm.image) {
      alert("Preencha nome, preço e carregue uma imagem.");
      return;
    }

    const newProduct = productForm as Product;
    
    // Check if updating or creating
    const exists = products.find(p => p.id === newProduct.id);
    if (exists) {
      onEditProduct(newProduct);
    } else {
      onAddProduct(newProduct);
    }
    setIsEditingProduct(false);
    setProductForm({});
  };
  
  const renderContent = () => {
    // PRODUCTS VIEW
    if (activeView === 'products') {
      if (isEditingProduct) {
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 max-w-2xl mx-auto animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">{products.find(p => p.id === productForm.id) ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button onClick={() => setIsEditingProduct(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Produto</label>
                <input 
                  type="text" 
                  value={productForm.name || ''} 
                  onChange={e => setProductForm({...productForm, name: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-amber-500"
                  placeholder="Ex: Pudim de Leite"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Descrição</label>
                <textarea 
                  value={productForm.description || ''} 
                  onChange={e => setProductForm({...productForm, description: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-amber-500 h-24"
                  placeholder="Descreva o sabor e textura..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Preço Base (R$)</label>
                  <input 
                    type="number" 
                    value={productForm.basePrice || ''} 
                    onChange={e => setProductForm({...productForm, basePrice: parseFloat(e.target.value)})}
                    className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-amber-500"
                    placeholder="0.00"
                    step="0.10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Categoria</label>
                  <select 
                    value={productForm.category || 'pudim'} 
                    onChange={e => setProductForm({...productForm, category: e.target.value as any})}
                    className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-amber-500"
                  >
                    <option value="pudim">Pudim</option>
                    <option value="mousse">Mousse</option>
                    <option value="combo">Combo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Imagem do Produto</label>
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <div className="flex items-center gap-4">
                         <label className="cursor-pointer bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors">
                            <Upload size={18} />
                            Carregar Imagem
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                        <span className="text-xs text-slate-500">Ou cole a URL abaixo</span>
                    </div>
                    
                    <input 
                      type="text" 
                      value={productForm.image || ''} 
                      onChange={e => setProductForm({...productForm, image: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg p-3 mt-3 text-xs focus:outline-none focus:border-amber-500"
                      placeholder="https://..."
                    />

                    {productForm.image && (
                      <div className="mt-3 h-40 w-full rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center">
                        <img src={productForm.image} alt="Preview" className="h-full object-contain" />
                      </div>
                    )}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                 <button 
                  onClick={handleSaveProduct}
                  className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-bold hover:bg-amber-700 flex justify-center items-center gap-2"
                 >
                   <Save size={18} /> Salvar Produto
                 </button>
                 <button 
                  onClick={() => setIsEditingProduct(false)}
                  className="px-6 border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50"
                 >
                   Cancelar
                 </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
             <h3 className="font-bold text-slate-800 text-xl">Catálogo de Produtos</h3>
             <button 
               onClick={() => handleOpenProductForm()} 
               className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-amber-700 flex items-center gap-2"
             >
               <Plus size={18} /> Novo Produto
             </button>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                      <th className="px-6 py-4">Produto</th>
                      <th className="px-6 py-4">Categoria</th>
                      <th className="px-6 py-4">Preço</th>
                      <th className="px-6 py-4">Rating</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-3">
                             <img src={product.image} className="w-10 h-10 rounded object-cover" alt="" />
                             <div className="font-medium text-slate-900">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 capitalize">{product.category}</td>
                          <td className="px-6 py-4 font-bold text-slate-800">R$ {product.basePrice.toFixed(2)}</td>
                          <td className="px-6 py-4">★ {product.rating}</td>
                          <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => handleOpenProductForm(product)} className="p-2 text-slate-400 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 rounded-lg transition-colors">
                                  <Pencil size={16} />
                                </button>
                                <button onClick={() => onDeleteProduct(product.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-lg transition-colors">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
        </div>
      );
    }

    // Orders View
    if (activeView === 'orders') {
        if (selectedOrder) {
            // Detailed Order View
            return (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                        <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <ArrowLeft size={20} className="text-slate-600" />
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Detalhes do Pedido {selectedOrder.id}</h2>
                            <span className="text-sm text-slate-500">{selectedOrder.time} • {selectedOrder.customerName}</span>
                        </div>
                        <span className="ml-auto bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-bold">
                            {selectedOrder.status}
                        </span>
                    </div>
                    <div className="p-8 grid grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-slate-400 font-bold uppercase text-xs tracking-wider mb-4">Itens do Pedido</h3>
                            <div className="space-y-4">
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-50">
                                        <span className="font-medium text-slate-800">{item}</span>
                                        <span className="text-slate-400">R$ --</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-4 text-lg font-bold text-slate-900">
                                    <span>Total</span>
                                    <span>R$ {selectedOrder.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-slate-400 font-bold uppercase text-xs tracking-wider mb-2">Cliente</h3>
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="font-bold text-slate-800">{selectedOrder.customerName}</p>
                                    <p className="text-slate-500 text-sm">{selectedOrder.customerPhone}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-slate-400 font-bold uppercase text-xs tracking-wider mb-2">Endereço de Entrega</h3>
                                <div className="bg-slate-50 p-4 rounded-lg flex gap-3">
                                    <CheckCircle size={20} className="text-green-500 mt-1" />
                                    <p className="text-slate-700 text-sm leading-relaxed">{selectedOrder.address}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-slate-400 font-bold uppercase text-xs tracking-wider mb-2">Pagamento</h3>
                                <div className="flex items-center gap-2 text-slate-700">
                                    <CreditCard size={18} />
                                    <span>{selectedOrder.paymentMethod}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // List View
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-xl">Gerenciamento de Pedidos em Tempo Real</h3>
                <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full animate-pulse">● Feed Ao Vivo</span>
            </div>
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                        <th className="px-6 py-4">ID do Pedido</th>
                        <th className="px-6 py-4">Cliente</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Ação</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {MOCK_ORDERS_DETAIL.map((order, i) => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                            <td className="px-6 py-4 font-mono text-slate-500">{order.id}</td>
                            <td className="px-6 py-4 font-medium text-slate-900">{order.customerName}</td>
                            <td className="px-6 py-4">R$ {order.total.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    order.status === 'Entregue' ? 'bg-green-100 text-green-800' : 
                                    order.status === 'Preparando' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <button className="text-amber-600 font-bold hover:underline">Ver</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        );
    }
      
    // Financials View
    if (activeView === 'financials') {
        const income = financials.filter(f => f.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
        const expense = financials.filter(f => f.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
        
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="flex justify-between items-center">
                 <h2 className="text-xl font-bold text-slate-800">Resumo Financeiro</h2>
                 <button 
                   onClick={handleResetFinancials}
                   className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 flex items-center gap-2"
                 >
                   <Trash size={16} /> Zerar Financeiro
                 </button>
             </div>

             <div className="grid grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl border border-slate-100">
                     <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-green-100 rounded-lg"><TrendingUp className="text-green-600" /></div>
                        {financials.length > 0 && <span className="text-green-600 font-bold text-sm">+12%</span>}
                     </div>
                     <p className="text-slate-500 text-sm">Entradas Totais</p>
                     <p className="text-2xl font-bold text-slate-800">R$ {income.toFixed(2)}</p>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-slate-100">
                     <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-red-100 rounded-lg"><TrendingDown className="text-red-600" /></div>
                        {financials.length > 0 && <span className="text-red-600 font-bold text-sm">+5%</span>}
                     </div>
                     <p className="text-slate-500 text-sm">Saídas Totais</p>
                     <p className="text-2xl font-bold text-slate-800">R$ {expense.toFixed(2)}</p>
                 </div>
             </div>

             <div className="bg-white p-6 rounded-xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-6">Últimas Transações</h3>
                {financials.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <DollarSign className="mx-auto mb-2 opacity-50" size={32} />
                        <p>Nenhum registro financeiro encontrado.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="p-3 rounded-l-lg">Data</th>
                                    <th className="p-3">Descrição</th>
                                    <th className="p-3">Categoria</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 rounded-r-lg text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {financials.map((rec) => (
                                    <tr key={rec.id}>
                                        <td className="p-3 text-slate-500 font-mono">{rec.date}</td>
                                        <td className="p-3 font-medium text-slate-800">{rec.description}</td>
                                        <td className="p-3"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{rec.category}</span></td>
                                        <td className="p-3">
                                            <span className={`text-xs font-bold ${rec.status === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>
                                                {rec.status === 'completed' ? 'Concluído' : 'Pendente'}
                                            </span>
                                        </td>
                                        <td className={`p-3 text-right font-bold ${rec.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                            {rec.type === 'income' ? '+' : '-'} R$ {rec.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
             </div>
          </div>
        );
    }
    
    // Default: Overview
    return (
      <div className="animate-in fade-in duration-300">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Receita Total (Mensal)" value="R$ 1.2M" trend="+12.5%" isPositive={true} icon={<DollarSign size={20} />} />
          <StatCard title="Pedidos Ativos" value="1,240" trend="+8.2%" isPositive={true} icon={<ShoppingBag size={20} />} />
          <StatCard title="Assinantes do Clube" value="8.5k" trend="+22.4%" isPositive={true} icon={<Users size={20} />} />
          <StatCard title="Ticket Médio" value="R$ 48.90" trend="-2.1%" isPositive={false} icon={<Activity size={20} />} />
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
            <h3 className="font-bold text-slate-800 mb-6">Trajetória de Receita</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d97706" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} cursor={{stroke: '#d97706', strokeWidth: 1}} />
                  <Area type="monotone" dataKey="revenue" stroke="#d97706" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6">Mix de Produtos</h3>
            <div className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen pl-72">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif capitalize">{activeView === 'overview' ? 'Visão Geral' : activeView === 'products' ? 'Produtos' : activeView}</h1>
          <p className="text-slate-500">Bem-vindo de volta, Estrategista.</p>
        </div>
        <div className="flex gap-3">
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 flex items-center gap-2">
                <Clock size={16} /> Últimos 7 Dias
            </div>
            <button 
              onClick={handleExport}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-amber-200 hover:bg-amber-700 transition-colors active:scale-95 flex items-center gap-2"
            >
                <Download size={16} /> Exportar CSV
            </button>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};