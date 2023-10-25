import React, {useState} from 'react'

const Insert = ({onInsert}) => {
  
  const [form, setForm]= useState({
    id:5,
    name:'무기명',
    address:'서울 금천구 가산동'
  })
  const {id, name, address} = form;
  const onSubmit=(e)=>{
      e.preventDefault();
      if(window.confirm("등록하시겠습니까?")){
        onInsert(form);
        setForm({
          id: id+1,
          name:'',
          address:''
        });
      }
  }
  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:e.target.value,
    });
  }
  const onChangeName = (e) => {
    setForm({
      ...form,
      name:e.target.value
    })
  }
  return (
    <div>
        <h1>주소 등록</h1>
        <form onSubmit={(e)=>onSubmit(e)}>
            <span>아이디 : {id}</span>
            <input value={name} name='name' onChange={onChange}/>
            <hr/>
            <input value={address} name='address' onChange={(e)=>onChange(e)}/>
            <hr/>
            <button>등록</button>
            <button type='reset'>취소</button>
        </form>
    </div>
  )
}

export default Insert;