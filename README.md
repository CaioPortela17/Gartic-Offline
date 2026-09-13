# Forca Gartic

Jogo de forca onde, além dos quadradinhos da palavra, aparece embaixo a **imagem do que é a coisa** — ela começa borrada e vai ficando nítida conforme o jogador acerta letras.

```bash
npm install
npm run dev
```

## Divisão do trabalho

| Pessoa | Parte | Onde fica |
|---|---|---|
| Ana | Página inicial | substitui o componente `Inicio` em `src/App.jsx` |
| (layout) | Página de desenho | substitui o componente `Jogo` em `src/App.jsx` |
| Caio | Pontuação | `src/integracao/pontuacao.js` |
| Magno | Palavras, desenhos, dificuldade e ranking | `src/dados/`, `src/sistemas/`, `src/componentes/` |

`src/App.jsx` inteiro é **provisório** — está lá só pra provar que tudo funciona junto. Ana e o layout podem jogar fora e usar os mesmos componentes/hook.

## O que já está pronto (parte do Magno)

### Palavras e desenhos
- `src/dados/palavras.js` — 60 palavras (20 por dificuldade), com categoria, emoji (o "desenho") e dica. Tem um campo `imagem` opcional: se preencher com um caminho de PNG/SVG, o jogo usa a imagem no lugar do emoji sem precisar mudar mais nada.
- `src/sistemas/palavras.js` — a API do jogo. Compara ignorando acento (`MAÇÃ` = `MACA`).

### Aleatoriedade
- `src/sistemas/aleatorio.js` — embaralhamento Fisher-Yates e "sacola de bingo": a palavra só pode repetir depois que todas as outras já saíram.

### Modos
`src/sistemas/dificuldade.js` — tudo que muda entre os modos está num lugar só:

| | Fácil | Médio | Difícil |
|---|---|---|---|
| erros permitidos | 7 | 5 | 3 |
| letras de graça | 1 | 0 | 0 |
| imagem já visível no início | 25% | 10% | 0% |
| tempo | sem | 90s | 60s |
| dica | automática | sob pedido | sob pedido |
| multiplicador de pontos | x1 | x2 | x3 |

### Ranking
`src/sistemas/ranking.js` — localStorage, sem banco. Ranking geral e por modo, top N, melhor pontuação, resumo por modo e limpar.

## Como usar (pra Ana e pro layout)

```jsx
import { usarJogo } from './ganchos/usarJogo.js'
import { calcularNitidez, errosRestantes } from './sistemas/palavras.js'
import ImagemRevelada from './componentes/ImagemRevelada.jsx'

const jogo = usarJogo({ modo: 'medio', categoria: null })

jogo.rodada          // { palavra, emoji, dica, categoria, acertos, erros, estado }
jogo.pontos          // pontos da partida
jogo.segundos        // null se o modo não tem tempo
jogo.numeroRodada    // 1..5
jogo.chutar('A')
jogo.usarDica()
jogo.proximaRodada()
jogo.reiniciar()
jogo.salvarNoRanking('Magno')   // -> { posicao, total, entrada }

<ImagemRevelada
  emoji={jogo.rodada.emoji}
  imagem={jogo.rodada.imagem}
  nitidez={calcularNitidez(jogo.rodada)}   // 0 a 1
/>
```

Componentes prontos pra reaproveitar: `ImagemRevelada`, `PainelPalavra`, `Teclado`, `Ranking`. Os estilos em `src/estilos.css` são provisórios, pode reescrever à vontade.

## Como o Caio encaixa a pontuação

Só mexer no corpo de `pontosDaRodada` em `src/integracao/pontuacao.js`, mantendo a assinatura:

```js
pontosDaRodada({ rodada, modo, segundosRestantes }) -> number
```

O hook chama isso automaticamente quando a rodada acaba, e o resultado já vai parar no ranking.

## Pra adicionar palavras

Só acrescentar no array de `src/dados/palavras.js`. Regra que usei:
- **fácil**: 4 a 6 letras, palavra do dia a dia
- **médio**: 6 a 9 letras, ou com acento
- **difícil**: 9+ letras, composta ou pouco comum

Nunca reaproveitar `id` de palavra apagada — o ranking guarda esses ids.
