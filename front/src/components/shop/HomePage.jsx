import axios from 'axios';
import React, { useEffect } from 'react'

const HomePage = () => {
  const getBooks = async() => {
    const url = `/books/list.json?query=자바&page=1&size=10`;
    const res = await axios(url);
    console.log(res);
  }
  useEffect(()=>{
    getBooks();
  },[]);
  return (
    <div className='my-5'>
      <h1 className='text-center mb-5'>Home Page</h1>
    </div>
  )
}

export default HomePage