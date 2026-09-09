//bug id 2822 Jamshed start
// Description: Set up a Redux store using Redux Toolkit to manage the application's state. The store includes reducers for authentication and user information, as well as integration with an API slice for handling asynchronous actions related to attendees. This setup provides a centralized and efficient way to manage state across the app, allowing for better organization and scalability as the application grows.
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authreducers';
import userReducer from './reducers/Userinforeducers';
import { attandiesSlice } from './servicess/apiSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    [attandiesSlice.reducerPath]: attandiesSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(attandiesSlice.middleware), 
});
//bug id 2822 Jamshed end