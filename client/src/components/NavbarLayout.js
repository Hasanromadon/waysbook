import React, { useEffect, useState } from 'react';
import {
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Image,
  Button,
} from 'react-bootstrap';
import ButtonWaysBook from '../components/ButtonWaysBook';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';
import { useIndexedDB } from 'react-indexed-db';

const NavbarLayout = ({ setModalShow, setModalRegisterShow }) => {
  const [cart, setCart] = useState();
  const { getAll } = useIndexedDB('cartbook');

  useEffect(() => {
    getAll().then((cart) => {
      setCart(cart);
    });
  }, [getAll, cart]);

  const { user, isLoggedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const userMenu = (
    <Image
      className="object-fit-cover"
      width={60}
      height={60}
      roundedCircle
      src={user?.profile?.image}
      alt=""
    />
  );

  return (
    <Navbar collapseOnSelect expand="lg">
      <Container>
        <Link to="/" className="navbar-brand">
          <img height="auto" src="/assets/icons/logo.svg" alt="" />
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto" id="navbarScrollingDropdown">
            {isLoggedIn ? (
              <>
                <Button
                  onClick={() => navigate('/cart')}
                  variant="transparent position-relative"
                >
                  <img src="/assets/icons/cart-black.svg" alt="" />
                  <span className="position-absolute rounded p-1 px-2 bg-danger border border-light rounded-circle cart-icon-qty">
                    {cart?.length}
                  </span>
                </Button>

                <NavDropdown align="end" title={userMenu}>
                  {user.role === 'admin' ? (
                    <>
                      <NavDropdown.Item as={Link} to="/profile">
                        <img
                          width={20}
                          src="/assets/icons/user.svg"
                          alt="user"
                        />{' '}
                        Profile
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/complain">
                        <img
                          width={20}
                          src="/assets/icons/complain.svg"
                          alt="user"
                        />{' '}
                        Complain
                      </NavDropdown.Item>

                      <NavDropdown.Item as={Link} to="/admin/addbook">
                        <img
                          width={20}
                          src="/assets/icons/manage.svg"
                          alt="user"
                        />{' '}
                        ManageBook
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/transaction">
                        <img
                          width={20}
                          src="/assets/icons/report.svg"
                          alt="user"
                        />{' '}
                        Transaction
                      </NavDropdown.Item>
                    </>
                  ) : (
                    <>
                      <NavDropdown.Item as={Link} to="/profile">
                        <img
                          width={20}
                          src="/assets/icons/user.svg"
                          alt="user"
                        />{' '}
                        Profile
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/complain">
                        <img
                          width={20}
                          src="/assets/icons/complain.svg"
                          alt="user"
                        />{' '}
                        Complain
                      </NavDropdown.Item>
                    </>
                  )}

                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Button} onClick={() => handleLogout()}>
                    <img width={20} src="/assets/icons/logout.svg" alt="user" />{' '}
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <ButtonWaysBook
                  onClick={() => setModalShow(true)}
                  outlined
                  className="me-1"
                >
                  Login
                </ButtonWaysBook>
                <ButtonWaysBook
                  onClick={() => setModalRegisterShow(true)}
                  outlined
                  className="me-1"
                >
                  Register
                </ButtonWaysBook>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarLayout;
