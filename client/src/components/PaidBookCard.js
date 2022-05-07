import React, { useEffect } from 'react';
import { Col } from 'react-bootstrap';
import toRupiah from '@develoka/angka-rupiah-js';
import { Link } from 'react-router-dom';
import LinkWaysBook from './LinkWaysBook';

const PaidBookCard = ({ book }) => {
  return (
    <>
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
        <div className="mt-3">
          <LinkWaysBook external to={book.bookAttachment}>
            Download
          </LinkWaysBook>
        </div>
      </div>
    </>
  );
};

export default PaidBookCard;
