import { useState } from "react";
import styled from "styled-components";
import { login } from "../redux/apiCalls";
import { mobile } from "../responsive";
import { useDispatch, useSelector } from "react-redux";

const Container = styled.div`
width: 100vw;
height: 100vh;
background: linear-gradient(
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.5)
    ),
    url("https://img.freepik.com/free-photo/attractive-asian-woman-showing-smartphone-app-shopping-bags-buying-online-via-application-standi_1258-156867.jpg?w=1800&t=st=1688795995~exp=1688796595~hmac=2810a731a4246cd6ddaf0128ae38f7b54f4abfe5f1a8656b987e57b5a3566a20")
    center;
background-size: cover;
display: flex;
align-items: center;
justify-content: center;
`;


const Wrapper = styled.div`
width: 25%;
padding: 20px;
background-color: white;
${mobile({ width: "75%" })}

`;


const Form = styled.form`
display: flex;
flex-direction: column;
`;


const Title = styled.h1`
font-size: 24px;
font-weight: 700;
`;


const Input = styled.input`
flex: 1;
min-width: 40%;
margin: 10px 0px;
padding: 10px;
border-radius: 10px;
border-width: thin;
`;


const Button = styled.button`
width: 40%;
border: none;
padding: 15px 20px;
background-color: #8f8267;
color: white;
cursor: pointer;
margin-bottom: 10px;
&:disabled {
  color: black;
  cursor: not-allowed;
}
`;


const Link = styled.a`
margin: 5px 0px;
font-size: 12px;
text-decoration: underline;
cursor: pointer;
`;

const Error = styled.span`
color: red;
`;


const Login = () => {
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const dispatch = useDispatch();



  const { isFetching, error } = useSelector((state) => state.user);

  const handleClick = (e) => {
    e.preventDefault();
    login(dispatch, { username, password });
  };

  return (
    <Container>
        <Wrapper>
            <Title>Welcome Back, Sign In Here</Title>
            <Form>
                <Input placeholder="username" onChange={(e) => setUsername(e.target.value)}/>
                <Input placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)}/>
                <Button onClick={handleClick} disabled={isFetching}>
                  Login
                </Button>
                {error && <Error>Something went wrong...</Error>}
                <Link>DO NOT YOU REMEMBER THE PASSWORD?</Link>
                <Link>CREATE A NEW ACCOUNT</Link>
            </Form>
        </Wrapper>
    </Container>
  );
};

export default Login;