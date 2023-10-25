import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Table, Spinner, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

const LocalSearch = () => {
    const [locals, setLocals] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const navigator = useNavigate();
    const [total, setTotal] = useState(0);
    const [end, setEnd] = useState(false);
    const [query, setQuery] = useState(search.get("query"));
    const ref_txt = useRef(null);
    let page = parseInt(search.get("page"));
    // console.log(page);
    const getLocal = async () => {
        const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}&size=5&page=${page}`;
        const config = {
            headers: {
                "Authorization": "KakaoAK d27ccec046d9726791715798429e0d53"
            }
        }
        setLoading(true);
        const res = await axios.get(url, config);
        console.log(res.data);
        setLocals(res.data.documents);
        setTotal(res.data.meta.pageable_count); //검색 수
        setEnd(res.data.meta.is_end); //마지막 페이지 
        setLoading(false);
    }
    const onSubmit = (e) => {
        e.preventDefault();
        navigator(`/local?page=1&query=${query}`)
        ref_txt.current.focus();
    }
    useEffect(() => {
        getLocal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])

    return (
        <div className='my-5'>
            <style type="text/css">
                {`
                .btn {
                    background-color: blueviolet;
                    color: white;
                    border: none;
                    &.active{
                        background-color: purple;
                    }
                    &:hover{
                        background-color: indigo;
                    }
                    &:disabled{
                        background-color: blueviolet;
                    }
                }
                `}
            </style>
            <h1 className='text-center'>지역검색</h1>
            {loading ?
                <div className='text-center'>
                    <Spinner variant='primary' />
                    <h5>로딩중...</h5>
                </div>
                :
                <>
                    <div>
                        <Row className='mb-3'>
                            <Col xs={4}>
                                <form onSubmit={onSubmit}>
                                    <InputGroup>
                                        <Form.Control ref={ref_txt} onChange={(e)=>setQuery(e.target.value)} value={query}/>
                                        <Button type='submit'>검색</Button>
                                    </InputGroup>
                                </form>
                            </Col>
                            <Col className='text-end'>
                                검색 결과 : {total}
                            </Col>
                        </Row>
                    </div>
                    <Table>
                        <thead>
                            <tr>
                                <td>지역명</td>
                                <td>주소</td>
                                <td>전화번호</td>
                            </tr>
                        </thead>
                        <tbody>
                            {locals.map(local =>
                                <tr key={local.id}>
                                    <td>{local.id}:{local.place_name}</td>
                                    <td>{local.address_name}</td>
                                    <td>{local.phone}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    {((Math.ceil(total / 5)) > 1 && !loading) &&
                        <div className='text-center'>
                            <Button onClick={() => navigator(`/local?page=${page - 1}&query=${query}`)} disabled={page === 1}>이전</Button>
                            <span className='mx-3'>{page}/{Math.ceil(total / 5)}</span>
                            <Button onClick={() => navigator(`/local?page=${page + 1}&query=${query}`)} disabled={end}>다음</Button>
                        </div>
                    }
                </>
            }
        </div>
    )
}

export default LocalSearch