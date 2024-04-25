import { Table, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { SetLoader } from '../../redux/loaderSlice';
import { GetProducts, UpdateProductStatus } from '../../apicalls/products';

function Products ()  {


    const [products,setProducts] = useState([]);

    const dispatch = useDispatch();

    const getData = async () =>{
      try {
        dispatch(SetLoader(true));
        const response = await GetProducts (null);
        dispatch(SetLoader(false));
        if(response.success){
          setProducts(response.data);
        }
      } catch (error) {
        dispatch(SetLoader)
        message.error(error.message);
        
      }
    }

    const onStatusUpdate = async (id, status) =>{
        try {
          const response = await UpdateProductStatus(id,status);
          if(response.success){
            message.success(response.message);
            getData();

          } else{
            throw new Error(response.message)
          }
        } catch (error) {
          message.error(error.message);
        }
    }

    const columns = [
      {
        title:"Product",
        dataIndex:"images",
        render:(text, record) =>{
          return (<img src={record?.image?.length > 0 ? record.image[0] : ""} alt=''
          className=' w-20 h-20 object-cover rounded-md '
          />)
        }
      },
      {
        title:"Product",
        dataIndex:"name"
      },
      {
        title:"Seller",
        dataIndex:"name",
        render : (text, record) =>{
           return  record.seller.name
        }
      },
      {
        title:"Price",
        dataIndex:"price"
      },
      {
        title:"Category",
        dataIndex:"category"
      },
      {
        title:"Age",
        dataIndex:"age"
      },
      {
        title:"Status",
        dataIndex:"status",
        render:(text, record) =>{
          return record.status.toUpperCase();
        }
      },
      {
        title:"Added On",
        dataIndex:"createdAt",
        render:(text, record) =>
          moment(record.createdAt).format("DD-MM-YYYY hh:mm A")
        
      },
      {
        title:"Action",
        dataIndex:"action",
        render:(text, record) =>{
            const {status, _id} = record
          return <div className='flex gap-5'>
            {status === "pending" && (<span className='underline cursor-pointer'
                onClick={() =>onStatusUpdate(_id,"approved")}
            >Approve</span>)}

            {status === "pending" && (
                <span className='underline cursor-pointer'
                    onClick={() =>onStatusUpdate(_id, "rejected")}
                > Reject</span>
            )}

            {status === "approved" && (
                <span className='underline cursor-pointer'
                    onClick={() =>onStatusUpdate(_id, "blocked")}
                > Block</span>
            )}

            {status === "blocked" && (
                <span className='underline cursor-pointer'
                    onClick={() =>onStatusUpdate(_id, "approved")}
                > Unblock</span>
            )}

          </div>
        }

      },
    ];


    useEffect(()=>{
      getData();
    },[]);

  

  return (
    <div>
        
        <Table columns={columns} dataSource={products} />
        
    </div>
  )
}

export default Products