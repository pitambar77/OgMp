import { Modal, message } from 'antd'
import moment from 'moment';
import React from 'react'
import {useNavigate} from 'react-router-dom'
import { DeleteNotification } from '../apicalls/notification';
import { useDispatch } from 'react-redux';
import { SetLoader } from '../redux/loaderSlice';


const Notification = ({
    notifications = [],
    reloadNotifications,
    showNotifications,
    setShowNotifications,
}) => {
    
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const deleteNotification = async (id) =>{
        try {
            dispatch(SetLoader(true))
            const response = await DeleteNotification(id);
            dispatch(SetLoader(false))
            if(response.success){
                message.success(response.message);
                reloadNotifications();
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false))
            message.error(error.message);
        }
    }

  return (
    <Modal title ="Notifications"
        open={showNotifications}
        onCancel={() =>setShowNotifications(false)}
        footer={null}
        centered
        width={800}
    >
        <div className=' flex flex-col gap-2'>
            {notifications.map((notification) =>(
                <div className=' flex flex-col gap-2 p-2  border border-solid border-gray-300 rounded cursor-pointer' 
                    key={notification._id}
                    
                >
                    <div className="flex justify-between items-center">
                        <div 
                            onClick={()=>{
                                navigate(notification.onClick);
                                setShowNotifications(false);
                            }}>
                            <h1 className=' text-gray-700'>{notification.title}</h1>
                            <span className=' text-gray-500'>{notification.message}</span>
                            <h1 className=' text-gray-500 text-sm'>{moment(notification.creatdAt).fromNow()}</h1>
                        </div>
                        <i className="ri-delete-bin-2-line cursor-pointer" onClick={()=>{
                            deleteNotification(notification._id);
                            }}>
                        </i>
                    </div>

                   
                </div>
            ))}
        </div>
        
    </Modal>
  )
}

export default Notification