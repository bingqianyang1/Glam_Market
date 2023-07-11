import styled from "styled-components";

const Container = styled.div`
height: 30px;
background-color: #dbc9a9;
color: white;
display: flex;
align-items: center;
justify-content: center;
font-size: 16px;
font-weight: 800;

`;

const Announcement = () => {
  return (
  <Container>Shop Now! Free Shipping on Orders over $60</Container>
  );
};

export default Announcement;
