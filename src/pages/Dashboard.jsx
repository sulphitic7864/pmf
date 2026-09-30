import React from 'react'
import SideBar from '../components/SideBar'
import DashboardComponents from '../components/DashboardComponents'
import { CgMenuRight } from 'react-icons/cg'

const Dashboard = () => {
  const [showSidebar, setShowSidebar] = React.useState(false)
  return (
    <>
    <div className='w-full gap-8  sm:px-10 lg:px-44 flex min-h-screen bg-black'>
      <CgMenuRight className='md:hidden absolute left-10 text-white text-3xl cursor-pointer' 
      onClick={()=>setShowSidebar(!showSidebar)}
      />
      <div className={`w-1/2 md:w-1/3 ${showSidebar ? "" : "hidden"} md:flex`}>
        <SideBar setShowSidebar={setShowSidebar}/>
      </div>
      <div className='w-full md:w-2/3 px-10 md:px-0 min-h-screen'>
       <DashboardComponents/>
      </div>
    </div>
    </>

  )
}

export default Dashboard