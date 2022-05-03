import React from 'react';
import ButtonWaysBook from '../../components/ButtonWaysBook';
import { Container, Row, Col, Image } from 'react-bootstrap';

const SelectedBook = () => {
  return (
    <Container className="my-5">
      <h3 className="section-title mb-3">List Book</h3>
      <div className="bg-white rounded">
        <Container className="p-5">
          <Row className="g-5 ms-3">
            <Col md={5} className="text-end">
              <Image src="/assets/selected-book.png" />
            </Col>
            <Col md={5}>
              <Image src="/assets/rating.png" />
              <p>My Own Private Mr. Cool</p>
              <p>
                Ia sedaging dan sedarah dengan adiknya, mengapa ia harus menjadi
                tampan dan adiknya menjadi buruk rupa? Mengapa bukan dia yang
                mewujud jelek, dan Adiknya yang mewujud tampan? Apakah ini
                karena perbuatan nasib? Kalau demikian, alangkah tidak adil dan
                semena-menanya nasib ini dalam memilihkan takdir bagi
                ciptaannya.
              </p>
              <ButtonWaysBook>View Book</ButtonWaysBook>
            </Col>
          </Row>
        </Container>
      </div>
    </Container>
  );
};

export default SelectedBook;
