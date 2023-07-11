import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ProductItem from './ProductItem';
import axios from "axios";
import { popularProducts } from '../data';

const Container = styled.div`
padding: 20px;
display: flex;
flex-wrap: wrap;
justify-content: space-between
`;


const Products = ({category, filters, sort}) => {
  //fetch data
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  //category changes from this function
  //use async since we are making request from API
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(category ? `http://localhost:5000/api/products?category=${category}` : "http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (error) {}
    };
    getProducts();
  }, [category]);

 
  //filter changes from this function (color, size)
  useEffect(() => {
    category &&
      setFilteredProducts(
        products.filter((item) =>
          Object.entries(filters).every(([key, value]) =>
          
            (item[key] && item[key].includes(value))
          )
        )
      );
      console.log(products)
  }, [products, category, filters]);



 
  useEffect(() => {
    if (sort === "newest") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.createdAt - b.createdAt)
      );
    } else if (sort === "price(asc)") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.price - b.price)
      );
    } else {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => b.price - a.price)
      );
    }
  }, [sort]);

  
  return (
    <Container>
      {category
        ? filteredProducts.map((item) => <ProductItem item={item} key={item.id} />)
        : products
            .slice(0, 8)
            .map((item) => <ProductItem item={item} key={item.id} />)}
    </Container>
  );


};

export default Products;