import { Product, FinancialRecord, Partner, Campaign, OrderDetailType, UserOrder } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Pudim de Leite Clássico',
    description: 'A receita da vovó. Textura ultra lisa, sem furinhos, com calda de caramelo âmbar.',
    basePrice: 24.90,
    image: 'https://images.unsplash.com/photo-1543363363-2384a307049b?q=80&w=800&auto=format&fit=crop',
    category: 'pudim',
    rating: 4.9,
    isPopular: true
  },
  {
    id: '2',
    name: 'Mousse Belgian Dark',
    description: 'Chocolate belga 70%, aerado na medida certa, finalizado com raspas de ouro.',
    basePrice: 28.90,
    image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?q=80&w=800&auto=format&fit=crop',
    category: 'mousse',
    rating: 4.8,
    isPopular: true
  },
  {
    id: '3',
    name: 'Pudim de Pistache',
    description: 'Pistache siciliano autêntico. Cremoso, verde suave e sabor inigualável.',
    basePrice: 32.90,
    image: 'https://images.unsplash.com/photo-1517438322307-e67111335449?q=80&w=800&auto=format&fit=crop',
    category: 'pudim',
    rating: 4.9
  },
  {
    id: '4',
    name: 'Combo Degustação',
    description: '4 mini pudins de sabores variados (Leite, Doce de Leite, Café, Nutella).',
    basePrice: 45.90,
    image: 'https://images.unsplash.com/photo-1624372076383-3928e469e5d4?q=80&w=800&auto=format&fit=crop',
    category: 'combo',
    rating: 5.0,
    isPopular: true
  },
  {
    id: '5',
    name: 'Mousse de Maracujá Real',
    description: 'Feito com a fruta fresca. O equilíbrio perfeito entre o doce e o azedo.',
    basePrice: 22.90,
    image: 'https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?q=80&w=800&auto=format&fit=crop',
    category: 'mousse',
    rating: 4.7
  }
];

export const TOPPINGS = [
  { id: 't1', name: 'Extra Calda Caramelo', price: 3.00 },
  { id: 't2', name: 'Chantilly Fresco', price: 4.50 },
  { id: 't3', name: 'Farofa de Nozes', price: 5.00 },
  { id: 't4', name: 'Flor de Sal', price: 1.00 },
];

export const SIZES = [
  { id: 'P', label: 'Individual (150g)', multiplier: 1 },
  { id: 'M', label: 'Casal (300g)', multiplier: 1.8 },
  { id: 'G', label: 'Família (800g)', multiplier: 3.5 },
];

// Dados Mockados para Admin
export const MOCK_FINANCIALS: FinancialRecord[] = [
  { id: 'F001', date: '2023-10-25', description: 'Vendas Diárias - App', category: 'Vendas', amount: 4500.00, type: 'income', status: 'completed' },
  { id: 'F002', date: '2023-10-25', description: 'Fornecedor de Laticínios', category: 'Insumos', amount: 1200.00, type: 'expense', status: 'completed' },
  { id: 'F003', date: '2023-10-24', description: 'Vendas B2B - Hotel Plaza', category: 'B2B', amount: 3200.00, type: 'income', status: 'completed' },
  { id: 'F004', date: '2023-10-24', description: 'Manutenção Equipamentos', category: 'Manutenção', amount: 450.00, type: 'expense', status: 'pending' },
  { id: 'F005', date: '2023-10-23', description: 'Campanha Facebook Ads', category: 'Marketing', amount: 800.00, type: 'expense', status: 'completed' },
];

export const MOCK_PARTNERS: Partner[] = [
  { id: 'P01', name: 'Hotel Grand Plaza', type: 'Corporate', status: 'Active', revenue: 15400, orders: 45 },
  { id: 'P02', name: 'Bistro Paris 6', type: 'Restaurant', status: 'Active', revenue: 8900, orders: 22 },
  { id: 'P03', name: 'Eventos Silva & Co', type: 'Event', status: 'Inactive', revenue: 0, orders: 0 },
  { id: 'P04', name: 'Café Cultura', type: 'Restaurant', status: 'Active', revenue: 4200, orders: 15 },
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'C01', name: 'Promoção de Verão', status: 'Active', reach: 45000, conversion: 2.4, cost: 1500 },
  { id: 'C02', name: 'Black Friday Antecipada', status: 'Scheduled', reach: 0, conversion: 0, cost: 3000 },
  { id: 'C03', name: 'Dia dos Namorados', status: 'Ended', reach: 68000, conversion: 3.8, cost: 2200 },
];

export const MOCK_ORDERS_DETAIL: OrderDetailType[] = [
  { id: '#ORD-291', customerName: 'João Silva', customerPhone: '(11) 99999-1111', address: 'Av. Paulista, 1000 - Apto 42', items: ['2x Mousse Belgian Dark', '1x Pudim Leite'], total: 82.70, status: 'Preparando', time: '10:30', paymentMethod: 'Pix' },
  { id: '#ORD-292', customerName: 'Maria Oliveira', customerPhone: '(11) 98888-2222', address: 'Rua Augusta, 500 - Bloco B', items: ['1x Combo Degustação'], total: 45.90, status: 'Saiu para Entrega', time: '10:15', paymentMethod: 'Cartão de Crédito' },
  { id: '#ORD-293', customerName: 'Carlos Souza', customerPhone: '(11) 97777-3333', address: 'Rua da Consolação, 1200', items: ['3x Pudim de Pistache'], total: 98.70, status: 'Entregue', time: '09:45', paymentMethod: 'Cartão de Débito' },
  { id: '#ORD-294', customerName: 'Ana Paula', customerPhone: '(11) 96666-4444', address: 'Alameda Santos, 200', items: ['1x Mousse Maracujá', '1x Mousse Belgian'], total: 51.80, status: 'Entregue', time: '09:30', paymentMethod: 'Pix' },
  { id: '#ORD-295', customerName: 'Roberto Lima', customerPhone: '(11) 95555-5555', address: 'Rua Bela Cintra, 800', items: ['2x Pudim Leite Clássico'], total: 49.80, status: 'Entregue', time: '09:00', paymentMethod: 'Cartão de Crédito' },
  { id: '#ORD-296', customerName: 'Fernanda Costa', customerPhone: '(11) 94444-6666', address: 'Rua Haddock Lobo, 300', items: ['1x Combo Degustação', '2x Água'], total: 55.90, status: 'Entregue', time: '08:45', paymentMethod: 'Dinheiro' },
];

export const MOCK_USER_HISTORY: UserOrder[] = [
  {
    id: '2841',
    date: '10 Out, 2024',
    total: 58.90,
    status: 'Entregue',
    items: [
      { productId: '1', name: 'Pudim de Leite Clássico', quantity: 1, size: 'M' },
      { productId: '2', name: 'Mousse Belgian Dark', quantity: 1, size: 'P' }
    ]
  },
  {
    id: '2705',
    date: '02 Out, 2024',
    total: 32.90,
    status: 'Entregue',
    items: [
      { productId: '3', name: 'Pudim de Pistache', quantity: 1, size: 'P' }
    ]
  },
  {
    id: '2540',
    date: '25 Set, 2024',
    total: 45.90,
    status: 'Entregue',
    items: [
      { productId: '4', name: 'Combo Degustação', quantity: 1, size: 'P' }
    ]
  }
];