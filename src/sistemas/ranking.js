/**
 * RANKING  —  responsabilidade: Magno
 *
 * Só localStorage, sem banco. Guarda uma lista única de partidas e filtra na hora
 * de mostrar — assim dá pra ter ranking geral e ranking por modo sem duplicar dado.
 *
 * Formato salvo em forca:ranking
 *   [{ id, nome, pontos, modo, acertos, erros, palavras, data }]
 *
 * Regra de ordenação: mais pontos primeiro; empate -> menos erros; empate ainda -> mais antigo
 * (quem chegou primeiro fica na frente).
 */

import { ler, gravar, apagar } from './armazenamento.js'
import { pegarModo } from './dificuldade.js'

const CHAVE = 'ranking'
const CHAVE_NOME = 'ultimoNome'
const LIMITE = 100 // quantas partidas ficam guardadas no total

/** Todas as partidas salvas, já ordenadas. */
export function lerRanking() {
  const lista = ler(CHAVE, [])
  return Array.isArray(lista) ? [...lista].sort(comparar) : []
}

function comparar(a, b) {
  if (b.pontos !== a.pontos) return b.pontos - a.pontos
  if (a.erros !== b.erros) return a.erros - b.erros
  return a.data - b.data
}

/**
 * Salva uma partida no ranking.
 *
 *   salvarPartida({ nome: 'Magno', pontos: 320, modo: 'medio', acertos: 8, erros: 2, palavras: 10 })
 *
 * Devolve { posicao, total, entrada } pra tela poder mostrar "você ficou em 3º".
 */
export function salvarPartida({ nome, pontos, modo, acertos = 0, erros = 0, palavras = 0 }) {
  const entrada = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    nome: limparNome(nome),
    pontos: Math.max(0, Math.round(Number(pontos) || 0)),
    modo: pegarModo(modo).id,
    acertos,
    erros,
    palavras,
    data: Date.now(),
  }

  const lista = [...lerRanking(), entrada].sort(comparar).slice(0, LIMITE)
  gravar(CHAVE, lista)
  gravar(CHAVE_NOME, entrada.nome) // pra já vir preenchido na próxima partida

  return {
    entrada,
    posicao: lista.findIndex((p) => p.id === entrada.id) + 1, // 0 = não entrou no top LIMITE
    total: lista.length,
  }
}

/**
 * Top N. Sem modo -> ranking geral.
 *   pegarTop(5)            geral
 *   pegarTop(5, 'dificil') só do difícil
 */
export function pegarTop(quantidade = 10, modo = null) {
  const lista = lerRanking()
  return (modo ? lista.filter((p) => p.modo === modo) : lista).slice(0, quantidade)
}

/** Melhor pontuação já feita (opcionalmente num modo só). */
export function melhorPontuacao(modo = null) {
  return pegarTop(1, modo)[0] ?? null
}

/** Resumo por modo, útil pra tela inicial da Ana: { facil: {...}, medio: {...} } */
export function resumoPorModo() {
  const lista = lerRanking()
  const resumo = {}
  for (const modo of ['facil', 'medio', 'dificil']) {
    const doModo = lista.filter((p) => p.modo === modo)
    resumo[modo] = {
      partidas: doModo.length,
      melhor: doModo[0]?.pontos ?? 0,
      melhorNome: doModo[0]?.nome ?? null,
    }
  }
  return resumo
}

export function limparRanking() {
  return apagar(CHAVE)
}

export function ultimoNome() {
  return ler(CHAVE_NOME, '')
}

/** Nome sem espaço sobrando, no máximo 14 caracteres, e nunca vazio. */
function limparNome(nome) {
  const limpo = String(nome ?? '').trim().slice(0, 14)
  return limpo || 'Anônimo'
}
