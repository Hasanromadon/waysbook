import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import DetailBook from './pages/DetailBook';
import Cart from './pages/Cart';
import Complain from './pages/Complain';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthToken } from './config/api';
import { userProfile } from './features/userSlice';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import AddBook from './pages/admin/AddBook';
import { DBConfig } from './config/DBConfig';
import { initDB } from 'react-indexed-db';
import Transaction from './pages/admin/Transaction';
import ComplainAdmin from './pages/admin/ComplainAdmin';
import { Toaster } from 'react-hot-toast';
import { getTransactions } from './features/transactionSlice';
import EditBook from './pages/admin/EditBook';
initDB(DBConfig);

const App = () => {
  const [token] = useState(localStorage.getItem('token'));
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // load if loggin
  useEffect(() => {
    if (token && token !== undefined) {
      setAuthToken(token);
      dispatch(userProfile());
    }
  }, []);

  useEffect(() => {
    if (user.isLoggedIn) {
      dispatch(userProfile());
      dispatch(getTransactions());
    }
  }, [user.isLoggedIn, dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books/:id" element={<DetailBook />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/complain" element={<Complain />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/admin/addbook" element={<AddBook />} />
        <Route path="/admin/edit/book/:id" element={<EditBook />} />
        <Route path="/admin/transaction" element={<Transaction />} />
        <Route path="/admin/complain" element={<ComplainAdmin />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
