import React from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  category: 'pudim' | 'mousse' | 'combo';
  rating: number;
  isPopular?: boolean;
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

export type AdminView = 'overview' | 'orders' | 'financials' | 'partners' | 'campaigns';

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

export interface Partner {
  id: string;
  name: string;
  type: 'Restaurant' | 'Corporate' | 'Event';
  status: 'Active' | 'Inactive';
  revenue: number;
  orders: number;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'Active' | 'Scheduled' | 'Ended';
  reach: number;
  conversion: number;
  cost: number;
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
  status: 'Entregue' | 'Cancelado';
  items: {
    productId: string;
    name: string;
    quantity: number;
    size: string;
  }[];
}