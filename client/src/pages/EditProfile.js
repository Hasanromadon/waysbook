import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Row,
  Col,
  Container,
  Button,
  Image,
  Form,
  Spinner,
  FloatingLabel,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ButtonWaysBook from '../components/ButtonWaysBook';
import InputFile from '../components/InputFile';
import Layout from '../hoc/Layout';
import { updateImage, updateProfile } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const { user, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      fullname: user.fullname,
      phone: user.profile.phone,
      gender: user.profile.gender,
      address: user.profile.address,
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required('Sorry the fullname is required'),
      phone: Yup.string().required('Sorry the phone number is required'),
      gender: Yup.string().required('Sorry the gender is required'),
      address: Yup.string().required('Sorry the address is required'),
    }),
    onSubmit: (values) => {
      handleUpdateProfile(values);
    },
  });

  const handleUpdateProfile = (values) => {
    dispatch(updateProfile(values));
  };

  const handleChangePicture = (e) => {
    const values = e.target.files[0];
    dispatch(updateImage(values));
  };

  return (
    <Layout>
      <Container className="mb-5">
        <Row className="justify-content-center">
          <Col md={10}>
            <div>
              <h3 className="section-title mb-3">Edit Profile</h3>
              <Row className="g-2 p-5 bg-pink rounded-3">
                <Col md={12}>
                  <div className="mb-3 preview-image-wrapper">
                    <img
                      className="mb-3 preview-image"
                      src={
                        user?.profile?.image !== null
                          ? user?.profile?.image
                          : user?.profile?.gender === 'male'
                          ? '/assets/icons/male-avatar.png'
                          : '/assets/icons/female-avatar.png'
                      }
                      width={140}
                      height={140}
                      alt=""
                    />
                    {loading ? (
                      <Spinner animation="border" />
                    ) : (
                      <InputFile
                        onChange={(e) => handleChangePicture(e)}
                        title="Upload File"
                      />
                    )}
                  </div>
                  <Form onSubmit={formik.handleSubmit}>
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Fullname"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        placeholder="name@example.com"
                        {...formik.getFieldProps('fullname')}
                      />
                      {formik.errors.fullname ? (
                        <small className="text-danger">
                          {formik.errors.fullname}
                        </small>
                      ) : null}
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="floatingSelect"
                      label="Gender"
                      className="mb-3"
                    >
                      <Form.Select
                        aria-label="Floating label select example"
                        {...formik.getFieldProps('gender')}
                      >
                        <option>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Form.Select>
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Phone number"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        placeholder="081188383"
                        {...formik.getFieldProps('phone')}
                      />
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Email address"
                      className="mb-3"
                    >
                      <Form.Control
                        disabled
                        type="email"
                        placeholder="name@example.com"
                        value={user?.email}
                      />
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Address"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        placeholder="address"
                        {...formik.getFieldProps('address')}
                      />
                    </FloatingLabel>
                    {formik.errors.address ? (
                      <small className="text-danger">
                        {formik.errors.address}
                      </small>
                    ) : null}

                    <div className="text-end">
                      <ButtonWaysBook loading={loading} type="submit">
                        Save Change
                      </ButtonWaysBook>
                    </div>
                  </Form>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default EditProfile;
