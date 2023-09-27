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

    //ao criar um serviço o valor do ultimo serviço do array, dentro de project>services, é armazenado na variavel lastService
    //é atribuído um id para esse lastService
    //é criada uma variável lastServiceCost, que recebe o custo do ultimo serviço
    //então é somado o novo custo, que é a soma do custo do projeto com o custo do ultimo serviço, lembrando que o ultimo serviço vem do ultimo array

    function createService(project) {
        setMessage('')
        const lastService = project.services[project.services.length -1]
        lastService.id = uuid()
        const lastServiceCost = parseFloat(lastService.cost) //certo
        const newCost = parseFloat(project.cost) + lastServiceCost

        const projectBudget = parseFloat(project.budget)

        //validação de custo X orçamento
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

        fetch(`http://localhost:4000/projects/${project._id}`,{
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

    //EDITAR SERVIÇO

    function editService(data, id) {
        const budget = data.budget
        const lastService = data.services[data.services.length -1] //pegando ultimo services, que é o que foi enviado para atualizar

        console.log('CUSTO DO ULTIMO SERVIÇO: ',lastService.cost)
        console.log('Orçamento total do projeto: ',budget)

        //map
        const newArray = data.services.map((elemento)=>{ //percorrendo o array e substituindo os valores
            if (elemento.id == id) {
                elemento.name = lastService.name
                elemento.cost = lastService.cost
                elemento.description = lastService.description
            } 
            return elemento
        })

        //filter
        const finalArray = newArray.filter((e)=>{ //removendo o ultimo objeto, que não possui ID
            return 'id' in e; // Verifica se a propriedade 'id' está presente no objeto
        })

        //atribuindo o novo array de services ao array data, que é o que será enviado pela API
        data.services = finalArray
        console.log('Data.cost: ',data.cost)
        console.log('LastService.cost: ',lastService.cost)
        let soma = 0 
        finalArray.forEach((e)=>{
            soma += parseFloat(e.cost);
        })
        //console.log('sominha: ',soma);
        data.cost = soma

        if (soma > budget) {
            alert('Orçamento estourado!')
        } else {
            fetch(`http://localhost:4000/projects/${data._id}`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then((res)=>res.json())
            .then((data2)=>{
                //setShowServiceForm(false)
                setProject(data)
                setServices(finalArray)
                console.log('DEU CERTO EU ACHO')
            })
            .catch((err)=>{
                console.log('Error: ',err)
            }) 
        }

         
    }
    //EDITAR SERVIÇO
    

    function toggleProjectForm() { //função para exibir ou não a edição do projeto
        setShowProjectForm(!showProjectForm)
    }
    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }


    function removeService(id, cost) {
        //o id é passado para ser excluído com o filter, mantendo todos os outros services, se houver
        //atualizar o serviço
        const serviceUpdate = project.services.filter(
            (service) => service.id !== id
            )
        //serviceUpdated agora não tem o service que foi passado por id
        const projectUpdated = project
        //projectUpdated recebe project, e a sua parte de services recebe o serviceUpdated, tratado acima
        projectUpdated.services = serviceUpdate
        //e o custo final do projeto é o resultado do próprio custo do projeto menos o custo que veio por parâmetro
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:4000/projects/${projectUpdated._id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectUpdated)
        })
        .then((res)=>res.json())
        .then((data)=>{
            //e aqui que se atualiza o project e o service, pois a requisição já foi um sucesso
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
                            //O componente ServiceForm passa 3 props
                            //1- a função de submit
                            //2- o texto do botão
                            //3 - os dados do projeto
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
                                    projectData={project} //VEREMOS SE FUNCIONARÁ
                                    handleEdit={editService}
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

