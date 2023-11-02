import './App.css';
import HeaderPage from './components/shop/HeaderPage';
import { Container } from "react-bootstrap"
import RouterPage from './components/shop/RouterPage';
import { useState } from 'react';
import { BoxContext } from './components/shop/BoxContext';
import BoxModal from './components/shop/BoxModal';
// import BookSearch from './components/ex03/BookSearch';
// import RouterPage from './components/ex03/RouterPage';
// import RouterPage from './components/ex02/RouterPage';
// import Posts from './components/ex01/Posts';
// import Todos from './components/ex01/Todos';
// import Product from './components/ex01/Product';
// import Hello from './components/ex01/Hello';
// import Count from './components/ex01/Count';
// import Address from './components/ex01/Address';

const App = () => {
  const background = "/images/header02.png"
  const [box, setBox] = useState({
    show:false,
    message:'',
    action:null
  })
  return (
    <BoxContext.Provider value={{box, setBox}}>
      <Container>
          <img src={background} alt='' width="100%"/>
          <HeaderPage/>
          <RouterPage/>
          {box.show && <BoxModal/>}
      </Container>
    </BoxContext.Provider>
  );
}

export default App;
