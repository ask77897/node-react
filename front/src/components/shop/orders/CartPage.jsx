import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import OrderPage from './OrderPage'
import { useLocation, useNavigate } from 'react-router-dom'
import { Alert, Button, Col, Row, Spinner, Table } from 'react-bootstrap'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { BoxContext } from '../BoxContext'

const CartPage = () => {
    const { setBox } = useContext(BoxContext)
    const location = useLocation();
    //console.log(location)
    const pathname = location.pathname;
    const search = new URLSearchParams(location.search);
    //console.log(search);
    const show = search.get("show") ? search.get("show") : "cart";
    //console.log(show)
    const navi = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sum, setSum] = useState(0);
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);

    const onClickOrder = () => {
        if(count===0){
            setBox({
                show:true,
                message:'주문할 상품을 선택헤주세요.'
            })
        }else{
            navi(`${pathname}?show=order`)
        }
    }
    const getCart = async () => {
        setLoading(true);
        const res = await axios.get(`/cart/list.json?uid=${sessionStorage.getItem("uid")}`);
        let list = res.data.list;
        list = list.map(book => book && { ...book, checked: false })
        //console.log(list);
        setBooks(list);
        let sum = 0;
        let total = 0;
        list.forEach(book => {
            sum += book.sum;
            total += book.qnt;
        });
        setSum(sum)
        setTotal(total)
        setLoading(false);
    }
    const onDelete = (cid) => {
        setBox({
            show: true,
            message: `${cid}번 상품을  삭제하시겠습니까?`,
            action: async () => {
                await axios.post('/cart/delete', { cid })
                getCart();
            }
        })
    }
    const onChange = (e, cid) => {
        const list = books.map(book => book.cid === cid ? { ...book, qnt: e.target.value } : book)
        setBooks(list)
    }
    const onUpdate = (cid, qnt) => {
        setBox({
            show: true,
            message: `수량을 ${qnt}로 변경하시겠습니까?`,
            action: async () => {
                await axios.post('/cart/update', { cid, qnt });
                getCart();
            }
        })
    }
    const onChangeAll = (e) => {
        const list = books.map(book => book && { ...book, checked: e.target.checked });
        setBooks(list);
    }
    const onChangeSingle = (e, cid) => {
        const list = books.map(book => book.cid === cid ? { ...book, checked: e.target.checked } : book);
        setBooks(list);
    }
    const onDeleteChecked = () => {
        if (count === 0) {
            setBox({
                show: true,
                message: '삭제할 상품을 선택해주세요.'
            })
        } else {
            setBox({
                show: true,
                message: `${count}개의 상품을 삭제하시겠습니까?`,
                action: async () => {
                    for (const book of books) {
                        if (book.checked) {
                            await axios.post('/cart/delete', { cid: book.cid });
                        }
                    }
                    getCart();
                }
            })
        }
    }

    useEffect(() => {
        getCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        let count = 0;
        books.forEach(book => book.checked && count++);
        setCount(count);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [books])

    if (loading) return <div className='text-center my-5'><Spinner /></div>
    return (
        <>
            {show === 'cart' ?
                <div className='my-5'>
                    <h1 className='text-center mb-5'>장바구니</h1>
                    <div className='mb-2'>
                        <Button variant='danger' size='sm' onClick={onDeleteChecked}>선택상품삭제</Button>
                    </div>
                    <Table striped bordered>
                        <thead>
                            <tr className='text-center'>
                                <th><input checked={books.length === count} type='checkbox' onChange={onChangeAll} /></th>
                                <th>ID</th>
                                <th>제목</th>
                                <th>가격</th>
                                <th>수량</th>
                                <th>합계</th>
                                <th>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(book =>
                                <tr key={book.cid}>
                                    <td className='text-center'><input type='checkbox' onChange={(e) => onChangeSingle(e, book.cid)} checked={book.checked} /></td>
                                    <td>{book.cid}</td>
                                    <td><div className='ellipsis'>[{book.bid}]{book.title}</div></td>
                                    <td className='text-end'>{book.fmtprice}원</td>
                                    <td className='text-end'>
                                        <input value={book.qnt} onChange={(e) => onChange(e, book.cid)} size={2} className='text-end' />
                                        <Button size='sm ms-1' onClick={() => onUpdate(book.cid, book.qnt)}>변경</Button>
                                    </td>
                                    <td className='text-end'>{book.fmtsum}원</td>
                                    <td className='text-center'><RiDeleteBin5Line className='delete' onClick={() => onDelete(book.cid)} /></td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <Alert>
                        <Row>
                            <Col>전체 상품 수 : {total}권</Col>
                            <Col className='text-end'>총 합계 금액 : {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</Col>
                        </Row>
                    </Alert>
                    <div className='text-center'>
                        {books.length > 0 &&
                            <Button className='px-5' onClick={onClickOrder}>주문하기</Button>
                        }
                        <Button variant='secondary' className='ms-2 px-5'>쇼핑계속하기</Button>
                    </div>
                </div>
                :
                <OrderPage books={books}/>
            }
        </>
    )
}

export default CartPage