import React, { useEffect, useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import list from "../../public/list.json";
import { useNavigate } from 'react-router-dom';

const Freebooks = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [isLogined,setLogin] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setLogin(true);
    }
  }, []);
  
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3, slidesToScroll: 3, infinite: true, dots: true }
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 2, infinite: true, dots: true }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1 }
      }
    ],
    beforeChange: () => setIsDragging(true),
    afterChange: () => setTimeout(() => setIsDragging(false), 100),
  };

  const filterData = list.filter((data) => data.price !== 0);

  useEffect(() => {
    console.log(filterData);
  }, [filterData]);

  return (
    <div className='max-w-screen-2xl mx-auto container md:px-20 px-4 py-16 text-gray-800'>
      <div className='mb-10'>
        <h1 className='text-4xl font-extrabold text-gray-900 mb-4'>Some of the Best Offered Books</h1>
        <p className='text-gray-600 max-w-3xl leading-relaxed'>
          Great stories don’t have to cost a thing! Dive into our eBook collection—timeless classics,
          trending reads, and hidden treasures. Read anywhere, anytime—absolutely marvelous!
        </p>
      </div>

      <Slider {...settings}>
        {filterData.map((book) => (
          <div
            key={book.id || book._id}
            onClick={() => { 
              if (!isDragging && isLogined) {
                navigate(`/books/${book._id || book.id}`, { state: { book } });
              }

              else if(!isDragging && !isLogined){
                navigate(`/login`);
              }
            }}
            className='p-4 cursor-pointer'
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-gray-200 h-full flex flex-col">
              <div className="bg-gray-100 h-64 flex items-center justify-center p-4">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-full w-auto object-contain rounded"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>
              <div className='p-4 flex flex-col justify-between flex-1'>
                <div>
                  <h2 className='text-xl font-semibold text-gray-900 truncate'>{book.title}</h2>
                  <p className='text-sm text-gray-500 italic'>{book.author || "Unknown"}</p>
                </div>
                <p className='text-sm text-gray-600 mt-3 line-clamp-3'>
                  {book.description || "No description available."}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Freebooks;
