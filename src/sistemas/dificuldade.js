/**
 * MODOS DE DIFICULDADE  —  responsabilidade: Magno
 *
 * Tudo que muda entre fácil/médio/difícil está centralizado aqui.
 * Se quiser balancear o jogo depois, mexe só neste arquivo.
 */

export const MODOS = {
  facil: {
    id: 'facil',
    nome: 'Fácil',
    cor: '#3ecf8e',
    // quantos erros o jogador aguenta antes de perder
    erros: 7,
    // quantas letras já vêm reveladas de graça no começo (sorteadas)
    letrasGratis: 1,
    // quanto da imagem já aparece antes de acertar qualquer letra (0 a 1)
    nitidezInicial: 0.25,
    // segundos por rodada. null = sem tempo
    tempo: null,
    // a dica aparece sozinha desde o início?
    dicaAutomatica: true,
    // multiplicador entregue pro sistema de pontuação do Caio
    multiplicador: 1,
  },
  medio: {
    id: 'medio',
    nome: 'Médio',
    cor: '#f5a623',
    erros: 5,
    letrasGratis: 0,
    nitidezInicial: 0.1,
    tempo: 90,
    dicaAutomatica: false,
    multiplicador: 2,
  },
  dificil: {
    id: 'dificil',
    nome: 'Difícil',
    cor: '#ff5c5c',
    erros: 3,
    letrasGratis: 0,
    nitidezInicial: 0,
    tempo: 60,
    dicaAutomatica: false,
    multiplicador: 3,
  },
}

export const LISTA_MODOS = Object.values(MODOS)

/** Devolve a config do modo. Se vier um id errado, cai no fácil em vez de quebrar a tela. */
export function pegarModo(id) {
  return MODOS[id] ?? MODOS.facil
}

/**
 * Quais dificuldades de palavra entram no sorteio de cada modo.
 * O difícil também sorteia palavra média pra rodada não ficar cansativa demais.
 */
export const POOL_DO_MODO = {
  facil: ['facil'],
  medio: ['facil', 'medio'],
  dificil: ['medio', 'dificil'],
}
