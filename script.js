let questions = [];
let currentIndex = 0;

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        displayQuestion();
    });

function displayQuestion() {
    const q = questions[currentIndex];
    const optionsContainer = document.getElementById('options-container');
    const hintBox = document.getElementById('hint-box');
    const feedback = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-button');

    // Reset UI for new question
    feedback.innerHTML = "";
    hintBox.style.display = "none";
    nextBtn.style.display = "none";
    optionsContainer.innerHTML = "";

    document.getElementById('question-text').innerText = `${currentIndex + 1}. ${q.question}`;

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index, q);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, questionObj) {
    const feedback = document.getElementById('feedback');
    const hintBox = document.getElementById('hint-box');
    const nextBtn = document.getElementById('next-button');

    if (selectedIndex === questionObj.answer) {
        // Correct Answer Logic
        feedback.innerHTML = `<span style="color: green;">Correct! ✅</span><br><div style="margin-top:10px; font-weight:normal; font-size:0.9rem; background:#e8f5e9; padding:10px; border-radius:5px;"><strong>Analysis:</strong> ${questionObj.description}</div>`;
        nextBtn.style.display = "block";
        hintBox.style.display = "none";
        
        // Disable buttons after correct answer
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(b => b.disabled = true);
    } else {
        // Incorrect Answer Logic
        feedback.innerHTML = `<span style="color: red;">Not quite. Try again! ❌</span>`;
        hintBox.innerHTML = `<strong>💡 Hint:</strong> ${questionObj.hint}`;
        hintBox.style.display = "block";
    }
}

function loadNextQuestion() {
    currentIndex++;
    if (currentIndex < questions.length) {
        displayQuestion();
    } else {
        document.getElementById('quiz-content').innerHTML = "<h2>Batch Complete! 🎓</h2><p>Excellent progress for the Central Bank of India Scale II exam.</p>";
    }
}
