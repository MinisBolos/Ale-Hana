import React from 'react';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  category: 'pudim' | 'mousse' | 'combo';
  rating: number;
  isPopular?: boolean;
  reviews?: Review[];
}

export interface CartItem extends Product {
  size: 'P' | 'M' | 'G' | 'Família';
  toppings: string[];
  quantity: number;
  finalPrice: number;
}

export interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

export enum AppMode {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export type AdminView = 'overview' | 'orders' | 'financials' | 'products' | 'settings';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info';
}

// Novos Tipos para Admin
export interface FinancialRecord {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'completed' | 'pending';
}

export interface OrderDetailType {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: string[];
  total: number;
  status: string;
  time: string;
  paymentMethod: string;
}

export interface UserOrder {
  id: string;
  date: string;
  total: number;
  status: 'Entregue' | 'Cancelado' | 'Em Preparo';
  items: {
    productId: string;
    name: string;
    quantity: number;
    size: string;
  }[];
}

export interface User {
  name: string;
  email: string;
  password?: string; // Em produção, nunca armazenar senha plana
  avatar?: string;
  orders: UserOrder[];
}

// Mercado Pago Types
export interface PixPaymentResponse {
  id: number;
  status: string;
  point_of_interaction: {
    transaction_data: {
      qr_code: string;
      qr_code_base64: string;
      ticket_url: string;
    }
  };
}

export interface Partner {
  id: string;
  name: string;
  type: string;
  status: string;
  revenue: number;
  orders: number;
}

export interface Campaign {
  id: string;
  name: string;
  status: string;
  reach: number;
  conversion: number;
  cost: number;
}