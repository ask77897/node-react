import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import { BsBookmarkHeart, BsBookmarkHeartFill } from 'react-icons/bs'
import { RiMessage3Line } from 'react-icons/ri'
import Pagination from 'react-js-pagination'
import './Pagination.css'
import { useNavigate, useLocation, NavLink } from 'react-router-dom'

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const size = 6;
  const location = useLocation();
  const navi = useNavigate();
  const search = new URLSearchParams(location.search);
  const page = search.get("page") ? parseInt(search.get("page")) : 1;
  const path = location.pathname;
  const [query, setQuery] = useState(search.get('query') ? search.get('query') : '');
  const getBooks = async () => {
    const url = `/books/list.json?query=${query}&page=${page}&size=${size}&uid=${sessionStorage.getItem("uid")}`;
    setLoading(true);
    const res = await axios(url);
    //console.log(res);
    setBooks(res.data.list);
    setTotal(res.data.total)
    setLoading(false);
  }
  const onChangePage = (page) => {
    navi(`${path}?query=${query}&page=${page}`)
  }
  const onSubmit = (e) => {
    e.preventDefault();
    navi(`${path}?query=${query}&page=${page}`)
  }
  const onClickHeeart = async (bid) => {
    if (sessionStorage.getItem("uid")) {
      await axios.post('books/insert/favorite', { uid: sessionStorage.getItem('uid'), bid: bid });
      getBooks();
    } else {
      navi('/users/login')
    }
  }
  const onClickFillHeart = async (bid) => {
    await axios.post('books/delete/favorite', { uid: sessionStorage.getItem('uid'), bid: bid });
    getBooks();
  }

  useEffect(() => {
    getBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  if (loading) return <div className='text-center my-5'><Spinner /></div>
  return (
    <div className='my-5'>
      <Row className='mb-3'>
        <Col md={4}>
          <form onSubmit={onSubmit}>
            <InputGroup>
              <Form.Control value={query} placeholder='검색검색' onChange={(e) => setQuery(e.target.value)} />
              <Button type='submit'>검색</Button>
            </InputGroup>
          </form>
        </Col>
        <Col className='mt-2'>검색 결과 : {total}권</Col>
      </Row>
      <Row>
        {books.map(book =>
          <Col xs={6} md={4} lg={2}  key={book.bid}>
            <Card>
              <Card.Body>
                <NavLink to={`/books/info/${book.bid}`}>
                  <img src={book.image || 'http://via.placeholder.com/170x250'} alt='' width='90%' />
                </NavLink>
                <div className='ellipsis'>{book.title}</div>
              </Card.Body>
              <Card.Footer className='text-end'>
                <span>
                  <span className='heart'>{book.ucnt === 0 ? <BsBookmarkHeart onClick={() => onClickHeeart(book.bid)} /> : <BsBookmarkHeartFill onClick={() => onClickFillHeart(book.bid)} />}</span>
                  <small className='ms-1'>{book.fcnt}</small>
                </span>
                {book.rcnt === 0 ||
                  <span>
                    <RiMessage3Line />
                    <small>{book.rcnt}</small>
                  </span>
                }
              </Card.Footer>
            </Card>
          </Col>
        )}
      </Row>
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

export default HomePage