const display = document.getElementById('display');
const historyList = document.getElementById('history-list');
const toggleThemeButton = document.getElementById('toggle-theme');
const themeIcon = document.getElementById('theme-icon');
const activateScientific = document.getElementById('activate-scientific');
const activateBasic = document.getElementById('activate-basic');
const basicButtons = document.getElementById('basic-buttons');
const advancedButtons = document.getElementById('advanced-buttons');
const calculatorTitle = document.getElementById('calculator-title');
const calculatorDescription = document.getElementById('calculator-description');
const tutorialText = document.getElementById('tutorial-text');

let currentInput = '';
let operator = null;
let previousInput = '';
let isDarkMode = false;
let isAdvancedMode = false;

document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', () => handleButtonClick(button.getAttribute('data-value')));
});

// Mapeamento do teclado
document.addEventListener('keydown', (event) => {
  const key = event.key;
  const keyMap = {
    '0': '0',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '+': '+',
    '-': '-',
    '*': '*', // Pode ser substituído por 'x' se preferir
    '/': '/',
    'Enter': '=',
    'Backspace': 'C',
    'Escape': 'C', // Limpar
    's': 'sin', // Seno
    'c': 'cos', // Cosseno
    't': 'tan', // Tangente
    'r': 'sqrt', // Raiz quadrada
    'p': 'pow' // Potência
  };

  if (keyMap[key]) {
    handleButtonClick(keyMap[key]);
  }
});

// Alternar tema claro/escuro
toggleThemeButton.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);
  themeIcon.textContent = isDarkMode ? '🌙' : '☀️';
});

// Alternar para Modo Científico
activateScientific.addEventListener('click', () => {
  isAdvancedMode = true;
  basicButtons.classList.add('hidden');
  advancedButtons.classList.remove('hidden');
  calculatorTitle.textContent = 'Calculadora Científica';
  calculatorDescription.textContent =
    'Uma calculadora com funções avançadas como raiz quadrada, potência, seno, cosseno e tangente.';
});

// Alternar para Modo Básico
activateBasic.addEventListener('click', () => {
  isAdvancedMode = false;
  basicButtons.classList.remove('hidden');
  advancedButtons.classList.add('hidden');
  calculatorTitle.textContent = 'Calculadora Básica';
  calculatorDescription.textContent =
    'Uma calculadora simples para operações básicas como soma, subtração, multiplicação e divisão.';
});

function handleButtonClick(value) {
  if (value === 'C') {
    clearDisplay();
  } else if (['+', '-', '*', '/'].includes(value)) {
    setOperator(value);
  } else if (value === '=') {
    calculateResult();
  } else if (['sqrt', 'pow', 'sin', 'cos', 'tan'].includes(value)) {
    handleAdvancedFunction(value);
  } else {
    appendToDisplay(value);
  }
}

function clearDisplay() {
  currentInput = '';
  operator = null;
  previousInput = '';
  updateDisplay();
  tutorialText.textContent = 'Realize uma operação para ver a explicação aqui!';
}

function updateDisplay() {
  if (operator && !currentInput) {
    display.value = `${formatNumber(previousInput)} ${operatorToSymbol(operator)}`;
  } else {
    display.value = formatNumber(currentInput || '0');
  }
}

function formatNumber(number) {
  const num = parseFloat(number);
  if (isNaN(num)) return number; 
  return num.toLocaleString('pt-BR', { maximumFractionDigits: 10 }); 
}

function appendToDisplay(value) {
  currentInput += value;
  updateDisplay();
}

function setOperator(op) {
  if (currentInput) {
    if (previousInput && operator) {
      calculateResult();
    }
    operator = op;
    previousInput = currentInput;
    currentInput = '';
    updateDisplayWithOperator(op);
  }
}

// Atualizar o display com o operador
function updateDisplayWithOperator(op) {
  display.value = `${formatNumber(previousInput)} ${operatorToSymbol(op)}`;
}

// Calcular resultado
function calculateResult() {
  let result;
  const prev = parseFloat(previousInput.replace(/\./g, '').replace(',', '.')); // Remove pontos e converte vírgula para ponto
  const current = parseFloat(currentInput.replace(/\./g, '').replace(',', '.'));
  if (isNaN(prev) || isNaN(current)) return;
  switch (operator) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      result = prev / current;
      break;
    default:
      return;
  }
  currentInput = result.toString();
  updateDisplay();
  const currentOperator = operator;
  operator = null;
  previousInput = '';
  addToHistory(`${prev} ${operatorToSymbol(currentOperator)} ${current} = ${result}`);
}

// Funções avançadas
function handleAdvancedFunction(func) {
  const num = parseFloat(currentInput.replace(/\./g, '').replace(',', '.'));
  let result;
  switch (func) {
    case 'sqrt':
      result = Math.sqrt(num);
      break;
    case 'pow':
      result = Math.pow(num, 2);
      break;
    case 'sin':
      result = Math.sin((num * Math.PI) / 180);
      break;
    case 'cos':
      result = Math.cos((num * Math.PI) / 180);
      break;
    case 'tan':
      result = Math.tan((num * Math.PI) / 180);
      break;
  }
  currentInput = result.toString();
  updateDisplay();
  addToHistory(`${func}(${num}) = ${result}`);
}
function addToHistory(entry) {
  const formattedEntry = entry
    .replace('*', '×') // Multiplicação
    .replace('/', '÷'); // Divisão
  const li = document.createElement('li');
  li.textContent = formattedEntry;
  historyList.appendChild(li);
  generateTutorial(formattedEntry);
}

// Gerar tutorial explicativo
function generateTutorial(entry) {
  let explanation = '';
  if (entry.includes('+')) {
    const [num1, num2, result] = entry.split(/[\+\=]/).map(Number);
    explanation = `
      <div class="tutorial-step">**Passo a Passo da Soma:**</div>
      <div class="tutorial-step">1. Começamos com o número ${num1}.</div>
      <div class="tutorial-step">2. Adicionamos ${num2} a ele. Isso significa que estamos juntando os dois valores.</div>
      <div class="tutorial-step">3. Imagine que você tem ${num1} livros e ganha mais ${num2} livros.</div>
      <div class="tutorial-step">4. Para encontrar o total, somamos as quantidades: ${num1} + ${num2}.</div>
      <div class="tutorial-step">5. O resultado da soma é ${result}. Portanto, você agora tem ${result} livros.</div>
      <div class="tutorial-step">6. Outra forma de pensar sobre isso é que se você tem ${num1} reais e ganha ${num2} reais, você terá ${result} reais no total.</div>
      <div class="tutorial-step">7. A soma é uma operação fundamental que usamos no dia a dia, como ao calcular o total de despesas ou o número de itens em uma lista.</div>
    `;
  } else if (entry.includes('-')) {
    const [num1, num2, result] = entry.split(/[\-\=]/).map(Number);
    explanation = `
      <div class="tutorial-step">**Passo a Passo da Subtração:**</div>
      <div class="tutorial-step">1. Começamos com ${num1}.</div>
      <div class="tutorial-step">2. Subtraímos ${num2} dele. Isso significa que estamos tirando ${num2} do total de ${num1}.</div>
      <div class="tutorial-step">3. Pense que você tem ${num1} reais e decide gastar ${num2} reais.</div>
      <div class="tutorial-step">4. Para saber quanto você ainda tem, fazemos: ${num1} - ${num2}.</div>
      <div class="tutorial-step">5. O resultado da subtração é ${result}. Assim, você ainda tem ${result} reais.</div>
      <div class="tutorial-step">6. Outra maneira de ver isso é que se você tinha ${num1} maçãs e deu ${num2} maçãs para um amigo, você ficará com ${result} maçãs.</div>
      <div class="tutorial-step">7. A subtração é útil para calcular o que resta após uma compra ou o que foi consumido de um total.</div>
    `;
  } else if (entry.includes('×')) {
    const [num1, num2, result] = entry.split(/[×\=]/).map(Number);
    explanation = `
      <div class="tutorial-step">**Passo a Passo da Multiplicação:**</div>
      <div class="tutorial-step">1. Começamos com ${num1}.</div>
      <div class="tutorial-step">2. Multiplicamos esse número por ${num2}. Isso significa que estamos somando ${num1} a ele mesmo ${num2} vezes.</div>
      <div class="tutorial-step">3. Imagine que você tem ${num1} pacotes de biscoitos, e cada pacote contém ${num2} biscoitos.</div>
      <div class="tutorial-step">4. Para encontrar o total de biscoitos, fazemos: ${num1} × ${num2}.</div>
      <div class="tutorial-step">5. O resultado da multiplicação é ${result}. Portanto, você tem ${result} biscoitos no total.</div>
      <div class="tutorial-step">6. Outra forma de pensar sobre isso é que se você tem ${num1} grupos de ${num2} amigos, o total de amigos é ${result}.</div>
      <div class="tutorial-step">7. A multiplicação é uma operação que usamos para calcular áreas, volumes e totais em diversas situações do dia a dia.</div>
    `;
  } else if (entry.includes('÷')) {
    const [num1, num2, result] = entry.split(/[÷\=]/).map(Number);
    explanation = `
      <div class="tutorial-step">**Passo a Passo da Divisão:**</div>
      <div class="tutorial-step">1. Começamos com ${num1}.</div>
      <div class="tutorial-step">2. Dividimos esse número por ${num2}. Isso significa que estamos separando ${num1} em ${num2} partes iguais.</div>
      <div class="tutorial-step">3. Pense que você tem ${num1} doces e quer dividi-los igualmente entre ${num2} amigos.</div>
      <div class="tutorial-step">4. Para saber quantos doces cada amigo receberá, fazemos: ${num1} ÷ ${num2}.</div>
      <div class="tutorial-step">5. O resultado da divisão é ${result}. Portanto, cada amigo receberá ${result} doces.</div>
      <div class="tutorial-step">6. Outra maneira de ver isso é que se você tem ${num1} reais e quer dividir igualmente entre ${num2} pessoas, cada pessoa receberá ${result} reais.</div>
      <div class="tutorial-step">7. A divisão é uma operação importante para entender como repartir recursos ou calcular médias.</div>
    `;
  } else if (entry.includes('sqrt')) {
    const match = entry.match(/sqrt\((\d+)\) = (\d+)/);
    if (match) {
      const [_, num, result] = match;
      explanation = `
        <div class="tutorial-step">**Passo a Passo da Raiz Quadrada:**</div>
        <div class="tutorial-step">1. Queremos encontrar a raiz quadrada de ${num}.</div>
        <div class="tutorial-step">2. A raiz quadrada é o número que, quando multiplicado por ele mesmo, resulta em ${num}.</div>
        <div class="tutorial-step">3. Para entender melhor, se você tem ${num} quadrados e quer saber o comprimento de um lado de um quadrado que tem a mesma área, a resposta é ${result}.</div>
        <div class="tutorial-step">4. Portanto, √${num} = ${result}.</div>
        <div class="tutorial-step">5. Outra forma de pensar sobre isso é que se você tem uma área de ${num} metros quadrados, a raiz quadrada nos diz o comprimento de cada lado do quadrado.</div>
        <div class="tutorial-step">6. A raiz quadrada é frequentemente usada em geometria e em cálculos de áreas.</div>
      `;
    }
  } else if (entry.includes('pow')) {
    const match = entry.match(/pow\((\d+)\) = (\d+)/);
    if (match) {
      const [_, num, result] = match;
      explanation = `
        <div class="tutorial-step">**Passo a Passo da Potência:**</div>
        <div class="tutorial-step">1. Elevamos ${num} ao quadrado.</div>
        <div class="tutorial-step">2. Isso significa multiplicar ${num} por ele mesmo.</div>
        <div class="tutorial-step">3. Para entender melhor, se você tem ${num} e quer saber quantas unidades existem em um quadrado formado por ${num}, o resultado é ${result}.</div>
        <div class="tutorial-step">4. Portanto, pow(${num}) = ${result}.</div>
        <div class="tutorial-step">5. Outra maneira de pensar sobre isso é que se você tem ${num} metros de lado em um quadrado, a área total do quadrado é ${result} metros quadrados.</div>
        <div class="tutorial-step">6. A potência é uma operação fundamental em matemática, usada em várias áreas, como física e engenharia.</div>
      `;
    }
  } else if (entry.includes('sin')) {
    const match = entry.match(/sin\((\d+)\) = ([\d.-]+)/);
    if (match) {
      const [_, angle, result] = match;
      explanation = `
        <div class="tutorial-step">**Passo a Passo do Seno:**</div>
        <div class="tutorial-step">1. Calculamos o seno do ângulo ${angle} graus.</div>
        <div class="tutorial-step">2. O seno é a razão entre o lado oposto e a hipotenusa em um triângulo retângulo.</div>
        <div class="tutorial-step">3. Para entender melhor, se você tem um triângulo retângulo e conhece o ângulo ${angle}, o seno nos ajuda a encontrar a altura em relação à hipotenusa.</div>
        <div class="tutorial-step">4. O resultado é aproximadamente ${result}. Portanto, sin(${angle}) = ${result}.</div>
        <div class="tutorial-step">5. O seno é amplamente utilizado em trigonometria, especialmente em problemas de ondas e ciclos.</div>
      `;
    }
  } else if (entry.includes('cos')) {
    const match = entry.match(/cos\((\d+)\) = ([\d.-]+)/);
    if (match) {
      const [_, angle, result] = match;
      explanation = `
        <div class="tutorial-step">**Passo a Passo do Cosseno:**</div>
        <div class="tutorial-step">1. Calculamos o cosseno do ângulo ${angle} graus.</div>
        <div class="tutorial-step">2. O cosseno é a razão entre o lado adjacente e a hipotenusa em um triângulo retângulo.</div>
        <div class="tutorial-step">3. Para entender melhor, se você tem um triângulo retângulo e conhece o ângulo ${angle}, o cosseno nos ajuda a encontrar a base em relação à hipotenusa.</div>
        <div class="tutorial-step">4. O resultado é aproximadamente ${result}. Portanto, cos(${angle}) = ${result}.</div>
        <div class="tutorial-step">5. O cosseno é utilizado em diversas aplicações, como na análise de ondas e na engenharia.</div>
      `;
    }
  } else if (entry.includes('tan')) {
    const match = entry.match(/tan\((\d+)\) = ([\d.-]+)/);
    if (match) {
      const [_, angle, result] = match;
      explanation = `
        <div class="tutorial-step">**Passo a Passo da Tangente:**</div>
        <div class="tutorial-step">1. Calculamos a tangente do ângulo ${angle} graus.</div>
        <div class="tutorial-step">2. A tangente é a razão entre o lado oposto e o lado adjacente em um triângulo retângulo.</div>
        <div class="tutorial-step">3. Para entender melhor, se você tem um triângulo retângulo e conhece o ângulo ${angle}, a tangente nos ajuda a relacionar a altura e a base.</div>
        <div class="tutorial-step">4. O resultado é aproximadamente ${result}. Portanto, tan(${angle}) = ${result}.</div>
        <div class="tutorial-step">5. A tangente é frequentemente usada em cálculos de inclinação e em problemas de engenharia.</div>
      `;
    }
  }
  tutorialText.innerHTML = explanation || 'Realize uma operação para ver a explicação aqui!';
}

function operatorToSymbol(op) {
  switch (op) {
    case '+': return '+';
    case '-': return '-';
    case '*': return '×';
    case '/': return '÷';
    default: return '';
  }
}