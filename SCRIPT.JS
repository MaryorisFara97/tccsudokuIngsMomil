let tablero = [];
let solucion = [];
let temporizador;
let segundos = 0;
let errores = 0;
let pistaUsada = false;

function iniciarJuego(dificultad) {
  document.getElementById('menu').classList.add('oculto');
  document.getElementById('juego').classList.remove('oculto');
  document.getElementById('nivelTitulo').innerText = "Nivel: " + dificultad.toUpperCase();

  errores = 0;
  pistaUsada = false;
  document.getElementById('errores').innerText = "Errores: 0 / 3";

  generarTablero(dificultad);
  iniciarCronometro();
}

function volverMenu() {
  clearInterval(temporizador);
  segundos = 0;
  document.getElementById('cronometro').innerText = "00:00";
  document.getElementById('juego').classList.add('oculto');
  document.getElementById('menu').classList.remove('oculto');
}

function reiniciar() {
  clearInterval(temporizador);
  iniciarJuego(document.getElementById('nivelTitulo').innerText.split(": ")[1].toLowerCase());
}

function generarTablero(dificultad) {
  const tableroDiv = document.getElementById('tablero');
  tableroDiv.innerHTML = '';
  tablero = Array.from({ length: 9 }, () => Array(9).fill(0));

  solucion = [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9]
  ];

  let vaciar;
  if (dificultad === 'facil') vaciar = 30;
  if (dificultad === 'medio') vaciar = 45;
  if (dificultad === 'dificil') vaciar = 60;

  let celdasVacias = [];
  while (celdasVacias.length < vaciar) {
    let i = Math.floor(Math.random() * 9);
    let j = Math.floor(Math.random() * 9);
    if (!celdasVacias.some(c => c[0] === i && c[1] === j)) celdasVacias.push([i, j]);
  }

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const input = document.createElement('input');
      input.maxLength = 1;
      input.classList.add('celda');

      if (celdasVacias.some(c => c[0] === i && c[1] === j)) {
        input.value = '';
        input.addEventListener('input', (e) => validarEntrada(e, i, j));
      } else {
        input.value = solucion[i][j];
        input.disabled = true;
      }

      tableroDiv.appendChild(input);
    }
  }
}

function validarEntrada(e, i, j) {
  const valor = e.target.value;
  if (!/^[1-9]$/.test(valor)) {
    e.target.value = '';
    return;
  }

  if (parseInt(valor) !== solucion[i][j]) {
    e.target.classList.add('error');
    errores++;
    document.getElementById('errores').innerText = `Errores: ${errores} / 3`;

    if (errores >= 3) {
      alert("🧩 Sudoku INGS Momil dice:\n\n😢 ¡Has cometido 3 errores! Vuelve a intentarlo, tú puedes 💪");
      reiniciar();
    }
  } else {
    e.target.classList.remove('error');
    e.target.disabled = true;
  }
}

function iniciarCronometro() {
  temporizador = setInterval(() => {
    segundos++;
    let min = Math.floor(segundos / 60);
    let seg = segundos % 60;
    document.getElementById('cronometro').innerText =
      `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  }, 1000);
}

function darPista() {
  if (pistaUsada) {
    alert("💡 Ya usaste tu única pista.");
    return;
  }

  const inputs = document.querySelectorAll('#tablero input');
  const vacias = [];
  inputs.forEach((input, index) => {
    if (!input.disabled && input.value === '') vacias.push(index);
  });

  if (vacias.length === 0) return;

  const aleatoria = vacias[Math.floor(Math.random() * vacias.length)];
  const fila = Math.floor(aleatoria / 9);
  const col = aleatoria % 9;
  inputs[aleatoria].value = solucion[fila][col];
  inputs[aleatoria].disabled = true;
  pistaUsada = true;

  alert("💡 Pista usada correctamente. ¡Úsala sabiamente!");
}
