import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ButtonWaysBook from '../components/ButtonWaysBook';
import { bookSelectors } from '../features/bookSlice';
import Layout from '../hoc/Layout';
import toRupiah from '@develoka/angka-rupiah-js';
import dateFormat, { masks } from 'dateformat';
import { useIndexedDB } from 'react-indexed-db';
import toast, { Toaster } from 'react-hot-toast';
import { transactionSelectors } from '../features/transactionSlice';
import LinkWaysBook from '../components/LinkWaysBook';
const DetailBook = () => {
  const { id } = useParams();
  const [paidBooks, setPaidBooks] = useState();
  const navigate = useNavigate();
  const book = useSelector((state) => bookSelectors.selectById(state, id));

  const transactions = useSelector(transactionSelectors.selectAll);
  const checkPaidBook = () => {
    const myBooks = [];
    transactions.map((trans) =>
      trans.order_detail.map((book) => {
        myBooks.push(book.book_detail);
      })
    );
    return myBooks;
  };

  useEffect(() => {
    const books = checkPaidBook();
    if (books) {
      setPaidBooks(books);
      console.log('paid', books);
    }
  }, [id]);

  const { add: addCart } = useIndexedDB('cartbook');

  const handleAddCart = () => {
    let detailBook = {
      id_book: id,
      title: book.title,
      author: book.author,
      image: book.thumbnail,
      price: book.price,
    };
    addCart(detailBook)
      .then(() => {
        toast.success('Added to cart');
      })
      .catch(() => toast('Book already in cart'));
    navigate('/cart');
  };

  return (
    <Layout>
      <Container className="mb-5 pb-5">
        <Row>
          <Col className="text-end" md={6}>
            <img
              className="object-fit-cover image-detail"
              width={280}
              height={400}
              src={book.thumbnail}
              alt=""
            />
          </Col>
          <Col md={5}>
            <div className="mb-3">
              <p className="fw-bold fs-2 font-times">{book.title}</p>
              <em className="text-secondary">{book.author}</em>
            </div>
            <div className="mb-3">
              <p className="fw-bold mb-1">Publication date</p>
              <span className="text-secondary">
                {book?.publicationDate
                  ? dateFormat(book?.publicationDate, 'dd mmm yyyy')
                  : ''}
              </span>
            </div>
            <div className="mb-3">
              <p className="fw-bold  mb-1">Pages</p>
              <span className="text-secondary">{book.pages}</span>
            </div>
            <div className="mb-3">
              <p className="fw-bold text-danger  mb-1">ISBN</p>
              <span className="text-secondary">{book.isbn}</span>
            </div>
            <div className="mb-3">
              <p className="fw-bold  mb-1">Price</p>
              <span className="fw-bold secondary-blue">
                {' '}
                {book?.price ? toRupiah(book.price, { floatingPoint: 0 }) : ''}
              </span>
            </div>
          </Col>
        </Row>
        <div className="mt-5">
          {' '}
          <h3 className="section-title mb-3">About This Book</h3>
          <p>{book.description}</p>
          <div className="text-end">
            {paidBooks?.findIndex((book) => book.id === +id) > -1 ? (
              <LinkWaysBook to={'download'}>Download</LinkWaysBook>
            ) : (
              <ButtonWaysBook iconCart onClick={() => handleAddCart()}>
                Add Cart
              </ButtonWaysBook>
            )}
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default DetailBook;
