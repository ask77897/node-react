import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Alert, Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const OrderModal = ({ purchase, sum }) => {
    const [show, setShow] = useState(false);
    const [list, setList] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getOrder = async () => {
        const res = await axios('/orders/list/order.json?pid=' + purchase.pid);
        //console.log(res.data)
        setList(res.data);
    }

    useEffect(() => {
        getOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                주문상품
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size='lg'
            >
                <Modal.Header closeButton>
                    <Modal.Title>주문 상품</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div>받는이 : {purchase.rname}</div>
                        <div>배송지 : {purchase.raddress1} {purchase.raddress2}</div>
                        <div>전화번호 : {purchase.rphone}</div>
                        <div>배송 상태 : {purchase.str_status}</div>
                    </div>
                    <Table bordered hover>
                        <thead>
                            <tr className='text-center'>
                                <th>주문번호</th>
                                <th>제목</th>
                                <th>수량</th>
                                <th>금액</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map(book =>
                                <tr key={book.bid} className='text-center'>
                                    <td>{book.bid}</td>
                                    <td className='text-start'><img src={book.image || "http://via.placeholder.com/170x250"} alt='' width="30"/>{book.title}</td>
                                    <td>{book.qnt}</td>
                                    <td className='text-end'>{book.fmtsum}원</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <Alert className='text-end'>총 합계 : {sum}</Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default OrderModal