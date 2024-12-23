import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";

// Initial state
const initialState = {
  loading: false,
  error: null,
  success: false,
  wishlist: [],
};

// Create a wishlist item
export const createWishlistAction = createAsyncThunk(
  "wishlist/create",
  async ({ userId, productId, note }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${baseURL}/users/verify-otp`, {
        user: userId,
        product: productId,
        note,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Error creating wishlist"
      );
    }
  }
);

// Fetch wishlist items
export const getWishlistAction = createAsyncThunk(
  "wishlist/get",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${baseURL}/wishlist/${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Error fetching wishlist items"
      );
    }
  }
);

// Update a wishlist item
export const updateWishlistAction = createAsyncThunk(
  "wishlist/update",
  async ({ wishlistId, note }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${baseURL}/wishlist/${wishlistId}`, {
        note,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Error updating wishlist item"
      );
    }
  }
);

// Delete a wishlist item
export const deleteWishlistAction = createAsyncThunk(
  "wishlist/delete",
  async (wishlistId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${baseURL}/wishlist/${wishlistId}/delete`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Error deleting wishlist item"
      );
    }
  }
);

// Wishlist slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  extraReducers: (builder) => {
    // Create wishlist
    builder.addCase(createWishlistAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createWishlistAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.wishlist.push(action.payload);
    });
    builder.addCase(createWishlistAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get wishlist
    builder.addCase(getWishlistAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getWishlistAction.fulfilled, (state, action) => {
      state.loading = false;
      state.wishlist = action.payload;
    });
    builder.addCase(getWishlistAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update wishlist
    builder.addCase(updateWishlistAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateWishlistAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      const index = state.wishlist.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1) {
        state.wishlist[index] = action.payload;
      }
    });
    builder.addCase(updateWishlistAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete wishlist
    builder.addCase(deleteWishlistAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteWishlistAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.wishlist = state.wishlist.filter(
        (item) => item._id !== action.payload._id
      );
    });
    builder.addCase(deleteWishlistAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// Generate reducer
const wishlistReducer = wishlistSlice.reducer;

export default wishlistReducer;
