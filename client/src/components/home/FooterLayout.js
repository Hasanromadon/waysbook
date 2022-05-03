import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FooterLayout = () => {
  return (
    <footer className="bg-light mt-5">
      <Container>
        <Row className="gx-5">
          <Col md={4}>
            <Image
              width={60}
              height={60}
              roundedCircle
              src="/assets/icons/logo.svg"
              alt=""
            />
            <p>
              Waysbook adalah platform toko buku online pertama diindonesia yang
              memudahkan dalam pembelian dengan harga-harga yang terjangkau
            </p>
          </Col>
          <Col className="footer-sitemap" md={4}>
            <p className="mt-4 fw-bold">SiteMap</p>
            <Link to="/">Home</Link>
            <Link to="/">Profile</Link>
            <Link to="/">Cart</Link>
            <Link to="/">Complain</Link>
          </Col>
          <Col md={4}>
            <p className="mt-4 fw-bold">Available App</p>
            <Image
              width={100}
              className="me-1"
              src="/assets/icons/googleplay.svg"
              alt=""
            />
            <Image width={100} src="/assets/icons/appstore.svg" alt="" />
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterLayout;
