import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import FooterLayout from '../components/home/FooterLayout';
import NavbarLayout from '../components/NavbarLayout';

const LayoutAdmin = ({ children }) => {
  //   const [state, dispatch] = useContext(UserContext);
  const [modalShow, setModalShow] = useState(false);
  const [modalRegisterShow, setModalRegisterShow] = useState(false);
  const { user, isLoggedIn } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <>
      <NavbarLayout
        setModalShow={setModalShow}
        setModalRegisterShow={setModalRegisterShow}
      />
      {children}
      <FooterLayout />
      <Login show={modalShow} onHide={() => setModalShow(false)} />
      <Register
        show={modalRegisterShow}
        onHide={() => setModalRegisterShow(false)}
      />
    </>
  );
};

export default LayoutAdmin;
