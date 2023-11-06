import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Spinner, Table } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom'
import Pagination from 'react-js-pagination'
import '../Pagination.css'
import OrderModal from './OrderModal';

const OrderList = () => {
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const navi = useNavigate();
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const page = search.get("page") ? parseInt(search.get("page")) : 1;
    const size = 3;
    const getPurchase = async () => {
        setLoading(true);
        const res = await axios(`/orders/list/purchase.json?uid=${sessionStorage.getItem("uid")}&page=${page}&size=${size}`);
        //console.log(res.data);
        setList(res.data.list);
        setTotal(res.data.total);
        setLoading(false);
    }
    const onChangePage = (page) => {
        navi(`/orders/list?page=${page}`);
    }

    useEffect(() => {
        getPurchase();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    if (loading) return <div className='text-center my-5'><Spinner /></div>
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>주문목록</h1>
            <Table bordered striped>
                <thead>
                    <tr className='text-center'>
                        <th>주문번호</th>
                        <th>주문일</th>
                        <th>전화번호</th>
                        <th>배송지</th>
                        <th>금액</th>
                        <th>주문상태</th>
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
                            <td><OrderModal purchase={p} sum={p.fmtsum}/></td>
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

export default OrderList