const socket = io();

// DOM
const jogadorSelect = document.getElementById('jogadorSelect');
const dadosSensor = document.getElementById('dadosSensor');
const canvas = document.getElementById('campo');
const ctx = canvas.getContext('2d');
const campoWidth = canvas.width;
const campoHeight = canvas.height;

// Remove o select de posição se não estiver usando dados locais
if (document.getElementById('posicaoSelect')) {
    document.getElementById('posicaoSelect').style.display = 'none';
}

// Recebe lista de jogadores do servidor
socket.on("players", (players) => {
    jogadorSelect.innerHTML = players.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
    // Assina o primeiro jogador por padrão
    if (players.length) socket.emit("subscribe", players[0].id);
});

// Assina jogador selecionado
jogadorSelect.addEventListener("change", () => {
    socket.emit("subscribe", jogadorSelect.value);
    trail = [];
});

// Atualiza mapa de calor e dados do sensor em tempo real
let trail = [];
const maxTrail = 100;

// Inicializa campoImg
const campoImg = new Image();
campoImg.src = 'campo.png';
campoImg.onload = () => {
    ctx.drawImage(campoImg, 0, 0, campoWidth, campoHeight);
};

socket.on("sensor", (data) => {
    // Atualiza dados do sensor
    dadosSensor.innerHTML = `Batimentos: ${data.bpm} bpm | Velocidade: ${data.speed} km/h | Posição: (${data.pos.x.toFixed(1)}, ${data.pos.y.toFixed(1)})`;

    // Atualiza trilha do jogador
    const margemX = 35, margemY = 25;
    const larguraCampo = campoWidth - 2 * margemX;
    const alturaCampo = campoHeight - 2 * margemY;
    const x = margemX + larguraCampo * (data.pos.x / 100);
    const y = margemY + alturaCampo * (data.pos.y / 100);
    trail.push({x, y});
    if (trail.length > maxTrail) trail.shift();

    // Desenha campo e mapa de calor
    ctx.clearRect(0, 0, campoWidth, campoHeight);
    ctx.drawImage(campoImg, 0, 0, campoWidth, campoHeight);

    ctx.save();
    ctx.beginPath();
    ctx.rect(margemX, margemY, larguraCampo, alturaCampo);
    ctx.clip();

    for (let i = 0; i < trail.length; i++) {
        let pt = trail[i];
        let grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 18);
        grad.addColorStop(0, 'rgba(255,0,0,0.25)');
        grad.addColorStop(0.5, 'rgba(255,255,0,0.18)');
        grad.addColorStop(1, 'rgba(0,255,0,0.10)');
        ctx.fillStyle = grad;
        ctx.fillRect(pt.x-18, pt.y-18, 36, 36);
    }

    ctx.restore();
});