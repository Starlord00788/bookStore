import React from 'react'
import Navbar from "../components/Navbar";
import Homepage from "../components/Homepage";
import Footer from "../components/footer";
const Home = () => {
  return (
   <>
    
    <div className='bg-white pt-20'>
    <Navbar />
    <Homepage />
    <Footer />
    </div>
   </>
  )
}

export default Home
