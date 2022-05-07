import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import ButtonWaysBook from '../components/ButtonWaysBook';
import Layout from '../hoc/Layout';
import { useIndexedDB } from 'react-indexed-db';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { API, apiHeader } from '../config/api';
import toast from 'react-hot-toast';
import toRupiah from '@develoka/angka-rupiah-js';

const Cart = () => {
  const title = 'Cart';
  document.title = 'Waysbook | ' + title;

  const [cart, setCart] = useState();
  const { user } = useSelector((state) => state.user);
  const { getAll, clear, deleteRecord } = useIndexedDB('cartbook');
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    deleteRecord(id).then((event) => {
      toast.success('Item deleted!');
    });
  };

  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    //change this according to your client-key
    const myMidtransClientKey = 'SB-Mid-client-ZBuTiayOZocEGgLJ';

    let scriptTag = document.createElement('script');
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute('data-client-key', myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  useEffect(() => {
    getAll().then((cart) => {
      setCart(cart);
      let total = 0;
      cart.forEach((item) => (total += item.price));
      setTotalPrice(total);
    });
  }, [getAll, cart]);

  const handlePay = async () => {
    const data = {};
    const order_detail = cart.map((item) => ({
      id_product: +item.id_book,
      price: item.price,
      qty: 1,
    }));
    data.order_detail = order_detail;
    data.total = totalPrice;

    try {
      const response = await API.post('/transactions', data, apiHeader);

      window.snap.pay(response.data.payment.token, {
        onSuccess: function (result) {
          navigate('/profile');
          clear();
        },
        onPending: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate('/profile');
        },
        onError: function (result) {
          /* You may add your own implementation here */
          console.log(result);
        },
        onClose: function () {
          /* You may add your own implementation here */
          alert('you closed the popup without finishing the payment');
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <Container className="my-5">
        <h3 className="section-title mb-3">My Cart</h3>
        {cart?.length > 0 ? (
          <Row className="g-5">
            <Col md={8}>
              <div>
                <p>Review Your Order</p>
                <hr />

                {cart?.length > 0
                  ? cart.map((item) => (
                      <>
                        <div className="order-item d-flex justify-content-between mb-4">
                          <div className="d-flex">
                            <img
                              width={130}
                              height={176}
                              src={item.image}
                              alt=""
                            />
                            <div className="ms-3">
                              <p className="font-times fw-bold fs-5 m-0">
                                {item.title}
                              </p>
                              <small className="text-secondary fst-italic">
                                {item.author}
                              </small>
                              <p className="fw-bold mt-3 secondary-blue ">
                                {item?.price
                                  ? toRupiah(item.price, { floatingPoint: 0 })
                                  : ''}
                              </p>
                            </div>
                          </div>
                          <div>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="bg-transparent border-0"
                            >
                              <img src="/assets/icons/delete.svg" alt="" />
                            </button>
                          </div>
                        </div>
                      </>
                    ))
                  : null}
              </div>
              <hr />
            </Col>
            <Col md={4} className="pt-4">
              <Row>
                <Col md={6} className="text-start">
                  <p>Subtotal</p>
                </Col>
                <Col className="text-end" md={6}>
                  {toRupiah(totalPrice, { floatingPoint: 0 })}
                </Col>
                <Col md={6} className="text-start">
                  <p>Qty</p>
                </Col>
                <Col className="text-end" md={6}>
                  {cart?.length}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6} className="text-start">
                  <p className="secondary-blue fw-bold">Total</p>
                </Col>
                <Col className="text-end" md={6}>
                  <p className="secondary-blue fw-bold">
                    {toRupiah(totalPrice, { floatingPoint: 0 })}
                  </p>
                </Col>
                <ButtonWaysBook onClick={() => handlePay()}>Pay</ButtonWaysBook>
              </Row>
            </Col>
          </Row>
        ) : (
          <div className="cart-empty">
            <p className="fs-4 ">Upps, Your Cart is empty</p>
          </div>
        )}
      </Container>
    </Layout>
  );
};

export default Cart;
