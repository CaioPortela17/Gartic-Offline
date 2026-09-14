/**
 * BONECO DA FORCA
 *
 * O poste/trave/corda ficam sempre visíveis (o "cadafalso"). A cada erro, mais um
 * pedaço do boneco é "desenhado" (cabeça, tronco, 2 braços, 2 pernas = 6 partes),
 * escalado pra sempre completar o boneco exatamente no erro que perde a rodada,
 * não importa se o modo permite 3, 5 ou 7 erros.
 */

const PARTES = ['cabeca', 'tronco', 'bracoE', 'bracoD', 'pernaE', 'pernaD']

function partesVisiveis(erros, errosPermitidos) {
  if (errosPermitidos <= 0) return 0
  const fracao = erros / errosPermitidos
  return Math.max(0, Math.min(PARTES.length, Math.ceil(fracao * PARTES.length)))
}

export default function BonecoForca({ erros, errosPermitidos, perdeu = false }) {
  const visiveis = partesVisiveis(erros, errosPermitidos)
  const mostrar = (parte) => visiveis >= PARTES.indexOf(parte) + 1

  return (
    <svg className="boneco-forca" viewBox="0 0 160 190" role="img" aria-label={`${erros} de ${errosPermitidos} erros`}>
      {/* cadafalso */}
      <line className="traco cadafalso" x1="14" y1="176" x2="90" y2="176" pathLength="1" />
      <line className="traco cadafalso" x1="38" y1="176" x2="38" y2="16" pathLength="1" />
      <line className="traco cadafalso" x1="38" y1="16" x2="108" y2="16" pathLength="1" />
      <line className="traco cadafalso" x1="108" y1="16" x2="108" y2="36" pathLength="1" />

      {/* boneco */}
      <circle
        className={`traco boneco ${mostrar('cabeca') ? 'visivel' : ''}`}
        cx="108" cy="52" r="16" pathLength="1"
      />
      {mostrar('cabeca') && perdeu && (
        <g className="rosto">
          <line x1="101" y1="46" x2="107" y2="52" />
          <line x1="107" y1="46" x2="101" y2="52" />
          <line x1="109" y1="46" x2="115" y2="52" />
          <line x1="115" y1="46" x2="109" y2="52" />
        </g>
      )}
      <line
        className={`traco boneco ${mostrar('tronco') ? 'visivel' : ''}`}
        x1="108" y1="68" x2="108" y2="120" pathLength="1"
      />
      <line
        className={`traco boneco ${mostrar('bracoE') ? 'visivel' : ''}`}
        x1="108" y1="80" x2="86" y2="104" pathLength="1"
      />
      <line
        className={`traco boneco ${mostrar('bracoD') ? 'visivel' : ''}`}
        x1="108" y1="80" x2="130" y2="104" pathLength="1"
      />
      <line
        className={`traco boneco ${mostrar('pernaE') ? 'visivel' : ''}`}
        x1="108" y1="120" x2="90" y2="156" pathLength="1"
      />
      <line
        className={`traco boneco ${mostrar('pernaD') ? 'visivel' : ''}`}
        x1="108" y1="120" x2="126" y2="156" pathLength="1"
      />
    </svg>
  )
}
