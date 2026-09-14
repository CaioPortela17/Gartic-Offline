/**
 * SISTEMA DE PALAVRAS E DESENHOS  —  responsabilidade: Magno
 *
 * É a API que o resto do jogo usa. Ninguém precisa importar o banco cru:
 *
 *   const sorteador = criarSorteador({ modo: 'medio' })
 *   const rodada = sorteador.sortear()
 *   rodada.exibicao        -> [{ letra:'G', revelada:true }, ...] pros quadradinhos
 *   rodada.nitidez         -> 0..1 pro quanto a imagem já está nítida
 *   const depois = aplicarLetra(rodada, 'A')
 */

import { PALAVRAS } from '../dados/palavras.js'
import { criarSacola, embaralhar } from './aleatorio.js'
import { pegarModo, POOL_DO_MODO } from './dificuldade.js'

export const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

/**
 * Tira acento e joga pra maiúscula, pra "MAÇÃ" e "MACA" serem a mesma coisa.
 * normalize('NFD') separa a letra do acento e o regex apaga só o acento.
 */
export function normalizar(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
}

/** Letras distintas que o jogador precisa acertar pra fechar a palavra. */
export function letrasUnicas(palavra) {
  return [...new Set(normalizar(palavra).split('').filter((c) => ALFABETO.includes(c)))]
}

/** Filtra o banco pelo modo (e por categoria, se a tela quiser filtrar por tema). */
export function filtrarPalavras({ modo = 'facil', categoria = null } = {}) {
  const pool = POOL_DO_MODO[modo] ?? POOL_DO_MODO.facil
  return PALAVRAS.filter(
    (p) => pool.includes(p.dificuldade) && (categoria ? p.categoria === categoria : true),
  )
}

/**
 * Monta o objeto de rodada a partir de uma palavra do banco.
 * É aqui que as "letras grátis" do modo fácil são sorteadas.
 */
export function criarRodada(item, modoId) {
  const modo = pegarModo(modoId)
  const alvo = normalizar(item.palavra)
  const unicas = letrasUnicas(alvo)

  // letras que já vêm reveladas: sorteia entre as únicas, sem passar do total
  const gratis = embaralhar(unicas).slice(0, Math.min(modo.letrasGratis, unicas.length - 1))

  return {
    id: item.id,
    palavra: item.palavra,
    alvo,
    categoria: item.categoria,
    dificuldadePalavra: item.dificuldade,
    emoji: item.emoji,
    imagem: item.imagem ?? null,
    dica: item.dica,
    modo: modo.id,
    // estado do jogo
    acertos: gratis,              // letras corretas já descobertas
    erros: [],                    // letras chutadas que não existem na palavra
    errosPermitidos: modo.erros,
    dicaVisivel: modo.dicaAutomatica,
    estado: 'jogando',            // 'jogando' | 'vitoria' | 'derrota'
  }
}

/** Cria um sorteador com sacola (sem repetir palavra) já configurado pro modo. */
export function criarSorteador({ modo = 'facil', categoria = null } = {}) {
  const disponiveis = filtrarPalavras({ modo, categoria })
  const sacola = criarSacola(disponiveis)

  return {
    total: disponiveis.length,
    restam: () => sacola.restam(),
    reiniciar: () => sacola.reiniciar(),
    sortear() {
      const item = sacola.puxar()
      return item ? criarRodada(item, modo) : null
    },
  }
}

/**
 * Chuta uma letra. Devolve SEMPRE uma rodada nova (nunca muda a antiga),
 * porque o React só re-renderiza se o objeto mudar de identidade.
 */
export function aplicarLetra(rodada, letraBruta) {
  const letra = normalizar(letraBruta)

  if (rodada.estado !== 'jogando') return rodada
  if (letra.length !== 1 || !ALFABETO.includes(letra)) return rodada
  if (rodada.acertos.includes(letra) || rodada.erros.includes(letra)) return rodada // já tentou

  const acertou = rodada.alvo.includes(letra)
  const acertos = acertou ? [...rodada.acertos, letra] : rodada.acertos
  const erros = acertou ? rodada.erros : [...rodada.erros, letra]

  const venceu = letrasUnicas(rodada.alvo).every((l) => acertos.includes(l))
  const perdeu = erros.length >= rodada.errosPermitidos

  return {
    ...rodada,
    acertos,
    erros,
    estado: venceu ? 'vitoria' : perdeu ? 'derrota' : 'jogando',
    ultimaLetra: letra,
    ultimoResultado: acertou ? 'acerto' : 'erro',
  }
}

/** Entrega a rodada como perdida (tempo acabou / desistiu). */
export function encerrarRodada(rodada, estado = 'derrota') {
  return rodada.estado === 'jogando' ? { ...rodada, estado } : rodada
}

/** Mostra a dica (o Caio pode descontar pontos quando isso for chamado). */
export function revelarDica(rodada) {
  return rodada.dicaVisivel ? rodada : { ...rodada, dicaVisivel: true }
}

/**
 * Como a palavra deve aparecer na tela.
 * Perdeu -> mostra tudo, marcando o que o jogador não tinha achado.
 */
export function montarExibicao(rodada) {
  const original = normalizar(rodada.palavra).split('')
  return original.map((letra, i) => {
    const ehLetra = ALFABETO.includes(letra)
    const revelada = !ehLetra || rodada.acertos.includes(letra) || rodada.estado === 'derrota'
    return {
      chave: `${i}-${letra}`,
      letra: revelada ? letra : '',
      ehLetra,
      revelada,
      perdida: rodada.estado === 'derrota' && ehLetra && !rodada.acertos.includes(letra),
    }
  })
}

/**
 * Progresso 0..1 = fração das letras únicas já descobertas.
 * É o que faz a imagem ir ficando nítida.
 */
export function calcularProgresso(rodada) {
  const unicas = letrasUnicas(rodada.alvo)
  if (unicas.length === 0) return 1
  const achadas = unicas.filter((l) => rodada.acertos.includes(l)).length
  return achadas / unicas.length
}

/**
 * Nitidez da imagem, também 0..1.
 * Começa na nitidezInicial do modo e vai até 1 conforme o progresso.
 * Acabou a rodada (ganhou ou perdeu) -> revela 100%.
 */
export function calcularNitidez(rodada) {
  if (rodada.estado !== 'jogando') return 1
  const base = pegarModo(rodada.modo).nitidezInicial
  return base + (1 - base) * calcularProgresso(rodada)
}

/** Erros que ainda sobram antes de perder. */
export function errosRestantes(rodada) {
  return Math.max(0, rodada.errosPermitidos - rodada.erros.length)
}
