import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Hero from '../components/home/Hero';
import ListBook from '../components/home/ListBook';
import QuoteSection from '../components/home/QuoteSection';
import SelectedBook from '../components/home/SelectedBook';
import { getBooks } from '../features/bookSlice';
import Layout from '../hoc/Layout';

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBooks());
  }, [dispatch]);
  return (
    <Layout>
      <Hero />
      <ListBook />
      <QuoteSection />
      <SelectedBook />
      {/* modal */}
    </Layout>
  );
};

export default Home;
