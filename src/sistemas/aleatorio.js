/**
 * ALEATORIEDADE  —  responsabilidade: Magno
 *
 * Duas coisas aqui:
 *  1. embaralhar() — Fisher-Yates, sorteio honesto (o sort(() => Math.random() - 0.5)
 *     que todo mundo usa é viciado, não use).
 *  2. criarSacola() — "sacola de bingo": sorteia sem repetir até acabar a lista e
 *     só então reembaralha. É isso que evita a mesma palavra cair 3x seguidas.
 */

/** Cópia embaralhada do array (não mexe no original). */
export function embaralhar(lista) {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

/** Um item aleatório do array. Devolve null se a lista estiver vazia. */
export function sortearUm(lista) {
  if (!lista || lista.length === 0) return null
  return lista[Math.floor(Math.random() * lista.length)]
}

/**
 * Sacola de sorteio sem repetição.
 *
 *   const sacola = criarSacola(PALAVRAS)
 *   sacola.puxar()   -> próxima palavra, nunca repete enquanto tiver item na sacola
 *   sacola.restam()  -> quantas ainda faltam pra virar a rodada
 *   sacola.reiniciar()
 *
 * Quando a sacola esvazia ela reembaralha sozinha, e ainda garante que o primeiro
 * item da nova rodada não seja igual ao último da rodada anterior.
 */
export function criarSacola(itens) {
  let restantes = embaralhar(itens)
  let ultimo = null

  function reabastecer() {
    restantes = embaralhar(itens)
    // evita repetir na virada da sacola
    if (itens.length > 1 && ultimo && restantes[0] === ultimo) {
      ;[restantes[0], restantes[restantes.length - 1]] = [restantes[restantes.length - 1], restantes[0]]
    }
  }

  return {
    puxar() {
      if (itens.length === 0) return null
      if (restantes.length === 0) reabastecer()
      ultimo = restantes.pop()
      return ultimo
    },
    restam: () => restantes.length,
    reiniciar() {
      ultimo = null
      reabastecer()
    },
  }
}
