import React from 'react';
import { Image } from 'react-bootstrap';

const Contact = ({ contacts, onClickContact }) => {
  console.log(contacts);

  return (
    <div className="rounded p-2 bg-secondary-gray">
      {contacts && contacts?.length > 0 ? (
        contacts.map((contact) => (
          <div
            onClick={() => onClickContact(contact)}
            className="contact-container p-2"
          >
            <Image
              roundedCircle
              width={45}
              height={45}
              src={contact?.profile?.image}
              alt=""
              className="me-2 p-1"
            />
            <span>{contact?.fullname}</span>
          </div>
        ))
      ) : (
        <p>No Complain</p>
      )}
    </div>
  );
};

export default Contact;
