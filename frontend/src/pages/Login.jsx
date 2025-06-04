import React, {useContext, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Login.css'
import axios from '../config/axios'
import { UserContext } from '../context/userContext'

const Login = () => {

  const {setUser} = useContext(UserContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit =  (e) => {
    e.preventDefault()
    
      axios.post('/users/login',{ 
        email, password
      }).then(res => {
        console.log(res.data)
        localStorage.setItem('token', res.data.token)
        setUser(res.data.user)
        navigate('/')
      }).catch(err => {
        console.error(err)
      })
    }
  

  return (
    <div className='loginPage'>
      <div className="loginCard">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)}/>
          <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
          <button className='btn' type="submit">Sign-In</button>
          <p>Don't have an account? <Link to='/register'>Register</Link> </p>
        </form>
      </div>
    </div>
  )
}

export default Login
