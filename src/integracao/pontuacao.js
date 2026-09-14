/**
 * PONTUAÇÃO  —  responsabilidade: Caio
 *
 *   pontosDaRodada({ rodada, modo, segundosRestantes })  ->  number
 *
 * Regras:
 *  - só pontua vitória; derrota vale 0.
 *  - base fixa + 10 por letra única acertada (recompensa palavra grande e letras grátis não contam
 *    contra o jogador, já que vêm dentro de `acertos`).
 *  - bônus de rodada limpa (sem nenhum erro) — prêmio por precisão, não só por vencer.
 *  - bônus de tempo restante, só existe nos modos com cronômetro.
 *  - desconta por erro e por ter pedido dica (só quando a dica não é automática do modo).
 *  - tudo multiplicado pelo multiplicador do modo (x1/x2/x3), pra dificuldade valer a pena.
 *  - nunca devolve negativo.
 */

const BASE_VITORIA = 50
const PONTOS_POR_LETRA = 10
const PENALIDADE_POR_ERRO = 15
const PENALIDADE_DICA = 20
const BONUS_RODADA_LIMPA = 30

export function pontosDaRodada({ rodada, modo, segundosRestantes }) {
  if (rodada.estado !== 'vitoria') return 0

  const porLetra = rodada.acertos.length * PONTOS_POR_LETRA
  const penalidadeErro = rodada.erros.length * PENALIDADE_POR_ERRO
  const bonusSemErro = rodada.erros.length === 0 ? BONUS_RODADA_LIMPA : 0
  const bonusTempo = segundosRestantes != null ? Math.round(segundosRestantes / 2) : 0
  const usouDicaPaga = rodada.dicaVisivel && !modo.dicaAutomatica
  const penalidadeDica = usouDicaPaga ? PENALIDADE_DICA : 0

  const bruto =
    BASE_VITORIA + porLetra + bonusSemErro + bonusTempo - penalidadeErro - penalidadeDica

  return Math.max(0, Math.round(bruto * modo.multiplicador))
}
