import axios from "axios";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalActions/globalActions";
import baseURL from "../../../utils/baseURL";
const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

const initialState = {
  sizes: [],
  size: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDeleted: false,
};

export const createSizeAction = createAsyncThunk(
  "size/create",
  async (name, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(`${baseURL}/size`, { name }, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const fetchSizeAction = createAsyncThunk(
  "size/fetch-all",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${baseURL}/size`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const updateSizeAction = createAsyncThunk(
  "size/update",
  async ({ id, name }, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${baseURL}/size/${id}`,
        { name },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const deleteSizeAction = createAsyncThunk(
  "size/delete",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.delete(`${baseURL}/size/${id}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

const sizeSlice = createSlice({
  name: "size",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(createSizeAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createSizeAction.fulfilled, (state, action) => {
      state.loading = false;
      state.size = action.payload;
      state.isAdded = true;
    });
    builder.addCase(createSizeAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(fetchSizeAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSizeAction.fulfilled, (state, action) => {
      state.loading = false;
      state.sizes = action.payload.sizes;
    });
    builder.addCase(fetchSizeAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(updateSizeAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateSizeAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isUpdated = true;
      state.size = action.payload;
    });
    builder.addCase(updateSizeAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(deleteSizeAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteSizeAction.fulfilled, (state) => {
      state.loading = false;
      state.isDeleted = true;
    });
    builder.addCase(deleteSizeAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(resetErrAction.pending, (state) => {
      state.error = null;
    });

    builder.addCase(resetSuccessAction.pending, (state) => {
      state.isAdded = false;
      state.isUpdated = false;
      state.isDeleted = false;
      state.error = null;
    });
  },
});

const sizeReducer = sizeSlice.reducer;

export default sizeReducer;
