import React, { useEffect, useState } from 'react'
import { Button, Spinner, Table } from 'react-bootstrap';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const getPosts = () => {
        setLoading(true);
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(json => {
                const start=(page-1)*10+1;
                const end=page*10;
                let newJson=json.filter(j=>j.id>=start && j.id<=end);
                newJson = newJson.map(j=>j && {...j, show:false})
                console.log(newJson);
                setPosts(newJson);
                setLoading(false);
            })
    }
    const onClickTitle = (id) => {
        const newPosts=posts.map(p=>p.id===id ? {...p, show:!p.show} : p);
        setPosts(newPosts);
    }

    useEffect(()=>{
        getPosts();
    }, [page]);

    if(loading) return(
        <div className='text-center my-5'>
            <Spinner variant='secondary'/>
            <h5>로딩중...</h5>
        </div>
    )

    return (
        <div className='m-5'>
            <style type="text/css">
                {`
                .btn {
                    background-color: purple;
                    color: white;
                    border: none;
                }
                .btn:hover{
                    background-color: violet;
                    color: gray;
                }
                .btn:disabled{
                    background-color: purple;
                }
                .btn:active{
                    background-color: violet;
                }
                `}
            </style>
            <h1 className='text-center my-5'>Posts</h1>
            <Table bordered hover>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Title</td>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post=>
                    <tr key={post.id}>
                        <td>{post.id}</td>
                        <td>
                            <div style={{color:'red', cursor:'pointer'}} onClick={()=>onClickTitle(post.id)}>
                                {post.title}
                            </div>
                            {post.show && <div>{post.body}</div>}
                        </td>
                    </tr>
                    )}
                </tbody>
            </Table>
            <div className='text-center'>
                <Button onClick={()=>setPage(page-1)} disabled={page===1}>이전</Button>
                <span className='mx-3'>{page}/10</span>
                <Button onClick={()=>setPage(page+1)} disabled={page===10}>다음</Button>
            </div>
        </div>
    )
}

export default Posts