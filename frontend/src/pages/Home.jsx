import React, {useEffect, useState} from 'react'
import '../styles/Home.css'
import axios from '../config/axios'
import {useNavigate} from 'react-router-dom'

const Home = () => {

    // const {user} = useContext(UserContext)
    const [newcard, setNewCard] = useState(false)
    const [projectName, setProjectName] = useState('')
    const [project, setProject] = useState([])  

    const navigate = useNavigate()

    function createProject(e){
      e.preventDefault();
      console.log({projectName})

      axios.post('/projects/create',{
        name: projectName
      }).then(res => {
        console.log(res.data)
        setProjectName('')
        setNewCard(false)
      }
      ).catch(err => {
        console.log(err.response?.data?.message || 'Failed to create project')
      })
    }

    useEffect(() => {
      axios.get('/projects/all')
      .then(res => {
        setProject(res.data.projects)
      }).catch(err=>{
        console.log(err.response?.data?.message || 'Failed to fetch projects')
        setProject([])
      })
    }, [])

  return (
    <div className='mainPage'>
      <div className="main">
        <button className='homeBtns' onClick={() => setNewCard(!newcard)}>
          New project
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>
      {
        project.map((project) => (
          <div className='homeBtns projectCard'
           key={project._id}
           onClick={() => navigate(`/project`,{
              state: {project}
           })}>
              <h3>{project.name}</h3>
              <div className='projectCard-info'>
                <i className='fa-regular fa-user'></i>
                <h5>: <span>{project.users.length}</span> </h5>
              </div>
          </div>
        ))
      }

      {
        newcard && (
          <div className='projectCard-container'>
          <div className='newCard'>
            <h2>Create new project</h2>
              <form onSubmit={createProject}>
                <input 
                className='projectInput' 
                type='text' 
                placeholder='Project name'
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)} 
                required
                />
                <div className='btns'>
                  <button className='proBtn' type='button' onClick={() => setNewCard(!newcard)}>Cancel</button>
                  <button id="createBtn" type='submit' className='proBtn'>Create</button>
                </div>
              </form>  
          </div>
          </div>
          )
      }


    </div>
  )
}

export default Home
