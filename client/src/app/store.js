import { configureStore } from '@reduxjs/toolkit';
import bookReducer from '../features/bookSlice';
import userReducer from '../features/userSlice';
import transactionReducer from '../features/transactionSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    book: bookReducer,
    transaction: transactionReducer,
  },
});
