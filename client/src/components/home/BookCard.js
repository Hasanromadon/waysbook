import React from 'react';
import { Col } from 'react-bootstrap';
import toRupiah from '@develoka/angka-rupiah-js';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <Col md={3}>
      <div className="mb-2 bookcard">
        <img className="bookcard-img" src={book.thumbnail} alt="" />
      </div>
      <div>
        <Link
          to={'books/' + book.id}
          className="cardbook-title fw-bold m-0 text-decoration-none d-block text-black"
        >
          {book.title}
        </Link>
        <small>
          {' '}
          <em className="text-secondary">{book.author}</em>
        </small>
        <p className="secondary-blue fw-bold mt-2">
          {book?.price ? toRupiah(book.price, { floatingPoint: 0 }) : ''}
        </p>
      </div>
    </Col>
  );
};

export default BookCard;
