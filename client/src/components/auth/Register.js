import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, FloatingLabel, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import ButtonWaysBook from '../ButtonWaysBook';
import * as Yup from 'yup';
import { userRegister } from '../../features/userSlice';

const Register = (props) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: { fullname: '', email: '', password: '' },
    validationSchema: Yup.object({
      fullname: Yup.string().required('Sorry the fullname is required'),
      email: Yup.string()
        .required('Sorry the email is required')
        .email('This is invalid email'),
      password: Yup.string().required('Sorry the password is required'),
    }),
    onSubmit: (values) => {
      handleRegister(values);
    },
  });

  const handleRegister = (formValue) => {
    const { fullname, email, password } = formValue;
    setLoading(true);
    dispatch(userRegister({ fullname, email, password }));
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
        <p className="fw-bold font-times fs-3">Register</p>
        <Form onSubmit={formik.handleSubmit}>
          <FloatingLabel
            controlId="floatingInput"
            label="Fullname"
            className="mb-3"
          >
            <Form.Control
              className="bg-gray"
              type="text"
              placeholder="Hasan"
              {...formik.getFieldProps('fullname')}
            />
            {formik.errors.fullname ? (
              <small className="text-danger">{formik.errors.fullname}</small>
            ) : null}
          </FloatingLabel>
          <FloatingLabel controlId="inputEmail" label="Email" className="mb-3">
            <Form.Control
              className="bg-gray"
              type="email"
              placeholder="name@example.com"
              autoComplete="off"
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
              autoComplete="off"
              {...formik.getFieldProps('password')}
            />
            {formik.errors.email ? (
              <small className="text-danger">{formik.errors.password}</small>
            ) : null}
          </FloatingLabel>
          <div className="d-grid mb-3">
            <ButtonWaysBook
              loading={loading}
              type="submit"
              onClick={props.onHide}
            >
              Register
            </ButtonWaysBook>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Register;
