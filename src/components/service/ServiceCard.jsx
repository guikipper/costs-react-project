import styles from '../projects/ProjectCard.module.css'
import {BsFillTrashFill, BsPencil} from 'react-icons/bs'
import {useState} from 'react'
import ServiceEdit from './ServiceEdit'
import ServiceForm from './ServiceForm'

function ServiceCard({id, name, cost, description, handleRemove, projectData, handleEdit}) {

    const [showEditForm, setShowEditForm] = useState(false)

    function toggleServiceForm() {
        setShowEditForm(!showEditForm)
    }

    const remove = (e)=>{
        e.preventDefault()
        handleRemove(id, cost)
    }

    const edit = (e)=>{
        //e.preventDefault() revisar aqui
        handleEdit(projectData, id)
    }

    return (
        <>
            <div className={styles.project_card}>
            <h4>{name}</h4>
            <p>
                <span>Custo total:</span> R${cost}
            </p>
            <p>{description }</p>
            <div className={styles.project_card_actions}>
                <button onClick={remove}> 
                    <BsFillTrashFill/>
                    Excluir
                </button>
                <button onClick={toggleServiceForm}>
                    <BsPencil/>
                    Editar
                </button>
            </div>
        </div>
        {showEditForm && (
            <ServiceForm
            handleSubmit={edit}
            btnText="Editar"
            projectData={projectData}
            />
        )}
        </>
       
    )
}

export default ServiceCard