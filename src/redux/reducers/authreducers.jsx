// authSlice.js
//bug id 2855 Jamshed start
// Description: Implemented a Redux slice for authentication using Redux Toolkit. This slice manages the authentication state, including login and logout actions, as well as handling asynchronous login operations with proper error handling. The slice provides a structured way to manage user authentication state across the application, allowing for easy integration with components that require authentication status and user information.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import urls from '../../../url';


const initialState = {
  isLoggedIn: false,
  isLoading: false,
  user: null,
  error: null,
};

// 🧠 Redux thunk to authenticate user
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ username, password, login_url }, thunkAPI) => {
    try {
      const loginEndpoint = login_url + urls.login;

      if (username && username.toLowerCase() === username) {
        username = username.toUpperCase();
      }

      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            username,
            password,
          },
        }),
      });

      const data = await response.json();
      if (data.result && data.result.message === 'Login successful') {
        return data.result; // return user info or session
      } else {
        return thunkAPI.rejectWithValue(data?.error || 'Invalid login');
      }
    } catch (err) {
      console.error('Login failed:', err);
      return thunkAPI.rejectWithValue(err.message || 'Unexpected error');
    }
  }
);

// 🧠 Redux slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
//bug id 2855 Jamshed end
