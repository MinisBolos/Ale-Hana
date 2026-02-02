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
  size: 'P' | 'M' | 'G';
  toppings: string[];
  quantity: number;
  finalPrice: number;
}

export interface UserOrder {
  id: string;
  date: string;
  total: number;
  status: string;
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
  avatar?: string;
  orders: UserOrder[];
}

export interface PixConfig {
  key: string;
  bank: string;
  owner: string;
}

// Admin Types
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

// UI Types
export enum AppMode {
  CUSTOMER = 'customer',
  ADMIN = 'admin'
}

export type AdminView = 'overview' | 'orders' | 'products' | 'financials' | 'settings';

export interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}
