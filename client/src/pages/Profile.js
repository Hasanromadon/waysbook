import React, { useEffect } from 'react';
import { Row, Col, Container, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import LinkWaysBook from '../components/LinkWaysBook';
import PaidBookCard from '../components/PaidBookCard';
import { transactionSelectors } from '../features/transactionSlice';
import { userProfile } from '../features/userSlice';
import Layout from '../hoc/Layout';

const Profile = () => {
  const title = 'Profile';
  document.title = 'Waysbook | ' + title;

  const { user } = useSelector((state) => state.user);
  const transactions = useSelector(transactionSelectors.selectAll);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userProfile());
  }, [dispatch]);

  return (
    <Layout>
      <Container>
        <Row className="justify-content-center mb-5">
          <Col md={10}>
            <div>
              <h3 className="section-title mb-3">Profile</h3>
              <Row className="g-2 p-5 bg-pink rounded-3">
                <Col md={8}>
                  <div className="d-flex mb-2">
                    <Image src="/assets/icons/message.svg" />
                    <div className="ms-3">
                      <p className="m-0 fw-bold fs-small">{user.email}</p>
                      <small className="fs-xsmall">Email</small>
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <Image src="/assets/icons/gender.svg" />
                    <div className="ms-3">
                      <p className="m-0 fw-bold fs-small">
                        {user?.profile?.gender}
                      </p>
                      <small className="fs-xsmall">Gender</small>
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <Image src="/assets/icons/phone.svg" />
                    <div className="ms-3">
                      <p className="m-0 fw-bold fs-small">
                        {user?.profile?.phone}
                      </p>
                      <small className="fs-xsmall">Mobile phone</small>
                    </div>
                  </div>
                  <div className="d-flex">
                    <Image src="/assets/icons/pin.svg" />
                    <div className="ms-3">
                      <p className="m-0 fw-bold fs-small">
                        {user?.profile?.address}
                      </p>
                      <small className="fs-xsmall">Address</small>
                    </div>
                  </div>
                </Col>
                <Col className="text-end" md={4}>
                  <div className="profile-image">
                    <Image
                      className="object-fit-cover"
                      width="100%"
                      height={202}
                      rounded
                      src={user?.profile?.image}
                      alt=""
                    />
                    <div className="d-grid mt-2">
                      <LinkWaysBook to="/profile/edit">
                        Edit Profile
                      </LinkWaysBook>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        {user?.role === 'user' ? (
          <Row>
            <h3 className="section-title mb-3">Profile</h3>
            {transactions?.length > 0 ? (
              transactions.map((trans) =>
                trans?.order_detail.map((book) => (
                  <Col md={3} key={book.book_detail.id}>
                    <PaidBookCard book={book.book_detail} />
                  </Col>
                ))
              )
            ) : (
              <p>You Don't have any book</p>
            )}
          </Row>
        ) : (
          ''
        )}
      </Container>
    </Layout>
  );
};

export default Profile;
