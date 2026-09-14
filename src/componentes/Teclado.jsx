/**
 * TECLADO  —  Magno (versão base pra testar; o visual final é do layout)
 * Aceita clique e também digitação no teclado físico.
 */

import { useEffect } from 'react'
import { Button } from 'primereact/button'
import { ALFABETO, normalizar } from '../sistemas/palavras.js'

export default function Teclado({ rodada, aoChutar, desativado = false }) {
  useEffect(() => {
    function aoDigitar(e) {
      if (desativado || e.ctrlKey || e.altKey || e.metaKey) return
      const letra = normalizar(e.key)
      if (letra.length === 1 && ALFABETO.includes(letra)) aoChutar(letra)
    }
    window.addEventListener('keydown', aoDigitar)
    return () => window.removeEventListener('keydown', aoDigitar)
  }, [aoChutar, desativado])

  return (
    <div className="teclado">
      {ALFABETO.map((letra) => {
        const acertou = rodada.acertos.includes(letra)
        const errou = rodada.erros.includes(letra)
        return (
          <Button
            key={letra}
            label={letra}
            className="tecla"
            severity={acertou ? 'success' : errou ? 'danger' : 'secondary'}
            outlined={!acertou && !errou}
            onClick={() => aoChutar(letra)}
            disabled={desativado || acertou || errou}
          />
        )
      })}
    </div>
  )
}
