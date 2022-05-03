import React from 'react';
import { Container } from 'react-bootstrap';

const QuoteSection = () => {
  return (
    <div className="quote-section">
      <Container className="d-flex justify-content-center">
        <div className="position-relative quote-container">
          <p className="m-0 py-3 quote-text text-start">
            The <span className="secondary-blue">Ways</span> to grow up, are
            read <span className="secondary-blue">Books</span>
          </p>
          <div>
            <img
              className="position-absolute bottom-0 end-0 d-block image-quote"
              src="/assets/readbook.png"
              alt=""
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default QuoteSection;
