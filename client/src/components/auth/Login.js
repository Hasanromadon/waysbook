import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Button, FloatingLabel, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import ButtonWaysBook from '../ButtonWaysBook';
import * as Yup from 'yup';
import { userLogin } from '../../features/userSlice';

const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string()
        .required('Sorry the email is required')
        .email('This is invalid email'),
      password: Yup.string().required('Sorry the password is required'),
    }),
    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  const handleLogin = (formValue) => {
    const { email, password } = formValue;
    setLoading(true);
    dispatch(userLogin({ email, password }));
    setLoading(false);
  };

  return (
    <Modal
      show={true}
      {...props}
      size="xs"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <p className="fw-bold font-times fs-3">Login</p>
        <Form onSubmit={formik.handleSubmit}>
          <FloatingLabel
            controlId="floatingInput"
            label="Email"
            className="mb-3"
          >
            <Form.Control
              className="bg-gray"
              type="email"
              placeholder="name@example.com"
              {...formik.getFieldProps('email')}
            />
            {formik.errors.email ? (
              <small className="text-danger">{formik.errors.email}</small>
            ) : null}
          </FloatingLabel>
          <FloatingLabel
            className="mb-3"
            controlId="floatingPassword"
            label="Password"
          >
            <Form.Control
              className="bg-gray"
              type="password"
              placeholder="Password"
              {...formik.getFieldProps('password')}
            />
            {formik.errors.password ? (
              <small className="text-danger">{formik.errors.password}</small>
            ) : null}
          </FloatingLabel>
          <div className="d-grid mb-3">
            <ButtonWaysBook
              loading={loading}
              type="submit"
              onClick={props.onHide}
            >
              Login
            </ButtonWaysBook>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Login;
