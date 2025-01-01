import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  brands: [],
  brand: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDeleted: false,
};

export const createBrandAction = createAsyncThunk(
  "brand/create",
  async (name, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const { data } = await axios.post(`${baseURL}/brands`, { name }, config);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const fetchBrandsAction = createAsyncThunk(
  "brands/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${baseURL}/brands`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const deleteBrandsAction = createAsyncThunk(
  "brands/delete",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`${baseURL}/brands/${id}`, config);

      return id;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

const brandsSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    resetBrandState(state) {
      state.isAdded = false;
      state.isUpdated = false;
      state.isDeleted = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createBrandAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createBrandAction.fulfilled, (state, action) => {
      state.loading = false;
      state.brand = action.payload;
      state.isAdded = true;
    });
    builder.addCase(createBrandAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(fetchBrandsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBrandsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.brands = action.payload;
    });
    builder.addCase(fetchBrandsAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(deleteBrandsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteBrandsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isDeleted = true;
      state.brands = state.brands.filter(
        (brand) => brand._id !== action.payload
      );
    });
    builder.addCase(deleteBrandsAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { resetBrandState } = brandsSlice.actions;
export default brandsSlice.reducer;
