import React, { useState } from 'react';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import FooterLayout from '../components/home/FooterLayout';
import NavbarLayout from '../components/NavbarLayout';

const Layout = ({ children }) => {
  //   const [state, dispatch] = useContext(UserContext);
  const [modalShow, setModalShow] = useState(false);
  const [modalRegisterShow, setModalRegisterShow] = useState(false);
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

export default Layout;
