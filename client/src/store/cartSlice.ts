// client/src/store/cartSlice.ts (НОВЫЙ ФАЙЛ)
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Product } from '../types';

// Описываем, как выглядит один элемент в корзине
export interface CartItem extends Product {
  cartQuantity: number;
}

// Описываем состояние корзины
interface CartState {
  cartItems: CartItem[];
}

const initialState: CartState = {
  cartItems: localStorage.getItem('cartItems') 
    ? JSON.parse(localStorage.getItem('cartItems')!) 
    : [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const itemIndex = state.cartItems.findIndex(item => item._id === action.payload._id);
      if (itemIndex >= 0) {
        state.cartItems[itemIndex].cartQuantity += 1;
      } else {
        const tempProduct = { ...action.payload, cartQuantity: 1 };
        state.cartItems.push(tempProduct);
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action: PayloadAction<Product>) => {
      state.cartItems = state.cartItems.filter(
        item => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    decreaseCart: (state, action: PayloadAction<Product>) => {
      const itemIndex = state.cartItems.findIndex(item => item._id === action.payload._id);
      if (state.cartItems[itemIndex].cartQuantity > 1) {
        state.cartItems[itemIndex].cartQuantity -= 1;
      } else {
        state.cartItems = state.cartItems.filter(
          item => item._id !== action.payload._id
        );
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    }
  },
});

export const { addToCart, removeFromCart, decreaseCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;