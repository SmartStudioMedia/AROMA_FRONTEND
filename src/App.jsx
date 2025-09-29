import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, ChevronDown } from 'lucide-react';
import { translations, languages } from './translations';

// API connection
const API_BASE = import.meta?.env?.VITE_API_BASE || "https://aroma-backend-production.up.railway.app";

async function apiGet(path) {
  const url = `${API_BASE}${path}${path.includes("?") ? "&" : "?"}t=${Date.now()}`;
  try {
  const res = await fetch(url, {
      method: 'GET',
      headers: { 
        "Content-Type": "application/json"
      },
    credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

async function apiPost(path, data) {
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, {
    method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
    body: JSON.stringify(data),
    credentials: "include",
  });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    const result = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
}

// Helper function to get translated text
const getText = (obj, lang) => {
  if (typeof obj === 'string') return obj;
  return obj?.[lang] || obj?.en || '';
};

// Category translation mapping
const categoryTranslations = {
  'Burgers': {
    en: 'Burgers',
    mt: 'Burgers', 
    it: 'Hamburger',
    fr: 'Burgers',
    es: 'Hamburguesas',
    de: 'Burger',
    ru: 'Бургеры',
    pt: 'Hambúrgueres',
    nl: 'Burgers',
    pl: 'Burgery'
  },
  'Sides': {
    en: 'Sides',
    mt: 'Ħut',
    it: 'Contorni',
    fr: 'Accompagnements',
    es: 'Acompañamientos',
    de: 'Beilagen',
    ru: 'Гарниры',
    pt: 'Acompanhamentos',
    nl: 'Bijgerechten',
    pl: 'Dodatki'
  },
  'Drinks': {
    en: 'Drinks',
    mt: 'Xorbiet',
    it: 'Bevande',
    fr: 'Boissons',
    es: 'Bebidas',
    de: 'Getränke',
    ru: 'Напитки',
    pt: 'Bebidas',
    nl: 'Drankjes',
    pl: 'Napoje'
  },
  'Desserts': {
    en: 'Desserts',
    mt: 'Dessert',
    it: 'Dolci',
    fr: 'Desserts',
    es: 'Postres',
    de: 'Desserts',
    ru: 'Десерты',
    pt: 'Sobremesas',
    nl: 'Desserts',
    pl: 'Desery'
  }
};

// Helper function to translate category names
function translateCategory(categoryName, lang = 'en') {
  if (categoryTranslations[categoryName]) {
    return categoryTranslations[categoryName][lang] || categoryTranslations[categoryName].en;
  }
  
  // For new categories, try to translate common food terms
  const commonTerms = {
    'Pizza': { en: 'Pizza', es: 'Pizza', it: 'Pizza', fr: 'Pizza', de: 'Pizza', ru: 'Пицца', pt: 'Pizza', nl: 'Pizza', pl: 'Pizza' },
    'Pasta': { en: 'Pasta', es: 'Pasta', it: 'Pasta', fr: 'Pâtes', de: 'Pasta', ru: 'Паста', pt: 'Massa', nl: 'Pasta', pl: 'Makaron' },
    'Salad': { en: 'Salad', es: 'Ensalada', it: 'Insalata', fr: 'Salade', de: 'Salat', ru: 'Салат', pt: 'Salada', nl: 'Salade', pl: 'Sałatka' },
    'Soup': { en: 'Soup', es: 'Sopa', it: 'Zuppa', fr: 'Soupe', de: 'Suppe', ru: 'Суп', pt: 'Sopa', nl: 'Soep', pl: 'Zupa' },
    'Appetizer': { en: 'Appetizer', es: 'Aperitivo', it: 'Antipasto', fr: 'Entrée', de: 'Vorspeise', ru: 'Закуска', pt: 'Aperitivo', nl: 'Voorgerecht', pl: 'Przystawka' },
    'Main Course': { en: 'Main Course', es: 'Plato Principal', it: 'Piatto Principale', fr: 'Plat Principal', de: 'Hauptgericht', ru: 'Основное блюдо', pt: 'Prato Principal', nl: 'Hoofdgerecht', pl: 'Danie Główne' },
    'Breakfast': { en: 'Breakfast', es: 'Desayuno', it: 'Colazione', fr: 'Petit-déjeuner', de: 'Frühstück', ru: 'Завтрак', pt: 'Café da Manhã', nl: 'Ontbijt', pl: 'Śniadanie' },
    'Lunch': { en: 'Lunch', es: 'Almuerzo', it: 'Pranzo', fr: 'Déjeuner', de: 'Mittagessen', ru: 'Обед', pt: 'Almoço', nl: 'Lunch', pl: 'Obiad' },
    'Dinner': { en: 'Dinner', es: 'Cena', it: 'Cena', fr: 'Dîner', de: 'Abendessen', ru: 'Ужин', pt: 'Jantar', nl: 'Diner', pl: 'Kolacja' },
    'Snacks': { en: 'Snacks', es: 'Aperitivos', it: 'Spuntini', fr: 'Collations', de: 'Snacks', ru: 'Закуски', pt: 'Lanches', nl: 'Snacks', pl: 'Przekąski' },
    'Beverages': { en: 'Beverages', es: 'Bebidas', it: 'Bevande', fr: 'Boissons', de: 'Getränke', ru: 'Напитки', pt: 'Bebidas', nl: 'Drankjes', pl: 'Napoje' },
    'Dessert': { en: 'Dessert', es: 'Postre', it: 'Dolce', fr: 'Dessert', de: 'Dessert', ru: 'Десерт', pt: 'Sobremesa', nl: 'Dessert', pl: 'Deser' },
    'Vegetarian': { en: 'Vegetarian', es: 'Vegetariano', it: 'Vegetariano', fr: 'Végétarien', de: 'Vegetarisch', ru: 'Вегетарианский', pt: 'Vegetariano', nl: 'Vegetarisch', pl: 'Wegetariański' },
    'Vegan': { en: 'Vegan', es: 'Vegano', it: 'Vegano', fr: 'Végan', de: 'Vegan', ru: 'Веганский', pt: 'Vegano', nl: 'Veganistisch', pl: 'Wegański' },
    'Gluten Free': { en: 'Gluten Free', es: 'Sin Gluten', it: 'Senza Glutine', fr: 'Sans Gluten', de: 'Glutenfrei', ru: 'Без глютена', pt: 'Sem Glúten', nl: 'Glutenvrij', pl: 'Bezglutenowy' },
    'Healthy': { en: 'Healthy', es: 'Saludable', it: 'Sano', fr: 'Sain', de: 'Gesund', ru: 'Здоровый', pt: 'Saudável', nl: 'Gezond', pl: 'Zdrowy' },
    'Spicy': { en: 'Spicy', es: 'Picante', it: 'Piccante', fr: 'Épicé', de: 'Scharf', ru: 'Острый', pt: 'Picante', nl: 'Pittig', pl: 'Ostry' },
    'Seafood': { en: 'Seafood', es: 'Mariscos', it: 'Frutti di Mare', fr: 'Fruits de Mer', de: 'Meeresfrüchte', ru: 'Морепродукты', pt: 'Frutos do Mar', nl: 'Zeevruchten', pl: 'Owoce Morza' },
    'Meat': { en: 'Meat', es: 'Carne', it: 'Carne', fr: 'Viande', de: 'Fleisch', ru: 'Мясо', pt: 'Carne', nl: 'Vlees', pl: 'Mięso' },
    'Chicken': { en: 'Chicken', es: 'Pollo', it: 'Pollo', fr: 'Poulet', de: 'Hähnchen', ru: 'Курица', pt: 'Frango', nl: 'Kip', pl: 'Kurczak' },
    'Beef': { en: 'Beef', es: 'Carne de Res', it: 'Manzo', fr: 'Bœuf', de: 'Rindfleisch', ru: 'Говядина', pt: 'Carne de Vaca', nl: 'Rundvlees', pl: 'Wołowina' },
    'Pork': { en: 'Pork', es: 'Cerdo', it: 'Maiale', fr: 'Porc', de: 'Schweinefleisch', ru: 'Свинина', pt: 'Porco', nl: 'Varkensvlees', pl: 'Wieprzowina' },
    'Fish': { en: 'Fish', es: 'Pescado', it: 'Pesce', fr: 'Poisson', de: 'Fisch', ru: 'Рыба', pt: 'Peixe', nl: 'Vis', pl: 'Ryba' },
    'Vegetables': { en: 'Vegetables', es: 'Verduras', it: 'Verdure', fr: 'Légumes', de: 'Gemüse', ru: 'Овощи', pt: 'Legumes', nl: 'Groenten', pl: 'Warzywa' },
    'Fruits': { en: 'Fruits', es: 'Frutas', it: 'Frutta', fr: 'Fruits', de: 'Obst', ru: 'Фрукты', pt: 'Frutas', nl: 'Fruit', pl: 'Owoce' },
    'Bread': { en: 'Bread', es: 'Pan', it: 'Pane', fr: 'Pain', de: 'Brot', ru: 'Хлеб', pt: 'Pão', nl: 'Brood', pl: 'Chleb' },
    'Rice': { en: 'Rice', es: 'Arroz', it: 'Riso', fr: 'Riz', de: 'Reis', ru: 'Рис', pt: 'Arroz', nl: 'Rijst', pl: 'Ryż' },
    'Noodles': { en: 'Noodles', es: 'Fideos', it: 'Tagliatelle', fr: 'Nouilles', de: 'Nudeln', ru: 'Лапша', pt: 'Macarrão', nl: 'Noedels', pl: 'Makaron' },
    'Sandwich': { en: 'Sandwich', es: 'Sándwich', it: 'Panino', fr: 'Sandwich', de: 'Sandwich', ru: 'Сэндвич', pt: 'Sanduíche', nl: 'Sandwich', pl: 'Kanapka' },
    'Wrap': { en: 'Wrap', es: 'Wrap', it: 'Wrap', fr: 'Wrap', de: 'Wrap', ru: 'Ролл', pt: 'Wrap', nl: 'Wrap', pl: 'Wrap' },
    'Burrito': { en: 'Burrito', es: 'Burrito', it: 'Burrito', fr: 'Burrito', de: 'Burrito', ru: 'Буррито', pt: 'Burrito', nl: 'Burrito', pl: 'Burrito' },
    'Taco': { en: 'Taco', es: 'Taco', it: 'Taco', fr: 'Taco', de: 'Taco', ru: 'Тако', pt: 'Taco', nl: 'Taco', pl: 'Taco' },
    'Sushi': { en: 'Sushi', es: 'Sushi', it: 'Sushi', fr: 'Sushi', de: 'Sushi', ru: 'Суши', pt: 'Sushi', nl: 'Sushi', pl: 'Sushi' },
    'Asian': { en: 'Asian', es: 'Asiático', it: 'Asiatico', fr: 'Asiatique', de: 'Asiatisch', ru: 'Азиатский', pt: 'Asiático', nl: 'Aziatisch', pl: 'Azjatycki' },
    'Italian': { en: 'Italian', es: 'Italiano', it: 'Italiano', fr: 'Italien', de: 'Italienisch', ru: 'Итальянский', pt: 'Italiano', nl: 'Italiaans', pl: 'Włoski' },
    'Mexican': { en: 'Mexican', es: 'Mexicano', it: 'Messicano', fr: 'Mexicain', de: 'Mexikanisch', ru: 'Мексиканский', pt: 'Mexicano', nl: 'Mexicaans', pl: 'Meksykański' },
    'Chinese': { en: 'Chinese', es: 'Chino', it: 'Cinese', fr: 'Chinois', de: 'Chinesisch', ru: 'Китайский', pt: 'Chinês', nl: 'Chinees', pl: 'Chiński' },
    'Japanese': { en: 'Japanese', es: 'Japonés', it: 'Giapponese', fr: 'Japonais', de: 'Japanisch', ru: 'Японский', pt: 'Japonês', nl: 'Japans', pl: 'Japoński' },
    'Indian': { en: 'Indian', es: 'Indio', it: 'Indiano', fr: 'Indien', de: 'Indisch', ru: 'Индийский', pt: 'Indiano', nl: 'Indiaas', pl: 'Indyjski' },
    'Thai': { en: 'Thai', es: 'Tailandés', it: 'Tailandese', fr: 'Thaï', de: 'Thailändisch', ru: 'Тайский', pt: 'Tailandês', nl: 'Thais', pl: 'Tajski' },
    'Mediterranean': { en: 'Mediterranean', es: 'Mediterráneo', it: 'Mediterraneo', fr: 'Méditerranéen', de: 'Mittelmeer', ru: 'Средиземноморский', pt: 'Mediterrâneo', nl: 'Mediterraan', pl: 'Śródziemnomorski' },
    'American': { en: 'American', es: 'Americano', it: 'Americano', fr: 'Américain', de: 'Amerikanisch', ru: 'Американский', pt: 'Americano', nl: 'Amerikaans', pl: 'Amerykański' },
    'French': { en: 'French', es: 'Francés', it: 'Francese', fr: 'Français', de: 'Französisch', ru: 'Французский', pt: 'Francês', nl: 'Frans', pl: 'Francuski' },
    'Greek': { en: 'Greek', es: 'Griego', it: 'Greco', fr: 'Grec', de: 'Griechisch', ru: 'Греческий', pt: 'Grego', nl: 'Grieks', pl: 'Grecki' },
    'Turkish': { en: 'Turkish', es: 'Turco', it: 'Turco', fr: 'Turc', de: 'Türkisch', ru: 'Турецкий', pt: 'Turco', nl: 'Turks', pl: 'Turecki' },
    'Lebanese': { en: 'Lebanese', es: 'Libanés', it: 'Libanese', fr: 'Libanais', de: 'Libanesisch', ru: 'Ливанский', pt: 'Libanês', nl: 'Libanees', pl: 'Libański' },
    'Fast Food': { en: 'Fast Food', es: 'Comida Rápida', it: 'Fast Food', fr: 'Restauration Rapide', de: 'Fast Food', ru: 'Фастфуд', pt: 'Fast Food', nl: 'Fast Food', pl: 'Fast Food' },
    'Street Food': { en: 'Street Food', es: 'Comida Callejera', it: 'Cibo di Strada', fr: 'Nourriture de Rue', de: 'Straßenessen', ru: 'Уличная еда', pt: 'Comida de Rua', nl: 'Straatvoedsel', pl: 'Jedzenie Uliczne' },
    'Fine Dining': { en: 'Fine Dining', es: 'Alta Cocina', it: 'Alta Cucina', fr: 'Haute Cuisine', de: 'Feinschmecker', ru: 'Высокая кухня', pt: 'Alta Gastronomia', nl: 'Fijne Keuken', pl: 'Wysoka Kuchnia' },
    'Casual': { en: 'Casual', es: 'Casual', it: 'Casual', fr: 'Décontracté', de: 'Lässig', ru: 'Повседневный', pt: 'Casual', nl: 'Casual', pl: 'Swobodny' },
    'Family': { en: 'Family', es: 'Familiar', it: 'Familiare', fr: 'Familial', de: 'Familie', ru: 'Семейный', pt: 'Familiar', nl: 'Familie', pl: 'Rodzinny' },
    'Kids': { en: 'Kids', es: 'Niños', it: 'Bambini', fr: 'Enfants', de: 'Kinder', ru: 'Детский', pt: 'Crianças', nl: 'Kinderen', pl: 'Dziecięcy' },
    'Senior': { en: 'Senior', es: 'Mayores', it: 'Anziani', fr: 'Séniors', de: 'Senioren', ru: 'Пожилой', pt: 'Idosos', nl: 'Senioren', pl: 'Senior' },
    'Special': { en: 'Special', es: 'Especial', it: 'Speciale', fr: 'Spécial', de: 'Spezial', ru: 'Особый', pt: 'Especial', nl: 'Speciaal', pl: 'Specjalny' },
    'Limited': { en: 'Limited', es: 'Limitado', it: 'Limitato', fr: 'Limité', de: 'Begrenzt', ru: 'Ограниченный', pt: 'Limitado', nl: 'Beperkt', pl: 'Ograniczony' },
    'Seasonal': { en: 'Seasonal', es: 'Estacional', it: 'Stagionale', fr: 'Saisonnier', de: 'Saisonal', ru: 'Сезонный', pt: 'Sazonal', nl: 'Seizoensgebonden', pl: 'Sezonowy' },
    'Holiday': { en: 'Holiday', es: 'Navideño', it: 'Festivo', fr: 'Vacances', de: 'Feiertag', ru: 'Праздничный', pt: 'Feriado', nl: 'Vakantie', pl: 'Świąteczny' },
    'Summer': { en: 'Summer', es: 'Verano', it: 'Estate', fr: 'Été', de: 'Sommer', ru: 'Летний', pt: 'Verão', nl: 'Zomer', pl: 'Letni' },
    'Winter': { en: 'Winter', es: 'Invierno', it: 'Inverno', fr: 'Hiver', de: 'Winter', ru: 'Зимний', pt: 'Inverno', nl: 'Winter', pl: 'Zimowy' },
    'Spring': { en: 'Spring', es: 'Primavera', it: 'Primavera', fr: 'Printemps', de: 'Frühling', ru: 'Весенний', pt: 'Primavera', nl: 'Lente', pl: 'Wiosenny' },
    'Autumn': { en: 'Autumn', es: 'Otoño', it: 'Autunno', fr: 'Automne', de: 'Herbst', ru: 'Осенний', pt: 'Outono', nl: 'Herfst', pl: 'Jesienny' }
  };
  
  // Check if the category name matches any common terms
  const normalizedName = categoryName.toLowerCase().trim();
  for (const [key, translations] of Object.entries(commonTerms)) {
    if (normalizedName === key.toLowerCase()) {
      return translations[lang] || translations.en;
    }
  }
  
  // If no translation found, return the original name
  return categoryName;
}

export default function App() {
  // Add custom scrollbar styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .cart-scroll {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .cart-scroll::-webkit-scrollbar {
        display: none;
      }
      /* Mobile touch scrolling improvements */
      .cart-scroll {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // State
  const [language, setLanguage] = useState('en');
  const [showWelcome, setShowWelcome] = useState(true);
  const [orderType, setOrderType] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalSrc, setImageModalSrc] = useState('');
  const [videoModalSrc, setVideoModalSrc] = useState('');
  const [modalType, setModalType] = useState('image'); // 'image' or 'video'
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [itemQuantities, setItemQuantities] = useState({});
  const [menuData, setMenuData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    marketingConsent: true, // Pre-ticked by default
    newsletterConsent: false
  });

  const t = translations[language];

  // Load menu from backend
  useEffect(() => {
    const loadMenu = async () => {
      try {
        setApiError(null);
        
        const data = await apiGet('/api/menu');
        
        if (data && data.categories && data.items) {
          setMenuData(data);
          setCategories(data.categories.filter(cat => cat.active));
          setItems(data.items.filter(item => item.active));
        } else {
          throw new Error('Invalid menu data structure');
        }
      } catch (error) {
        setApiError(error.message);
        
        // Fallback to default data
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

  // Update active category when language changes
  useEffect(() => {
    if (categories.length > 0) {
      const firstCategory = categories[0];
      const categoryName = translateCategory(firstCategory.name, language);
      setActiveCategory(categoryName.toLowerCase());
    }
  }, [language, categories]);

  // Get items for current category
  const getCurrentCategoryItems = () => {
    if (!items || !activeCategory || !categories.length) {
      return [];
    }
    
    const categoryId = categories.find(cat => {
      const categoryName = translateCategory(cat.name, language);
      return categoryName.toLowerCase() === activeCategory;
    })?.id;
    
    if (!categoryId) {
      return [];
    }
    
    const filteredItems = items.filter(item => item.category_id === categoryId && item.active);
    
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

  // Helper function to determine if URL is video or image
  const isVideoUrl = (url) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
    const urlLower = url.toLowerCase();
    
    // Check for direct video files
    if (videoExtensions.some(ext => urlLower.includes(ext))) return true;
    
    // Check for YouTube URLs
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) return true;
    
    // Check for Vimeo URLs
    if (urlLower.includes('vimeo.com')) return true;
    
    // Check for other video hosting
    if (urlLower.includes('video') || urlLower.includes('stream')) return true;
    
    return false;
  };

  // Helper function to detect if URL is a YouTube Short
  const isYouTubeShort = (url) => {
    if (!url || typeof url !== 'string') return false;
    return url.includes('youtube.com/shorts/') || url.includes('youtu.be/') && url.includes('shorts');
  };

  // Helper function to detect mobile devices and problematic browsers
  const isMobileDevice = () => {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || 
                     window.innerWidth <= 768;
    
    // Also detect browsers known to have YouTube iframe issues
    const hasVideoIssues = /iPhone|iPad|iPod|Android.*Chrome\/[0-9]{2}\.[0-9]|Safari.*Version\/[0-9]{2}\.[0-9]|Mobile.*Safari/i.test(userAgent);
    
    // Check for touch capability (mobile indicator)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Check for mobile viewport
    const isMobileViewport = window.innerWidth <= 768 || window.innerHeight <= 1024;
    
    // Force mobile mode for any of these conditions
    const forceMobile = isMobile || hasVideoIssues || (isTouchDevice && isMobileViewport);
    
    // Debug: Force mobile mode with URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const forceMobileParam = urlParams.get('forceMobile');
    const finalMobile = forceMobile || forceMobileParam === 'true';
    
    // Only force mobile mode for actual mobile devices
    const aggressiveMobile = false; // Allow desktop to use iframe
    
    console.log('Mobile detection:', {
      userAgent,
      isMobile,
      hasVideoIssues,
      isTouchDevice,
      isMobileViewport,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      forceMobile,
      forceMobileParam,
      finalMobile,
      aggressiveMobile
    });
    
    return finalMobile; // Use normal mobile detection
  };

  // Helper function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    
    try {
      const videoId = getYouTubeVideoId(url);
      
      if (videoId) {
        // Optimized parameters for all YouTube videos including Shorts
        const baseParams = [
          'autoplay=1',
          'mute=1',
          'rel=0',
          'modestbranding=1',
          'fs=1',
          'cc_load_policy=0',
          'iv_load_policy=3',
          'enablejsapi=1',
          `origin=${window.location.origin}`,
          'playsinline=1',
          'controls=1',
          'disablekb=0',
          'loop=0'
        ];
        
        if (isYouTubeShort(url)) {
          // Special parameters for Shorts to prevent corruption
          baseParams.push('start=0', 'end=0');
        }
        
        return `https://www.youtube.com/embed/${videoId}?${baseParams.join('&')}`;
      }
      return '';
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
      return '';
    }
  };

  // Helper function to get Vimeo embed URL
  const getVimeoEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    
    try {
      const parts = url.split('vimeo.com/');
      if (parts.length > 1) {
        const videoId = parts[1].split('?')[0];
        return `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1`;
      }
      return '';
    } catch (error) {
      console.error('Error parsing Vimeo URL:', error);
      return '';
    }
  };

  // Helper function to get YouTube video ID
  const getYouTubeVideoId = (url) => {
    if (!url || typeof url !== 'string') {
      console.log('getYouTubeVideoId: Invalid URL:', url);
      return '';
    }
    
    try {
      console.log('getYouTubeVideoId: Processing URL:', url);
      
      // Handle regular YouTube URLs: https://www.youtube.com/watch?v=VIDEO_ID
      if (url.includes('youtube.com/watch?v=')) {
        const parts = url.split('v=');
        if (parts.length > 1) {
          const videoId = parts[1].split('&')[0];
          console.log('getYouTubeVideoId: Extracted video ID from youtube.com:', videoId);
          return videoId;
        }
      }
      // Handle YouTube Shorts URLs: https://www.youtube.com/shorts/VIDEO_ID
      else if (url.includes('youtube.com/shorts/')) {
        const parts = url.split('youtube.com/shorts/');
        if (parts.length > 1) {
          const videoId = parts[1].split('?')[0];
          console.log('getYouTubeVideoId: Extracted video ID from youtube.com/shorts:', videoId);
          return videoId;
        }
      }
      // Handle youtu.be URLs: https://youtu.be/VIDEO_ID
      else if (url.includes('youtu.be/')) {
        const parts = url.split('youtu.be/');
        if (parts.length > 1) {
          const videoId = parts[1].split('?')[0];
          console.log('getYouTubeVideoId: Extracted video ID from youtu.be:', videoId);
          return videoId;
        }
      }
      
      console.log('getYouTubeVideoId: No valid YouTube URL pattern found');
      return '';
    } catch (error) {
      console.error('Error extracting YouTube video ID:', error);
      return '';
    }
  };

  // Test the YouTube URL parsing
  const testYouTubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const testShortsUrl = 'https://www.youtube.com/shorts/dQw4w9WgXcQ';
  
  console.log('Testing YouTube URL parsing:', testYouTubeUrl);
  const testVideoId = getYouTubeVideoId(testYouTubeUrl);
  console.log('Test result - Video ID:', testVideoId);
  
  console.log('Testing YouTube Shorts URL parsing:', testShortsUrl);
  const testShortsId = getYouTubeVideoId(testShortsUrl);
  console.log('Test result - Shorts ID:', testShortsId);
  
  console.log('Testing YouTube Shorts detection:', {
    url: testShortsUrl,
    isShort: isYouTubeShort(testShortsUrl),
    embedUrl: getYouTubeEmbedUrl(testShortsUrl),
    willUseDirectLink: isYouTubeShort(testShortsUrl)
  });
  
  // Test regular YouTube video
  console.log('Testing regular YouTube video:', {
    url: testYouTubeUrl,
    isShort: isYouTubeShort(testYouTubeUrl),
    embedUrl: getYouTubeEmbedUrl(testYouTubeUrl),
    willUseDirectLink: isYouTubeShort(testYouTubeUrl)
  });
  
  console.log('Test thumbnail URL:', `https://img.youtube.com/vi/${testVideoId}/mqdefault.jpg`);
  
  // Test if the thumbnail URL actually works
  const testThumbnailUrl = `https://img.youtube.com/vi/${testVideoId}/mqdefault.jpg`;
  const testImg = new Image();
  testImg.onload = () => console.log('✅ YouTube thumbnail test successful:', testThumbnailUrl);
  testImg.onerror = () => console.log('❌ YouTube thumbnail test failed:', testThumbnailUrl);
  testImg.src = testThumbnailUrl;

  // Helper function to get the primary media URL (video takes priority over image)
  const getPrimaryMediaUrl = (item) => {
    if (!item) {
      console.log('getPrimaryMediaUrl: No item provided');
      return '';
    }
    
    console.log('getPrimaryMediaUrl: Item data:', {
      id: item.id,
      name: item.name?.en || 'Unknown',
      video: item.video,
      image: item.image
    });
    
    if (item.video && typeof item.video === 'string' && item.video.trim() !== '') {
      console.log('getPrimaryMediaUrl: Using video URL:', item.video);
      return item.video;
    }
    
    if (item.image && typeof item.image === 'string') {
      console.log('getPrimaryMediaUrl: Using image URL:', item.image);
      return item.image;
    }
    
    console.log('getPrimaryMediaUrl: No valid media URL found');
    return '';
  };

  // Helper function to get the media type (video or image)
  const getMediaType = (item) => {
    if (!item) return 'image';
    
    if (item.video && typeof item.video === 'string' && item.video.trim() !== '') {
      return 'video';
    }
    
    return 'image';
  };

  // Helper function to open media modal
  const openMediaModal = (url) => {
    if (isVideoUrl(url)) {
      setVideoModalSrc(url);
      setModalType('video');
      setIsVideoPlaying(false); // Reset video playing state
      setIsLoading(true); // Reset loading state
      
      // Debug logging for mobile detection
      console.log('Opening video modal:', {
        url: url,
        isMobile: isMobileDevice(),
        isYouTubeShort: isYouTubeShort(url),
        userAgent: navigator.userAgent,
        screenWidth: window.innerWidth,
        willUseDirectLink: isYouTubeShort(url) || new URLSearchParams(window.location.search).get('forceDirect'),
        reason: isYouTubeShort(url) ? 'YouTube Shorts detected' : 'Normal video'
      });
    } else {
      setImageModalSrc(url);
      setModalType('image');
    }
    setShowImageModal(true);
  };

  // Show customer form before submitting order
  const submitOrder = () => {
    if (cart.length === 0) return;
    setShowCart(false); // Close cart modal first
    setTimeout(() => {
      setShowCustomerForm(true); // Open customer form after cart closes
    }, 100);
  };

  // Actually submit the order with customer info
  const confirmOrder = async () => {
    if (!customerInfo.name.trim() || !customerInfo.email.trim()) {
      alert('Please fill in both name and email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({ id: item.id, qty: item.qty })),
        orderType: orderType,
        tableNumber: orderType === 'dine-in' ? Math.floor(Math.random() * 20) + 1 : null,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        marketingConsent: customerInfo.marketingConsent,
        newsletterConsent: customerInfo.newsletterConsent,
        total: getCartTotal()
      };
      
      const result = await apiPost('/api/orders', orderData);
      
      setOrderStatus("success");
      clearCart();
      setShowCart(false);
      setShowCustomerForm(false);
      setCustomerInfo({ name: '', email: '' });
      
      setTimeout(() => setOrderStatus(null), 3000);
    } catch (error) {
      setOrderStatus("error");
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

  // Media Modal Component (Image/Video)
  const MediaModal = () => {
    if (!showImageModal) return null;
    
    const handleVideoClick = (e) => {
      e.stopPropagation();
      const video = e.target;
      if (video.paused) {
        video.play().catch(err => console.log('Autoplay failed:', err));
      }
    };

    // Determine if this is a YouTube or Vimeo URL
    const isYouTube = videoModalSrc.includes('youtube.com') || videoModalSrc.includes('youtu.be');
    const isVimeo = videoModalSrc.includes('vimeo.com');
    
    // Fallback function to open video in new tab if embed fails
    const openVideoInNewTab = () => {
      window.open(videoModalSrc, '_blank', 'noopener,noreferrer');
    };
    
    // Timeout mechanism to detect slow loading
    const [iframeTimeout, setIframeTimeout] = useState(null);
    
    useEffect(() => {
      if (modalType === 'video' && isYouTube) {
        const timeout = setTimeout(() => {
          console.log('YouTube iframe taking too long to load, showing fallback');
          const iframe = document.querySelector('iframe[src*="youtube.com/embed"]');
          if (iframe && iframe.offsetHeight === 0) {
            iframe.style.display = 'none';
            iframe.parentElement.innerHTML = `
              <div class="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center text-white">
                <div class="text-center">
                  <div class="text-4xl mb-4">⏱️</div>
                  <p class="text-lg font-semibold mb-2">Loading Timeout</p>
                  <p class="text-sm opacity-75 mb-4">Video is taking too long to load. Try opening it directly.</p>
                  <button onclick="window.open('${videoModalSrc}', '_blank', 'noopener,noreferrer')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    Open in YouTube
                  </button>
                </div>
              </div>
            `;
          }
        }, 10000); // 10 second timeout
        
        setIframeTimeout(timeout);
        
        return () => {
          if (timeout) clearTimeout(timeout);
        };
      }
    }, [modalType, isYouTube, videoModalSrc]);
    
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={() => setShowImageModal(false)}
      >
        <div className="relative max-w-4xl max-h-full">
          {modalType === 'video' ? (
            <div className="relative">
              {isYouTube ? (
                <div className="relative">
                  {isLoading && (
                    <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center text-white z-10">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-lg font-semibold">Loading Video...</p>
                        <p className="text-sm opacity-75">This may take a moment</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Allow YouTube Shorts to use embedded player with optimized parameters */}
                  {(new URLSearchParams(window.location.search).get('forceDirect')) ? (
                    <div className="w-full h-96 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center text-white">
                      <div className="text-center p-6">
                        <div className="text-8xl mb-6">{isYouTubeShort(videoModalSrc) ? '🎬' : '📱'}</div>
                        <h3 className="text-2xl font-bold mb-3">
                          {isYouTubeShort(videoModalSrc) ? 'YouTube Shorts Player' : 'Mobile Video Player'}
                        </h3>
                        <p className="text-base opacity-90 mb-8 leading-relaxed">
                          {isYouTubeShort(videoModalSrc) 
                            ? 'YouTube Shorts have known corruption issues when embedded. Opening directly in the YouTube app prevents green lines and jagged patterns.'
                            : 'To prevent video corruption (green lines, jagged patterns), please open this video directly in the YouTube app for the best viewing experience.'
                          }
                        </p>
                        
                        <div className="mb-6 p-4 bg-red-800 bg-opacity-50 rounded-lg border border-red-400">
                          <p className="text-sm font-semibold text-red-200">
                            {isYouTubeShort(videoModalSrc) ? '🎬 Shorts Corruption Prevention' : '🛡️ Corruption Prevention Active'}
                          </p>
                          <p className="text-xs text-red-300 mt-1">
                            {isYouTubeShort(videoModalSrc) 
                              ? 'YouTube Shorts embedded players show diagonal green lines and corruption'
                              : 'This prevents diagonal green lines and jagged video patterns'
                            }
                          </p>
                        </div>
                        <div className="space-y-4">
                          <button
                            onClick={() => {
                              // Try to open in YouTube app first, fallback to browser
                              const videoId = getYouTubeVideoId(videoModalSrc);
                              const youtubeAppUrl = `vnd.youtube:${videoId}`;
                              const youtubeWebUrl = videoModalSrc;
                              
                              // Try YouTube app first
                              window.location.href = youtubeAppUrl;
                              
                              // Fallback to web after a short delay
                              setTimeout(() => {
                                window.open(youtubeWebUrl, '_blank', 'noopener,noreferrer');
                              }, 1000);
                            }}
                            className="w-full bg-white text-red-600 hover:bg-gray-100 px-6 py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-3 shadow-lg"
                          >
                            <span className="text-2xl">▶️</span>
                            Open in YouTube App
                          </button>
                          
                          <button
                            onClick={() => window.open(videoModalSrc, '_blank', 'noopener,noreferrer')}
                            className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <span>🌐</span>
                            Open in Browser
                          </button>
                          
                          {/* Debug button - only show in development */}
                          {window.location.hostname === 'localhost' || window.location.hostname.includes('dev') ? (
                            <button
                              onClick={() => {
                                // Force show iframe for testing
                                const container = document.querySelector('.mobile-iframe-container');
                                if (container) {
                                  container.innerHTML = `
                                    <div class="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center text-white">
                                      <div class="text-center">
                                        <div class="text-4xl mb-4">⚠️</div>
                                        <p class="text-lg font-semibold mb-2">Testing Embedded Player</p>
                                        <p class="text-sm opacity-75 mb-4">This may show corruption on mobile</p>
                                        <iframe
                                          src="${getYouTubeEmbedUrl(videoModalSrc)}"
                                          className="w-full h-96 rounded-lg"
                                          frameBorder="0"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                          allowFullScreen
                                          title="YouTube video"
                                          loading="eager"
                                        ></iframe>
                                      </div>
                                    </div>
                                  `;
                                  container.classList.remove('hidden');
                                }
                              }}
                              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                            >
                              🧪 Test Embedded Player (Debug)
                            </button>
                          ) : null}
                        </div>
                        
                        <div className="mt-6 text-xs opacity-75">
                          <p>This prevents video corruption issues on mobile devices</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="video-container">
                      <iframe
                        src={getYouTubeEmbedUrl(videoModalSrc)}
                        className="w-full h-96 rounded-lg"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        title="YouTube video"
                        loading="eager"
                      onLoad={(e) => {
                        console.log('YouTube iframe loaded successfully');
                        setIsLoading(false);
                        // Clear timeout if iframe loads successfully
                        if (iframeTimeout) {
                          clearTimeout(iframeTimeout);
                          setIframeTimeout(null);
                        }
                      }}
                  onError={(e) => {
                    console.log('YouTube iframe failed to load, showing fallback options');
                    // Clear timeout
                    if (iframeTimeout) {
                      clearTimeout(iframeTimeout);
                      setIframeTimeout(null);
                    }
                    // Hide iframe and show error message with fallback options
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center text-white">
                        <div class="text-center">
                          <div class="text-4xl mb-4">🎥</div>
                          <p class="text-lg font-semibold mb-2">Video Playback Error</p>
                          <p class="text-sm opacity-75 mb-4">Unable to load video. This may be due to codec issues or connection problems.</p>
                          <div class="flex gap-3 justify-center">
                            <button onclick="window.open('${videoModalSrc}', '_blank', 'noopener,noreferrer')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                              Open in YouTube
                            </button>
                            <button onclick="window.location.reload()" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                              Retry
                            </button>
                          </div>
                        </div>
                      </div>
                    `;
                  }}
                      />
                    </div>
                  )}
                  
                  {/* Hidden container for mobile iframe fallback */}
                  <div className="mobile-iframe-container hidden"></div>
                </div>
              ) : isVimeo ? (
                <iframe
                  src={getVimeoEmbedUrl(videoModalSrc)}
                  className="w-full h-96 rounded-lg"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Vimeo video"
                />
              ) : (
                <>
                  <video
                    src={videoModalSrc}
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="max-w-full max-h-full object-contain rounded-lg"
                    onClick={handleVideoClick}
                    onLoadedData={(e) => {
                      // Try to play when video is loaded
                      e.target.play().catch(err => console.log('Initial autoplay failed:', err));
                    }}
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    onEnded={() => setIsVideoPlaying(false)}
                    style={{
                      WebkitPlaysInline: true,
                      playsInline: true,
                      'webkit-playsinline': true,
                      imageRendering: 'crisp-edges'
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                  {!isVideoPlaying && (
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center cursor-pointer"
                      onClick={handleVideoClick}
                    >
                      <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all transform hover:scale-110">
                        <span className="text-4xl ml-1">▶️</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
          <img
            src={imageModalSrc}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          )}
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
      {categories.length > 0 && (
      <div className="bg-white border-b">
        <div className="px-4 py-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide category-scroll">
            {categories.map(category => {
              const categoryName = translateCategory(category.name, language);
              const categoryNameLower = categoryName.toLowerCase();
              
              return (
              <button
                  key={category.id}
                  onClick={() => setActiveCategory(categoryNameLower)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeCategory === categoryNameLower
                      ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                  <span className="mr-2">{category.icon}</span>
                  {categoryName}
              </button>
              );
            })}
          </div>
        </div>
      </div>
      )}

      {/* Menu Items */}
      <main className="p-4 space-y-4 pb-20">
        {!categories.length || !activeCategory ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
            <p className="text-gray-500">Loading menu...</p>
          </div>
        ) : getCurrentCategoryItems().length === 0 ? (
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
                {/* Item Image/Video */}
                {getMediaType(item) === 'video' ? (
                  <div className="relative w-20 h-20 rounded-lg flex-shrink-0 bg-gray-200 flex items-center justify-center cursor-pointer"
                       onClick={(e) => {
                         e.stopPropagation();
                         openMediaModal(getPrimaryMediaUrl(item));
                       }}>
                    {(getPrimaryMediaUrl(item).includes('youtube.com') || getPrimaryMediaUrl(item).includes('youtu.be')) ? (
                      <img
                        src={`https://img.youtube.com/vi/${getYouTubeVideoId(getPrimaryMediaUrl(item))}/maxresdefault.jpg`}
                alt={getText(item.name, language)}
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                        onError={(e) => {
                          console.log('YouTube thumbnail failed to load, trying fallback');
                          // Try medium quality as fallback
                          e.target.src = `https://img.youtube.com/vi/${getYouTubeVideoId(getPrimaryMediaUrl(item))}/hqdefault.jpg`;
                          e.target.onerror = () => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center"><span class="text-2xl">🎥</span></div>';
                          };
                        }}
                        onLoad={() => console.log('YouTube thumbnail loaded successfully')}
                      />
                    ) : getPrimaryMediaUrl(item).includes('vimeo.com') ? (
                      <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🎥</span>
                      </div>
                    ) : (
                      <video
                        src={getPrimaryMediaUrl(item)}
                        className="w-full h-full object-cover rounded-lg"
                        muted
                        loop
                      />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                        <span className="text-lg">▶️</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={getPrimaryMediaUrl(item)}
                    alt={getText(item.name, language)}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                      openMediaModal(getPrimaryMediaUrl(item));
                }}
              />
                )}
              
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
              {getMediaType(selectedItem) === 'video' ? (
                <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center cursor-pointer"
                     onClick={() => {
                       openMediaModal(getPrimaryMediaUrl(selectedItem));
                     }}>
                  {(getPrimaryMediaUrl(selectedItem).includes('youtube.com') || getPrimaryMediaUrl(selectedItem).includes('youtu.be')) ? (
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeVideoId(getPrimaryMediaUrl(selectedItem))}/maxresdefault.jpg`}
                      alt={getText(selectedItem.name, language)}
                      className="w-full h-full object-cover rounded-t-2xl"
                      loading="eager"
                      onError={(e) => {
                        console.log('YouTube thumbnail failed to load in selected item modal, trying fallback');
                        // Try high quality as fallback
                        e.target.src = `https://img.youtube.com/vi/${getYouTubeVideoId(getPrimaryMediaUrl(selectedItem))}/hqdefault.jpg`;
                        e.target.onerror = () => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gray-300 rounded-t-2xl flex items-center justify-center"><span class="text-6xl">🎥</span></div>';
                        };
                      }}
                      onLoad={() => console.log('YouTube thumbnail loaded successfully in selected item modal')}
                    />
                  ) : getPrimaryMediaUrl(selectedItem).includes('vimeo.com') ? (
                    <div className="w-full h-full bg-gray-300 rounded-t-2xl flex items-center justify-center">
                      <span className="text-6xl">🎥</span>
                    </div>
                  ) : (
                    <video
                      src={getPrimaryMediaUrl(selectedItem)}
                      className="w-full h-full object-cover rounded-t-2xl"
                      muted
                      loop
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-t-2xl flex items-center justify-center">
                    <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                      <span className="text-3xl">▶️</span>
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={getPrimaryMediaUrl(selectedItem)}
                alt={getText(selectedItem.name, language)}
                className="w-full h-48 object-cover rounded-t-2xl cursor-pointer"
                onClick={() => {
                    openMediaModal(getPrimaryMediaUrl(selectedItem));
                }}
              />
              )}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col">
            {/* Fixed Header */}
            <div className="p-6 border-b flex-shrink-0">
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
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto cart-scroll">
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
                            {getMediaType(item) === 'video' ? (
                              <div className="relative w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                                {(getPrimaryMediaUrl(item).includes('youtube.com') || getPrimaryMediaUrl(item).includes('youtu.be')) ? (
                                  <img
                                    src={`https://img.youtube.com/vi/${getYouTubeVideoId(getPrimaryMediaUrl(item))}/hqdefault.jpg`}
                                    alt={getText(item.name, language)}
                                    className="w-full h-full object-cover rounded-lg"
                                    loading="lazy"
                                    onError={(e) => {
                                      console.log('YouTube thumbnail failed to load in cart, trying fallback');
                                      // Try medium quality as fallback
                                      e.target.src = `https://img.youtube.com/vi/${getYouTubeVideoId(getPrimaryMediaUrl(item))}/mqdefault.jpg`;
                                      e.target.onerror = () => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center"><span class="text-sm">🎥</span></div>';
                                      };
                                    }}
                                    onLoad={() => console.log('YouTube thumbnail loaded successfully in cart')}
                                  />
                                ) : getPrimaryMediaUrl(item).includes('vimeo.com') ? (
                                  <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                                    <span className="text-sm">🎥</span>
                                  </div>
                                ) : (
                                  <video
                                    src={getPrimaryMediaUrl(item)}
                                    className="w-full h-full object-cover rounded-lg"
                                    muted
                                    loop
                                  />
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                                  <span className="text-xs">▶️</span>
                                </div>
                              </div>
                            ) : (
                              <img
                                src={getPrimaryMediaUrl(item)}
                                alt={getText(item.name, language)}
                                className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
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
                    </div>
                  </>
                )}
              </div>
            </div>
                    
            {/* Fixed Footer with Complete Button */}
            {cart.length > 0 && (
              <div className="border-t bg-white p-6 flex-shrink-0">
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
            )}
          </div>
        </div>
      )}

      {/* Customer Form Modal */}
      {showCustomerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" style={{zIndex: 9999}}>
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Complete Your Order</h2>
                <button
                  onClick={() => setShowCustomerForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-4">Order Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{getText(item.name, language)} × {item.qty}</span>
                      <span>€{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total:</span>
                    <span>€{getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your email address"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send your order confirmation to this email
                  </p>
                </div>

                {/* Marketing Consent Option */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customerInfo.marketingConsent}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, marketingConsent: e.target.checked }))}
                      className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <div className="text-sm">
                      <span className="text-gray-700 font-medium">Marketing Communications</span>
                      <p className="text-gray-500 text-xs mt-1">
                        I would like to receive special offers, promotions, and marketing materials from AROMA Restaurant. 
                        <span className="text-orange-600 font-medium"> Uncheck if you don't want marketing emails.</span>
                      </p>
                    </div>
                  </label>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    You can unsubscribe from these communications at any time. Your privacy is important to us.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowCustomerForm(false)}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Back to Cart
                </button>
                <button
                  onClick={confirmOrder}
                  disabled={loading || !customerInfo.name.trim() || !customerInfo.email.trim()}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Complete Order & Send Confirmation"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      <MediaModal />

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
