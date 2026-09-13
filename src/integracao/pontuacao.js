/**
 * PONTUAÇÃO  —  responsabilidade: CAIO
 *
 * Isto aqui é só um provisório pro jogo rodar enquanto o sistema de verdade não vem.
 * Caio: pode apagar o corpo da função e escrever o seu, só mantenha a assinatura,
 * porque o ranking e o useJogo chamam exatamente assim:
 *
 *   pontosDaRodada({ rodada, modo, segundosRestantes })  ->  number
 *
 * Dados que você tem em mãos:
 *   rodada.estado             'vitoria' | 'derrota'
 *   rodada.acertos / .erros   arrays de letras
 *   rodada.dicaVisivel        true se o jogador usou a dica
 *   modo.multiplicador        1 (fácil), 2 (médio), 3 (difícil)
 *   segundosRestantes         null quando o modo não tem tempo
 */

export function pontosDaRodada({ rodada, modo, segundosRestantes }) {
  if (rodada.estado !== 'vitoria') return 0

  const base = 50
  const porLetra = rodada.acertos.length * 10
  const penalidadeErro = rodada.erros.length * 15
  const bonusTempo = segundosRestantes ? Math.round(segundosRestantes / 2) : 0
  const penalidadeDica = rodada.dicaVisivel && !modo.dicaAutomatica ? 20 : 0

  const total = (base + porLetra + bonusTempo - penalidadeErro - penalidadeDica) * modo.multiplicador
  return Math.max(0, total)
}
