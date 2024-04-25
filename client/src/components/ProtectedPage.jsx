import React, { useEffect, useState } from 'react'
import {Avatar, Badge, message} from "antd"
import {GetCurrentUser} from "../apicalls/users";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../redux/loaderSlice';
import { SetUser } from '../redux/usersSlice';
import Notification from './Notification';
import { GetAllNotifications, ReadAllNotifications } from '../apicalls/notification';


const ProtectedPage = ({children}) => {

    const [notifications=[], setNotifications] = useState([])
    const [showNotifications, setShowNotifications] = useState(false);
    const {user} = useSelector((state) => state.users);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validateToken = async () =>{
        try {
            dispatch(SetLoader(false))
            const response = await GetCurrentUser();
            dispatch(SetLoader(false));
            if (response.success) {
                dispatch(SetUser(response.data));
                
            } else {
                navigate("/login");
                message.error(response.message)
            }
            
        } catch (error) {
            dispatch(SetLoader(false));
            navigate("/login");
            message.error(error.message)

        }
    };

    const getNotifications = async () =>{
        try {
            
            const response = await GetAllNotifications();
            
            if(response.success){
                setNotifications(response.data);
            } else {
                throw new Error(response.message);
            }

        } catch (error) {
            
            message.error(error.message);
        }
    }

    const readNotifications = async () =>{
        try {
            
            const response = await ReadAllNotifications();
            
            if(response.success){
                getNotifications();
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            
            message.error(error.message);
        }
    }

    useEffect(() => {
        if(localStorage.getItem("token")){
            validateToken();
            getNotifications();
        }else{
            message.error("Please login to continue")
            navigate("/login");
        }
    },[]);
  return (
    user && (
        <div>
            {/* header */}

            <div className=' flex justify-between items-center bg-primary p-5'>
                 <h1 className=' text-2xl text-white cursor-pointer' onClick={()=>navigate('/')}>OGMP</h1>
                 <div className=' bg-white py-2 px-5 rounded flex gap-1 items-center'>
                 {/* <i className="ri-shield-user-line"></i> */}
                    <span className=' underline cursor-pointer uppercase'
                      onClick={()=>{
                        if(user.role === "user"){
                            navigate("/profile");
                        }else{
                            navigate("/admin");
                        }
                      }} >
                        {user.name}
                    </span>
                    <Badge className=' cursor-pointer' count={notifications?.filter((notification) =>!notification.read).length}
                        onClick = {()=>{
                            readNotifications();
                            setShowNotifications(true)
                        }
                    }
                    >
                        <Avatar shape="circle" size="small"  icon={<i class="ri-notification-line  text-gray-600"></i>} />
                    </Badge>
                    <i className="ri-logout-box-r-line ml-10 cursor-pointer" 
                    onClick={()=>{
                        localStorage.removeItem('token');
                        navigate('/login');
                    }}
                    ></i>
                 </div>
            </div>
            {/*body*/}
            <div className=' p-5'>{children}</div>


            {<Notification 
                notifications={notifications}
                reloadNotifications={getNotifications}
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
            />}

        </div>
    )
  );
};

export default ProtectedPage