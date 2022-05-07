import React, { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import ButtonWaysBook from '../ButtonWaysBook';
import { useIndexedDB } from 'react-indexed-db';
// import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link } from 'react-router-dom';
import toRupiah from '@develoka/angka-rupiah-js';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { transactionSelectors } from '../../features/transactionSlice';
import LinkWaysBook from '../LinkWaysBook';

const CarouselItem = ({ book }) => {
  const [paidBooks, setPaidBooks] = useState();
  const { isLoggedIn, user } = useSelector((state) => state.user);

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
  }, []);

  const { add: addCart } = useIndexedDB('cartbook');
  const handleAddCart = () => {
    if (isLoggedIn) {
      let detailBook = {
        id_book: book.id,
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
    } else {
      toast.error('Please loggin before');
    }
  };

  return (
    <div className="carouselItem d-flex ">
      <Image
        className="object-fit-cover"
        height={350}
        width={250}
        src={book.thumbnail}
        alt=""
      />
      {/* <Skeleton width={200} height={200} /> */}
      <div className=" bg-white carousel-text px-3 pt-3 position-relative">
        <Link
          to={'/books/' + book.id}
          className="carousel-title bold m-0 fw-bold lh-0"
        >
          {book.title}
        </Link>
        <small className="carousel-author text-secondary d-block">
          <em>{book.author}</em>
        </small>
        <p className="carousel-desc mt-2">
          {book?.description?.length > 100
            ? book?.description?.substring(0, 100) + '...'
            : book?.description}
        </p>

        <p className="mb-2 secondary-blue fw-bold ">
          {' '}
          {book?.price ? toRupiah(book.price, { floatingPoint: 0 }) : ''}
        </p>
        {user?.role === 'user' ? (
          <div className="d-grid  mb-3">
            {paidBooks?.findIndex((paidBook) => paidBook.id === +book.id) >
            -1 ? (
              <LinkWaysBook external to={book.bookAttachment}>
                Download
              </LinkWaysBook>
            ) : (
              <ButtonWaysBook onClick={() => handleAddCart()}>
                Add to Cart
              </ButtonWaysBook>
            )}
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default CarouselItem;
