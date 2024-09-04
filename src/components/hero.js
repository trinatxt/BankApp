import React from 'react';
import homepagepic5 from '../assets/homepagepic5.jpg';

const Hero = () => {
    return (
        <div data-testid="hero" className='w-full h-[90vh] relative'>
            <img className='absolute top-0 left-0 w-full h-full object-cover' src={homepagepic5} alt='homepagepic5' />
            <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center text-white'>
            </div>
        </div>
    );
}

export default Hero;
