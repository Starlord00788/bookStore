import React from 'react';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Footer from './components/footer';
import Freebooks from './components/Freebooks';
import Homepage from './components/Homepage';
const App = () => {
  return (
   <>
  <div className='bg-white '>
    <Navbar />

<Homepage />
    <Footer  />
    

  </div>
    </>
  );
};

export default App;