import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Register.css'
import axios from '../config/axios'
import { UserContext } from '../context/userContext'


const Register = () => {

  const { setUser } = useContext(UserContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await axios.post('/users/register', {
        email,
        password
      })
      console.log(res.data)
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      navigate('/login')
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='registerPage'>
      <div className="registerCard">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <button
            className='btn'
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign-Up'}
          </button>
          <p>Already have an account? <Link to='/login'>Login</Link> </p>
        </form>
      </div>
    </div>
  )
}

export default Register
