import React from 'react'
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const BookModal = ({book}) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button onClick={handleShow}>
                상세보기
            </Button>

            <Modal
                size='lg'
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>상세정보</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={3}>
                            <img src={book.thumbnail || "http://via.placeholder.com/170x250"} width='90%'/>
                        </Col>
                        <Col>
                            <h5>{book.title}</h5>
                            <div className='mb-3'>가격 : {book.price}원</div>
                            <div className='mb-3'>저자 : {book.authors}</div>
                            <div className='mb-3'>ISBN : {book.isbn}</div>
                            <div className='mb-3'>출판사 : {book.publisher}</div>
                            <div className='mb-3'>출판일 : {book.datetime}</div>
                        </Col>
                    </Row>
                    <hr/>
                    <div>{book.contents || <p>내용없음</p>}</div>
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

export default BookModal