import React, {useContext, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Login.css'
import axios from '../config/axios'
import { UserContext } from '../context/userContext'

const Login = () => {
  const {setUser} = useContext(UserContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const res = await axios.post('/users/login',{ 
        email, password
      })
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      navigate('/')
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='loginPage'>
      <div className="loginCard">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            onChange={(e)=>setEmail(e.target.value)}
            disabled={isLoading}
          />
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(e)=>setPassword(e.target.value)}
            disabled={isLoading}
          />
          <button 
            className='btn' 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign-In'}
          </button>
          <p>Don't have an account? <Link to='/register'>Register</Link> </p>
        </form>
      </div>
    </div>
  )
}

export default Login
