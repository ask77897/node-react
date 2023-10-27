import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, Form, InputGroup, Row, Spinner, Table } from 'react-bootstrap';
import Pagination from 'react-js-pagination'
import '../Pagination.css'

const BookList = () => {
    const size = 5;
    const location = useLocation();
    const navi = useNavigate();
    const path = location.pathname;
    const search = new URLSearchParams(location.search);
    const page = search.get("page") ? parseInt(search.get("page")) : 1;
    const [query, setQuery] = useState(search.get('query') ? search.get("query") : "");
    // console.log(path, query, page, size);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const getBooks = async () => {
        const url = `/books/list.json?query=${query}&page=${page}&size=${size}`;
        setLoading(true);
        const res = await axios(url);
        // console.log(res);
        setBooks(res.data.list);
        setTotal(res.data.total);
        setLoading(false);
    }
    useEffect(() => {
        getBooks();
    }, [location]);
    const onChangePage = (page) => {
        navi(`${path}?page=${page}&query=${query}&size=${size}`);
        // console.log(page);
    }
    const onSubmit = (e) => {
        e.preventDefault();
        navi(`${path}?page=1&query=${query}&size=${size}`);
    }
    const onDelete = async(bid) => {
        if(!window.confirm(`${bid}번 도서를 삭제하시겠습니까?`)) return;
        const res = await axios.post('/books/delete', {bid});
        if(res.data==0){
            alert("삭제 실패");
        }else{
            alert("삭제 성공");
            getBooks();
        }
    }
    if (loading) return <div className='text-center my-5'><Spinner /></div>
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>도서목록</h1>
            <Row>
                <Col md={4}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control value={query} onChange={(e) => setQuery(e.target.value)} />
                            <Button type='submit'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
                <Col className='text-end'>
                    검색 결과 : {total}권
                </Col>
            </Row>
            <Table striped>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>이미지</th>
                        <th>제목</th>
                        <th>저자</th>
                        <th>가격</th>
                        <th>등록일</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book =>
                        <tr key={book.bid}>
                            <td>{book.bid}</td>
                            <td><img src={book.image || "http://via.placeholder.com/170x250"} width="30" /></td>
                            <td width="30%"><div className='ellipsis'>{book.title}</div></td>
                            <td width="20%"><div className='ellipsis'>{book.authors}</div></td>
                            <td>{book.fmtprice}</td>
                            <td>{book.fmtdate}</td>
                            <td><Button size='sm' variant='danger' onClick={()=>onDelete(book.bid)}>삭제</Button></td>
                        </tr>)}
                </tbody>
            </Table>
            {total > size &&
                <Pagination
                    activePage={page}
                    itemsCountPerPage={size}
                    totalItemsCount={total}
                    pageRangeDisplayed={10}
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={onChangePage} />
            }
        </div>
    )
}

export default BookList