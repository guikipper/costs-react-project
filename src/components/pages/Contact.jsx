function Contact() {

    function testaApi() {
        console.log('Entrou na função')
        fetch('http://localhost:4000/categories')
  .then(response => response.json())
  .then(data => {
    console.log(data); // Aqui você pode trabalhar com os dados recebidos
  })
  .catch(error => {
    console.error('Erro:', error);
  });
    }

    

    return (
        <>
        <h1>
            Contatinho de vagabundo
        </h1>
        <button onClick={testaApi}>
            Teste
        </button>
        </>
    )
}

export default Contact