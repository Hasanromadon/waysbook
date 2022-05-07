import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import ButtonWaysBook from '../ButtonWaysBook';

const DeleteModal = (props) => {
  const deleteBook = () => {
    props.handleDelete();
    props.onHide();
  };

  return (
    <Modal
      show={true}
      {...props}
      size="xs"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <p className="fw-bold font-times fs-5">
          Are you sure want delete this book?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary py-1 rounded-1 fs-6 fw-bold"
          onClick={props.onHide}
        >
          Cancel
        </Button>

        <ButtonWaysBook type="submit" onClick={() => deleteBook()}>
          Yes, delete
        </ButtonWaysBook>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
