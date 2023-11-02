import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Alert, Button, Col, Row, Spinner, Table } from 'react-bootstrap'
import Pagination from 'react-js-pagination'
import '../Pagination.css'
import {RiDeleteBin6Line} from 'react-icons/ri'
import { BoxContext } from '../BoxContext'

const CartPage = () => {
    const size = 5;
    const {setBox} = useContext(BoxContext)
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [total, setTotal] = useState(0);
    const [sum, setSum] = useState(0);
    const getCart = async () => {
        setLoading(true);
        const res = await axios.get(`/cart/list.json?uid=${sessionStorage.getItem("uid")}&page=${page}&size=${size}`);
        console.log(res.data);
        setBooks(res.data.list);
        setTotal(res.data.total);
        const res1 = await axios.get(`/cart/sum?uid=${sessionStorage.getItem("uid")}`);
        setSum(res1.data.fmtsum);
        setLoading(false);
    }
    useEffect(() => {
        getCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);
    const onChangePage = (page) => {
        setPage(page);
    }
    const onClickDelete = (cid) => {
        setBox({
            show:true,
            message:`${cid}번 상품을 삭제하시겠습니까?`,
            action:async()=>{
                await axios.post('/cart/delete', {cid});
                if(page===1){
                    getCart();
                }else{
                    setPage(1);
                }
            }
        })
    }
    const onClickUpdate = (cid, qnt) => {
        setBox({
            show:true,
            message:`${cid}번 수량을 ${qnt}로 변경하시겠습니까?`,
            action:async()=>{
                await axios.post('/cart/update', {cid, qnt});
                getCart();
            }
        })   
    }
    const onChange = (e, cid) => {
        setBooks(books.map(book=>book.cid===cid ? {...book, qnt:e.target.value} : book));
    }

    if (loading) return <div className='text-center my-5'><Spinner /></div>
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>주문목록</h1>
            <Table>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td colSpan={2}>제목</td>
                        <td>가격</td>
                        <td>수량</td>
                        <td>합계</td>
                        <td>삭제</td>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book =>
                        <tr key={book.bid}>
                            <td>{book.cid}</td>
                            <td><img src={book.image || 'http://via.placeholder.com/170x250'} alt='' width={30} /></td>
                            <td>{book.title}</td>
                            <td className='text-end'>{book.fmtprice}원</td>
                            <td>
                                <input onChange={(e)=>onChange(e, book.cid)} value={book.qnt} size={2} className='text-end'/>
                                <Button size='sm ms-1' onClick={()=>onClickUpdate(book.cid, book.qnt)}>변경</Button>
                            </td>
                            <td>{book.fmtsum}</td>
                            <td><RiDeleteBin6Line className='delete' onClick={()=>onClickDelete(book.cid)}/></td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Alert>
                <Row>
                    <Col>주문상품수량 : {total}</Col>
                    <Col className='text-end'>총 상품금액 : {sum}원</Col>
                </Row>
            </Alert>
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

export default CartPage