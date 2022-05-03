import React from 'react';
import { Row, Col, Form, Image, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
const Chat = ({ contact, loadMessages, messages, sendMessage, onlineUser }) => {
  const { user } = useSelector((state) => state.user);

  return (
    <div>
      <div className="chat-container bg-secondary-gray rounded-2 overflow-hidden position-relative">
        <div className="chat-header p-2 d-flex align-items-center">
          <Image
            roundedCircle
            width={45}
            height={45}
            src="/assets/hasan.png"
            alt=""
            className="me-2 p-1"
          />
          <div>
            <span className="d-block fw-bold">{contact?.fullname}</span>
            <small>
              {onlineUser?.findIndex((user) => user?.id === contact?.id) > 0 ? (
                <>
                  <img src="/assets/icons/online.svg" alt="" /> Online
                </>
              ) : (
                <>Offline</>
              )}
            </small>
          </div>
        </div>
        {/* body */}
        <div className="p-3 messages-container">
          {messages?.map((message) => {
            if (message?.id_sender === user.id) {
              return (
                <div
                  key={message.id}
                  className="chat-sender ms-auto chat-text bg-white rounded p-2"
                >
                  <p className="m-0">{message.message}</p>
                </div>
              );
            } else {
              return (
                <div
                  key={message.id}
                  className="chat-receiver chat-text bg-white rounded p-2"
                >
                  <p className="m-0">{message.message}</p>
                </div>
              );
            }
          })}
        </div>

        {/* input */}
        <div className="p-3 position-absolute bottom-0 start-0 end-0">
          <Row className="g-2">
            <Col md={11}>
              <Form.Control
                onKeyPress={sendMessage}
                type="text"
                placeholder="Normal text"
              />
            </Col>
            <Col md={1}>
              <div className="d-grid">
                <Button variant="info">
                  <img src="/assets/icons/send-message.svg" alt="" />
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Chat;
