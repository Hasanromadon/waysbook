import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LinkWaysBook = ({
  children,
  className,
  outlined,
  iconCart,
  loading,
  to,
}) => {
  return (
    <Link
      to={to}
      className={`fw-bold btn secondary rounded-1 button-waysbook block text-light ${className}`}
      disabled={loading}
    >
      {loading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="me-2"
        />
      )}
      {children}
      {iconCart ? (
        <img className="ms-2" src="/assets/icons/cart.svg" alt="" />
      ) : (
        ''
      )}
    </Link>
  );
};

export default LinkWaysBook;
