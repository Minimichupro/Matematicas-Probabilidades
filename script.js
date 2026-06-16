// Base de datos que almacena las 100 preguntas estructuradas matemáticamente
const masterQuestions = [];

// 1. GENERAR 20 PREGUNTAS DE LAPLACE
for (let i = 1; i <= 20; i++) {
    let favor = 2 + (i % 5);
    let total = 10 + (i % 3) * 2; 
    masterQuestions.push({
        topic: "Regla de Laplace (Casos Favorables / Casos Posibles)",
        question: `[Ejercicio Laplace #${i}] En una urna hay esferas numeradas de forma consecutiva del 1 al ${total}. ¿Cuál es la probabilidad matemática exacta de extraer al azar una esfera que pertenezca al grupo de los ${favor} casos favorables previamente clasificados?`,
        options: [`${favor}/${total}`, `${total - favor}/${total}`, `1/${total}`, `${favor}/${total * 2}`],
        answer: `${favor}/${total}`
    });
}

// 2. GENERAR 20 PREGUNTAS DE P(A U B)
for (let i = 1; i <= 20; i++) {
    let pA = 0.3 + (i % 4) * 0.1;
    let pB = 0.2 + (i % 3) * 0.1;
    let pInter = 0.1;
    let pUnion = (pA + pB - pInter).toFixed(2);
    masterQuestions.push({
        topic: "Probabilidad de la Unión P(A ∪ B)",
        question: `[Ejercicio P(A ∪ B) #${i}] Sabiendo que los eventos A y B pertenecen al mismo espacio muestral, donde P(A) = ${pA.toFixed(2)}, P(B) = ${pB.toFixed(2)} y su intersección simultánea es P(A ∩ B) = ${pInter.toFixed(2)}. Calcule el valor de la unión P(A ∪ B).`,
        options: [pUnion, (pA + pB).toFixed(2), (pA - pInter).toFixed(2), "1.00"],
        answer: pUnion
    });
}

// 3. GENERAR 20 PREGUNTAS DE P(A ∩ B) - U Invertida
for (let i = 1; i <= 20; i++) {
    let pA = 0.4 + (i % 3) * 0.1;
    let pB = 0.3 + (i % 3) * 0.1;
    let pUnion = 0.6 + (i % 3) * 0.05;
    let pInter = (pA + pB - pUnion).toFixed(2);
    masterQuestions.push({
        topic: "Probabilidad de la Intersección P(A ∩ B)",
        question: `[Ejercicio P(A ∩ B) #${i}] Dados dos sucesos compatibles A y B, donde se conoce algebraicamente que P(A) = ${pA.toFixed(2)}, P(B) = ${pB.toFixed(2)} y la probabilidad de la unión de ambos es P(A ∪ B) = ${pUnion.toFixed(2)}. Halle el valor exacto de la intersección P(A ∩ B).`,
        options: [pInter, (pA + pB).toFixed(2), "0.15", (pUnion - pA).toFixed(2)],
        answer: pInter
    });
}

// 4. GENERAR 20 PREGUNTAS DE TEOREMA DE BAYES
for (let i = 1; i <= 20; i++) {
    let pA = 0.2 + (i % 4) * 0.1; 
    let pB_dado_A = 0.4 + (i % 3) * 0.1; 
    let pInter = (pA * pB_dado_A).toFixed(3);
    masterQuestions.push({
        topic: "Teorema de Bayes & Probabilidad Condicional",
        question: `[Ejercicio Bayes #${i}] Aplicando la definición del Teorema de Bayes, donde P(B|A) = P(A ∩ B) / P(A). Si la probabilidad condicional calculada es P(B|A) = ${pB_dado_A.toFixed(2)} y la probabilidad del evento base es P(A) = ${pA.toFixed(2)}, despeje y halle el valor de la intersección simultánea P(A ∩ B).`,
        options: [pInter, (pB_dado_A / pA).toFixed(3), (pA / pB_dado_A).toFixed(3), "0.500"],
        answer: pInter
    });
}

// 5. GENERAR 20 PREGUNTAS DE TABLAS DE CONTINGENCIA Y ÁRBOLES
for (let i = 1; i <= 20; i++) {
    let totalHombres = 40 + (i % 5) * 5;
    let totalMujeres = 100 - totalHombres;
    let hombresAprobados = 25 + (i % 4) * 2;
    masterQuestions.push({
        topic: "Árbol de Probabilidades y Tablas de Contingencia",
        question: `[Ejercicio Combinado #${i}] (⚠️ Nota: Este ejercicio se debe resolver obligatoriamente construyendo una Tabla de Contingencia o un Árbol de decisiones). En un centro de estudios hay 100 alumnos: ${totalHombres} hombres y ${totalMujeres} mujeres. Se sabe de los registros que de los hombres, exactamente ${hombresAprobados} aprobaron el examen. Si elegimos un expediente al azar y resulta ser de un hombre, ¿cuál es la probabilidad condicionada de que esté aprobado?`,
        options: [`${hombresAprobados}/${totalHombres}`, `${hombresAprobados}/100`, `${totalHombres}/100`, `${hombresAprobados}/${totalMujeres}`],
        answer: `${hombresAprobados}/${totalHombres}`
    });
}

// Mezclar las opciones de manera aleatoria en todas las preguntas
masterQuestions.forEach(q => {
    q.options = q.options.sort(() => Math.random() - 0.5);
});

// Variables de estado del juego
let poolQuestions = [...masterQuestions]; // Copia del banco para gestionar la no repetición global
let roundQuestions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;

function startRound() {
    // Si quedan menos de 10 preguntas en el pozo global, lo rellenamos de nuevo
    if (poolQuestions.length < 10) {
        poolQuestions = [...masterQuestions];
    }

    // Mezclar el pozo general y extraer 10 preguntas únicas para la ronda actual
    poolQuestions.sort(() => Math.random() - 0.5);
    roundQuestions = poolQuestions.splice(0, 10);

    // Reiniciar contadores de la ronda
    currentQuestionIndex = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;

    // Control de pantallas
    document.getElementById("results-screen").style.display = "none";
    document.getElementById("quiz-screen").style.display = "block";
    
    updateScoreCounter();
    showQuestion();
}

function showQuestion() {
    document.getElementById("btn-next").style.display = "none";
    let currentQuestion = roundQuestions[currentQuestionIndex];
    
    // Actualizar barra de progreso visual
    let percent = (currentQuestionIndex / 10) * 100;
    document.getElementById("progress").style.width = `${percent}%`;
    document.getElementById("question-number").innerText = `Pregunta ${currentQuestionIndex + 1} de 10`;
    
    // Insertar textos
    document.getElementById("topic").innerText = currentQuestion.topic;
    document.getElementById("question").innerText = currentQuestion.question;
    
    // Renderizar opciones de respuesta
    let optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";
    
    currentQuestion.options.forEach(option => {
        let button = document.createElement("button");
        button.className = "btn-option";
        button.innerText = option;
        button.onclick = () => evaluateAnswer(button, option);
        optionsContainer.appendChild(button);
    });
}

function evaluateAnswer(selectedButton, selectedOption) {
    let currentQuestion = roundQuestions[currentQuestionIndex];
    let allButtons = document.querySelectorAll(".btn-option");
    
    // Deshabilitar todos los botones para evitar múltiples clics
    allButtons.forEach(btn => btn.disabled = true);
    
    if (selectedOption === currentQuestion.answer) {
        selectedButton.classList.add("correct");
        correctAnswers++;
    } else {
        selectedButton.classList.add("incorrect");
        incorrectAnswers++;
        // Destacar cuál era la respuesta correcta para aprendizaje del usuario
        allButtons.forEach(btn => {
            if (btn.innerText === currentQuestion.answer) {
                btn.classList.add("correct");
            }
        });
    }
    
    updateScoreCounter();
    document.getElementById("btn-next").style.display = "inline-block";
}

function updateScoreCounter() {
    document.getElementById("score-counter").innerText = `Correctas: ${correctAnswers} | Incorrectas: ${incorrectAnswers}`;
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < 10) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById("quiz-screen").style.display = "none";
    document.getElementById("results-screen").style.display = "block";
    
    document.getElementById("final-ratio").innerText = `${correctAnswers}/10`;
    document.getElementById("res-correct").innerText = correctAnswers;
    document.getElementById("res-incorrect").innerText = incorrectAnswers;
    
    let percent = (correctAnswers / 10) * 100;
    document.getElementById("res-percent").innerText = `${percent}%`;
    
    let feedback = "";
    if (correctAnswers === 10) feedback = "¡Perfecto! Dominas la probabilidad a nivel experto. 🌟";
    else if (correctAnswers >= 7) feedback = "¡Muy buen trabajo! Tienes bases muy sólidas en estadística. 📈";
    else if (correctAnswers >= 5) feedback = "¡Aprobado! Pero te vendría bien repasar las tablas y diagramas. 📝";
    else feedback = "Sigue practicando. Te sugerimos estructurar los datos usando tablas de contingencia. 🔍";
    
    document.getElementById("feedback-msg").innerText = feedback;
}

// Arrancar la primera ronda de forma automática al cargar la ventana
window.onload = startRound;
