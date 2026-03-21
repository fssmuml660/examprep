let questions = [];
let currentIndex = 0;

// Fetch the JSON file from the root directory
fetch('questions.json')
    .then(response => {
        if (!response.ok) throw new Error("JSON not found");
        return response.json();
    })
    .then(data => {
        questions = data;
        displayQuestion();
    })
    .catch(err => {
        document.getElementById('question-text').innerText = "Error loading questions. Check questions.json file.";
        console.error(err);
    });

function displayQuestion() {
    const q = questions[currentIndex];
    const optionsContainer = document.getElementById('options-container');
    const hintBox = document.getElementById('hint-box');
    const feedback = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-button');

    // Reset UI
    feedback.innerText = "";
    hintBox.style.display = "none";
    nextBtn.style.display = "none";
    optionsContainer.innerHTML = "";

    document.getElementById('question-text').innerText = `${currentIndex + 1}. ${q.question}`;

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index, q.answer, q.hint);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, correctIndex, hint) {
    const feedback = document.getElementById('feedback');
    const hintBox = document.getElementById('hint-box');
    const nextBtn = document.getElementById('next-button');

    if (selectedIndex === correctIndex) {
        feedback.innerText = "Correct! ✅";
        feedback.style.color = "green";
        nextBtn.style.display = "block";
        hintBox.style.display = "none";
    } else {
        feedback.innerText = "Try again! ❌";
        feedback.style.color = "red";
        hintBox.innerText = "💡 Hint: " + hint;
        hintBox.style.display = "block";
    }
}

function loadNextQuestion() {
    currentIndex++;
    if (currentIndex < questions.length) {
        displayQuestion();
    } else {
        document.getElementById('quiz-content').innerHTML = "<h2>Quiz Completed! 🎓</h2><p>You've finished the Batch 1 questions. Ready for Batch 2?</p>";
    }
}
