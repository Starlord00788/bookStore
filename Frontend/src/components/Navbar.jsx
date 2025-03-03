import React, { useEffect, useState } from 'react'
import SearchBar from './searchBar'
import Theme from './theme'
const Navbar = () => {
   
  const [sticky,setSticky]=useState(false)
  useEffect(()=>{
    const handleScroll = ()=>{
      if(window.scrollY > 0 ){
        setSticky(true);
      }
      else{
        setSticky(false)
      }
    }
   
    window.addEventListener("scroll",handleScroll)
    return () =>{
      window.removeEventListener('scroll',handleScroll)
    }
   

  },[])


    const navitems = (<>
      <li><a>Home</a></li>
    
    <li><a>Explore</a></li>
    <li><a>Contact</a></li>
    <li><a>About</a></li>
    </>)

  


  return (
    <>
    <div className={`bg-white max-w-screen-2xl mx-auto 
      container md:px-20 px-4 fixed top-0 left-0 right-0  ${
      sticky ? "sticky-navbar shadow-md bg-slate-100 duration-300 transition-all ease-in-out" : ""}` }>
    <div className={`navbar  ${sticky ? "bg-slate-100 duration-300 transition-all ease-in-out" : "bg-white"} `}>
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn text-gray-800 btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      <ul
        tabIndex={0}
        className=" text-gray-800 menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow">
       
       {navitems}
      </ul>
    </div>
    <a className="font-bold text-gray-800 *:cursor-pointer text-2xl cursor-default">NovelNimbus</a>
  </div>
  <div className="navbar-end space-x-5">
  <div className="navbar-center hidden lg:flex">
    <ul className=" text-gray-800 menu menu-horizontal px-1">
     {navitems}
    </ul>

  </div>
  <div className='hidden md:block  text-gray-800'><SearchBar /></div>
  <div className="hidden md:block "><Theme /></div>
  <div className="">
    <a className="btn text-white w-16 cursor-pointer">Login</a>
  </div>
  </div>
</div>
    </div>
    </>
  )
}

export default Navbar
