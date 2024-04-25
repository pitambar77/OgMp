import React from 'react'
import { Tabs } from 'antd'
import Products from './Products/Products'
import UserBids from './UserBid/UserBids'
import { useSelector } from 'react-redux'

const Profile = () => {
    const {user} = useSelector((state) =>state.users);
  return (
    <div>
        <Tabs defaultActiveKey='1'>
            <Tabs.TabPane tab="Products" key="1">
               <Products/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Bids" key="2">
                <UserBids/>
            </Tabs.TabPane>
            {/* <Tabs.TabPane tab="General" key="3">
                <div className="flex flex-col w-1/3">
                  <span className=' text-primary text-xl flex justify-between'>Name:{user.name}</span>
                  <span className=' text-primary text-xl flex justify-between'>Email:{user.email}</span>
                </div>
            </Tabs.TabPane> */}

        </Tabs>
    </div>
  )
}

export default Profile