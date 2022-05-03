import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { API } from '../config/api';
// untuk membuat  reducer, dan action otomatis
//createEntityAdapter bisa untuk normalisasi data seperti dr list, handle object in array

export const saveBooks = createAsyncThunk(
  'books/saveBooks',
  async ({ title, price }) => {
    const response = await API.post('/books', {
      title,
      price,
    });
    return response.data;
  }
);
export const deleteBooks = createAsyncThunk('books/deleteBooks', async (id) => {
  await API.delete(`/books/${id}`);
  return id; //dispatch agar tertrigger
});
export const editBooks = createAsyncThunk(
  'books/editBooks',
  async ({ id, title, price }) => {
    const response = await API.patch(`/books/${id}`, {
      title,
      price,
    });
    return response.data.data; //dispatch agar tertrigger
  }
);

export const getBooks = createAsyncThunk('books/getBooks', async () => {
  const response = await API.get('/books');
  return response.data.data;
});

const bookEntity = createEntityAdapter({
  selectId: (book) => book.id,
});

const bookSlice = createSlice({
  name: 'book',
  initialState: bookEntity.getInitialState(),
  extraReducers: {
    [getBooks.fulfilled]: (state, action) => {
      bookEntity.setAll(state, action.payload); //masukan data kedalam state
    },
    [saveBooks.fulfilled]: (state, action) => {
      bookEntity.addOne(state, action.payload); //masukan data kedalam state
    },
    [deleteBooks.fulfilled]: (state, action) => {
      bookEntity.removeOne(state, action.payload); //masukan data kedalam state
    },
    [editBooks.fulfilled]: (state, action) => {
      bookEntity.updateOne(state, {
        id: action.payload.id,
        updates: action.payload,
      }); //masukan data kedalam state
    },
  },
});

export const bookSelectors = bookEntity.getSelectors((state) => state.book);

export const { update } = bookSlice.actions;
export default bookSlice.reducer;
