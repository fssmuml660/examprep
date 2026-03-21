let questions = [];
let currentIndex = 0;
let score = 0;

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        displayQuestion();
    });

function displayQuestion() {
    const q = questions[currentIndex];
    
    // Update Exam Status (Progress)
    document.getElementById('status').innerText = `Question ${currentIndex + 1} of ${questions.length}`;
    
    document.getElementById('question-text').innerText = q.question;
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = "";
    
    document.getElementById('hint-box').style.display = "none";
    document.getElementById('feedback-box').style.display = "none";
    document.getElementById('next-button').style.display = "none";

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt.text;
        btn.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(btn);
    });
}

function showHint() {
    const hintBox = document.getElementById('hint-box');
    hintBox.innerText = "💡 Hint: " + questions[currentIndex].hint;
    hintBox.style.display = "block";
}

function checkAnswer(selectedIndex) {
    const q = questions[currentIndex];
    const feedbackBox = document.getElementById('feedback-box');
    const nextBtn = document.getElementById('next-button');
    const buttons = document.querySelectorAll('.option-btn');

    // Show option-specific feedback
    feedbackBox.style.display = "block";
    feedbackBox.innerHTML = `<strong>Result:</strong> ${q.options[selectedIndex].feedback}`;
    
    if (selectedIndex === q.answer) {
        feedbackBox.style.color = "#2e7d32";
        feedbackBox.innerHTML += `<br><br><strong>Deep Dive:</strong> ${q.explanation}`;
        nextBtn.style.display = "block";
        buttons.forEach(b => b.disabled = true);
        score++;
    } else {
        feedbackBox.style.color = "#d32f2f";
    }
}

function loadNextQuestion() {
    currentIndex++;
    if (currentIndex < questions.length) {
        displayQuestion();
    } else {
        document.getElementById('quiz-app').innerHTML = `<h2>Exam Finished! 🎓</h2><p>Your Final Score: ${score} / ${questions.length}</p>`;
    }
}
