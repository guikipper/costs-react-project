import styles from './Project.module.css'
import Container from '../layout/Container'
import { parse, v4 as uuid } from 'uuid';
import {useParams} from 'react-router-dom' //serve para pegar o id que está vindo pela URL
import {useState, useEffect} from 'react'
import Loading from '../layout/Loading'
import ProjectForm from '../projects/ProjectForm'
import ServiceForm from '../service/ServiceForm'
import Message from '../layout/Message'
import ServiceCard from '../service/ServiceCard'

function Project() {

    const {id} = useParams()
    const [message, setMessage] = useState()
    const [type, setType] = useState()
    const [project, setProject] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [services, setServices] = useState([])

    useEffect(() => { 
        setTimeout(() => {
            fetch(`http://localhost:4000/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => res.json())
            .then((data) => {
                setProject(data)
                setServices(data.services)
            })
            .catch((err) => {
                console.log('Deu erro: ', err)
            })
        }, 300); // 1000 milissegundos = 1 segundo
    }, [id]);

    //Divisão

    function editProject (project) {
        setMessage('')
         if (project.budget < project.cost) {
            setMessage('O orçamento não pode ser menor que o custo do projeto.')
            setType('error')
            return false
        } 

        fetch(`http://localhost:4000/projects/${project._id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project),
        })
        .then((resp)=>resp.json())
        .then((data)=>{
            setMessage('Projeto atualizado.')
            setType('success')
            setProject(project)
            setShowProjectForm(false)
        })
        .catch((err)=>{
            console.log("Erro: ",err)
        })
    }

    function createService(project) {
        setMessage('')
        const lastService = project.services[project.services.length -1]
        lastService.id = uuid()
        const lastServiceCost = parseFloat(lastService.cost) //certo
        const newCost = parseFloat(project.cost) + lastServiceCost
        const projectBudget = parseFloat(project.budget)

        //maximum value validation
        if (newCost > projectBudget) {
            console.log('estourou')
            setMessage('Orçamento ultrapassado, verifique o valor do serviço.')
            setType('error')
            project.services.pop()
            return false
        }

        //add service cost to project total cost
        project.cost = newCost

        // update project

        fetch(`http://localhost:4000/projects/${project.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        })
        .then((res)=>res.json())
        .then((data)=>{
            setShowServiceForm(false)
        })
        .catch((err)=>{
            console.log('Error: ',err)
        })
    }

    function toggleProjectForm() { //função para exibir ou não a edição do projeto
        setShowProjectForm(!showProjectForm)
    }
    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }
    function removeService(id, cost) {
        //atualizar o serviço
        const serviceUpdate = project.services.filter(
            (service) => service.id !== id
            )
        const projectUpdated = project
        projectUpdated.services = serviceUpdate
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectUpdated)
        })
        .then((res)=>res.json())
        .then((data)=>{
            setProject(projectUpdated)
            setServices(serviceUpdate)
            setMessage('Serviço removido com sucesso!')
        })
        .catch()
    }

    return (
        <>
        {project.name ? (
        <div className={styles.project_details}>
            <Container customClass="column">
                {message && (
                    <Message msg={message} type={type}/>
                )}
                <div className={styles.details_container}>
                    <h1>Projeto</h1>
                    <button className={styles.btn} onClick={toggleProjectForm}>{!showProjectForm ? 'Editar Projeto' : 'Fechar'}</button>
                    {!showProjectForm ? (
                        <div className={styles.project_info}>
                            <p>
                                <span>Nome:</span> {project.name}
                            </p>
                            <p>
                                <span>Categoria:</span> {project.category.name}
                            </p>
                            <p>
                                <span>Total de Orçamento:</span> R$ {project.budget}
                            </p>
                            <p>
                                <span>Total Utilizado:</span> R$ {project.cost}
                            </p>
                        </div>
                    )
                    : //se não 
                    (
                        <div className={styles.project_info}>
                            <ProjectForm handleSubmit={editProject} btnText="Concluir Edição" projectData={project}/>
                        </div>
                    )}
                </div>
                <div className={styles.service_form_container}> {/* Revisar */}
                    <h2>Adicione um serviço:</h2>
                    <button>
                    <button className={styles.btn} onClick={toggleServiceForm}>
                        {!showServiceForm ? 'Adicionar Serviço' : 'Fechar'}</button>
                    </button>
                    <div className={styles.project_info}>
                        {showServiceForm && (
                            <ServiceForm 
                            handleSubmit={createService}
                            btnText="Adicionar Serviço"
                            projectData={project}
                            />
                        )}
                    </div>
                </div>
                <h2>Serviços</h2>
                    <Container customClass="start">
                        {services.length > 0 && (
                            services.map((service)=>(
                                <ServiceCard
                                    id={service.id}
                                    name={service.name}
                                    cost={service.cost}
                                    description={service.description}
                                    key={service.id}
                                    handleRemove={removeService}
                                />
                            ))
                        )}
                        {services.length === 0 && (
                            <p>Não há serviços cadastrados.</p>
                        )}
                    </Container>
            </Container>
        </div>
    ) : (
        <Loading/>
    )}
        </>
        )
}

export default Project

