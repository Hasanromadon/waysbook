import React, { useEffect, useState } from 'react';
import toRupiah from '@develoka/angka-rupiah-js';
import { Row, Col, Table, Container } from 'react-bootstrap';
import { API } from '../../config/api';
import LayoutAdmin from '../../hoc/LayoutAdmin';

const Transaction = () => {
  const title = 'Transactions';
  document.title = 'Waysbook | ' + title;

  const [transactions, setTransactions] = useState([]);

  const getAllTransactions = async () => {
    try {
      const response = await API.get('/transactions');
      setTransactions(response.data.data);
      console.log(transactions);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllTransactions();
  }, []);

  return (
    <LayoutAdmin>
      <Container>
        <Row className="justify-content-center">
          <Col className="bg-gray-light p-4 " md={10}>
            <div>
              <h3 className="section-title mb-3">Incoming Transaction</h3>
              <Table striped hover>
                <thead className="text-danger">
                  <tr>
                    <th>No</th>
                    <th>Users</th>
                    <th>Product Purchased</th>
                    <th>Total Payment</th>
                    <th>Status Payment</th>
                  </tr>
                </thead>
                <tbody className="border-top-0">
                  {transactions?.length > 0 ? (
                    transactions.map((item, index) => (
                      <tr key={item.id}>
                        <td>1</td>
                        <td>{item.buyer.fullname}</td>
                        <td>
                          {item.order_detail
                            .map((book) => {
                              return book.book_detail.title;
                            })
                            .join(', ')}
                        </td>
                        <td
                          className={
                            item?.status === 'success'
                              ? 'text-success fw-bold'
                              : 'text-danger fw-bold'
                          }
                        >
                          {item?.order_detail &&
                            toRupiah(
                              eval(
                                item.order_detail
                                  .map((book) => {
                                    return +book.price;
                                  })
                                  .join('+')
                              ),
                              {
                                floatingPoint: '0',
                              }
                            )}
                        </td>
                        <td
                          className={
                            item?.status === 'success'
                              ? 'text-success fw-bold'
                              : 'text-danger fw-bold'
                          }
                        >
                          {item?.status}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>No Data</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
    </LayoutAdmin>
  );
};

export default Transaction;
