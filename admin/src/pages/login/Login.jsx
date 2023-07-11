import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from "../../redux/apiCalls";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const handleClick = (e) => {
        e.preventDefault();
        login(dispatch, { username, password });
    }

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#e3cda3"
    }}>
      <span style={{
  fontWeight: 'bold',
  fontSize: '60px', marginBottom: 50,
  color: '#98a68b',
  fontFamily: 'Brush Script MT'
}}>Glam Market Admin Dashboard</span> 
      <input style={{ padding: 10, marginBottom: 20 }} type="text" placeholder="username" onChange={(e)=>setUsername(e.target.value)}/>

      <input style={{ padding: 10, marginBottom: 20 }} type="password" placeholder="password" onChange={(e)=>setPassword(e.target.value)}/>

      <button style={{ padding: 10, width:100, backgroundColor: '#b3ba9c'}} onClick={handleClick}>Login</button>
    </div>
  )
}

export default Login
