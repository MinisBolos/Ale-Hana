import React, { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { getDessertRecommendation } from '../services/geminiService';
import { MOCK_PRODUCTS } from '../constants';

export const AIConcierge: React.FC = () => {
  const [mood, setMood] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!mood.trim()) return;
    setLoading(true);
    setRecommendation('');
    
    // Create a string list of products for the AI
    const productList = MOCK_PRODUCTS.map(p => p.name).join(', ');
    
    const result = await getDessertRecommendation(mood, productList);
    setRecommendation(result);
    setLoading(false);
  };

  return (
    <div className="p-6 pb-24">
      <div className="text-center mb-8">
        <div className="inline-block p-3 rounded-full bg-purple-100 mb-4 animate-bounce">
          <Sparkles size={32} className="text-purple-600" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Concierge Doce</h2>
        <p className="text-gray-500 text-sm">
          Distribuído por Gemini AI. Diga como se sente e escolheremos a sobremesa perfeita.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-50 mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">Como você está se sentindo hoje?</label>
        <div className="relative">
          <input 
            type="text" 
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="ex: Estressado, Comemorando..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <button 
            onClick={handleAsk}
            disabled={loading}
            className="absolute right-2 top-2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>

      {recommendation && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100 shadow-sm animate-in fade-in zoom-in duration-300">
          <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
            <Sparkles size={16} />
            Nossa Sugestão
          </h3>
          <p className="text-gray-800 leading-relaxed font-medium">
            "{recommendation}"
          </p>
        </div>
      )}

      <div className="mt-8">
        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Humores Populares</h4>
        <div className="flex flex-wrap gap-2">
          {['Preciso de Conforto', 'Celebração', 'Desejo Noturno', 'Romântico'].map(m => (
            <button 
              key={m}
              onClick={() => setMood(m)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};