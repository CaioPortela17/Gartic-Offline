/**
 * QUADRADINHOS DA PALAVRA  —  Magno (versão base; o layout final é do outro integrante)
 */

import { montarExibicao } from '../sistemas/palavras.js'

export default function PainelPalavra({ rodada }) {
  const letras = montarExibicao(rodada)

  return (
    <div className="painel-palavra" aria-label="palavra a adivinhar">
      {letras.map((l) => (
        <span
          key={l.chave}
          className={
            'letra' +
            (l.revelada ? ' revelada' : '') +
            (l.perdida ? ' perdida' : '') +
            (l.ehLetra ? '' : ' separador')
          }
        >
          {l.letra || ' '}
        </span>
      ))}
    </div>
  )
}
