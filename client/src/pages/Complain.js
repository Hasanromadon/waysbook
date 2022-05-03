import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Chat from '../components/Chat';
import Layout from '../hoc/Layout';
import { io } from 'socket.io-client';

let socket;
const Complain = () => {
  const title = 'Complain admin';
  document.title = 'DumbMerch | ' + title;
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

    loadContact();

    return () => {
      socket.disconnect('tttttttttttttttttes');
    };
  }, []);

  useEffect(() => {
    if (contacts.length > 0) {
      socket.emit('load messages', contacts[0]?.id);
    }

    if (contacts.length > 0) {
      socket.on('new message', () => {
        socket.emit('load messages', contacts[0]?.id);
      });

      loadMessages();
    }

    // listen error sent from server
    socket.on('connect_error', (err) => {
      console.error(err.message); // not authorized
    });
  }, [contacts]);

  const loadContact = () => {
    // emit event load admin contact
    socket.emit('load admin contact');
    // listen event to get admin contact
    socket.on('admin contact', (data) => {
      setContacts([data]);
    });
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
        id_recipient: contacts[0]?.id,
        message: e.target.value,
      };

      socket.emit('send message', data);
      e.target.value = '';
    }
  };

  return (
    <Layout>
      <Container className="mt-3 mb-5">
        <Row className="g-3 justify-content-center ">
          <Col md={10}>
            {contacts && (
              <Chat
                onlineUser={onlineUser}
                loadMessages={loadMessages}
                messages={messages}
                contact={contacts[0]}
                sendMessage={onSendMessage}
              />
            )}
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Complain;
