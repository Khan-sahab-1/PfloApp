// userSlice.js
//bug id 2855 Jamshed start
// Description: Implemented a Redux slice for managing user information using Redux Toolkit. This slice handles fetching user data asynchronously, including loading and error states. The slice provides a structured way to manage user information across the application, allowing for easy integration with components that require user data.

import API, { BASE_URL } from "../../utils/apiurls";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import urls from "../../../url";
const initialState = {
  userDatainfo: null,
  loading: false,
  error: null,
};


// src/api/homeApi.js
// src/api/homeApi.js

const fetchHomePageData = async (baseURL) => {
  // console.log(`${baseURL}${urls.getHomepageData}`,'mil raha h url');

  const response = await fetch(`${baseURL}${urls.getHomepageData}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      params: {},
    }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

// src/redux/features/user/userThunk.js



export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (baseURL, thunkAPI) => {
    try {
      const response = await fetchHomePageData(baseURL);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserData: (state) => {
      state.userDatainfo = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userDatainfo = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserData } = userSlice.actions;
export default userSlice.reducer;
//bug id 2855 Jamshed end

