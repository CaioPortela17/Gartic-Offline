/**
 * SELEÇÃO DE MODO E CATEGORIA
 *
 * Ponte entre a tela inicial (Ana) e o jogo: deixa escolher dificuldade/categoria,
 * que já existem prontas em sistemas/dificuldade.js e dados/palavras.js mas antes
 * não tinham nenhuma tela que desse acesso a elas.
 */

import { useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { Dialog } from 'primereact/dialog'
import { LISTA_MODOS } from '../sistemas/dificuldade.js'
import { CATEGORIAS_DISPONIVEIS } from '../dados/palavras.js'
import { resumoPorModo } from '../sistemas/ranking.js'
import Ranking from './Ranking.jsx'

export default function SelecaoModo({ onEscolher }) {
  const [modo, setModo] = useState(LISTA_MODOS[0].id)
  const [categoria, setCategoria] = useState(null)
  const [rankingAberto, setRankingAberto] = useState(false)
  const resumo = resumoPorModo()

  const opcoesCategoria = [
    { label: 'Todas as categorias', value: null },
    ...CATEGORIAS_DISPONIVEIS.map((c) => ({ label: c, value: c })),
  ]

  return (
    <main className="tela selecao">
      <h1>Forca</h1>
      <p className="sub">Escolha a dificuldade e comece a jogar</p>

      <div className="modos">
        {LISTA_MODOS.map((m) => {
          const ativo = modo === m.id
          const melhor = resumo[m.id]?.melhor ?? 0
          return (
            <Card
              key={m.id}
              className={`modo-card${ativo ? ' ativo' : ''}`}
              style={{ borderColor: ativo ? m.cor : undefined }}
              onClick={() => setModo(m.id)}
            >
              <strong style={{ color: m.cor }}>{m.nome}</strong>
              <small>
                {m.erros} erros · {m.tempo ? `${m.tempo}s por rodada` : 'sem tempo'}
              </small>
              <Tag value={`x${m.multiplicador} pontos`} style={{ background: m.cor, color: '#10121a' }} />
              {melhor > 0 && <small className="recorde">recorde: {melhor} pts</small>}
            </Card>
          )
        })}
      </div>

      <label className="campo">
        Categoria
        <Dropdown
          value={categoria}
          onChange={(e) => setCategoria(e.value)}
          options={opcoesCategoria}
          placeholder="Todas as categorias"
        />
      </label>

      <Button
        label="Jogar"
        icon="pi pi-play"
        size="large"
        onClick={() => onEscolher({ modo, categoria })}
      />
      <Button label="ver ranking" link onClick={() => setRankingAberto(true)} />

      <Dialog
        header="Ranking"
        visible={rankingAberto}
        onHide={() => setRankingAberto(false)}
        style={{ width: '90vw', maxWidth: 480 }}
      >
        <Ranking quantidade={10} />
      </Dialog>
    </main>
  )
}
