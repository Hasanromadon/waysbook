import React from 'react';
import { Button, Spinner } from 'react-bootstrap';

const ButtonWaysBook = ({
  children,
  className,
  outlined,
  iconCart,
  onClick,
  loading,
  type,
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      className={`fw-bold ${className}`}
      variant={
        outlined
          ? 'button-waysbook-outlined'
          : 'secondary rounded-1 button-waysbook block'
      }
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
    </Button>
  );
};

export default ButtonWaysBook;
