/**
 * TABELA DE RANKING  —  responsabilidade: Magno
 * Serve tanto pra tela final quanto pra tela inicial da Ana (é só importar).
 */

import { useState } from 'react'
import { pegarTop, limparRanking } from '../sistemas/ranking.js'
import { LISTA_MODOS } from '../sistemas/dificuldade.js'

const MEDALHAS = ['🥇', '🥈', '🥉']

export default function Ranking({ quantidade = 10, destaqueId = null }) {
  const [filtro, setFiltro] = useState(null) // null = geral
  const [versao, setVersao] = useState(0)    // força reler depois de limpar
  const lista = pegarTop(quantidade, filtro)

  return (
    <section className="ranking" key={versao}>
      <header className="ranking-topo">
        <h2>Ranking</h2>
        <div className="ranking-filtros">
          <button className={!filtro ? 'ativo' : ''} onClick={() => setFiltro(null)}>
            Geral
          </button>
          {LISTA_MODOS.map((m) => (
            <button
              key={m.id}
              className={filtro === m.id ? 'ativo' : ''}
              onClick={() => setFiltro(m.id)}
            >
              {m.nome}
            </button>
          ))}
        </div>
      </header>

      {lista.length === 0 ? (
        <p className="vazio">Ninguém jogou ainda. Seja o primeiro!</p>
      ) : (
        <ol className="ranking-lista">
          {lista.map((p, i) => (
            <li key={p.id} className={p.id === destaqueId ? 'destaque' : ''}>
              <span className="pos">{MEDALHAS[i] ?? `${i + 1}º`}</span>
              <span className="nome">{p.nome}</span>
              <span className="modo">{p.modo}</span>
              <span className="pts">{p.pontos}</span>
            </li>
          ))}
        </ol>
      )}

      {lista.length > 0 && (
        <button
          className="limpar"
          onClick={() => {
            if (confirm('Apagar todo o ranking?')) {
              limparRanking()
              setVersao((v) => v + 1)
            }
          }}
        >
          limpar ranking
        </button>
      )}
    </section>
  )
}
