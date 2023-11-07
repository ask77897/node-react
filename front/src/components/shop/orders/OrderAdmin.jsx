import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Col, InputGroup, Row, Spinner, Table, Form } from 'react-bootstrap'
import Pagination from 'react-js-pagination'
import '../Pagination.css'
import OrderModal from './OrderModal'
import { BoxContext } from '../BoxContext'

const OrderAdmin = () => {
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState([]);
    const [query, setQuery] = useState('');
    const [total, setTotal] = useState(0);
    const { setBox } = useContext(BoxContext);
    const location = useLocation();
    const navi = useNavigate();
    const search = new URLSearchParams(location.search);
    const page = search.get('page') ? parseInt(search.get('page')) : 1;
    const size = 5;

    const getList = async () => {
        setLoading(true);
        const res = await axios(`/orders/list.json?page=${page}&size=${size}&query=${query}`);
        //console.log(res.data)
        setList(res.data.list);
        setTotal(res.data.total);
        setLoading(false);
    }

    const onChangePage = (page) => {
        navi(`/orders/admin?page=${page}&size=${size}&query=${query}`);
    }
    const onSubmit = (e) => {
        e.preventDefault();
        navi(`/orders/admin?page=1&size=${size}&query=${query}`);
    }
    const onChangeStatus = (e, pid) => {
        const plist = list.map(p => p.pid === pid ? { ...p, status: e.target.value } : p);
        setList(plist);
    }
    const onClickChange = (pid, status) => {
        setBox({
            show: true,
            message: `${pid}번 주문상태를 ${status}로 변경하시겠습니까?`,
                action: async() => {
                    await axios.post('/orders/update', {pid, status});
                    getList();
            }
        })
    }

    useEffect(() => {
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])

    if (loading) return <div className='text-center my-5'><Spinner /></div>
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>주문관리</h1>
            <Row className='mb-2'>
                <Col md={4}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control placeholder='주문자, 주소, 전화번호' value={query} onChange={(e) => setQuery(e.target.value)} />
                            <Button type='submit'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
                <Col className='mt-2'>
                    검색 결과 : {total}건
                </Col>
            </Row>
            <Table bordered striped>
                <thead>
                    <tr className='text-center'>
                        <th>주문번호</th>
                        <th>주문일</th>
                        <th>전화번호</th>
                        <th>배송지</th>
                        <th>금액</th>
                        <th>주문상태</th>
                        <th>상태변경</th>
                        <th>주문상품</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map(p =>
                        <tr key={p.pid} className='text-center'>
                            <td>{p.pid}</td>
                            <td>{p.fmtdate}</td>
                            <td>{p.rphone}</td>
                            <td>{p.raddress1}</td>
                            <td className='text-end'>{p.fmtsum}원</td>
                            <td>{p.str_status}</td>
                            <td>
                                <InputGroup>
                                    <Form.Select value={p.status} onChange={(e) => onChangeStatus(e, p.pid)}>
                                        <option value="0">결제확인중</option>
                                        <option value="1">결제확인</option>
                                        <option value="2">배송준비중</option>
                                        <option value="3">배송중</option>
                                        <option value="4">배송완료</option>
                                        <option value="5">주문완료</option>
                                    </Form.Select>
                                    <Button size='sm' onClick={()=>onClickChange(p.pid, p.status)}>변경</Button>
                                </InputGroup>
                            </td>
                            <td><OrderModal purchase={p} sum={p.fmtsum} /></td>
                        </tr>
                    )}
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

export default OrderAdmin