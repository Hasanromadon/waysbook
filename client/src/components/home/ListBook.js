import React from 'react';
import { Container, Image, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { bookSelectors } from '../../features/bookSlice';
import BookCard from './BookCard';

const ListBook = () => {
  const books = useSelector(bookSelectors.selectAll);
  return (
    <Container className="mt-5 listbook position-relative">
      <h3 className="section-title mb-3">List Book</h3>
      <section className="bg-white rounded p-5 position-relative">
        <div className="position-absolute top-0 zigzag-image end-0">
          <Image src="/assets/zigzag.svg" />
        </div>
        <Row className="g-5">
          {books?.length > 0
            ? books.map((book) => <BookCard key={book.id} book={book} />)
            : ''}
        </Row>
        <div className="position-absolute bottom-0 zigzag-image-bottom start-0">
          <Image src="/assets/zigzag.svg" />
        </div>
      </section>
    </Container>
  );
};

export default ListBook;
