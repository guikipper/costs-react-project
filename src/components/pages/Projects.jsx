import {useLocation} from 'react-router-dom'
import {useState, useEffect} from 'react'
import Message from "../layout/Message"
import styles from './Projects.module.css'
import Container from '../layout/Container'
import LinkButton from '../layout/LinkButton'
import ProjectCard from '../projects/ProjectCard'
import Loading from '../layout/Loading'

function Projects() {
    const [projects, setProjects] = useState([])
    const [removeLoading, setRemoveLoading] = useState(false)
    const [projectMessage, setProjectMessage] = useState('')

    const location = useLocation() //serve para enviar mensagem 
    let message = ''
    if (location.state) {
        message = location.state
    } 

    useEffect(() =>{
        fetch("http://localhost:4000/projects",{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((resp)=>resp.json())
        .then((data) => {
            
            setProjects(data)
            setRemoveLoading(true)

        })
        .catch((err)=>{
            console.log(err)
        })
    }, [])

    function removeProject(id) {
        fetch(`http://localhost:4000/projects/${id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json'
            },
        })
        .then((resp)=> resp.json())
        .then((data)=> {
            setProjects(projects.filter((project)=>{
                return project._id !== id
            }))
        })
        .catch((err)=> {console.log('Error: ',err)})
    }

    return (
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>Meus projetos</h1>
                <LinkButton to="/newproject" text="Criar Projeto"/>
            </div>
            {message && (
                <Message msg={message} type="success"/>
            )}
            {projectMessage && (
                <Message msg={projectMessage} type="success"/>
            )}
            <div className={styles.max_height}>
              {  <Container customClass="start">
                    {projects.length > 0 && ( 
                        projects.map((project)=>(
                            <ProjectCard id={project._id} name={project.name} budget={project.budget} category={project.category.name} key={project.key} handleRemove={removeProject}/> //esse cara recebe 6 parâmetros
                        )))
                    }
                    {!removeLoading && ( //se removeLoading for false, irá aparecer o loading
                        <Loading/>
                    )}
                    {removeLoading && projects.length === 0 && (
                        <p>Não há projetos cadastrados.</p>
                    )}
                </Container>}
            </div>
            
        </div>
    )
}

export default Projects