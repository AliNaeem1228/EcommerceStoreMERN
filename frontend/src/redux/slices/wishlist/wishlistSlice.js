import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";

const initialState = {
  wishlist: [],
  loading: false,
  error: null,
  success: false,
  pagination: null,
};

export const createWishlistAction = createAsyncThunk(
  "wishlist/create",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${baseURL}/wishlist`, {
        user: userId,
        product: productId,
      });
      return data.wishlist;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Error creating wishlist item"
      );
    }
  }
);

export const getWishlistAction = createAsyncThunk(
  "wishlist/get",
  async ({ userId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${baseURL}/wishlist/${userId}?page=${page}&limit=${limit}`
      );
      return {
        wishlist: data.wishlist,
        pagination: data.pagination,
        totalResults: data.totalResults,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Error fetching wishlist items"
      );
    }
  }
);

export const deleteWishlistAction = createAsyncThunk(
  "wishlist/delete",
  async (wishlistId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${baseURL}/wishlist/${wishlistId}/delete`
      );
      return data.wishlist;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Error deleting wishlist item"
      );
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  extraReducers: (builder) => {
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

    builder.addCase(getWishlistAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getWishlistAction.fulfilled, (state, action) => {
      state.loading = false;
      state.wishlist = action.payload.wishlist;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(getWishlistAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

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

const wishlistReducer = wishlistSlice.reducer;

export default wishlistReducer;
