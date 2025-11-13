import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }) => {
    const { data } = await axios.get(`/api/products/${productId}`);
    return { ...data, quantity };
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], total: 0 },
  reducers: {
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === id);
      if (item) item.quantity = quantity;
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToCart.fulfilled, (state, action) => {
      const itemIndex = state.items.findIndex(
        (item) => item._id === action.payload._id
      );
      if (itemIndex >= 0) {
        state.items[itemIndex].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    });
  },
});

export const { removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
