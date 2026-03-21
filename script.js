let questions = [];
let currentIndex = 0;
let userAnswers = []; // Stores {selectedIndex, isCorrect}

async function initQuiz() {
    try {
        const response = await fetch(`questions.json?v=${new Date().getTime()}`);
        questions = await response.json();
        // Initialize userAnswers array with nulls
        userAnswers = new Array(questions.length).fill(null);
        displayQuestion();
    } catch (error) {
        document.getElementById('question-text').innerText = "Error loading questions.";
    }
}

function displayQuestion() {
    const q = questions[currentIndex];
    const container = document.getElementById('options-container');
    const fb = document.getElementById('feedback-box');
    const hb = document.getElementById('hint-box');
    
    document.getElementById('status').innerText = `Question ${currentIndex + 1} of ${questions.length}`;
    document.getElementById('question-text').innerText = q.question;
    container.innerHTML = "";
    fb.style.display = "none";
    hb.style.display = "none";

    // Show/Hide Back Button
    document.getElementById('back-button').style.visibility = currentIndex > 0 ? "visible" : "hidden";

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt.text;
        
        // If already answered, show the state
        if (userAnswers[currentIndex] !== null) {
            btn.disabled = true;
            if (index === q.answer) btn.style.borderColor = "#2e7d32";
            if (index === userAnswers[currentIndex].selected && index !== q.answer) btn.style.borderColor = "#d32f2f";
        }
        
        btn.onclick = () => checkAnswer(index);
        container.appendChild(btn);
    });

    // If already answered, show feedback and next button
    if (userAnswers[currentIndex] !== null) {
        showFeedback(userAnswers[currentIndex].selected);
    } else {
        document.getElementById('next-button').style.display = "none";
    }
}

function checkAnswer(selectedIndex) {
    const q = questions[currentIndex];
    userAnswers[currentIndex] = {
        selected: selectedIndex,
        isCorrect: selectedIndex === q.answer
    };
    
    // Disable buttons after selection
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach(b => b.disabled = true);
    
    showFeedback(selectedIndex);
}

function showFeedback(selectedIndex) {
    const q = questions[currentIndex];
    const fb = document.getElementById('feedback-box');
    const nextBtn = document.getElementById('next-button');
    
    fb.style.display = "block";
    if (selectedIndex === q.answer) {
        fb.className = "feedback-box feedback-correct";
        fb.innerHTML = `<strong>Correct!</strong><br>${q.explanation}`;
    } else {
        fb.className = "feedback-box feedback-wrong";
        fb.innerHTML = `<strong>Incorrect.</strong><br>${q.options[selectedIndex].feedback}`;
    }
    nextBtn.style.display = "block";
    nextBtn.innerText = (currentIndex === questions.length - 1) ? "Finish & Review 🏁" : "Next Question ➜";
}

function showHint() {
    const hb = document.getElementById('hint-box');
    hb.innerText = "💡 Hint: " + questions[currentIndex].hint;
    hb.style.display = "block";
}

function loadNextQuestion() {
    if (currentIndex < questions.length - 1) {
        currentIndex++;
        displayQuestion();
    } else {
        showReview();
    }
}

function loadPrevQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        displayQuestion();
    }
}

function showReview() {
    const quizApp = document.getElementById('quiz-app');
    let score = userAnswers.filter(a => a && a.isCorrect).length;
    
    let reviewHTML = `
        <div style="text-align:left;">
            <h2 style="color:#004a99; text-align:center;">Exam Review</h2>
            <p style="text-align:center; font-size:1.2rem;">Score: <strong>${score} / ${questions.length}</strong></p>
            <hr>`;

    questions.forEach((q, i) => {
        const ua = userAnswers[i];
        const statusColor = ua.isCorrect ? "#2e7d32" : "#d32f2f";
        reviewHTML += `
            <div style="margin-bottom:20px; padding:15px; border:1px solid #ddd; border-radius:8px;">
                <p><strong>Q${i+1}: ${q.question}</strong></p>
                <p style="color:${statusColor}">Your Answer: ${q.options[ua.selected].text}</p>
                <p style="font-size:0.9rem; color:#666;"><strong>Key Takeaway:</strong> ${q.explanation}</p>
            </div>`;
    });

    reviewHTML += `<button class="btn next-btn" style="display:block; width:100%" onclick="location.reload()">Restart Exam</button></div>`;
    quizApp.innerHTML = reviewHTML;
}

initQuiz();
