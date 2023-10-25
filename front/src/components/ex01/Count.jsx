import React, { useState } from 'react'
import '../../App.css'

const Count = () => {
    // const buttonStyle={
    //     background:'purple',
    //     fontSize:30,
    //     color:'white',
    //     cursor:'pointer'
    // }
    const [count, setCount] = useState(0);

    return (
        <div className='count'>
            {/* <button className='button' onClick={()=>setCount(count-10)}>10감소</button> */}
            <button className='button' onClick={()=>setCount(count-1)}>감소</button>
            <span className='text'>{count}</span>
            <button className='button' onClick={()=>setCount(count+1)}>증가</button>
            {/* <button className='button' onClick={()=>setCount(count+10)}>10증가</button> */}
        </div>
    )
}

export default Count