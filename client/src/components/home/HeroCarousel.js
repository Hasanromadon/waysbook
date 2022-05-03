import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import CarouselItem from './CarouselItem';
import { useSelector } from 'react-redux';
import { bookSelectors } from '../../features/bookSlice';
const HeroCarousel = () => {
  const books = useSelector(bookSelectors.selectAll);
  const settings = {
    className: 'slider variable-width',
    infinite: true,
    centerMode: false,
    variableWidth: true,
    arrows: false,
    autoplay: true,
  };

  return (
    <div>
      <Slider {...settings}>
        {books?.length > 0
          ? books.map((book) => <CarouselItem key={book.id} book={book} />)
          : ''}
      </Slider>
    </div>
  );
};

export default HeroCarousel;
