import { message } from 'antd';
import React, { useEffect, useState } from 'react'
import { GetProducts } from '../apicalls/products';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../redux/loaderSlice';
import {useNavigate} from 'react-router-dom';
import Divider from '../components/Divider';
import Filters from './Profile/Home/Filters';


const Home = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    status:'approved',
    category:[],
    age:[]
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {user} = useSelector((state)=>state.users);

  const getData = async () =>{
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts(filters);
      dispatch(SetLoader(false));
      if(response.success){
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  }

  // useEffect(()=>{
  //   getData()
  // },[]);

  useEffect(()=>{
    getData();
  },[filters])

  return (
    <div className=' flex gap-4'>
      { showFilters && (<Filters 
        showFilters={setFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        setFilters={setFilters}
       />)}
       <div className=' flex flex-col gap-4 w-full'>
          <div className=' flex gap-4 items-center'>
            {!showFilters && <i className="ri-equalizer-line text-xl cursor-pointer" 
              onClick={() => setShowFilters(!showFilters)}
            ></i>}
            <input type="text" placeholder='Search product here.....' className=' border border-gray-300 rounded border-solid w-full p-2 h-8' />
          </div>
       <div className={`grid gap-4 ${showFilters ?"grid-cols-4":" grid-cols-5"}`}>
      {products?.map((product)=>{
        return <div className=' border border-gray-300 rounded border-solid flex flex-col gap-2 pb-2 cursor-pointer'
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
            <img src={product.image[0]}
                className=' w-full h-56 p-2 rounded-md'
                alt=''
            />
            
            <div className='px-2 flex flex-col'>
              <h1 className=' text-lg font-semibold'>{product.name}</h1>
              <p className=' text-sm'>{product.age} { ' '} {product.age === 1 ? "year" : " years"} old</p>
              <Divider/>
              <span className=' text-xl font-semibold text-green-700'>$ {product.price}</span>
            </div>

        </div>
      })}
     </div>
       </div>
     
    </div>
  )
}

export default Home