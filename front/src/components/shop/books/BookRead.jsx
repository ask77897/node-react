import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Button, Card, Col, Row, Spinner } from 'react-bootstrap'

const BookRead = () => {
    const ref_file = useRef(null);
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
        fmtdate: '',
        file: null,
        fcnt: 0,
        ucnt: 0,
        rcnt: 0
    });
    const { title,/* price,*/ fmtprice, authors, contents, publisher, image, isbn,/* regdate,*/ fmtdate, file, fcnt, ucnt, rcnt } = book;
    //console.log(bid);

    const getBook = async () => {
        setloading(true);
        const res = await axios.get('/books/read/' + bid);
        //console.log(res.data);
        setBook(res.data);
        setloading(false);
    }
    const onChangeFile = (e) => {
        setBook({
            ...book,
            image: URL.createObjectURL(e.target.files[0]),
            file: e.target.files[0]
        })
    }
    const onUpdateImage = async() => {
        if(!file){
            alert("변경할 이미지를 선택해주세요");
        }else{
            if(window.confirm("이미지를 변경하시겠습니까?")){
                //이미지변경
                const formData = new FormData();
                formData.append('file', file);
                formData.append('bid', bid);
                const res = await axios.post('/books/update/image', formData);
                if(res.data===0){
                    alert("이미지 변경 실패");
                }else{
                    alert("이미지 변경 성공");
                    getBook();
                }
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
            <h1 className='text-center mb-5'>도서정보</h1>
            <Row className='justify-content-center'>
                <Col md={8}>
                    <Card className='p-5'>
                        <Row>
                            <Col>
                                <div>
                                    <img src={image || "http://via.placeholder.com/170x250"} alt='' width={200} onClick={() => ref_file.current.click()} style={{cursor:'pointer'}} />
                                    <input type='file' onChange={onChangeFile} style={{ display: 'none' }} ref={ref_file} />
                                </div>
                                <Button size='sm mt-2 w-100' onClick={onUpdateImage}>이미지수정</Button>
                            </Col>
                            <Col className='align-self-center px-3'>
                                <div>
                                    <h3>제목 : {title}</h3>
                                    <hr />
                                    <div>가격 : {fmtprice}원</div>
                                    <div>저자 : {authors}</div>
                                    <div>출판사 : {publisher}</div>
                                    <div>등록일 : {fmtdate}</div>
                                    <div>ISBN : {isbn}</div>
                                    <hr/>
                                    <div>
                                        {fcnt} : {ucnt} : {rcnt}
                                    </div>
                                </div>
                                <NavLink to={`/books/update/${bid}`}><div className='my-3'><Button size='sm' className='mt-2 px-5'>정보수정</Button></div></NavLink>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <hr />
                                <div>{contents}</div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default BookRead