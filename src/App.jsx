/**
 * TELA DE TESTE — PROVISÓRIA
 *
 * Serve só pra provar que o sistema de palavras, os modos e o ranking funcionam.
 * Ana: a página inicial de verdade substitui a seleção de modo daqui.
 * Layout: a página de desenho de verdade substitui o bloco <section className="jogo">.
 * As duas coisas podem usar exatamente os mesmos componentes e o hook usarJogo.
 */
import TelaInicial from './componentes/TelaInicial/TelaInicial.jsx'
import { useState } from 'react'
import { usarJogo } from './ganchos/usarJogo.js'
import { LISTA_MODOS } from './sistemas/dificuldade.js'
import { calcularNitidez, errosRestantes } from './sistemas/palavras.js'
import { CATEGORIAS_DISPONIVEIS } from './dados/palavras.js'
import { ultimoNome } from './sistemas/ranking.js'
import ImagemRevelada from './componentes/ImagemRevelada.jsx'
import PainelPalavra from './componentes/PainelPalavra.jsx'
import Teclado from './componentes/Teclado.jsx'
import Ranking from './componentes/Ranking.jsx'

export default function App() {
  const [config, setConfig] = useState(null) // null = tela de escolha

  function iniciarJogo() {
    setConfig({
      modo: LISTA_MODOS[0].id,
      categoria: null,
    })
  }

  if (!config) return <TelaInicial onStart={iniciarJogo} />

  return <Jogo config={config} aoSair={() => setConfig(null)} />
}

// function Inicio({ aoComecar }) {
//   const [categoria, setCategoria] = useState('')

//   return (
//     <main className="tela inicio">
//       <h1>Forca Gartic</h1>
//       <p className="sub">Adivinhe a palavra — a imagem vai ficando nítida a cada acerto.</p>

//       <label className="campo">
//         Categoria
//         <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
//           <option value="">Todas</option>
//           {CATEGORIAS_DISPONIVEIS.map((c) => (
//             <option key={c} value={c}>{c}</option>
//           ))}
//         </select>
//       </label>

//       <div className="modos">
//         {LISTA_MODOS.map((m) => (
//           <button
//             key={m.id}
//             className="modo-botao"
//             style={{ borderColor: m.cor }}
//             onClick={() => aoComecar({ modo: m.id, categoria: categoria || null })}
//           >
//             <strong style={{ color: m.cor }}>{m.nome}</strong>
//             <small>
//               {m.erros} erros · {m.tempo ? `${m.tempo}s` : 'sem tempo'} · x{m.multiplicador}
//             </small>
//           </button>
//         ))}
//       </div>

//       <Ranking quantidade={5} />
//     </main>
//   )
// } 
// nao precisa usar mais isso 

function Jogo({ config, aoSair }) {
  const jogo = usarJogo(config)
  const [nome, setNome] = useState(ultimoNome())
  const [salvo, setSalvo] = useState(null)

  if (!jogo.rodada) {
    return (
      <main className="tela">
        <p>Não há palavras pra essa combinação de modo e categoria.</p>
        <button onClick={aoSair}>voltar</button>
      </main>
    )
  }

  if (jogo.partidaAcabou) {
    return (
      <main className="tela fim">
        <h1>Fim de partida</h1>
        <p className="pontuacao-final">{jogo.pontos} pontos</p>

        {!salvo ? (
          <div className="salvar">
            <input
              value={nome}
              maxLength={14}
              placeholder="seu nome"
              onChange={(e) => setNome(e.target.value)}
            />
            <button onClick={() => setSalvo(jogo.salvarNoRanking(nome))}>salvar no ranking</button>
          </div>
        ) : (
          <p className="posicao">
            Você ficou em {salvo.posicao}º de {salvo.total}!
          </p>
        )}

        <Ranking quantidade={10} destaqueId={salvo?.entrada.id} />
        <div className="acoes">
          <button onClick={jogo.reiniciar}>jogar de novo</button>
          <button onClick={aoSair}>trocar modo</button>
        </div>
      </main>
    )
  }

  const { rodada, modo } = jogo
  const acabou = rodada.estado !== 'jogando'

  return (
    <main className="tela jogo">
      <header className="hud">
        <span className="tag" style={{ background: modo.cor }}>{modo.nome}</span>
        <span>Rodada {jogo.numeroRodada}/{jogo.totalRodadas}</span>
        <span>{jogo.pontos} pts</span>
        <span>❤️ {errosRestantes(rodada)}</span>
        {jogo.segundos != null && <span>⏱ {jogo.segundos}s</span>}
      </header>

      <PainelPalavra rodada={rodada} />

      <ImagemRevelada
        emoji={rodada.emoji}
        imagem={rodada.imagem}
        nitidez={calcularNitidez(rodada)}
        alt={acabou ? rodada.palavra : 'desenho da palavra secreta'}
      />

      <p className="categoria">{rodada.categoria}</p>
      {rodada.dicaVisivel ? (
        <p className="dica">💡 {rodada.dica}</p>
      ) : (
        !acabou && <button className="link" onClick={jogo.usarDica}>ver dica (-20 pts)</button>
      )}

      <Teclado rodada={rodada} aoChutar={jogo.chutar} desativado={acabou} />

      {acabou && (
        <div className="resultado">
          <p>
            {rodada.estado === 'vitoria' ? '🎉 Acertou!' : '💀 Era'} <strong>{rodada.palavra}</strong>
          </p>
          <button onClick={jogo.proximaRodada}>
            {jogo.numeroRodada >= jogo.totalRodadas ? 'ver resultado' : 'próxima palavra'}
          </button>
        </div>
      )}
    </main>
  )
}
