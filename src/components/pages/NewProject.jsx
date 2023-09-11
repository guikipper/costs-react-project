import {useNavigate} from 'react-router-dom'
import style from './NewProject.module.css'
import ProjectForm from '../projects/ProjectForm'

function NewProject() {

    const navigate = useNavigate()

    function createPost(project) {
        //initialize cost and services
        project.cost = 0; //nao entendi
        project.services = [] //nao entendi

        fetch("http://localhost:5000/projects", 
            { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project)
            })
            .then((res) => res.json())
            .then((data)=> {
                console.log('Testando o PROJECT antes do POST: ',project)
                navigate("/projects", { state: "Projeto criado com sucesso!" })
            })
            .catch((err)=>console.log(err))
    }

    return (
        <div className={style.new_project_container}>
            <h1>Criar Projeto</h1>
            <p>Crie seu projeto para adicionar os serviços.</p>
            <ProjectForm handleSubmit={createPost} btnText="Criar Projeto"/>
        </div>
       
    )
}

export default NewProject