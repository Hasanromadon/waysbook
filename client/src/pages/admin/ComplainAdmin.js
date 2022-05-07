import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Chat from '../../components/Chat';
import Contact from '../../components/Contact';
import { io } from 'socket.io-client';
import LayoutAdmin from '../../hoc/LayoutAdmin';

let socket;
const ComplainAdmin = () => {
  const title = 'Complain admin';
  document.title = 'Waysbook | ' + title;

  const [contact, setContact] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);

  const [contacts, setContacts] = useState([]);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io('http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socket.emit('join');
    socket.on('onlineUser', (user) => {
      setOnlineUser(user);
    });

    socket.emit('load customer contacts');
    socket.on('new message', () => {
      socket.emit('load customer contacts');
      socket.emit('load messages', contact?.id);
    });

    // listen error sent from server
    socket.on('connect_error', (err) => {
      console.error(err.message); // not authorized
    });
    loadContacts();
    loadMessages();

    return () => {
      socket.disconnect();
    };
  }, [messages]); // code here
  const loadContacts = () => {
    socket.on('customer contacts', (data) => {
      // filter just customers which have sent a message
      const customercontact = data?.filter((contact) => {
        return contact.senderMessage?.length > 0;
      });

      setContacts(customercontact);
    });
  };

  // used for active style when click contact
  const onClickContact = (data) => {
    setContact(data);
    socket.emit('load messages', data.id);
  };

  const loadMessages = () => {
    socket.on('messages', async (data) => {
      if (data.length > 0) {
        const dataMessages = data.map((item) => ({
          id_sender: item.sender.id,
          message: item.message,
        }));

        setMessages(dataMessages);
      }
    });
  };

  const onSendMessage = (e) => {
    if (e.key === 'Enter') {
      const data = {
        id_recipient: contact?.id,
        message: e.target.value,
      };

      socket.emit('send message', data);
      e.target.value = '';
    }
  };

  console.log('checkonline', onlineUser);

  return (
    <LayoutAdmin>
      <Container className="mt-3 mb-5">
        <Row className="g-3">
          <Col md={3}>
            <Contact onClickContact={onClickContact} contacts={contacts} />
          </Col>
          <Col md={9}>
            <Chat
              onlineUser={onlineUser}
              sendMessage={onSendMessage}
              contact={contact}
              messages={messages}
            />
          </Col>
        </Row>
      </Container>
    </LayoutAdmin>
  );
};

export default ComplainAdmin;
