import style from "../projects/ProjectForm.module.css";
import Input from "../form/Input"
import Select from "../form/Select";
import SubmitButton from "../form/SubmitButton";

import { useEffect, useState } from "react";

function ProjectForm({ handleSubmit, btnText, projectData }) {
  const [categories, setCategories] = useState([]);
  const [project, setProject] = useState(projectData || {});

  useEffect(() => { //função para popular o Select com as categorias
    fetch("http://localhost:4000/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log('Dados em categories', data)
        setCategories(data); //busca os dados na API e atribui em categories
      })
      .catch((err) => {
        console.log("Erro: ", err);
      });
  }, []);

  const submit = (e) => {
    e.preventDefault();
    handleSubmit(project) //aqui é o método passado pela prop, que pede o project como argumento, está sendo passado daqui
  };

  function handleChange(e) {
    setProject({ ...project, [e.target.name]: e.target.value });
  }

  function handleCategory(e) {
    setProject({ //aqui estamos populando o project, o category, especificamente
      ...project,
      category: {
        id: e.target.value,
        name: e.target.options[e.target.selectedIndex].text,
      },
    });
  }
  return (
    //submit é uma const que tem a função POST, passando o Project, que veio por argumento.
    <form onSubmit={submit} className={style.form}>
      <Input
        type="text"
        value={project.name}
        text="Nome do Projeto"
        name="name"
        placeholder="Informe o nome do projeto"
        handleOnChange={handleChange}
      />
      <Input
        type="number"
        value={project.budget}
        text="Orçamento"
        name="budget"
        placeholder="Informe o orçamento do projeto"
        handleOnChange={handleChange}
      />
      <Select
        name="category_id"
        text="Selecione a categoria"
        options={categories}
        handleOnChange={handleCategory}
        value={project.category ? project.category.id : ""}
      />
      <SubmitButton text={btnText} />
    </form>
  );
}

export default ProjectForm;
