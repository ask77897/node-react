import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Button, Card, Col, Row, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const MyPage = () => {
  const navi = useNavigate();
  const ref_file = useRef(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    uid: '',
    upass: '',
    uname: '',
    photo: '',
    phone: '',
    address1: '',
    address2: '',
    fmtdate: '',
    fmtmodi: '',
    file: null
  });
  const { uid,/* upass,*/ uname, photo, phone, address1, address2, fmtdate, fmtmodi, file } = user;
  const getUser = async () => {
    setLoading(true);
    const res = await axios.get(`/users/read/${sessionStorage.getItem("uid")}`);
    console.log(res.data);
    setUser(res.data);
    setLoading(false);
  }
  const onChangeFile = (e) =>{
    setUser({
      ...user,
      photo:URL.createObjectURL(e.target.files[0]),
      file:e.target.files[0]
    })
  }

  const onUpdatePhoto = async() => {
    if(!file){
      alert("수정할 사진을 선택해주세요.");
    }else{
      if(window.confirm("사진을 수정하시겠습니까?")){
        //사진저장
        const formData = new FormData();
        formData.append("file", file);
        formData.append("uid", uid);
        await axios.post('/users/update/photo', formData);
        alert("사진이 변경되었습니다.")
      }
    }
  }

  useEffect(() => {
    getUser();
  }, [])

  if (loading) return <div className='my-5 text-center'><Spinner /></div>
  return (
    <div className='my-5'>
      <h1 className='text-center mb-5'>My Page</h1>
      <Row className='justify-content-center mx-3'>
        <Col md={6}>
          <Card className='p-5'>
            <div>
              <img src={photo || 'http://via.placeholder.com/200x200'} alt='' onClick={()=>ref_file.current.click()} width="200" className='photo'/>
              <input type='file'onChange={onChangeFile} ref={ref_file} style={{display:"none"}}/>
              <br />
              <Button size='sm' className='mt-2' onClick={onUpdatePhoto}>이미지수정</Button>
              <hr />
            </div>
            <div>
              <div>이름 : {uname}</div>
              <div>전화 : {phone}</div>
              <div>주소 : {address1} {address2}</div>
              <div>가입일 : {fmtdate}</div>
              <div>수정일 : {fmtmodi}</div>
              <hr />
              <Button size='sm' onClick={() => navi('/users/update')}>정보수정</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default MyPage