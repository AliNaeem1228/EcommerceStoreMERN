import axios from "axios";
import baseURL from "../../../utils/baseURL";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalActions/globalActions";
const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  stats: null,
};

export const placeOrderAction = createAsyncThunk(
  "order/place-order",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { orderItems, shippingAddress, totalPrice } = payload;
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${baseURL}/orders`,
        {
          orderItems,
          shippingAddress,
          totalPrice,
        },
        config
      );
      return window.open(data?.url);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const fetchOrdersAction = createAsyncThunk(
  "orders/list",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${baseURL}/orders`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const OrdersStatsAction = createAsyncThunk(
  "orders/statistics",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${baseURL}/orders/sales/stats`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const fetchOderAction = createAsyncThunk(
  "orders/details",
  async (productId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `${baseURL}/orders/${productId}`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const updateOrderAction = createAsyncThunk(
  "order/update-order",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { status, id } = payload;
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${baseURL}/orders/update/${id}`,
        {
          status,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const deleteOrderAction = createAsyncThunk(
  "order/delete",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.delete(`${baseURL}/orders/${id}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(placeOrderAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(placeOrderAction.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.isAdded = true;
    });
    builder.addCase(placeOrderAction.rejected, (state, action) => {
      state.loading = false;
      state.order = null;
      state.isAdded = false;
      state.error = action.payload;
    });
    builder.addCase(fetchOrdersAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOrdersAction.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    });
    builder.addCase(fetchOrdersAction.rejected, (state, action) => {
      state.loading = false;
      state.orders = null;
      state.error = action.payload;
    });
    builder.addCase(OrdersStatsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(OrdersStatsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.stats = action.payload;
    });
    builder.addCase(OrdersStatsAction.rejected, (state, action) => {
      state.loading = false;
      state.stats = null;
      state.error = action.payload;
    });
    builder.addCase(updateOrderAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateOrderAction.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
    });
    builder.addCase(updateOrderAction.rejected, (state, action) => {
      state.loading = false;
      state.order = null;
      state.error = action.payload;
    });
    builder.addCase(fetchOderAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOderAction.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
    });
    builder.addCase(fetchOderAction.rejected, (state, action) => {
      state.loading = false;
      state.order = null;
      state.error = action.payload;
    });
    builder.addCase(resetErrAction.pending, (state, action) => {
      state.error = null;
    });
    builder.addCase(resetSuccessAction.pending, (state, action) => {
      state.isAdded = false;
    });
    builder.addCase(deleteOrderAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteOrderAction.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = state.orders.filter(
        (order) => order._id !== action.meta.arg
      );
    });
    builder.addCase(deleteOrderAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

const ordersReducer = ordersSlice.reducer;

export default ordersReducer;
