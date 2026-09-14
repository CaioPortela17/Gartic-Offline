/**
 * TELA DE FIM DE PARTIDA
 * Salva no ranking e mostra a posição — antes vivia dentro do App.jsx provisório.
 */

import { useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import Ranking from './Ranking.jsx'
import { ultimoNome } from '../sistemas/ranking.js'

export default function TelaFim({ jogo, aoSair }) {
  const [nome, setNome] = useState(ultimoNome())
  const [salvo, setSalvo] = useState(null)

  return (
    <main className="tela fim">
      <h1>Fim de partida</h1>
      <p className="pontuacao-final">{jogo.pontos} pontos</p>

      {!salvo ? (
        <Card className="salvar-card">
          <div className="salvar">
            <InputText
              value={nome}
              maxLength={14}
              placeholder="seu nome"
              onChange={(e) => setNome(e.target.value)}
            />
            <Button label="salvar no ranking" icon="pi pi-save" onClick={() => setSalvo(jogo.salvarNoRanking(nome))} />
          </div>
        </Card>
      ) : (
        <p className="posicao">
          <i className="pi pi-trophy" /> Você ficou em {salvo.posicao}º de {salvo.total}!
        </p>
      )}

      <Ranking quantidade={10} destaqueId={salvo?.entrada.id} />

      <div className="acoes">
        <Button label="jogar de novo" icon="pi pi-refresh" onClick={jogo.reiniciar} />
        <Button label="trocar modo" icon="pi pi-sliders-h" severity="secondary" outlined onClick={aoSair} />
      </div>
    </main>
  )
}
