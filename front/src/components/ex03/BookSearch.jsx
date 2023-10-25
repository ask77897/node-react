import React, { useRef } from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Table } from 'react-bootstrap';
import Book from './Book';

const BookSearch = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [last, setLast] = useState(1);
    const [end, setEnd] = useState(false);
    const [query, setQuery] = useState('노드');
    const ref_txt = useRef(null);
    const getBooks = async () => {
        const url = `https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=5&page=${page}`;
        const config = {
            headers: {
                "Authorization": "KakaoAK d27ccec046d9726791715798429e0d53"
            }
        }
        setLoading(true);
        const res = await axios.get(url, config);
        // console.log(res);
        setLast(Math.ceil(res.data.meta.pageable_count/5));
        setBooks(res.data.documents);
        setEnd(res.data.meta.is_end);
        setLoading(false);
    }

    useEffect(() => {
        getBooks();
    }, [page]);

    const onChange = (e) => {
        setQuery(e.target.value);
    }
    const onSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        getBooks();
        ref_txt.current.focus();
    }

    //if (loading) return <h1 className='text-center my-5'>로딩중...</h1>

    return (
        <div className='my-5'>
            <style type="text/css">
                {`
                .btn {
                    background-color: blueviolet;
                    color: white;
                    border: none;
                    &.active{
                        background-color: purple;
                    }
                    &:hover{
                        background-color: indigo;
                    }
                    &:disabled{
                        background-color: blueviolet;
                    }
                }
                `}
            </style>
            <h1 className='text-center mb-5'>도서검색</h1>
            <Row className='mb-3'>
                <Col md={4}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control ref={ref_txt} value={query} onChange={onChange}/>
                            <Button type='submit'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
            </Row>
            <Table striped>
                <thead>
                    <tr>
                        <th>이미지</th>
                        <th>제목</th>
                        <th>가격</th>
                        <th>저자</th>
                        <th>상세보기</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? 
                        <tr><td colSpan={5}><div>로딩중...</div></td></tr>
                        :
                        books.map(book=><Book key={book.isbn} book={book}/>)
                    }
                </tbody>
            </Table>
            {(last > 1 && !loading) && 
                <div className='text-center'>
                    <Button onClick={()=>setPage(page-1)} disabled={page===1}>이전</Button>
                    <span className='mx-3'>{page} / {last}</span>
                    <Button onClick={()=>setPage(page+1)} disabled={end}>다음</Button>
                </div>
            }
        </div>
    )
}

export default BookSearch