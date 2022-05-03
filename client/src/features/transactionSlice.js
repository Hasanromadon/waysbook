import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { API } from '../config/api';
// untuk membuat  reducer, dan action otomatis
//createEntityAdapter bisa untuk normalisasi data seperti dr list, handle object in array

export const getTransactions = createAsyncThunk(
  'transaction/getTransaction',
  async () => {
    const response = await API.get('/transactions');
    return response.data.data;
  }
);

const transactionEntity = createEntityAdapter({
  selectId: (transaction) => transaction.id,
});

const transactionSlice = createSlice({
  name: 'transaction',
  initialState: transactionEntity.getInitialState(),
  extraReducers: {
    [getTransactions.fulfilled]: (state, action) => {
      transactionEntity.setAll(state, action.payload); //masukan data kedalam state
    },
  },
});

export const transactionSelectors = transactionEntity.getSelectors(
  (state) => state.transaction
);

export const { update } = transactionSlice.actions;
export default transactionSlice.reducer;
