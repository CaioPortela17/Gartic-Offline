/**
 * IMAGEM QUE VAI FICANDO NÍTIDA  —  responsabilidade: Magno
 *
 * Recebe nitidez de 0 a 1 (vem de calcularNitidez) e traduz em CSS:
 *   blur     30px -> 0px
 *   opacity  0.25 -> 1
 *   escala de cinza  100% -> 0%  (a cor só volta no fim, dá aquele efeito de "revelou")
 *
 * Funciona igual pra emoji e pra imagem de verdade, então dá pra trocar os emojis
 * por PNG/SVG depois só preenchendo o campo `imagem` no banco de palavras.
 */

export default function ImagemRevelada({ emoji, imagem, nitidez = 0, alt = 'desenho da palavra', compacta = false }) {
  const n = Math.min(1, Math.max(0, nitidez))

  const estilo = {
    filter: `blur(${(1 - n) * 30}px) grayscale(${(1 - n) * 100}%)`,
    opacity: 0.25 + n * 0.75,
    transform: `scale(${0.9 + n * 0.1})`,
    transition: 'filter .5s ease, opacity .5s ease, transform .5s ease',
  }

  if (compacta) {
    return (
      <div className="imagem-mini">
        <div className="quadro">
          {imagem ? (
            <img src={imagem} alt={alt} style={estilo} />
          ) : (
            <span style={estilo} role="img" aria-label={alt}>{emoji}</span>
          )}
        </div>
        <small>a palavra</small>
      </div>
    )
  }

  return (
    <div className="imagem-revelada">
      {imagem ? (
        <img src={imagem} alt={alt} style={estilo} />
      ) : (
        <span className="imagem-emoji" style={estilo} role="img" aria-label={alt}>
          {emoji}
        </span>
      )}
      <div className="imagem-barra">
        <div className="imagem-barra-preenchida" style={{ width: `${n * 100}%` }} />
      </div>
    </div>
  )
}
