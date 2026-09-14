/**
 * TELA DE JOGO
 *
 * A "página de desenho" que o README deixava em aberto pro layout de alguém do grupo —
 * ninguém tinha pego ainda. Só monta a UI: toda a lógica continua em usarJogo/sistemas/*.
 */

import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { ProgressBar } from 'primereact/progressbar'
import { Message } from 'primereact/message'
import PainelPalavra from './PainelPalavra.jsx'
import Teclado from './Teclado.jsx'
import ImagemRevelada from './ImagemRevelada.jsx'
import BonecoForca from './BonecoForca.jsx'
import { calcularNitidez, errosRestantes } from '../sistemas/palavras.js'

export default function TelaJogo({ jogo, aoSair }) {
  const { rodada, modo } = jogo
  const acabou = rodada.estado !== 'jogando'
  const vidas = errosRestantes(rodada)

  return (
    <main className="tela jogo">
      <Card className="hud-card">
        <div className="hud">
          <Tag value={modo.nome} style={{ background: modo.cor, color: '#10121a' }} />
          <span>rodada {jogo.numeroRodada}/{jogo.totalRodadas}</span>
          <span className="hud-pontos">
            <i className="pi pi-star-fill" /> {jogo.pontos} pts
          </span>
          <span className={vidas <= 1 ? 'hud-vidas critico' : 'hud-vidas'}>
            <i className="pi pi-heart-fill" /> {vidas}
          </span>
          {jogo.segundos != null && (
            <span className="hud-tempo">
              <i className="pi pi-clock" /> {jogo.segundos}s
            </span>
          )}
          <Button icon="pi pi-times" text severity="secondary" onClick={aoSair} aria-label="sair" />
        </div>
        {jogo.segundos != null && (
          <ProgressBar
            value={(jogo.segundos / modo.tempo) * 100}
            showValue={false}
            style={{ height: 6 }}
          />
        )}
      </Card>

      <BonecoForca
        erros={rodada.erros.length}
        errosPermitidos={rodada.errosPermitidos}
        perdeu={rodada.estado === 'derrota'}
      />

      <PainelPalavra rodada={rodada} />

      <ImagemRevelada
        compacta
        emoji={rodada.emoji}
        imagem={rodada.imagem}
        nitidez={calcularNitidez(rodada)}
        alt={acabou ? rodada.palavra : 'desenho da palavra secreta'}
      />

      <p className="categoria">{rodada.categoria}</p>

      {rodada.dicaVisivel ? (
        <Message severity="warn" text={rodada.dica} icon="pi pi-lightbulb" />
      ) : (
        !acabou && (
          <Button
            label="ver dica (-20 pts)"
            icon="pi pi-lightbulb"
            link
            onClick={jogo.usarDica}
          />
        )
      )}

      <Teclado rodada={rodada} aoChutar={jogo.chutar} desativado={acabou} />

      {acabou && (
        <div className="resultado">
          <p className="linha">
            <span className={`selo ${rodada.estado === 'vitoria' ? 'vitoria' : 'derrota'}`}>
              {rodada.estado === 'vitoria' ? '✓' : '✕'}
            </span>
            {rodada.estado === 'vitoria' ? 'Acertou!' : 'Era'} <strong>{rodada.palavra}</strong>
          </p>
          <Button
            label={jogo.numeroRodada >= jogo.totalRodadas ? 'ver resultado' : 'próxima palavra'}
            onClick={jogo.proximaRodada}
          />
        </div>
      )}
    </main>
  )
}
