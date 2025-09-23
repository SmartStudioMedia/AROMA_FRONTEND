import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, ChevronDown } from 'lucide-react';
import { translations, languages } from './translations';

// API connection - use environment variable or default
const API_BASE = import.meta?.env?.VITE_API_BASE || "https://aroma-backend-production.up.railway.app";

async function apiGet(path) {
  const url = `${API_BASE}${path}${path.includes("?") ? "&" : "?"}t=${Date.now()}`;
  console.log('🔗 Fetching from:', url);
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      },
      credentials: "include",
    });
    console.log('📡 Response status:', res.status);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    console.log('✅ API Response:', data);
    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
}

async function apiPost(path, data) {
  const url = `${API_BASE}${path}`;
  console.log('📤 Posting to:', url, 'Data:', data);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    console.log('📡 Post response status:', res.status);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    const result = await res.json();
    console.log('✅ Post success:', result);
    return result;
  } catch (error) {
    console.error('❌ Post Error:', error);
    throw error;
  }
}

// Helper function to get translated text
const getText = (obj, lang) => {
  if (typeof obj === 'string') return obj;
  return obj?.[lang] || obj?.en || '';
};

export default function App() {
  // State
  const [language, setLanguage] = useState('en');
  const [showWelcome, setShowWelcome] = useState(true);
  const [orderType, setOrderType] = useState(null);
  const [activeCategory, setActiveCategory] = useState('burgers');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalSrc, setImageModalSrc] = useState('');
  const [itemQuantities, setItemQuantities] = useState({});
  const [menuData, setMenuData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [apiError, setApiError] = useState(null);

  const t = translations[language];

  // Load menu from backend
  useEffect(() => {
    const loadMenu = async () => {
      try {
        console.log('🔄 Loading menu from backend...');
        setApiError(null);
        
        // First test the debug endpoint
        try {
          const debugData = await apiGet('/api/debug');
          console.log('🔍 Debug endpoint response:', debugData);
        } catch (debugError) {
          console.log('⚠️ Debug endpoint failed:', debugError);
        }
        
        const data = await apiGet('/api/menu');
        console.log('📋 Menu data received:', data);
        
        if (data && data.categories && data.items) {
          setMenuData(data);
          setCategories(data.categories.filter(cat => cat.active));
          setItems(data.items.filter(item => item.active));
          console.log('✅ Menu loaded successfully');
          console.log('📂 Categories:', data.categories);
          console.log('🍽️ Items:', data.items);
        } else {
          throw new Error('Invalid menu data structure');
        }
      } catch (error) {
        console.error('❌ Failed to load menu from backend:', error);
        setApiError(error.message);
        
        // Fallback to default data
        console.log('🔄 Using fallback menu data...');
        const defaultData = {
          categories: [
            { id: 1, name: 'Burgers', icon: '🍔', sort_order: 1, active: true },
            { id: 2, name: 'Sides', icon: '🍟', sort_order: 2, active: true },
            { id: 3, name: 'Drinks', icon: '🥤', sort_order: 3, active: true },
            { id: 4, name: 'Desserts', icon: '🍰', sort_order: 4, active: true }
          ],
          items: [
            {
              id: 1,
              name: { en: 'Classic Burger', mt: 'Burger Klassiku', it: 'Burger Classico', fr: 'Burger Classique', es: 'Burger Clásico', de: 'Klassischer Burger', ru: 'Классический бургер', pt: 'Burger Clássico', nl: 'Klassieke Burger', pl: 'Klasyczny Burger' },
              description: { en: 'Juicy beef patty with fresh lettuce and tomato', mt: 'Patty tal-baħar b\'lettuce friska u tadam', it: 'Polpetta di manzo succosa con lattuga fresca e pomodoro', fr: 'Steak de bœuf juteux avec laitue fraîche et tomate', es: 'Hamburguesa de carne jugosa con lechuga fresca y tomate', de: 'Saftiges Rindersteak mit frischem Salat und Tomate', ru: 'Сочная говяжья котлета со свежим салатом и помидорами', pt: 'Hambúrguer de carne suculento com alface fresca e tomate', nl: 'Sappige rundvleesburger met verse sla en tomaat', pl: 'Soczysta wołowina z świeżą sałatą i pomidorem' },
              price: 12.99,
              image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
              category_id: 1,
              active: true,
              ingredients: { en: 'Beef patty, lettuce, tomato, onion, bun', mt: 'Patty tal-baħar, lettuce, tadam, basal, bun', it: 'Polpetta di manzo, lattuga, pomodoro, cipolla, panino', fr: 'Steak de bœuf, laitue, tomate, oignon, pain', es: 'Hamburguesa de carne, lechuga, tomate, cebolla, pan', de: 'Rindersteak, Salat, Tomate, Zwiebel, Brötchen', ru: 'Говяжья котлета, салат, помидор, лук, булочка', pt: 'Hambúrguer de carne, alface, tomate, cebola, pão', nl: 'Rundvleesburger, sla, tomaat, ui, broodje', pl: 'Wołowina, sałata, pomidor, cebula, bułka' },
              nutrition: { en: 'Calories: 650, Protein: 35g, Carbs: 45g, Fat: 35g', mt: 'Kaloriji: 650, Proteini: 35g, Karboidrati: 45g, Xaħmijiet: 35g', it: 'Calorie: 650, Proteine: 35g, Carboidrati: 45g, Grassi: 35g', fr: 'Calories: 650, Protéines: 35g, Glucides: 45g, Lipides: 35g', es: 'Calorías: 650, Proteínas: 35g, Carbohidratos: 45g, Grasas: 35g', de: 'Kalorien: 650, Eiweiß: 35g, Kohlenhydrate: 45g, Fette: 35g', ru: 'Калории: 650, Белки: 35г, Углеводы: 45г, Жиры: 35г', pt: 'Calorias: 650, Proteínas: 35g, Carboidratos: 45g, Gorduras: 35g', nl: 'Calorieën: 650, Eiwit: 35g, Koolhydraten: 45g, Vet: 35g', pl: 'Kalorie: 650, Białko: 35g, Węglowodany: 45g, Tłuszcz: 35g' },
              allergies: { en: 'Contains gluten, dairy', mt: 'Fih gluten, dairy', it: 'Contiene glutine, latticini', fr: 'Contient du gluten, des produits laitiers', es: 'Contiene gluten, lácteos', de: 'Enthält Gluten, Milchprodukte', ru: 'Содержит глютен, молочные продукты', pt: 'Contém glúten, laticínios', nl: 'Bevat gluten, zuivel', pl: 'Zawiera gluten, nabiał' },
              prepTime: { en: '15 min', mt: '15 min', it: '15 min', fr: '15 min', es: '15 min', de: '15 Min', ru: '15 мин', pt: '15 min', nl: '15 min', pl: '15 min' }
            }
          ]
        };
        setMenuData(defaultData);
        setCategories(defaultData.categories);
        setItems(defaultData.items);
      }
    };
    loadMenu();
  }, []);

  // Get items for current category
  const getCurrentCategoryItems = () => {
    if (!items || !activeCategory) {
      console.log('🔍 No items or category:', { items: items?.length, activeCategory });
      return [];
    }
    
    const categoryId = categories.find(cat => cat.name.toLowerCase() === activeCategory)?.id;
    console.log('🔍 Current category:', activeCategory, 'Category ID:', categoryId);
    console.log('🔍 All items:', items.length, 'items');
    
    const filteredItems = items.filter(item => item.category_id === categoryId && item.active);
    console.log('🔍 Filtered items for', activeCategory, ':', filteredItems.length, 'items');
    console.log('🔍 Filtered items:', filteredItems);
    
    return filteredItems;
  };

  // Cart functions
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p => 
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev
      .map(p => p.id === id ? { ...p, qty: p.qty - 1 } : p)
      .filter(p => p.qty > 0)
    );
  };

  const clearCart = () => setCart([]);

  const getCartQuantity = (id) => {
    const item = cart.find(c => c.id === id);
    return item ? item.qty : 0;
  };

  const getItemQuantity = (id) => {
    return itemQuantities[id] || 0;
  };

  const updateItemQuantity = (id, change) => {
    setItemQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + change)
    }));
  };

  const addItemToCart = (item) => {
    const quantity = itemQuantities[item.id] || 0;
    if (quantity === 0) return;
    
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p => 
          p.id === item.id ? { ...p, qty: p.qty + quantity } : p
        );
      }
      return [...prev, { ...item, qty: quantity }];
    });
    
    // Reset quantity after adding to cart
    setItemQuantities(prev => ({
      ...prev,
      [item.id]: 0
    }));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  // Submit order
  const submitOrder = async () => {
    if (cart.length === 0) return;
    
    setLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({ id: item.id, qty: item.qty })),
        orderType: orderType,
        tableNumber: orderType === 'dine-in' ? Math.floor(Math.random() * 20) + 1 : null,
        customerName: 'Customer',
        total: getCartTotal()
      };
      
      console.log('📤 Submitting order:', orderData);
      const result = await apiPost('/api/orders', orderData);
      console.log('✅ Order result:', result);
      
      setOrderStatus("success");
      clearCart();
      setShowCart(false);
      
      setTimeout(() => setOrderStatus(null), 3000);
    } catch (error) {
      setOrderStatus("error");
      console.error("❌ Order failed:", error);
      console.error("❌ Error details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Language Dropdown Component
  const LanguageDropdown = ({ isWelcome = false }) => {
    const selectedLang = languages.find(l => l.code === language);
    
    return (
      <div className="relative">
        <button
          onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors ${
            isWelcome ? 'w-full justify-between' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg emoji" style={{fontSize: '18px'}}>{selectedLang.flag}</span>
            <span className="text-sm font-medium">{selectedLang.name}</span>
          </div>
          <ChevronDown 
            size={16} 
            className={`transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`}
          />
        </button>
        
        {showLanguageDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setShowLanguageDropdown(false);
                }}
                className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <span className="text-lg emoji" style={{fontSize: '18px'}}>{lang.flag}</span>
                <span className="font-medium text-gray-800">{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Image Modal Component
  const ImageModal = () => {
    if (!showImageModal) return null;
    
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={() => setShowImageModal(false)}
      >
        <div className="relative max-w-4xl max-h-full">
          <img
            src={imageModalSrc}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    );
  };

  // Welcome Screen
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">🍔</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">AROMA</h1>
              <p className="text-gray-600">{t.welcome}</p>
            </div>

            {/* Language Dropdown */}
            <div className="mb-8">
              <LanguageDropdown isWelcome={true} />
            </div>

            {/* Order Type Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => {
                  setOrderType("dine-in");
                  setShowWelcome(false);
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-3"
              >
                <span className="text-xl">🍽️</span>
                <span>{t.dineIn}</span>
              </button>
              
              <button
                onClick={() => {
                  setOrderType("takeaway");
                  setShowWelcome(false);
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-3"
              >
                <span className="text-xl">🥡</span>
                <span>{t.takeaway}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Restaurant Name - Top Left */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🍔</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">AROMA</h1>
            </div>
            
            {/* Cart and Language - Top Right */}
            <div className="flex items-center gap-3">
              {/* Cart Button */}
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <ShoppingCart size={18} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cart.reduce((sum, item) => sum + item.qty, 0)}
                  </span>
                )}
              </button>
              
              {/* Language Dropdown */}
              <LanguageDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* API Error Message */}
      {apiError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-4 rounded">
          <strong>⚠️ Connection Error:</strong> {apiError}
          <br />
          <small>Using offline menu data</small>
        </div>
      )}

      {/* Category Tabs */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide category-scroll">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.name.toLowerCase())}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeCategory === category.name.toLowerCase()
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <main className="p-4 space-y-4 pb-20">
        {/* Debug Info */}
        <div className="bg-blue-100 p-3 rounded text-sm mb-4">
          <strong>🔍 Debug Info:</strong><br />
          Active Category: <strong>{activeCategory}</strong><br />
          Items in Category: <strong>{getCurrentCategoryItems().length}</strong><br />
          Total Items: <strong>{items.length}</strong><br />
          API Base: <strong>{API_BASE}</strong>
        </div>
        
        {getCurrentCategoryItems().length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
            <p className="text-gray-500">No items available in this category</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new items!</p>
          </div>
        ) : (
          getCurrentCategoryItems().map(item => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex gap-4">
                {/* Item Image */}
                <img
                  src={item.image}
                  alt={getText(item.name, language)}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageModalSrc(item.image);
                    setShowImageModal(true);
                  }}
                />
                
                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 mb-1">{getText(item.name, language)}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{getText(item.description, language)}</p>
                  <p className="text-orange-600 font-bold mb-3">€{item.price.toFixed(2)}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateItemQuantity(item.id, -1);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center font-medium text-sm">
                        {getItemQuantity(item.id)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateItemQuantity(item.id, 1);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white p-1.5 rounded-full transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addItemToCart(item);
                      }}
                      disabled={getItemQuantity(item.id) === 0}
                      className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      {t.addToCart}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Item Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedItem.image}
                alt={getText(selectedItem.name, language)}
                className="w-full h-48 object-cover rounded-t-2xl cursor-pointer"
                onClick={() => {
                  setImageModalSrc(selectedItem.image);
                  setShowImageModal(true);
                }}
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{getText(selectedItem.name, language)}</h2>
              <p className="text-gray-600 mb-4">{getText(selectedItem.description, language)}</p>
              
              <div className="space-y-3 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{t.ingredients}</h4>
                  <p className="text-gray-600 text-sm">{getText(selectedItem.ingredients, language)}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{t.nutrition}</h4>
                  <p className="text-gray-600 text-sm">{getText(selectedItem.nutrition, language)}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{t.allergies}</h4>
                  <p className="text-gray-600 text-sm">{getText(selectedItem.allergies, language)}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{t.prepTime}</h4>
                  <p className="text-gray-600 text-sm">{getText(selectedItem.prepTime, language)}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-orange-600 font-bold text-xl">
                  €{selectedItem.price.toFixed(2)}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateItemQuantity(selectedItem.id, -1)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-medium">
                    {getItemQuantity(selectedItem.id)}
                  </span>
                  <button
                    onClick={() => updateItemQuantity(selectedItem.id, 1)}
                    className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              
              {/* Add to Cart Button */}
              <button
                onClick={() => {
                  addItemToCart(selectedItem);
                  setSelectedItem(null);
                }}
                disabled={getItemQuantity(selectedItem.id) === 0}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors mt-4"
              >
                {t.addToCart}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">{t.cart}</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <ShoppingCart className="text-gray-400" size={24} />
                  </div>
                  <p className="text-gray-500">{t.emptyCart}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-3 flex-1">
                          {/* Item Thumbnail */}
                          <img
                            src={item.image}
                            alt={getText(item.name, language)}
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800">{getText(item.name, language)}</h3>
                            <p className="text-gray-600 text-sm">
                              €{item.price.toFixed(2)} × {item.qty}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-orange-500 hover:bg-orange-600 text-white p-1.5 rounded-full transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-bold text-lg text-gray-800">{t.total}</span>
                      <span className="font-bold text-xl text-orange-600">
                        €{getCartTotal().toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <button
                        onClick={clearCart}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors"
                      >
                        {t.cancelOrder}
                      </button>
                      <button
                        onClick={submitOrder}
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {loading ? "Processing..." : t.completeOrder}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      <ImageModal />

      {/* Order Status Messages */}
      {orderStatus === "success" && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {t.orderSuccess}
        </div>
      )}
      {orderStatus === "error" && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {t.orderError}
        </div>
      )}
    </div>
  );
}
