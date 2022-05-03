import React, { useState } from 'react';
import { Row, Col, Container, Form, FloatingLabel } from 'react-bootstrap';
import { useFormik } from 'formik';
import Layout from '../../hoc/Layout';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import InputFile from '../../components/InputFile';
import ButtonWaysBook from '../../components/ButtonWaysBook';
import { API } from '../../config/api';

const AddBook = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      title: '',
      author: '',
      publicationDate: '',
      description: '',
      price: 0,
      isbn: 0,
      pages: 0,
      bookAttachment: '',
      thumbnail: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Sorry the title is required'),
      publicationDate: Yup.date().required(
        'Sorry the publicationDate is required'
      ),
      author: Yup.string().required('Sorry the author is required'),

      description: Yup.string().required('Sorry the description is required'),
      price: Yup.number().required('Sorry the price is required'),
      isbn: Yup.number().required('Sorry the isbn is required'),
      bookAttachment: Yup.string().required(
        'Sorry the bookAttachment is required'
      ),
    }),
    onSubmit: (values) => {
      console.log(values);
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.set('title', values.title);
    formData.set('author', values.author);
    formData.set('publicationDate', values.publicationDate);
    formData.set('description', values.description);
    formData.set('price', values.price);
    formData.set('isbn', values.isbn);
    formData.set('pages', values.pages);
    formData.set('bookAttachment', values.bookAttachment);
    formData.set('image', values.thumbnail, values.thumbnail.name);

    console.log(formData);

    try {
      // POST DATA
      const config = {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      };
      await API.post('/books', formData, config);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImage = (e) => {
    formik.setFieldValue('thumbnail', e.currentTarget.files[0]);

    if (e.target.type === 'file') {
      let url = URL.createObjectURL(e.target.files[0]);
      // setPreview(url);
    }
  };

  return (
    <Layout>
      <Container>
        <Row className="justify-content-center">
          <Col className="bg-gray-light border p-4 " md={10}>
            <div>
              <h3 className="section-title mb-3">Add Product</h3>
              <form onSubmit={formik.handleSubmit}>
                <FloatingLabel className="mb-3" controlId="title" label="Title">
                  <Form.Control
                    className="bg-gray"
                    type="text"
                    placeholder="Title"
                    {...formik.getFieldProps('title')}
                  />
                  {formik.errors.title ? (
                    <small className="text-danger">{formik.errors.title}</small>
                  ) : null}
                </FloatingLabel>
                <FloatingLabel
                  className="mb-3"
                  controlId="author"
                  label="Author"
                >
                  <Form.Control
                    className="bg-gray"
                    type="text"
                    placeholder="Author"
                    {...formik.getFieldProps('author')}
                  />
                  {formik.errors.author ? (
                    <small className="text-danger">
                      {formik.errors.author}
                    </small>
                  ) : null}
                </FloatingLabel>
                <FloatingLabel
                  className="mb-3"
                  controlId="publication-date"
                  label="publication Date"
                >
                  <Form.Control
                    className="bg-gray"
                    type="date"
                    placeholder="publication Date"
                    {...formik.getFieldProps('publicationDate')}
                  />
                  {formik.errors.publicationDate ? (
                    <small className="text-danger">
                      {formik.errors.publicationDate}
                    </small>
                  ) : null}
                </FloatingLabel>

                <FloatingLabel className="mb-3" controlId="Pages" label="Pages">
                  <Form.Control
                    className="bg-gray"
                    type="number"
                    placeholder="publication Date"
                    {...formik.getFieldProps('pages')}
                  />
                  {formik.errors.pages ? (
                    <small className="text-danger">{formik.errors.pages}</small>
                  ) : null}
                </FloatingLabel>
                <FloatingLabel className="mb-3" controlId="isbn" label="ISBN">
                  <Form.Control
                    className="bg-gray"
                    type="number"
                    placeholder="publication Date"
                    {...formik.getFieldProps('isbn')}
                  />
                  {formik.errors.isbn ? (
                    <small className="text-danger">{formik.errors.isbn}</small>
                  ) : null}
                </FloatingLabel>
                <FloatingLabel className="mb-3" controlId="price" label="Price">
                  <Form.Control
                    className="bg-gray"
                    type="number"
                    placeholder="price"
                    {...formik.getFieldProps('price')}
                  />
                  {formik.errors.price ? (
                    <small className="text-danger">{formik.errors.price}</small>
                  ) : null}
                </FloatingLabel>
                <FloatingLabel
                  className="mb-3"
                  controlId="book-attachment"
                  label="Book Attachment"
                >
                  <Form.Control
                    className="bg-gray"
                    type="text"
                    placeholder="book Attachment"
                    {...formik.getFieldProps('bookAttachment')}
                  />
                  {formik.errors.bookAttachment ? (
                    <small className="text-danger">
                      {formik.errors.bookAttachment}
                    </small>
                  ) : null}
                </FloatingLabel>
                <FloatingLabel
                  className="mb-3"
                  controlId="description"
                  label="Description"
                >
                  <Form.Control
                    as="textarea"
                    className="bg-gray resize-none"
                    placeholder="Description"
                    style={{ height: '100px' }}
                    {...formik.getFieldProps('description')}
                  />
                  {formik.errors.description ? (
                    <small className="text-danger">
                      {formik.errors.description}
                    </small>
                  ) : null}
                </FloatingLabel>
                <div className="mb-3">
                  <InputFile
                    onChange={(e) => handleImage(e)}
                    border
                    title="Attach Book File"
                  />
                </div>
                <div className="mb-5 text-end">
                  <ButtonWaysBook type="submit">Add product</ButtonWaysBook>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default AddBook;
