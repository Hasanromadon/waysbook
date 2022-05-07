import React, { useState } from 'react';
import { Row, Col, Container, Form, FloatingLabel } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import ButtonWaysBook from '../../components/ButtonWaysBook';
import { API } from '../../config/api';
import InputFileImage from '../../components/InputFileImage';
import InputFile from '../../components/InputFile';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { bookSelectors } from '../../features/bookSlice';
import dateformat from 'dateformat';
import LayoutAdmin from '../../hoc/LayoutAdmin';

const EditBook = () => {
  const title = 'Edit book';
  document.title = 'Waysbook | ' + title;

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const book = useSelector((state) => bookSelectors.selectById(state, id));
  const [filePreview, setFilePreview] = useState(book.bookAttachment);
  const [imagePreview, setImagePreview] = useState(book.thumbnail);
  const navigate = useNavigate();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: book.title,
      author: book.author,
      publicationDate: dateformat(book.publicationDate, 'yyyy-mm-dd'),
      description: book.description,
      price: book.price,
      isbn: book.isbn,
      pages: book.pages,
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
    }),
    onSubmit: (values) => {
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

    if (values.bookAttachment !== '') {
      formData.set(
        'bookAttachment',
        values.bookAttachment,
        values.bookAttachment.name
      );
    }

    if (values.thumbnail !== '') {
      formData.set('image', values.thumbnail, values.thumbnail.name);
    }
    let toastAddBook;
    try {
      setLoading(true);
      toastAddBook = toast.loading('Loading...');
      const config = {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      };
      await API.patch(`/books/${id}`, formData, config);
      toast.success('Book Edited', {
        id: toastAddBook,
      });
      navigate('/');
      setLoading(false);
    } catch (error) {
      toast.error("Can't Edit Book", {
        id: toastAddBook,
      });
      setLoading(false);
    }
  };

  const handleImage = (e) => {
    formik.setFieldValue('thumbnail', e.currentTarget.files[0]);
    setImagePreview(URL.createObjectURL(e.currentTarget.files[0]));
    console.log('handle image');
  };
  const handleFile = (e) => {
    formik.setFieldValue('bookAttachment', e.currentTarget.files[0]);
    setFilePreview(e.currentTarget.files[0].name);
    console.log('handle file');
  };

  return (
    <LayoutAdmin>
      <Container>
        <Row className="justify-content-center">
          <Col className="bg-gray-light border p-4 " md={10}>
            <div>
              <h3 className="section-title mb-3">Edit Product</h3>
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

                <div className="mb-3">
                  <InputFile
                    onChange={(e) => handleFile(e)}
                    border
                    title="Attach Book File"
                  />
                  {filePreview ? (
                    <p className="mt-1">
                      {' '}
                      <img src="/assets/icons/pdf.svg" alt="" /> {filePreview}
                    </p>
                  ) : (
                    ''
                  )}
                </div>

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
                  <InputFileImage
                    onChange={(e) => handleImage(e)}
                    border
                    title="Attach Book Thumbnail"
                  />
                  {imagePreview && (
                    <img className="image-preview" src={imagePreview} alt="" />
                  )}
                </div>
                <div className="mb-5 text-end">
                  <ButtonWaysBook loading={loading} type="submit">
                    Save Change
                  </ButtonWaysBook>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </LayoutAdmin>
  );
};

export default EditBook;
