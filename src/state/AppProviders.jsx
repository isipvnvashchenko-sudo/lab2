import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';

const CartContext = createContext(null);
const ThemeContext = createContext(null);
const AuthContext = createContext(null);

const CART_STORAGE_KEY = 'app.cart';
const THEME_STORAGE_KEY = 'app.theme';

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
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  } catch {
    return 'light';
  }
}

export function AppProviders({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, undefined, getInitialCart);
  const [theme, setTheme] = useState(getInitialTheme);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
    }
  }, [theme]);

  const cartValue = useMemo(() => ({
    cart,
    addToCart: (product) => dispatch({ type: 'add', product }),
    removeFromCart: (id) => dispatch({ type: 'remove', id }),
    decreaseQuantity: (id) => dispatch({ type: 'decrease', id }),
    clearCart: () => dispatch({ type: 'clear' }),
    totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }), [cart]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme((t) => t === 'light' ? 'dark' : 'light') }}>
      <CartContext.Provider value={cartValue}>
        <AuthContext.Provider value={{ user, login: (username) => setUser(username), logout: () => setUser(null) }}>
          {children}
        </AuthContext.Provider>
      </CartContext.Provider>
    </ThemeContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
export const useTheme = () => useContext(ThemeContext);
export const useAuth = () => useContext(AuthContext);
