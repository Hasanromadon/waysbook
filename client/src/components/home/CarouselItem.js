import React from 'react';
import { Image } from 'react-bootstrap';
import ButtonWaysBook from '../ButtonWaysBook';
import { useIndexedDB } from 'react-indexed-db';
// import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link } from 'react-router-dom';
import toRupiah from '@develoka/angka-rupiah-js';
import toast from 'react-hot-toast';

const CarouselItem = ({ book }) => {
  const { add: addCart } = useIndexedDB('cartbook');
  const handleAddCart = () => {
    let detailBook = {
      id_book: book?.id,
      title: book?.title,
      author: book?.author,
      image: book?.thumbnail,
      price: book?.price,
    };
    addCart(detailBook)
      .then(() => {
        toast.success(` ${book?.title} added to cart!`);
      })
      .catch(() => {
        toast(`Book already in cart!`);
      });
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
            ? book?.description?.substring(0, 120) + '...'
            : book?.description}
        </p>

        <p className="mb-2 secondary-blue fw-bold ">
          {' '}
          {book?.price ? toRupiah(book.price, { floatingPoint: 0 }) : ''}
        </p>
        <div className="d-grid position-absolute bottom-0 mb-3">
          <ButtonWaysBook onClick={() => handleAddCart()}>
            Add cart
          </ButtonWaysBook>
        </div>
      </div>
    </div>
  );
};

export default CarouselItem;
