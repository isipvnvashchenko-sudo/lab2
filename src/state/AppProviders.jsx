import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';

const CartContext = createContext(null);
const ThemeContext = createContext(null);
const AuthContext = createContext(null);

const CART_STORAGE_KEY = 'app.cart';
const THEME_STORAGE_KEY = 'app.theme';
const USER_STORAGE_KEY = 'app.user';
const memoryStorage = {};

function isLocalStorageAvailable() {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const storageAvailable = typeof window !== 'undefined' && isLocalStorageAvailable();

const safeStorage = {
  getItem(key) {
    try {
      if (storageAvailable) return window.localStorage.getItem(key);
      return Object.prototype.hasOwnProperty.call(memoryStorage, key) ? memoryStorage[key] : null;
    } catch {
      return null;
    }
  },
  setItem(key, value) {
    try {
      if (storageAvailable) {
        window.localStorage.setItem(key, value);
      } else {
        memoryStorage[key] = value;
      }
    } catch {
      memoryStorage[key] = value;
    }
  },
  removeItem(key) {
    try {
      if (storageAvailable) {
        window.localStorage.removeItem(key);
      } else {
        delete memoryStorage[key];
      }
    } catch {
      delete memoryStorage[key];
    }
  }
};

function safeParse(raw, fallback) {
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.find((item) => item.id === action.product.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...state, { ...action.product, quantity: 1 }];
    }
    case 'remove':
      return state.filter((item) => item.id !== action.id);
    case 'decrease':
      return state
        .map((item) => item.id === action.id ? { ...item, quantity: item.quantity - 1 } : item)
        .filter((item) => item.quantity > 0);
    case 'clear':
      return [];
    default:
      return state;
  }
}

function getInitialCart() {
  const raw = safeStorage.getItem(CART_STORAGE_KEY);
  const parsed = safeParse(raw, []);
  return Array.isArray(parsed) ? parsed : [];
}

function getInitialTheme() {
  const saved = safeStorage.getItem(THEME_STORAGE_KEY);
  return saved === 'dark' || saved === 'light' ? saved : 'light';
}

function getInitialUser() {
  const raw = safeStorage.getItem(USER_STORAGE_KEY);
  return safeParse(raw, null);
}

export function AppProviders({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, undefined, getInitialCart);
  const [theme, setTheme] = useState(getInitialTheme);
  const [user, setUser] = useState(getInitialUser);

  useEffect(() => {
    safeStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    safeStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      safeStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      safeStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const cartValue = useMemo(() => ({
    cart,
    addToCart: (product) => dispatch({ type: 'add', product }),
    removeFromCart: (id) => dispatch({ type: 'remove', id }),
    decreaseQuantity: (id) => dispatch({ type: 'decrease', id }),
    clearCart: () => dispatch({ type: 'clear' }),
    totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }), [cart]);

  const authValue = useMemo(() => ({
    user,
    login: (userData) => setUser(userData),
    logout: () => setUser(null)
  }), [user]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme((t) => t === 'light' ? 'dark' : 'light') }}>
      <CartContext.Provider value={cartValue}>
        <AuthContext.Provider value={authValue}>
          {children}
        </AuthContext.Provider>
      </CartContext.Provider>
    </ThemeContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
export const useTheme = () => useContext(ThemeContext);
export const useAuth = () => useContext(AuthContext);
