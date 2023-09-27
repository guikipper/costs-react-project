import styles from '../projects/ProjectForm.module.css'
import {useState} from 'react'
import Input from '../form/Input'
import SubmitButton from '../form/SubmitButton'

function ServiceForm({handleSubmit, btnText, projectData}) {

    const [service, setService] = useState({})

    function submit(e) {
        e.preventDefault()
        if(service.name && service.cost && service.description) {
            projectData.services.push(service)
            //recebo o project e os dados de service, dou um push em projectData e passo esse valor para handleSubmit, que equivale a função createService, lá em Project
            //dessa forma, o parâmetro que createService recebe é o projectData com o serviço adicionado
            handleSubmit(projectData) //função que vem de Project
        } else {
            console.log('tem que informar os dados o djow')
        }
    }

    function handleChange(e) {
        setService({...service, [e.target.name]: e.target.value})
    }

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input
                type="text"
                text="Nome do serviço"
                name="name"
                placeholder="Insira o nome do serviço"
                handleOnChange={handleChange}
            />
            <Input
                type="number"
                text="Custo do serviço"
                name="cost"
                placeholder="Insira o valor total"
                handleOnChange={handleChange}
            />
            <Input
                type="text"
                text="Descrição do serviço"
                name="description"
                placeholder="Descreva o serviço"
                handleOnChange={handleChange}
            />
            <SubmitButton text={btnText} />
        </form>
    )
}

export default ServiceForm