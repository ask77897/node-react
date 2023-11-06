import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Form, InputGroup, Row, Spinner, Table } from 'react-bootstrap'
import ModalPostCode from '../users/ModalPostCode';
import { BoxContext } from '../BoxContext'

const OrderPage = ({ books }) => {
    const [loading, setLoading] = useState(false)
    const { setBox } = useContext(BoxContext);
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState(0); //주문할 전체상품 갯수
    const [sum, setSum] = useState(0); //주문할 상품 합계
    const [user, setUser] = useState({
        uid: '',
        uname: '',
        phone: '',
        address1: '',
        address2: ''
    });
    const {uid, uname, phone, address1, address2 } = user;

    const getUser = async () => {
        const res = await axios.get(`/users/read/${sessionStorage.getItem('uid')}`);
        //console.log(res.data);
        setUser(res.data);
    }
    const getCart = () => {
        let list = books.filter(book => book.checked)
        let sum = 0;
        let total = 0;
        list.forEach(book => {
            sum += book.sum;
            total += book.qnt;
        });
        setSum(sum);
        setTotal(total);
    }
    const onChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }
    const onOrder = () => {
        setBox({
            show:true,
            message:'주문을 진행하시겠습니까?',
            action: async()=>{
                setLoading(true)
                const data = {...user, sum, uid};
                //console.log(data)
                const res = await axios.post('/orders/insert/purchase', data)
                const pid = res.data;
                //console.log(pid);
                //주문상품 저장
                for(const order of orders){
                    const data={...order, pid}
                    //console.log(data)
                    await axios.post('/orders/insert', data)
                }
                setBox({
                    show:true,
                    message:'주문이 완료되었습니다.'
                })
                setLoading(false)
                window.location.href="/";
            }
        })
    }

    useEffect(() => {
        getCart();
        getUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        const list = books.filter(book => book.checked)
        setOrders(list);
        //console.log(list)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if(loading) return <div className='text-center my-2'><Spinner/></div>
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>주문하기</h1>
            <Table striped bordered>
                <thead>
                    <tr className='text-center'>
                        <th>제목</th>
                        <th>가격</th>
                        <th>수량</th>
                        <th>합계</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(book =>
                        <tr key={book.cid}>
                            <td><div className='ellipsis'>[{book.bid}]{book.title}</div></td>
                            <td className='text-end'>{book.fmtprice}원</td>
                            <td className='text-end'>{book.qnt}권</td>
                            <td className='text-end'>{book.fmtsum}원</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Alert>
                <Row>
                    <Col>총 주문 수량 : {total}권</Col>
                    <Col className='text-end'>총 주문 합계 : {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</Col>
                </Row>
            </Alert>
            <div className='my-5'>
                <h1 className='text-center mb-5'>주문자 정보</h1>
                <Card className='p-3'>
                    <form>
                        <InputGroup className='mb-3'>
                            <InputGroup.Text>받는이</InputGroup.Text>
                            <Form.Control value={uname} name='uname' onChange={onChange} />
                        </InputGroup>
                        <InputGroup className='mb-3'>
                            <InputGroup.Text>전화번호</InputGroup.Text>
                            <Form.Control value={phone} name='phone' onChange={onChange} />
                        </InputGroup>
                        <InputGroup className='mb-1'>
                            <InputGroup.Text>받을주소</InputGroup.Text>
                            <Form.Control value={address1} name='address1' onChange={onChange} />
                            <ModalPostCode user={user} setUser={setUser} />
                        </InputGroup>
                        <Form.Control placeholder='상세주소' value={address2} name='address2' onChange={onChange} />
                    </form>
                </Card>
                <div className='text-center my-3'>
                    <Button className='px-5' onClick={onOrder}>주문하기</Button>
                </div>
            </div>
        </div>
    )
}

export default OrderPage