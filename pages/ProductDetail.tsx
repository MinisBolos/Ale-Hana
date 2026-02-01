import React, { useState } from 'react';
import { ArrowLeft, Minus, Plus, Heart } from 'lucide-react';
import { Product, CartItem } from '../types';
import { SIZES, TOPPINGS } from '../constants';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (item: CartItem) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart, isFavorite, onToggleFavorite }) => {
  const [selectedSize, setSelectedSize] = useState(SIZES[0]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const baseTotal = (product.basePrice * selectedSize.multiplier);
  const toppingsTotal = selectedToppings.reduce((acc, topId) => {
    const top = TOPPINGS.find(t => t.id === topId);
    return acc + (top ? top.price : 0);
  }, 0);
  
  const finalPrice = (baseTotal + toppingsTotal) * quantity;

  const toggleTopping = (id: string) => {
    if (selectedToppings.includes(id)) {
      setSelectedToppings(selectedToppings.filter(t => t !== id));
    } else {
      setSelectedToppings([...selectedToppings, id]);
    }
  };

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      size: selectedSize.id as any,
      toppings: selectedToppings,
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

        {/* Toppings */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Adicionais</h3>
          <div className="space-y-3">
            {TOPPINGS.map(topping => (
              <div 
                key={topping.id}
                onClick={() => toggleTopping(topping.id)}
                className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedToppings.includes(topping.id)
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                     selectedToppings.includes(topping.id) ? 'bg-amber-500 border-amber-500' : 'border-gray-300'
                  }`}>
                    {selectedToppings.includes(topping.id) && <Plus size={12} className="text-white" />}
                  </div>
                  <span className="text-gray-700 font-medium">{topping.name}</span>
                </div>
                <span className="text-amber-600 font-semibold">+ R$ {topping.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quantity and Add */}
        <div className="flex items-center gap-4">
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
      </div>
    </div>
  );
};