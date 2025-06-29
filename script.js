const tabuleiro = document.getElementById('tabuleiro');
const tentativasEl = document.getElementById('tentativas');
const paresEl = document.getElementById('paresEncontrados');
const tempoEl = document.getElementById('tempo');
const nivelSelect = document.getElementById('nivel');
const btnReiniciar = document.getElementById('btnReiniciar');
const btnDica = document.getElementById('btnDica');

let emojisBase = ['🐶','🐱','🦊','🐻','🐼','🐵','🐸','🦁','🐔','🐴','🐰','🐨','🐯','🦄','🐷','🐙','🦉','🐢','🐞','🦀','🐬','🦋','🐝','🐳','🐦','🐡','🐺','🐗','🦥','🐿️','🦜','🐊'];

let cartas = [];
let primeiraCarta = null;
let segundaCarta = null;
let bloqueio = false;
let tentativas = 0;
let paresEncontrados = 0;
let totalPares = 0;

let tempo = 0;
let intervaloTempo = null;

function criarCarta(emoji, index) {
  const carta = document.createElement('div');
  carta.classList.add('carta');
  carta.dataset.emoji = emoji;
  carta.dataset.index = index;

  const cartaInner = document.createElement('div');
  cartaInner.classList.add('carta-inner');

  const frente = document.createElement('div');
  frente.classList.add('carta-frente');
  frente.textContent = emoji;

  const verso = document.createElement('div');
  verso.classList.add('carta-verso');
  

  cartaInner.appendChild(frente);
  cartaInner.appendChild(verso);
  carta.appendChild(cartaInner);

  carta.addEventListener('click', () => {
    if (bloqueio || carta.classList.contains('revelada') || carta === primeiraCarta) return;

    carta.classList.add('revelada');

    if (!primeiraCarta) {
      primeiraCarta = carta;
    } else {
      segundaCarta = carta;
      tentativas++;
      tentativasEl.textContent = `Tentativas: ${tentativas}`;
      verificarPar();
    }
  });

  tabuleiro.appendChild(carta);
}

function verificarPar() {
  if (primeiraCarta.dataset.emoji === segundaCarta.dataset.emoji) {
    primeiraCarta = null;
    segundaCarta = null;
    paresEncontrados++;
    paresEl.textContent = `Pares encontrados: ${paresEncontrados}`;

    if (paresEncontrados === totalPares) {
      clearInterval(intervaloTempo);
      setTimeout(() => {
        if (tentativas === totalPares) {
          alert(`🌟 Incrível! Você completou o jogo sem errar nenhuma vez! Tempo: ${tempo}s`);
          salvarRanking(tempo, tentativas);
        } else {
          alert(`🎉 Parabéns! Você completou o jogo com ${tentativas} tentativas em ${tempo}s.`);
          salvarRanking(tempo, tentativas);
        }
        // Após terminar o jogo pode bloquear cliques ou permitir reiniciar.
      }, 300);
    }
  } else {
    bloqueio = true;
    setTimeout(() => {
      primeiraCarta.classList.remove('revelada');
      segundaCarta.classList.remove('revelada');
      primeiraCarta = null;
      segundaCarta = null;
      bloqueio = false;
    }, 1000);
  }
}

function iniciarJogo() {
  // Limpar tudo
  tabuleiro.innerHTML = '';
  primeiraCarta = null;
  segundaCarta = null;
  bloqueio = false;
  tentativas = 0;
  paresEncontrados = 0;
  tentativasEl.textContent = `Tentativas: 0`;
  paresEl.textContent = `Pares encontrados: 0`;
  tempo = 0;
  tempoEl.textContent = `Tempo: 0s`;

  // Define tamanho da grade e pares conforme nível
  const tamanho = parseInt(nivelSelect.value);
  totalPares = (tamanho * tamanho) / 2;

  // Pega os emojis necessários e duplica
  const selecionados = emojisBase.slice(0, totalPares);
  cartas = [...selecionados, ...selecionados];
  cartas.sort(() => 0.5 - Math.random());

  // Ajusta grade do tabuleiro
  tabuleiro.style.gridTemplateColumns = `repeat(${tamanho}, 100px)`;

  // Cria cartas
  cartas.forEach((emoji, index) => criarCarta(emoji, index));

  // Inicia contador de tempo
  if(intervaloTempo) clearInterval(intervaloTempo);
  intervaloTempo = setInterval(() => {
    tempo++;
    tempoEl.textContent = `Tempo: ${tempo}s`;
  }, 1000);
}

// Botão reiniciar
btnReiniciar.addEventListener('click', iniciarJogo);

// Botão dica (mostrar todas as cartas por 3s segundos)
btnDica.addEventListener('click', () => {
  if (bloqueio) return;
  bloqueio = true;
  document.querySelectorAll('.carta').forEach(carta => carta.classList.add('revelada'));
  setTimeout(() => {
    document.querySelectorAll('.carta').forEach(carta => carta.classList.remove('revelada'));
    bloqueio = false;
  }, 3000);
});

// Mudança de nível reinicia jogo automaticamente
nivelSelect.addEventListener('change', iniciarJogo);

// Iniciar jogo ao carregar a página
window.onload = iniciarJogo;
