import React from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-amber-50 hover:shadow-md transition-all cursor-pointer group"
      onClick={() => onClick(product)}
    >
      <div className="relative h-32 w-full overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.isPopular && (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
            POPULAR
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-gray-800 leading-tight text-sm line-clamp-1">{product.name}</h3>
          <span className="text-amber-600 font-bold text-sm">★ {product.rating}</span>
        </div>
        <p className="text-gray-400 text-xs line-clamp-2 mb-3 h-8">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900">R$ {product.basePrice.toFixed(2)}</span>
          <button className="bg-amber-100 p-1.5 rounded-full text-amber-700 hover:bg-amber-200 transition-colors">
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};