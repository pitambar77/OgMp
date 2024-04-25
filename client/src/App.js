import {BrowserRouter , Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedPage from './components/ProtectedPage';
import About from './pages/About';
import Spinner from './components/Spinner';
import { useSelector } from 'react-redux';
import Profile from './pages/Profile/Profile';
import Admin from './pages/Admin/Admin';
import ProductInfo from './pages/ProductInfo';


function App() {

  const {loading} = useSelector(state =>state.loaders);

  return (
    <div>
    
    { loading && <Spinner/>}
      <BrowserRouter>
      
        <Routes>
          <Route path='/' element={<ProtectedPage><Home/></ProtectedPage>}/>
          <Route path='/product/:id' element={<ProtectedPage><ProductInfo/></ProtectedPage>}/>
          <Route path='/profile' element={<ProtectedPage><Profile/></ProtectedPage>}/>
          <Route path='/admin' element={<ProtectedPage><Admin/></ProtectedPage>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/about' element={<About/>}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
