import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Col, Row, Spinner, Tab, Tabs } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BsBookmarkHeart, BsBookmarkHeartFill } from 'react-icons/bs'
import { RiMessage3Line } from 'react-icons/ri'
import ReviewPage from './ReviewPage';
import { BoxContext } from '../BoxContext';

const BookInfo = () => {
    const navi = useNavigate();
    const { setBox } = useContext(BoxContext)
    const location = useLocation();
    const { bid } = useParams();
    const [book, setBook] = useState("");
    const [loading, setLoading] = useState(false);


    const getBook = async () => {
        setLoading(true);
        const res = await axios(`/books/read/${bid}?uid=${sessionStorage.getItem("uid")}`);
        //console.log(res.data);
        setBook(res.data);
        setLoading(false);
    }
    useEffect(() => {
        getBook();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const onClickHeeart = async (bid) => {
        if (sessionStorage.getItem("uid")) {
            await axios.post('/books/insert/favorite', { uid: sessionStorage.getItem('uid'), bid: bid });
            getBook();
        } else {
            sessionStorage.setItem("target", location.pathname);
            navi('/users/login')
        }
    }
    const onClickFillHeart = async (bid) => {
        await axios.post('/books/delete/favorite', { uid: sessionStorage.getItem('uid'), bid: bid });
        getBook();
    }
    const onClickCart = async () => {
        const res = await axios.post("/cart/insert", { bid, uid: sessionStorage.getItem("uid") });;
        if (res.data === 0) {
            setBox({
                show: true,
                message: res.data === 0 ? `장바구니에 등록되었습니다.\n쇼핑을 계속 하시겠습니까?` : `이미 장바구니에 존재합니다.\n쇼핑을 계속 하시겠습니까?`,
                action: () => {
                    location.href = "/"
                }
            })
        }
    }


    //console.log(bid);
    if (loading) return <div className='text-center my-5'><Spinner /></div>
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>도서정보</h1>
            <Card className='p-3'>
                <Row>
                    <Col xs={5} md={4} lg={3} className='align-self-center'>
                        <img src={book.image} alt='' width="90%" />
                    </Col>
                    <Col className='ms-3'>
                        <h5 className='ellipsis'>{book.title}</h5>
                        <hr />
                        <div className='mb-2'>가격 : {book.fmtprice}</div>
                        <div className='ellipsis mb-1'>저자 : {book.authors}</div>
                        <div className='ellipsis mb-1'>출판사 : {book.publisher}</div>
                        <div className='ellipsis mb-1'>등록일 : {book.fmtdate}</div>
                        <div className='ellipsis'>ISBN : {book.isbn}</div>
                        <hr />
                        <span className='ms-3'>
                            <span className='heart'>{book.ucnt === 0 ?
                                <BsBookmarkHeart onClick={() => onClickHeeart(book.bid)} />
                                :
                                <BsBookmarkHeartFill onClick={() => onClickFillHeart(book.bid)} />}
                            </span>
                            <span className='ms-1'>{book.fcnt}</span>
                        </span>
                        {book.rcnt === 0 ||
                            <span>
                                <RiMessage3Line />
                                <small>{book.rcnt}</small>
                            </span>
                        }
                        <hr />
                        {sessionStorage.getItem("uid") &&
                            <div>
                                <Button variant='secondary' className='me-2' onClick={onClickCart}>장바구니</Button>
                                <Button>바로구매</Button>
                            </div>
                        }
                    </Col>
                </Row>
            </Card>
            {/*상세설명 / 리뷰 탭*/}
            <div className='my-5'>
                <Tabs
                    defaultActiveKey="home"
                    transition={false}
                    id="noanim-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="home" title="상세설명">
                        <div className='px-5'>{book.contents}</div>
                    </Tab>
                    <Tab eventKey="profile" title="리뷰">
                        <ReviewPage location={location} setBook={setBook} book={book} />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default BookInfo