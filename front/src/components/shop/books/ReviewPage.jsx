import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination'
import '../Pagination.css'

const ReviewPage = ({ location }) => {
    const { bid } = useParams();
    const [reviews, setReviews] = useState([]);
    //console.log(pathname);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [contents, setContents] = useState('');
    const size = 3;
    const getReviews = async () => {
        const url = `/review/list.json?page=${page}&size=${size}&bid=${bid}`;
        const res = await axios(url);
        //console.log (res.data)
        let list = res.data.list;
        list = list.map(r => r && { ...r, ellipsis: true });
        setReviews(list);
        setTotal(res.data.total);
    }
    const onClickWrite = () => {
        sessionStorage.setItem('target', location.pathname);
        window.location.href = "/users/login";
    }
    const onChangePage = (page) => {
        setPage(page);
    }
    const onChangeEllipsis = (rid) => {
        const list = reviews.map(r => r.rid === rid ? { ...r, ellipsis: !r.ellipsis } : r);
        setReviews(list);
    }
    const onClickReview = async () => {
        if (contents === "") {
            alert("리뷰를 입력해주세요.");
        } else {
            const res = await axios.post('/review/insert', {
                uid: sessionStorage.getItem("uid"),
                bid,
                contents
            });
            if (res.data === 1) {
                getReviews();
                setContents("");
            }
        }
    }
    const onClickDelete = async(rid) => {
        if(window.confirm("리뷰를 삭제하시겠습니까?")){
            console.log(rid)
            const res = await axios.post('/review/delete', {rid})
            if(res.data===1){
                getReviews();
            }
        }
    }
    useEffect(() => {
        getReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    return (
        <div>
            {!sessionStorage.getItem("uid") ?
                <div><Button className='w-100' onClick={onClickWrite}>리뷰작성</Button></div>
                :
                <div><Form.Control value={contents} onChange={(e) => setContents(e.target.value)} as="textarea" rows={5} placeholder='내용을 입력하세요.' />
                    <div className='text-end mt-2'>
                        <Button className='px-5' onClick={onClickReview}>등록</Button>
                    </div>
                </div>
            }
            {reviews.map(review =>
                <Row key={review.rid} className='mt-5'>
                    <Col xs={2} md={1} className='align-self-center'>
                        <img src={review.photo || "http://via.placeholder.com/100x100"} alt='' width="80%" className='photo' />
                        <div className='small text-center'>{review.uname}</div>
                    </Col>
                    <Col>
                        <div className='small'>{review.fmtdate}</div>
                        <div className={review.ellipsis && 'ellipsis2'} onClick={() => onChangeEllipsis(review.rid)}>[{review.rid}]{review.contents}</div>
                        {sessionStorage.getItem("uid") === review.uid &&
                            <div className='text-end mb-2'>
                                <Button size='sm me-2'>수정</Button>
                                <Button variant='danger' size='sm' onClick={()=>onClickDelete(review.rid)}>삭제</Button>
                            </div>
                        }
                    </Col>
                    <hr />
                </Row>
            )}
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

export default ReviewPage