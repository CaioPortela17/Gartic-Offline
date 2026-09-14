import { useState } from 'react'
import TelaInicial from './componentes/TelaInicial/TelaInicial.jsx'
import SelecaoModo from './componentes/SelecaoModo.jsx'
import TelaJogo from './componentes/TelaJogo.jsx'
import TelaFim from './componentes/TelaFim.jsx'
import { usarJogo } from './ganchos/usarJogo.js'

export default function App() {
  // 'intro' -> 'selecao' -> 'jogo', controla qual tela aparece
  const [etapa, setEtapa] = useState('intro')
  const [config, setConfig] = useState(null)

  if (etapa === 'intro') {
    return <TelaInicial onStart={() => setEtapa('selecao')} />
  }

  if (etapa === 'selecao') {
    return (
      <SelecaoModo
        onEscolher={(escolha) => {
          setConfig(escolha)
          setEtapa('jogo')
        }}
      />
    )
  }

  return <Partida config={config} aoSair={() => setEtapa('selecao')} />
}

function Partida({ config, aoSair }) {
  const jogo = usarJogo(config)

  if (!jogo.rodada) {
    return (
      <main className="tela">
        <p>Não há palavras suficientes pra essa categoria nesse modo.</p>
        <button onClick={aoSair}>voltar</button>
      </main>
    )
  }

  if (jogo.partidaAcabou) {
    return <TelaFim jogo={jogo} aoSair={aoSair} />
  }

  return <TelaJogo jogo={jogo} aoSair={aoSair} />
}
