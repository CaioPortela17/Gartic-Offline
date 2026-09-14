import { useState } from "react";
import "./TelaInicial.css";

function TelaInicial({ onStart }) {
  const [caindo, setCaindo] = useState(false);

  function comecarJogo() {
    setCaindo(true);

    setTimeout(() => {
      onStart();
    }, 1500);
  }

  return (
    <main className={`tela-inicial ${caindo ? "transicao" : ""}`}>

      <div className="conteudo">

        <p className="subtitulo">
          Um deafio de palavras!
        </p>

        <h1>FORCA</h1>

        <div className="linha-titulo"></div>

        <button
          className="botao-comecar"
          onClick={comecarJogo}
          disabled={caindo}
        >
          COMEÇAR
        </button>

        <p className="instrucao">
          Clique para iniciar o desafio
        </p>

      </div>

    </main>
  );
}

export default TelaInicial;