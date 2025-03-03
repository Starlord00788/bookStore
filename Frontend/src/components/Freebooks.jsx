import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import list from "../../public/list.json"



const Freebooks = () => {
    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };

    const filterData = list.filter((data)=> data.category === "Free");
    console.log(filterData);
  return (
   <>
   <div className='max-w-screen-2xl mx-auto 
      container md:px-20 px-4 '>
<div><h1 className='font-semibold text-xl pb-2 text-gray-800'>Free offered Books</h1>
<p className='text-gray-800'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequuntur blanditiis incidunt quas voluptatum laboriosam, repellat dolores, natus doloribus repudiandae quisquam earum facilis distinctio iusto est tempora deleniti totam?</p></div>



   <div className='text-gray-800'>
   <Slider {...settings}>
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
        <div>
          <h3>7</h3>
        </div>
        <div>
          <h3>8</h3>
        </div>
      </Slider>
   </div>
   </div>
   </>
  )
}

export default Freebooks
