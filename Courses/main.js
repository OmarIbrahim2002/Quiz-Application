// Select Elements:
let countSpan = document.querySelector(".quizInfo .count .num");
let qNumSpan = document.querySelector(".count .current");
let bullets = document.querySelector(".bullets");
let spansContainer = document.querySelector(".bullets .spansContainer");
let quizArea = document.querySelector(".quizArea");
let answersArea = document.querySelector(".answersArea");
let submitBtn = document.querySelector("button.submit");
let results = document.querySelector(".results");
let countdownEle = document.querySelector(".countdown");

let countDownTime = 30;

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

function getQuestions () {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //* Convert JSON Object To JS Object
            let questionObject = JSON.parse(this.responseText);
            let qCountLength = questionObject.length;

            // Create Bullets + Set Questions Count
            createBullets(qCountLength);

            // Add Question Data
            addQuestionData(questionObject[currentIndex], qCountLength);

            qNumSpan.innerHTML = currentIndex + 1;

            // countDown(countDownTime, qCountLength);

            // Click onSubmit Button
            submitBtn.onclick = () => {
                // Get Right Answer
                let theRightAnswer = questionObject[currentIndex].right_answer;

                // Increase Index
                currentIndex++

                qNumSpan.innerHTML = currentIndex + 1;

                // Check Answers
                checkAnswer(theRightAnswer, qCountLength);

                // Remove Previous Question
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";
                //* Add Question Data
                addQuestionData(questionObject[currentIndex], qCountLength);

                // Handle Bullets Classes
                bulletsClasses();

                clearInterval(countDownInterval);
                // countDown(countDownTime, qCountLength);

                showResults(qCountLength);
            };
        };
    };
    myRequest.open("GET", "questions.json", true);
    myRequest.send();
};
getQuestions();

function createBullets (num) {
    countSpan.innerHTML = num;

    // Create Spans
    for (let i = 0; i < num; i++){
        // Create Bullets
        let theBullets = document.createElement("span");

        if (i === 0) {
            theBullets.className = "active";
        }

        // Append Bullets To Main Bullets Container
        spansContainer.appendChild(theBullets);
    }
}
function addQuestionData (obj, count) {
    if (currentIndex < count) {
        // Create h2 question Title
    let questionHeading = document.createElement("h2");
    let questionTitle = document.createElement("h3");

    // Create Question Text
        //* To Get The "Title" Inside Object
    let questionHeadingText = document.createTextNode(obj["heading"]);
    let questionText = document.createTextNode(obj["title"]);
    questionHeading.appendChild(questionHeadingText);
    questionTitle.appendChild(questionText);

    quizArea.appendChild(questionHeading);
    quizArea.appendChild(questionTitle);

    // Create The Answers
    for (let i = 1; i <= 5; i++){
        let mainDiv = document.createElement("div");
        mainDiv.className = "answer";

        let radioInput = document.createElement("input");
        radioInput.name = "question";
        radioInput.type = "radio";
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];

        if (radioInput.dataset.answer == "undefined") {
            continue;
        }

        // Make First Option Checked
        if (i === 1) {
            radioInput.checked = true;
        }

        // Create Label
        let theLabel = document.createElement("label");
        theLabel.htmlFor = `answer_${i}`;
        let labelText = document.createTextNode(obj[`answer_${i}`]);

        theLabel.appendChild(labelText);

        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);

        answersArea.appendChild(mainDiv);
    }
    }
}

function checkAnswer (rAnswer, count) {
    let allAnswers = document.getElementsByName("question");
    let theChoosenAnswer;
    for (i = 0; i < allAnswers.length; i++){
        if (allAnswers[i].checked) {
            theChoosenAnswer = allAnswers[i].dataset.answer;
        }
    }

    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
    }
};
function bulletsClasses () {
    let bulletsSpans = document.querySelectorAll(".bullets .spansContainer span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "active";
        }
    })
};
function showResults (count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitBtn.remove();
        bullets.remove();

        if (rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `${rightAnswers} from ${count} </br><span class="good">عاش ياعم بس راجع تاني</span>`;
        } else if (rightAnswers === count) {
            theResults = ` All answers are Correct </br><span class="perfect">😅الله اكبر عليييك</span>`;
        } else {
            theResults = `${rightAnswers} from ${count} </br><span class="bad">روح ذاكر ياعم</span>`;
        }

        let pdf = document.querySelector("a");
        pdf.classList.remove("none");

        results.innerHTML = theResults;
        qNumSpan.innerHTML = currentIndex;
    }
};
function countDown (duration, count) {
    if (currentIndex < count) {
        let mins, secs;
        countDownInterval = setInterval(function () {
            mins = parseInt(duration / 60);
            secs = parseInt(duration % 60);

            mins = mins < 10 ? `0${mins}` : mins;
            secs = secs < 10 ? `0${secs}` : secs;

            countdownEle.innerHTML = `${mins}:${secs}`;

            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitBtn.click();
            }
        }, 1000);
    };
};