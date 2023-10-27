import './App.css';
import HeaderPage from './components/shop/HeaderPage';
import { Container } from "react-bootstrap"
import RouterPage from './components/shop/RouterPage';
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
  return (
    <Container>
      <div className="App">
        <div>
          <img src={background} width="100%"/>
        </div>
        <HeaderPage/>
        <RouterPage/>
      </div>
    </Container>
  );
}

export default App;
