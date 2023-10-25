import React, { useState } from 'react'
import { Button, Table, Form, InputGroup } from 'react-bootstrap';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';

const Product = () => {
    const [products, setProducts] = useState([
        { "id": 1, "name": "냉장고", "price": 100 },
        { "id": 2, "name": "세탁기", "price": 80 },
        { "id": 3, "name": "건조기", "price": 80 }
    ]);
    const [form, setForm] = useState({
        id: 4,
        name: '',
        price: 0
    });
    const { id, name, price } = form;
    const onInsert = (e) => {
        e.preventDefault();
        setProducts(products.concat(form));
        alert("저장")
        setForm({
            id: id + 1,
            name: '',
            price: 0
        })
    }
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }
    return (
        <div className='p-5'>
            <style type="text/css">
                {`
                .btn-flat {
                background-color: purple;
                color: white;
                }
                `}
            </style>
            <h1 className='text-center mb-5'>상품관리</h1>
            <div>
                <form onSubmit={onInsert}>
                    <h3>아이디 : {id}</h3>
                    <InputGroup className='mb-2'>
                        <InputGroupText>상품명</InputGroupText>
                        <Form.Control value={name} onChange={onChange} name='name' />
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroupText>상품가격</InputGroupText>
                        <Form.Control value={price} onChange={onChange} name='price' />
                    </InputGroup>
                    <Button variant='flat'>등록</Button>
                </form>
            </div>
            <hr />
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>아이디</th>
                        <th>상품명</th>
                        <th>상품가격</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p =>
                        <tr key={p.id}>
                            <td className='py-2'>{p.id}</td>
                            <td>{p.name}</td>
                            <td>{p.price}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default Product