import { Table, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { SetLoader } from '../../redux/loaderSlice';
import { GetProducts, UpdateProductStatus } from '../../apicalls/products';
import { GetAllUsers, UpdateUserStatus } from '../../apicalls/users';

function Users ()  {


    const [users,setUsers] = useState([]);

    const dispatch = useDispatch();

    const getData = async () =>{
      try {
        dispatch(SetLoader(true));
        const response = await GetAllUsers (null);
        dispatch(SetLoader(false));
        if(response.success){
          setUsers(response.data);
        }
      } catch (error) {
        dispatch(SetLoader)
        message.error(error.message);
        
      }
    }

    const onStatusUpdate = async (id, status) =>{
        try {
          const response = await UpdateUserStatus (id,status);
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
        title:"Name",
        dataIndex:"name"
      },
      {
        title:"Email",
        dataIndex:"email"
      },
      {
        title:"Role",
        dataIndex:"role",
        render:(text, record) =>{
            return record.role.toUpperCase();
          }
      },
      {
        title:"Created At",
        dataIndex:"createdAt",
        render:(text, record) =>
        moment(record.createdAt).format("DD-MM-YYYY hh:mm A"),
      },
    
      {
        title:"Status",
        dataIndex:"status",
        render:(text, record) =>{
          return record.status.toUpperCase();
        }
      },
      {
        title:"Action",
        dataIndex:"action",
        render:(text, record) =>{
            const {status, _id} = record
          return <div className='flex gap-5'>
            {status === "active" && (<span className='underline cursor-pointer'
                onClick={() =>onStatusUpdate(_id,"blocked")}
            >Block</span>)}

            {status === "blocked" && (
                <span className='underline cursor-pointer'
                    onClick={() =>onStatusUpdate(_id, "active")}
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
        
        <Table columns={columns} dataSource={users} />
        
    </div>
  )
}

export default Users