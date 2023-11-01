import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
    const [chcnt, setChcnt] = useState(0);
    const getBooks = async () => {
        const url = `/books/list.json?query=${query}&page=${page}&size=${size}`;
        setLoading(true);
        const res = await axios(url);
        // console.log(res);
        let list = res.data.list;
        list = list.map(book=>book && {...book, checked:false})
        setBooks(list);
        setTotal(res.data.total);
        setLoading(false);
    }
    useEffect(() => {
        getBooks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);
    useEffect(()=>{
        let cnt = 0;
        books.forEach(book=>book.checked && cnt++);
        setChcnt(cnt);
    }, [books])
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
        if(res.data===0){
            alert("삭제 실패");
        }else{
            alert("삭제 성공");
            navi(`${path}?page=1&query=${query}&size=${size}`);
        }
    }
    const onChangeAll = (e) => {
        const list = books.map(book=>book && {...book, checked:e.target.checked})
        setBooks(list);
    }
    const onChangeSingle = (e, isbn) => {
        const list = books.map(book=>book.isbn===isbn ? {...book, checked:e.target.checked} : book)
        setBooks(list);
    }
    const onClickDelete = () => {
        if(chcnt===0){
            alert("삭제할 도서를 선택하세요.")
        }else{
            if(window.confirm(`${chcnt}권을 삭제하시겠습니까?`)){
                let count = 0;
                books.forEach(async book=>{
                    if(book.checked){
                        const res = await axios.post('/books/delete', {bid:book.bid});
                        if(res.data===1) count++
                    }
                });
                setTimeout(()=>{
                    alert(`${count}권이 삭제되었습니다.`);
                    navi(`${path}?page=1&query=${query}&size=${size}`);
                }, 1000)
            }
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
                <Col className='mt-1'>검색 결과 : {total}권</Col>
                <Col className='text-end'><Button variant='danger' size='sm' onClick={onClickDelete}>선택삭제</Button></Col>
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
                        <th><input type='checkbox' checked={books.length===chcnt} onChange={onChangeAll}/></th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book =>
                        <tr key={book.bid}>
                            <td>{book.bid}</td>
                            <td><img src={book.image || "http://via.placeholder.com/170x250"} alt='' width="30" /></td>
                            <td width="30%">
                                <div className='ellipsis'><NavLink to={`/books/read/${book.bid}`}>{book.title}</NavLink></div>
                                <span>리뷰 수:{book.rcnt}</span>
                                <span>좋아요 수:{book.fcnt}</span>
                            </td>
                            <td width="20%"><div className='ellipsis'>{book.authors}</div></td>
                            <td>{book.fmtprice}</td>
                            <td>{book.fmtdate}</td>
                            <td><Button size='sm' variant='danger' onClick={()=>onDelete(book.bid)}>삭제</Button></td>
                            <td><input type='checkbox' checked={book.checked} onChange={(e)=>onChangeSingle(e, book.isbn)}/></td>
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