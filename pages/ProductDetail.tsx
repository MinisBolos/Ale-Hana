import React, { useState } from 'react';
import { ArrowLeft, Minus, Plus, Heart, Star, User } from 'lucide-react';
import { Product, CartItem } from '../types';
import { SIZES } from '../constants';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (item: CartItem) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart, isFavorite, onToggleFavorite }) => {
  const [selectedSize, setSelectedSize] = useState(SIZES[0]);
  const [quantity, setQuantity] = useState(1);

  // Cálculo simplificado sem toppings
  const baseTotal = (product.basePrice * selectedSize.multiplier);
  const finalPrice = baseTotal * quantity;

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      size: selectedSize.id as any,
      toppings: [], // Array vazio pois não há mais adicionais
      quantity,
      finalPrice: finalPrice
    });
    onBack();
  };

  return (
    <div className="pb-24 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header Image */}
      <div className="relative h-72 w-full">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <button 
          onClick={onBack} 
          className="absolute top-4 left-4 bg-white/90 p-2 rounded-full shadow-lg backdrop-blur-sm hover:bg-white transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-800" />
        </button>
        <button 
          onClick={onToggleFavorite}
          className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg backdrop-blur-sm hover:scale-110 transition-transform"
        >
          <Heart 
            size={20} 
            className={`transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-800'}`} 
          />
        </button>
      </div>

      <div className="bg-white -mt-6 rounded-t-3xl relative p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold font-serif text-gray-900">{product.name}</h1>
          <div className="bg-amber-100 px-3 py-1 rounded-full flex items-center gap-1">
            <span className="text-amber-700 font-bold text-sm">★ {product.rating}</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">{product.description}</p>

        {/* Size Selection */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Escolha o Tamanho</h3>
          <div className="flex gap-3">
            {SIZES.map(size => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size)}
                className={`flex-1 py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all ${
                  selectedSize.id === size.id 
                    ? 'border-amber-500 bg-amber-50 text-amber-700' 
                    : 'border-gray-100 text-gray-500 hover:border-gray-200'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity and Add */}
        <div className="flex items-center gap-4 mb-10 mt-8">
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 gap-4">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-amber-600 transition-colors">
                <Minus size={20} />
              </button>
              <span className="font-bold text-lg w-4 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="text-amber-600 hover:scale-110 transition-transform">
                <Plus size={20} />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-gray-200 active:scale-95 transition-transform flex justify-between px-6 hover:bg-gray-800"
            >
              <span>Adicionar</span>
              <span>R$ {finalPrice.toFixed(2)}</span>
            </button>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-gray-100 pt-8">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Avaliações de Clientes</h3>
            {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                    {product.reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-50 pb-4 last:border-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                        <User size={14} />
                                    </div>
                                    <span className="font-bold text-sm text-gray-800">{review.userName}</span>
                                </div>
                                <span className="text-xs text-gray-400">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={12} 
                                        className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} 
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-sm text-center py-4">Este produto ainda não tem avaliações.</p>
            )}
        </div>
      </div>
    </div>
  );
};