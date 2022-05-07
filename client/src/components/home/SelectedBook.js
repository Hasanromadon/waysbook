import React from 'react';
import ButtonWaysBook from '../../components/ButtonWaysBook';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { bookSelectors } from '../../features/bookSlice';
import { useNavigate } from 'react-router-dom';

const SelectedBook = () => {
  const navigate = useNavigate();
  let books = useSelector(bookSelectors.selectAll);
  books = { ...books[books?.length - 1] };

  return (
    <Container className="my-5">
      <h3 className="section-title mb-3">Selected Book</h3>
      <div className="bg-white rounded">
        <Container className="p-5">
          <Row className="g-4 ms-3">
            <Col md={5} className="text-end">
              <Image width="80%" src={books.thumbnail} />
            </Col>
            <Col md={5}>
              <Image src="/assets/rating.png" />
              <p>{books.title}</p>
              <p>
                {books.description?.length > 400
                  ? books.description.substring(0, 400) + '...'
                  : books.description}
              </p>
              <ButtonWaysBook onClick={() => navigate('/books/' + books.id)}>
                View Book
              </ButtonWaysBook>
            </Col>
          </Row>
        </Container>
      </div>
    </Container>
  );
};

export default SelectedBook;
