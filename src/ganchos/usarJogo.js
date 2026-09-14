/**
 * HOOK DO JOGO  —  Magno (cola entre as partes)
 *
 * Junta sorteio + dificuldade + tempo + pontuação (do Caio) + ranking.
 * O layout da página de desenho (do outro integrante) e a inicial (Ana) só consomem isto.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  aplicarLetra,
  criarSorteador,
  encerrarRodada,
  revelarDica,
} from '../sistemas/palavras.js'
import { pegarModo } from '../sistemas/dificuldade.js'
import { pontosDaRodada } from '../integracao/pontuacao.js'
import { salvarPartida } from '../sistemas/ranking.js'

const RODADAS_POR_PARTIDA = 5

export function usarJogo({ modo: modoId = 'facil', categoria = null } = {}) {
  const modo = useMemo(() => pegarModo(modoId), [modoId])
  // recria o sorteador quando troca de modo/categoria — sacola nova, sem repetição
  const sorteador = useMemo(() => criarSorteador({ modo: modoId, categoria }), [modoId, categoria])

  const [rodada, setRodada] = useState(() => sorteador.sortear())
  const [pontos, setPontos] = useState(0)
  const [numeroRodada, setNumeroRodada] = useState(1)
  const [segundos, setSegundos] = useState(modo.tempo)
  const [partidaAcabou, setPartidaAcabou] = useState(false)
  const [historico, setHistorico] = useState([])
  const jaPontuou = useRef(false)

  // ---- cronômetro (só nos modos que têm tempo)
  useEffect(() => {
    if (modo.tempo == null || !rodada || rodada.estado !== 'jogando') return
    const t = setInterval(() => {
      setSegundos((s) => {
        if (s <= 1) {
          setRodada((r) => encerrarRodada(r, 'derrota'))
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [modo.tempo, rodada?.id, rodada?.estado])

  // ---- fim de rodada: pontua uma vez só e guarda no histórico
  useEffect(() => {
    if (!rodada || rodada.estado === 'jogando' || jaPontuou.current) return
    jaPontuou.current = true
    const ganhos = pontosDaRodada({ rodada, modo, segundosRestantes: segundos })
    setPontos((p) => p + ganhos)
    setHistorico((h) => [...h, { palavra: rodada.palavra, estado: rodada.estado, pontos: ganhos }])
  }, [rodada?.estado])

  const chutar = useCallback((letra) => setRodada((r) => (r ? aplicarLetra(r, letra) : r)), [])
  const usarDica = useCallback(() => setRodada((r) => (r ? revelarDica(r) : r)), [])
  const desistir = useCallback(() => setRodada((r) => (r ? encerrarRodada(r, 'derrota') : r)), [])

  const proximaRodada = useCallback(() => {
    if (numeroRodada >= RODADAS_POR_PARTIDA) {
      setPartidaAcabou(true)
      return
    }
    const nova = sorteador.sortear()
    if (!nova) {
      setPartidaAcabou(true)
      return
    }
    jaPontuou.current = false
    setRodada(nova)
    setSegundos(modo.tempo)
    setNumeroRodada((n) => n + 1)
  }, [numeroRodada, sorteador, modo.tempo])

  const reiniciar = useCallback(() => {
    sorteador.reiniciar()
    jaPontuou.current = false
    setRodada(sorteador.sortear())
    setPontos(0)
    setNumeroRodada(1)
    setSegundos(modo.tempo)
    setPartidaAcabou(false)
    setHistorico([])
  }, [sorteador, modo.tempo])

  /** Fecha a partida gravando no ranking. Devolve { posicao, total, entrada }. */
  const salvarNoRanking = useCallback(
    (nome) =>
      salvarPartida({
        nome,
        pontos,
        modo: modo.id,
        acertos: historico.filter((h) => h.estado === 'vitoria').length,
        erros: historico.filter((h) => h.estado === 'derrota').length,
        palavras: historico.length,
      }),
    [pontos, modo.id, historico],
  )

  return {
    modo,
    rodada,
    pontos,
    segundos,
    numeroRodada,
    totalRodadas: RODADAS_POR_PARTIDA,
    partidaAcabou,
    historico,
    chutar,
    usarDica,
    desistir,
    proximaRodada,
    reiniciar,
    salvarNoRanking,
  }
}
