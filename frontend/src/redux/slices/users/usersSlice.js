import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import baseURL from "../../../utils/baseURL";
import { resetErrAction } from "../globalActions/globalActions";

//initialState
const initialState = {
  loading: false,
  error: null,
  success: false,
  isVerified: null,
  users: [],
  user: null,
  profile: {},
  userAuth: {
    loading: false,
    error: null,
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
  forgotPasswordStatus: "idle",
  forgotPasswordSuccessMessage: null,
  forgotPasswordError: null,
  resetPasswordStatus: "idle",
  resetPasswordSuccessMessage: null,
  resetPasswordError: null,
};

//register action
export const registerUserAction = createAsyncThunk(
  "users/register",
  async (
    { email, password, name },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      //make the http request
      const { data } = await axios.post(`${baseURL}/users/register`, {
        email,
        password,
        name,
      });
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

//update user shipping address action
export const updateUserShippingAddressAction = createAsyncThunk(
  "users/update-shipping-address",
  async (
    {
      firstName,
      lastName,
      address,
      city,
      postalCode,
      province,
      phone,
      country,
    },
    { rejectWithValue, getState, dispatch }
  ) => {
    console.log(
      firstName,
      lastName,
      address,
      city,
      postalCode,
      province,
      phone,
      country
    );
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${baseURL}/users/update/shipping`,
        {
          firstName,
          lastName,
          address,
          city,
          postalCode,
          province,
          phone,
          country,
        },
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

//user profile action
export const getUserProfileAction = createAsyncThunk(
  "users/profile-fetched",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      //get token
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`${baseURL}/users/profile`, config);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

//login action
export const loginUserAction = createAsyncThunk(
  "users/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${baseURL}/users/login`, {
        email,
        password,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

//Verify OTP
export const verifyOtpAction = createAsyncThunk(
  "users/verify-otp",
  async ({ _id, otp }, { rejectWithValue }) => {
    try {
      console.log("createAsyncThunk ==");
      const { data } = await axios.post(`${baseURL}/users/verify-otp`, {
        userId: _id,
        otp,
      });
      console.log("On verify otp data --", data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      window.location.reload();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify OTP"
      );
    }
  }
);

//logout action
export const logoutAction = createAsyncThunk(
  "users/logout",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    //get token
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cartItems");
    return true;
  }
);

//Send OTP
export const sendOtpAction = createAsyncThunk(
  "users/send-otp",
  async (_id, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${baseURL}/users/send-otp`, {
        user: _id,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

//Forgot Password
export const forgotPasswordAction = createAsyncThunk(
  "users/forgot-password",
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${baseURL}/users/forgot-password`, {
        email,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send forgot password link"
      );
    }
  }
);

//Reset Password
export const resetPasswordAction = createAsyncThunk(
  "users/reset-password",
  async ({ _id, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${baseURL}/users/reset-password`, {
        userId: _id,
        password,
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reset password"
      );
    }
  }
);

//users slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  extraReducers: (builder) => {
    //handle actions
    //login
    builder.addCase(loginUserAction.pending, (state, action) => {
      state.userAuth.loading = true;
    });
    builder.addCase(loginUserAction.fulfilled, (state, action) => {
      state.userAuth.userInfo = action.payload;
      state.userAuth.loading = false;
    });
    builder.addCase(loginUserAction.rejected, (state, action) => {
      state.userAuth.error = action.payload;
      state.userAuth.loading = false;
    });
    //register
    builder.addCase(registerUserAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(registerUserAction.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(registerUserAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    //logout
    builder.addCase(logoutAction.fulfilled, (state, action) => {
      state.userAuth.userInfo = null;
    });
    //profile
    builder.addCase(getUserProfileAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getUserProfileAction.fulfilled, (state, action) => {
      state.profile = action.payload;
      state.loading = false;
    });
    builder.addCase(getUserProfileAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    //shipping address
    builder.addCase(
      updateUserShippingAddressAction.pending,
      (state, action) => {
        state.loading = true;
      }
    );
    builder.addCase(
      updateUserShippingAddressAction.fulfilled,
      (state, action) => {
        state.user = action.payload;
        state.loading = false;
      }
    );
    builder.addCase(
      updateUserShippingAddressAction.rejected,
      (state, action) => {
        state.error = action.payload;
        state.loading = false;
      }
    );
    //reset error action
    builder.addCase(resetErrAction.pending, (state) => {
      state.error = null;
    });
    //send OTP
    builder.addCase(sendOtpAction.pending, (state, action) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(sendOtpAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(sendOtpAction.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });

    //verify OTP
    builder.addCase(verifyOtpAction.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyOtpAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isVerified = action.payload.isVerified;
      state.userAuth.userInfo = action.payload;
      state.success = true;
      state.error = null;
    });
    builder.addCase(verifyOtpAction.rejected, (state, action) => {
      state.loading = false;
      state.isVerified = null;
      state.success = false;
      state.error = action.payload;
    });
    builder
      .addCase(forgotPasswordAction.pending, (state) => {
        state.forgotPasswordStatus = "pending";
      })
      .addCase(forgotPasswordAction.fulfilled, (state, action) => {
        state.forgotPasswordStatus = "fullfilled";
        state.forgotPasswordSuccessMessage = action.payload;
      })
      .addCase(forgotPasswordAction.rejected, (state, action) => {
        state.forgotPasswordStatus = "rejected";
        state.forgotPasswordError = action.error;
      })

      .addCase(resetPasswordAction.pending, (state) => {
        state.resetPasswordStatus = "pending";
      })
      .addCase(resetPasswordAction.fulfilled, (state, action) => {
        state.resetPasswordStatus = "fullfilled";
        state.resetPasswordSuccessMessage = action.payload;
      })
      .addCase(resetPasswordAction.rejected, (state, action) => {
        state.resetPasswordStatus = "rejected";
        state.resetPasswordError = action.error;
      });
  },
});

//generate reducer
const usersReducer = usersSlice.reducer;

export default usersReducer;
