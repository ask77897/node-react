import axios from 'axios';
import React, { useContext, useRef } from 'react'
import { useState } from 'react'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { BoxContext } from '../BoxContext';

const LoginPage = () => {
    const ref_uid = useRef(null);
    const ref_upass = useRef(null);
    const navi = useNavigate();
    const { setBox } = useContext(BoxContext)
    const [form, setForm] = useState({
        uid: 'blue',
        upass: 'pass'
    });
    const { uid, upass } = form;
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        if (uid === '') {
            setBox({
                show: true,
                message: '아이디를 입력해주세요.'
            })
            //alert("아이디를 입력해주세요.");
            ref_uid.current.focus();
        } else if (upass === '') {
            setBox({
                show: true,
                message: '비밀번호를 입력해주세요.'
            })
            //alert("비밀번호를 입력해주세요.");
            ref_upass.current.focus();
        } else {
            const res = await axios.post('/users/login', form)
            //console.log(res);
            if (res.data === 0) {
                setBox({
                    show: true,
                    message: '아이디가 존재하지 않습니다.'
                })
                //alert("아이디가 존재하지 않습니다.");
                ref_uid.current.focus();
            } else if (res.data === 2) {
                setBox({
                    show: true,
                    message: '비밀번호가 일치하지 않습니다.'
                })
                //alert("비밀번호가 일치하지 않습니다.");
                ref_upass.current.focus();
            } else {
                sessionStorage.setItem('uid', uid);
                setBox({
                    show: true,
                    message: '로그인 성공!'
                })
                //alert("로그인 성공!");
                if (sessionStorage.getItem("target")) {
                    navi(sessionStorage.getItem("target"));
                } else {
                    navi('/');
                }
            }
        }
    }

    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>로그인</h1>
            <Row className='justify-content-center'>
                <Col md={6} className='mx-3'>
                    <Card className='p-3'>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>아이디</InputGroup.Text>
                                <Form.Control onChange={onChange} ref={ref_uid} value={uid} name='uid' />
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>비밀번호</InputGroup.Text>
                                <Form.Control onChange={onChange} ref={ref_upass} type='password' value={upass} name='upass' />
                            </InputGroup>
                            <Button className='w-100' type='submit'>로그인</Button>
                        </form>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default LoginPage