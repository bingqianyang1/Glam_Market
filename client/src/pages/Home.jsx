import React from 'react';
import Announcement from '../components/Announcement';
import Categories from '../components/Categories';
import Footer from '../components/Footer';
import Navibar from '../components/Navibar';
import Products from '../components/Products';
import Slider from '../components/Slider';
import Subscribe from '../components/Subscribe';

const Home = () => {
  return (
    <div>
      <Announcement/>
      <Navibar/>
      <Slider/>
      <Categories/>
      <Products/>
      <Subscribe/>
      <Footer/>
    </div>
  );
};

export default Home;

