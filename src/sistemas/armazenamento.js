/**
 * WRAPPER DO LOCALSTORAGE  —  responsabilidade: Magno
 *
 * Existe por dois motivos:
 *  - localStorage quebra em aba anônima / storage cheio, e um throw aqui derruba a tela toda;
 *  - JSON.parse de dado corrompido também quebra.
 * Então tudo passa por try/catch e, no pior caso, o jogo roda sem salvar nada.
 */

const PREFIXO = 'forca:'

export function ler(chave, padrao = null) {
  try {
    const bruto = localStorage.getItem(PREFIXO + chave)
    if (bruto === null) return padrao
    return JSON.parse(bruto)
  } catch {
    return padrao
  }
}

export function gravar(chave, valor) {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor))
    return true
  } catch {
    return false
  }
}

export function apagar(chave) {
  try {
    localStorage.removeItem(PREFIXO + chave)
    return true
  } catch {
    return false
  }
}
