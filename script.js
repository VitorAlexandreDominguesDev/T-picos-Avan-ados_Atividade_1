const canvas = document.getElementById('campo');
const ctx = canvas.getContext('2d');
const select = document.getElementById('posicaoSelect');

const campoWidth = canvas.width;
const campoHeight = canvas.height;
const numFrames = 800;
const tempoAtualizacao = 100; // ms (atualiza a cada 0.1s)
const maxPontos = 1000; // máximo de pontos exibidos no mapa

// Definição das posições e jogadores por posição
const posicoes = {
    'Atacante': 3,
    'Meio-campo': 3,
    'Lateral': 2,
    'Zagueiro': 3
};

// Carregar imagem do campo
const campoImg = new Image();
campoImg.src = 'campo.png'; // Certifique-se de que o arquivo está na mesma pasta

// Simular posições dos jogadores por posição
let dadosPorPosicao = {};

// Armazena as posições atuais para cada posição
let posicoesAtuais = {};
let intervalId = null;

// Função para gerar números com distribuição normal (Box-Muller)
function normalRandom(mu, sigma) {
    let u = 1 - Math.random();
    let v = 1 - Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mu + sigma * z;
}

function simularPosicoes() {
    dadosPorPosicao = {};
    for (const [posicao, quantidade] of Object.entries(posicoes)) {
        let todos = [];
        for (let j = 0; j < quantidade; j++) {
            let posicoesJogador = [];
            // Defina centros e dispersão para cada posição
            let centro, dispersao;
            if (posicao === 'Atacante') {
                centro = {x: campoWidth * 0.8, y: campoHeight * 0.5};
                dispersao = {x: campoWidth * 0.12, y: campoHeight * 0.25};
            } else if (posicao === 'Meio-campo') {
                centro = {x: campoWidth * 0.5, y: campoHeight * 0.5};
                dispersao = {x: campoWidth * 0.18, y: campoHeight * 0.35};
            } else if (posicao === 'Lateral') {
                // Um lateral em cada lado
                let lado = (j % 2 === 0) ? 0.15 : 0.85;
                centro = {x: campoWidth * 0.5, y: campoHeight * lado};
                dispersao = {x: campoWidth * 0.35, y: campoHeight * 0.08};
            } else if (posicao === 'Zagueiro') {
                centro = {x: campoWidth * 0.18, y: campoHeight * 0.5};
                dispersao = {x: campoWidth * 0.10, y: campoHeight * 0.28};
            }
            for (let f = 0; f < numFrames; f++) {
                let x = normalRandom(centro.x, dispersao.x);
                let y = normalRandom(centro.y, dispersao.y);
                // Garante que fique dentro do campo
                x = Math.max(0, Math.min(campoWidth, x));
                y = Math.max(0, Math.min(campoHeight, y));
                posicoesJogador.push({x, y});
            }
            todos = todos.concat(posicoesJogador);
        }
        dadosPorPosicao[posicao] = todos;
    }
}

// Preencher o select com posições
function preencherSelect() {
    select.innerHTML = '';
    for (const posicao of Object.keys(posicoes)) {
        let option = document.createElement('option');
        option.value = posicao;
        option.textContent = posicao;
        select.appendChild(option);
    }
}

// Desenhar mapa de calor de uma posição
function desenharMapaDeCalor(posicao) {
    ctx.clearRect(0, 0, campoWidth, campoHeight);
    ctx.drawImage(campoImg, 0, 0, campoWidth, campoHeight);

    // Define as margens do campo 
    const margemX = 35; 
    const margemY = 25; 
    const larguraCampo = campoWidth - 2 * margemX;
    const alturaCampo = campoHeight - 2 * margemY;

    // Limitar o desenho ao retângulo do campo
    ctx.save();
    ctx.beginPath();
    ctx.rect(margemX, margemY, larguraCampo, alturaCampo);
    ctx.clip();

    let posicoes = dadosPorPosicao[posicao];
    for (let i = 0; i < posicoes.length; i++) {
        let {x, y} = posicoes[i];
        let grad = ctx.createRadialGradient(x, y, 0, x, y, 18);
        grad.addColorStop(0, 'rgba(255,0,0,0.25)');
        grad.addColorStop(0.5, 'rgba(255,255,0,0.18)');
        grad.addColorStop(1, 'rgba(0,255,0,0.10)');
        ctx.fillStyle = grad;
        ctx.fillRect(x-18, y-18, 36, 36);
    }

    ctx.restore();
}

// Função para adicionar um novo ponto para cada jogador de cada posição
function atualizarPosicoes() {
    for (const [posicao, quantidade] of Object.entries(posicoes)) {
        if (!posicoesAtuais[posicao]) posicoesAtuais[posicao] = [];
        for (let j = 0; j < quantidade; j++) {
            // Defina centros e dispersão para cada posição
            let centro, dispersao;
            if (posicao === 'Atacante') {
                centro = {x: campoWidth * 0.8, y: campoHeight * 0.5};
                dispersao = {x: campoWidth * 0.12, y: campoHeight * 0.25};
            } else if (posicao === 'Meio-campo') {
                centro = {x: campoWidth * 0.5, y: campoHeight * 0.5};
                dispersao = {x: campoWidth * 0.18, y: campoHeight * 0.35};
            } else if (posicao === 'Lateral') {
                let lado = (j % 2 === 0) ? 0.15 : 0.85;
                centro = {x: campoWidth * 0.5, y: campoHeight * lado};
                dispersao = {x: campoWidth * 0.35, y: campoHeight * 0.08};
            } else if (posicao === 'Zagueiro') {
                centro = {x: campoWidth * 0.18, y: campoHeight * 0.5};
                dispersao = {x: campoWidth * 0.10, y: campoHeight * 0.28};
            }
            let x = normalRandom(centro.x, dispersao.x);
            let y = normalRandom(centro.y, dispersao.y);
            x = Math.max(0, Math.min(campoWidth, x));
            y = Math.max(0, Math.min(campoHeight, y));
            posicoesAtuais[posicao].push({x, y});
            // Limita o tamanho do array para não crescer indefinidamente
            if (posicoesAtuais[posicao].length > maxPontos) {
                posicoesAtuais[posicao].shift();
            }
        }
    }
}

// Função para desenhar o mapa de calor em tempo real
function desenharMapaDeCalorTempoReal(posicao) {
    ctx.clearRect(0, 0, campoWidth, campoHeight);
    ctx.drawImage(campoImg, 0, 0, campoWidth, campoHeight);

    const margemX = 35; 
    const margemY = 25; 
    const larguraCampo = campoWidth - 2 * margemX;
    const alturaCampo = campoHeight - 2 * margemY;

    ctx.save();
    ctx.beginPath();
    ctx.rect(margemX, margemY, larguraCampo, alturaCampo);
    ctx.clip();

    let posicoes = posicoesAtuais[posicao] || [];
    for (let i = 0; i < posicoes.length; i++) {
        let {x, y} = posicoes[i];
        let grad = ctx.createRadialGradient(x, y, 0, x, y, 18);
        grad.addColorStop(0, 'rgba(255,0,0,0.25)');
        grad.addColorStop(0.5, 'rgba(255,255,0,0.18)');
        grad.addColorStop(1, 'rgba(0,255,0,0.10)');
        ctx.fillStyle = grad;
        ctx.fillRect(x-18, y-18, 36, 36);
    }

    ctx.restore();
}

// Iniciar simulação em tempo real
function iniciarSimulacaoTempoReal() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
        atualizarPosicoes();
        desenharMapaDeCalorTempoReal(select.value || 'Atacante');
    }, tempoAtualizacao);
}

// Atualizar mapa ao selecionar posição
select.addEventListener('change', function() {
    desenharMapaDeCalorTempoReal(select.value);
});

// Inicialização após carregar a imagem do campo
campoImg.onload = function() {
    preencherSelect();
    iniciarSimulacaoTempoReal();
};