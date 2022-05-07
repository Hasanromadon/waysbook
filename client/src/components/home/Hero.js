import React from 'react';
import { Container } from 'react-bootstrap';
import CarouselItem from './CarouselItem';
import HeroCarousel from './HeroCarousel';

const Hero = ({ booksList }) => {
  return (
    <div className="hero-container">
      <Container className="p-5">
        <h2 className="text-center hero-tagline mt-5">
          <span className="d-block">With us, you can shop online & help</span>
          <span>save your high street at the same time</span>
        </h2>
      </Container>
      <HeroCarousel />
    </div>
  );
};

export default Hero;
