import "./Privacy.css";

const Privacy = () => {
  return (
    <main className="privacy-container">
      <h2>Política de Privacidade - Semaninha</h2>
      <p>
        Seus dados são coletados apenas para a geração da colagem e não são
        armazenados em nenhum servidor. O site utiliza a API do Last.FM para
        obter os dados do usuário e os albuns mais ouvidos.
      </p>
      <p>Os dados coletados são:</p>
      <ul>
        <li>Nome do usuário</li>
        <li>Período de tempo</li>
        <li>Tamanho da colagem</li>
        <li>
          Se o nome do album/artista e a quantidade de plays devem ser exibidos
        </li>
      </ul>
      <p>Os dados coletados não são compartilhados com terceiros.</p>
      <div className="contact">
        <p>
          Para mais informações, entre em contato pelo email:{" "}
          <a href="mailto:danielangelo12334@gmail.com">
            danielangelo1234@gmail.com
          </a>
        </p>
      </div>
    </main>
  );
};

export default Privacy;
