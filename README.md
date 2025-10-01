# Mapa de Calor de Jogadores de Futebol em Tempo Real

Este projeto simula sensores em jogadores de futebol, transmitindo dados de batimentos cardíacos, velocidade e posição via **Socket.io** para um frontend que exibe o mapa de calor em tempo real.

## Funcionalidades

- Simulação de dados de sensores (bpm, velocidade, posição x/y) para jogadores.
- Transmissão dos dados via WebSocket (Socket.io).
- Visualização do mapa de calor do jogador selecionado.
- Exibição dos dados do sensor em tempo real.
- Interface estilizada e responsiva.

## Estrutura de Pastas

```
T-picos-Avan-ados_Atividade_1/
│
├── public/
│   ├── index.html
│   ├── style.css
│   ├── live.js
│   └── campo.png
│
└── server.js
```

## Como executar

1. **Instale as dependências:**
   ```bash
   npm install express socket.io
   ```

2. **Inicie o servidor backend:**
   ```bash
   node server.js
   ```

3. **Acesse o frontend:**
   Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Como funciona

- O backend (`server.js`) simula dados dos jogadores e transmite via socket.io.
- O frontend (`public/index.html` + `live.js`) recebe os dados e desenha o mapa de calor no canvas.
- Selecione o jogador desejado para visualizar seu mapa de calor e dados em tempo real.

## Personalização

- Para alterar os jogadores simulados, edite o array `PLAYERS` em `server.js`.
- Para modificar o visual, edite `style.css` e/ou substitua `campo.png` por outra imagem de campo.

## Requisitos

- Node.js 18+
- Navegador moderno

## Créditos

Desenvolvido para atividade prática de tópicos avançados em programação.

## Melhorias

- Melhor visualização do mapa de calor
- Buscar trazer os dados simulados de todos os 22 jogadores.
