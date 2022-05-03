import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { API, setAuthToken } from '../config/api';
// untuk membuat  reducer, dan action otomatis
//createEntityAdapter bisa untuk normalisasi data seperti dr list, handle object in array

const getToken = () => {
  const token = localStorage.getItem('token');
  setAuthToken(token);
};

export const userLogin = createAsyncThunk(
  'user/login',
  async ({ email, password }) => {
    const response = await API.post('/auth/login', {
      email,
      password,
    });
    return response.data.data;
  }
);
export const userRegister = createAsyncThunk(
  'user/register',
  async ({ fullname, email, password }) => {
    const response = await API.post('/auth/register', {
      fullname,
      email,
      password,
    });
    return response.data.data;
  }
);

export const userProfile = createAsyncThunk('user/profile', async () => {
  const response = await API.get('/users/profile');
  return response.data.data;
});
export const updateProfile = createAsyncThunk(
  'user/profile/update',
  async (values) => {
    const response = await API.patch('/users/profile', {
      ...values,
    });
    console.log(response.data.data);
    return response.data.data;
  }
);

export const updateImage = createAsyncThunk(
  'user/profile/image',
  async (values) => {
    const formData = new FormData();
    formData.append('image', values);

    const config = {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    };

    await API.patch('/users/image', formData, config);
    // update state
    const response = await API.get('/users/profile');
    return response.data.data;
  }
);

// export const getBooks = createAsyncThunk('books/getBooks', async () => {
//   const response = await API.get('/books');
//   return response.data.data;
// });

const initialState = {
  loading: false,
  isLoggedIn: false,
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  extraReducers: {
    [userLogin.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      localStorage.setItem('token', state.user.token);
      setAuthToken(state.user.token);
    },

    [userRegister.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem('token');
    },

    [userProfile.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    [updateProfile.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    [updateProfile.pending]: (state, action) => {
      state.loading = true;
    },

    [updateImage.pending]: (state, action) => {
      state.loading = true;
    },
    [updateImage.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
  },
  reducers: {
    logout: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem('token');
    },
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
