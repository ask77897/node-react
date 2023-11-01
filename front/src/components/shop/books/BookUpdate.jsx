import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { /*NavLink,*/ useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap'

const BookUpdate = () => {
    const navi = useNavigate();
    const [loading, setloading] = useState(false);
    const { bid } = useParams();
    const [book, setBook] = useState({
        bid: '',
        title: '',
        price: '',
        fmtprice: '',
        authors: '',
        contents: '',
        publisher: '',
        image: '',
        isbn: '',
        regdate: '',
        fmtdate: ''
    });
    const { title, price, /*fmtprice,*/ authors, contents, publisher/*, image, isbn, regdate, fmtdate*/ } = book;
    //console.log(bid);

    const getBook = async () => {
        setloading(true);
        const res = await axios.get('/books/read/' + bid);
        //console.log(res.data);
        setBook(res.data);
        setloading(false);
    }
    const onChange = (e) => {
        setBook({
            ...book,
            [e.target.name]:e.target.value
        })
    }
    const onSubmit = async(e) => {
        e.preventDefault();
        if(window.confirm("수정된 내용을 저장하시겠습니까?")){
            //수정하기
            const res = await axios.post('/books/update', book);
            if(res.data===0){
                alert("수정 실패");
            }else{
                alert("수정 완료");
                navi(`/books/read/${bid}`);
            }
        }
    }
    useEffect(() => {
        getBook();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if (loading) return <div className='text-center my-5'><Spinner /></div>
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>도서정보수정</h1>
            <Row className='justify-content-center'>
                <Col md={8}>
                    <Card className='p-3'>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>도서코드</InputGroup.Text>
                                <Form.Control value={bid} name='bid' onChange={onChange} readOnly/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>제목</InputGroup.Text>
                                <Form.Control value={title} name='title' onChange={onChange}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>가격</InputGroup.Text>
                                <Form.Control value={price} name='price' onChange={onChange}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>저자</InputGroup.Text>
                                <Form.Control value={authors} name='authors' onChange={onChange}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>출판사</InputGroup.Text>
                                <Form.Control value={publisher} name='publisher' onChange={onChange}/>
                            </InputGroup>
                            <Form.Control as="textarea" rows={10} name='contents' onChange={onChange}>{contents}</Form.Control>
                            <div className='text-center my-3'>
                                <Button className='me-2' type='submit'>정보수정</Button>
                                <Button variant='secondary' onClick={()=>getBook()}>수정취소</Button>
                            </div>
                        </form>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default BookUpdate