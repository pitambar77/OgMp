import React, { useState,useEffect } from 'react'
import {  Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../redux/loaderSlice';
import { useParams} from 'react-router-dom';
import { GetAllBids, GetProductById } from '../apicalls/products';
import Divider from '../components/Divider';
import moment from 'moment';
import BidModal from './ProductInfo/BidModal';


const ProductInfo = () => {

    const {user} = useSelector((state) =>state.users);

    const [showAddNewBid, setShowAddNewBid] = useState(false);

    const [selectedImageIndex , setSelectedImageIndex] = useState(0);

    const [product, setProduct] = useState(null);
   

    const dispatch = useDispatch();
    const {id} = useParams();
    const getData = async () =>{
        try {
          dispatch(SetLoader(true));
          const response = await GetProductById(id);
          dispatch(SetLoader(false));
          if(response.success){
            const bidsResponse = await GetAllBids({product:id});
            setProduct({
              ...response.data,
              bids:bidsResponse.data
            });
          }
        } catch (error) {
          dispatch(SetLoader(false));
          message.error(error.message);
        }
      }
    
      useEffect(()=>{
        getData();
      },[]);

  return ( product &&
    <div>
        <div className="grid grid-cols-2 gap-10  p-5" >
            {/*images*/}
            <div className=' flex flex-col gap-5'>
                <img src={product.image[selectedImageIndex]} alt=''
                    className=' w-full h-96  rounded-sm'
                />

                <div className=' flex gap-3'>
                    {product.image.map((images,index) =>{
                        return(
                            <img className= {" w-20 h-20 object-cover rounded-md cursor-pointer " + (selectedImageIndex === index ? "border border-green-700 border-dashed p-2" : " ")}
                            onClick={() =>setSelectedImageIndex(index)}
                            src={images}
                            alt=''/>
                        )
                    })}
                </div>

                  <Divider/>

                <div className=' text-gray-600' >
                    <h1 >Added On</h1>
                    <span >{moment(product.createdAt).format("MMM D , YYYY hh:mm A")}</span>
                </div>

            </div>
            {/*details*/}
            <div className=' flex flex-col gap-3'>
                  <div>
                    <h1 className=' text-2xl font-semibold'>{product.name}</h1>
                    <span>{product.description}</span>
                  </div>
                <Divider/>
                <div className=' flex flex-col'>
                  <h1 className=' text-2xl font-semibold'>Product Details</h1>
                  <div className=' flex justify-between mt-2 '>
                    <span>Price</span>
                    <span>$ {product.price}</span>
                  </div>
                  <div className=' flex justify-between mt-2  '>
                    <span className=''>Category</span>
                    <span className=' uppercase'> {product.category}</span>
                  </div>
                  <div className=' flex justify-between mt-2 '>
                    <span>Bill Available</span>
                    <span> {product.billAvailable ? "Yes" : "No"}</span>
                  </div>
                  <div className=' flex justify-between mt-2 '>
                    <span>Box Available</span>
                    <span>{product.boxAvailable ? "Yes" : "No"}</span>
                  </div>
                  <div className=' flex justify-between mt-2 '>
                    <span>Accessories Available</span>
                    <span>{product.accessoriesAvailable ? "Yes" : "No"}</span>
                  </div>
                  <div className=' flex justify-between mt-2 '>
                    <span>Warranty Available</span>
                    <span>{product.warrantyAvailable ? "Yes" : "No"}</span>
                  </div>
                  <div className=' flex justify-between mt-2 '>
                    <span>Purchased Year</span>
                    <span>{moment().subtract(product.age, 'years').format('YYYY')}({product.age} years ago)</span>
                  </div>
                </div>
                <Divider/>
                <div className=' flex flex-col'>
                  <h1 className=' text-2xl font-semibold'>Seller Details</h1>
                  <div className=' flex justify-between mt-2 '>
                    <span>Name</span>
                    <span> {product.seller.name}</span>
                  </div>
                  <div className=' flex justify-between mt-2  '>
                    <span className=''>Email</span>
                    <span > {product.seller.email}</span>
                  </div>
                </div>
                <Divider/>
              <div className=' flex flex-col'>
                <div className=' flex justify-between mb-3'>
                  <h1 className=' text-2xl font-semibold'>Bids</h1>
                  <Button onClick={()=>setShowAddNewBid(!showAddNewBid)}
                    disabled = {user._id === product.seller._id}
                  >
                    New Bid
                  </Button>
                </div>
                { product.showBidsOnProductPage &&
                 product?.bids?.map((bid) => {
                  return <div className=' border border-gray-300 border-solid rounded p-3 mt-4'>
                      <div className=' flex justify-between text-gray-500 '>
                        <span className=''>Name</span>
                        <span>{bid.buyer.name}</span>
                      </div>
                      <div className=' flex justify-between text-gray-500 '>
                        <span className=''>Bid Amount</span>
                        <span>{bid.bidAmount}</span>
                      </div>
                      <div className=' flex justify-between text-gray-500 '>
                        <span className=''>Bid Place On</span>
                        <span>{moment(bid.createdAt).format(" MMM D ,YYYY hh:mm A")}</span>
                      </div>
                  </div>
                })}
              </div>
            </div>
             
        </div>
        {showAddNewBid && <BidModal
          product={product}
          reloadData={getData}
          showBidModal={showAddNewBid}
          setShowBidModal={setShowAddNewBid}
         />}
    </div>
  )
}

export default ProductInfo