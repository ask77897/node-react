import React from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const NavigatePage = () => {
    const navigator = useNavigate();
    return (
        <div>
            <Button onClick={()=>navigator(-1)}>뒤로가기</Button>
            <Button onClick={()=>navigator('/')}>홈으로가기</Button>
            <Button onClick={()=>navigator('/profiles')}>profiles</Button>
        </div>
    )
}

export default NavigatePage