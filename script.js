let questions = [];
let currentIndex = 0;
let score = 0;

/**
 * Initialize the quiz by fetching the JSON data.
 */
async function initQuiz() {
    try {
        // Cache-busting: adds a timestamp to ensure you always get the latest JSON
        const response = await fetch(`questions.json?v=${new Date().getTime()}`);
        if (!response.ok) throw new Error("Could not find questions.json file.");
        
        questions = await response.json();
        if (questions.length === 0) throw new Error("questions.json is empty.");
        
        displayQuestion();
    } catch (error) {
        console.error("Quiz Initialization Error:", error);
        document.getElementById('question-text').innerHTML = 
            `<span style="color:red">Error: ${error.message}</span><br>
             <small>Ensure questions.json is in the same folder as index.html.</small>`;
    }
}

/**
 * Renders the current question and options to the DOM.
 */
function displayQuestion() {
    const q = questions[currentIndex];
    
    // Update Progress Header
    document.getElementById('status').innerText = `Progress: ${currentIndex + 1} / ${questions.length}`;
    
    // Set Question Text
    document.getElementById('question-text').innerText = q.question;
    
    const container = document.getElementById('options-container');
    container.innerHTML = ""; // Clear previous options
    
    // Reset Visibility of UI Elements
    document.getElementById('hint-box').style.display = "none";
    document.getElementById('feedback-box').style.display = "none";
    document.getElementById('next-button').style.display = "none";
    document.getElementById('hint-button').style.display = "block";

    // Generate Option Buttons
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt.text;
        btn.onclick = () => checkAnswer(index);
        container.appendChild(btn);
    });
}

/**
 * Shows the hint for the current question.
 */
function showHint() {
    const hb = document.getElementById('hint-box');
    hb.innerText = "💡 Hint: " + questions[currentIndex].hint;
    hb.style.display = "block";
}

/**
 * Validates the user's choice and provides detailed feedback.
 */
function checkAnswer(selectedIndex) {
    const q = questions[currentIndex];
    const fb = document.getElementById('feedback-box');
    const nextBtn = document.getElementById('next-button');
    const btns = document.querySelectorAll('.option-btn');

    fb.style.display = "block";
    
    if (selectedIndex === q.answer) {
        // Correct Answer
        fb.className = "feedback-box feedback-correct";
        fb.innerHTML = `<strong>Correct! ✅</strong><br>${q.options[selectedIndex].feedback}<br><br><strong>Deep Dive:</strong> ${q.explanation}`;
        nextBtn.style.display = "block";
        document.getElementById('hint-button').style.display = "none";
        btns.forEach(b => b.disabled = true); // Prevent changing answer
        score++;
    } else {
        // Incorrect Answer
        fb.className = "feedback-box feedback-wrong";
        fb.innerHTML = `<strong>Not quite. ❌</strong><br>${q.options[selectedIndex].feedback}`;
        // We don't disable buttons here so the user can try again
    }
}

/**
 * Moves to the next question or shows final results.
 */
function loadNextQuestion() {
    currentIndex++;
    if (currentIndex < questions.length) {
        displayQuestion();
    } else {
        const quizApp = document.getElementById('quiz-app');
        quizApp.innerHTML = `
            <div style="text-align:center; padding: 20px;">
                <h2 style="color:#004a99">Exam Finished! 🎓</h2>
                <p style="font-size:1.2rem">Final Score: <strong>${score} / ${questions.length}</strong></p>
                <hr>
                <p>Great job on your CBI Scale II Preparation.</p>
                <button class="btn next-btn" style="display:inline-block; width:auto;" onclick="location.reload()">Restart Quiz</button>
            </div>`;
    }
}

// Start the application
initQuiz();
