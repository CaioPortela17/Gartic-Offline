/**
 * TABELA DE RANKING  —  responsabilidade: Magno (dados), PrimeReact aplicado na tela de jogo
 * Serve tanto pra tela final quanto pra tela inicial (é só importar).
 */

import { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { SelectButton } from 'primereact/selectbutton'
import { Button } from 'primereact/button'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { pegarTop, limparRanking } from '../sistemas/ranking.js'
import { LISTA_MODOS } from '../sistemas/dificuldade.js'

const MEDALHAS = ['🥇', '🥈', '🥉']

const OPCOES_FILTRO = [
  { label: 'Geral', value: null },
  ...LISTA_MODOS.map((m) => ({ label: m.nome, value: m.id })),
]

export default function Ranking({ quantidade = 10, destaqueId = null }) {
  const [filtro, setFiltro] = useState(null) // null = geral
  const [versao, setVersao] = useState(0) // força reler depois de limpar
  const lista = pegarTop(quantidade, filtro)

  function pedirLimpeza() {
    confirmDialog({
      message: 'Apagar todo o ranking?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Apagar',
      rejectLabel: 'Cancelar',
      accept: () => {
        limparRanking()
        setVersao((v) => v + 1)
      },
    })
  }

  return (
    <section className="ranking" key={versao}>
      <ConfirmDialog />
      <header className="ranking-topo">
        <h2>Ranking</h2>
        <SelectButton
          value={filtro}
          onChange={(e) => setFiltro(e.value)}
          options={OPCOES_FILTRO}
          allowEmpty={false}
        />
      </header>

      {lista.length === 0 ? (
        <p className="vazio">Ninguém jogou ainda. Seja o primeiro!</p>
      ) : (
        <DataTable
          value={lista.map((p, i) => ({ ...p, posicao: i + 1 }))}
          size="small"
          rowClassName={(p) => (p.id === destaqueId ? 'linha-destaque' : '')}
        >
          <Column
            header="#"
            body={(p, { rowIndex }) => MEDALHAS[rowIndex] ?? p.posicao}
            style={{ width: '3rem' }}
          />
          <Column field="nome" header="Nome" />
          <Column
            field="modo"
            header="Modo"
            body={(p) => LISTA_MODOS.find((m) => m.id === p.modo)?.nome ?? p.modo}
          />
          <Column field="pontos" header="Pontos" body={(p) => <strong>{p.pontos}</strong>} />
        </DataTable>
      )}

      {lista.length > 0 && (
        <Button
          label="limpar ranking"
          icon="pi pi-trash"
          text
          severity="secondary"
          size="small"
          className="limpar"
          onClick={pedirLimpeza}
        />
      )}
    </section>
  )
}
