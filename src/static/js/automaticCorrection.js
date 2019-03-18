function checkAnswer(elem) {
    let parent = elem.parentNode.parentNode.children[1];
    let all = parent.querySelectorAll('[data-answer]');

    let feedbacks = [];
    let answers = [];
    for (let i = 0; i < all.length; i++) {
        feedbacks.push("unknown");
        let curElement = all[i];
        let tagName = curElement.tagName;
        let curElementAnswer = curElement.getAttribute("data-answer");

        switch(tagName) {
            case "SELECT":
                let selectText = curElement.options[curElement.selectedIndex].text;
                answers.push(selectText);
                if (selectText === curElementAnswer) {
                    feedbacks[i] = "correct";
                }
                else {
                    feedbacks[i] = "wrong";
                }
                break;
                // Textarea are harder to check, we simply search for some keywords
            case "TEXTAREA":
                let correctKeyWords = curElementAnswer.split(',');
                let answerReply = curElement.value;
                answers.push(answerReply);
                answerReply = answerReply.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                answerReply = answerReply.toLowerCase();
                for (let j = 0; j < correctKeyWords.length; j++) {
                    if (answerReply.includes(correctKeyWords[i])) {
                        feedbacks[i] = "correct";
                        break;
                    }
                }
                break;
            case "INPUT":
                let inputValue = curElement.value;
                answers.push(inputValue);
                if (inputValue === curElementAnswer) {
                    feedbacks[i] = "correct";
                }
                else {
                    feedbacks[i] = "wrong";
                }
                break;
            default:
                feedbacks[i] = "warning";
                console.warn("Don't handle this kind of tag : " + tagName);
        }
    }

    let feedbackSpan = elem.parentNode.getElementsByClassName("exFeedback")[0];
    let feedbackSpanText = '';
    let exerciceSuccess = true;
    let value = 0;
    for (let i = 0; i < feedbacks.length; i++) {
        switch(feedbacks[i]) {
            case "unknown":
                feedbackSpanText += '<i class="fas fa-question"></i> ';
                value += 1;
                break;
            case "correct":
                feedbackSpanText += '<i class="fas fa-check"></i> ';
                value += 1;
                break;
            case "wrong":
                feedbackSpanText += '<i class="fas fa-times"></i> ';
                exerciceSuccess = false;
                break;
            case "warning":
                feedbackSpanText += '<i class="fas fa-exclamation"></i> ';
                value += 1;
                break;
        }
    }
    value /= feedbacks.length;
    value *= 100;
    feedbackSpan.innerHTML = feedbackSpanText;

    if (exerciceSuccess) {
        showCorrection(elem);
    } else {
        let attemptsNumber = $(elem).data('attempts');
        $(elem).data('attempts', attemptsNumber+1); // Update it
        if (attemptsNumber+1 >= 3) {
            let correctionButton = elem.parentNode.querySelector('.correctionButton');
            correctionButton.classList.remove("d-none");
        }
    }

    // Update the db with the information
    let exerciceElem = elem.parentNode.parentNode.parentNode.querySelectorAll('[data-ex]');
    let question = "";
    for (let i = 0; i < exerciceElem.length; i++) {
        let curElement = exerciceElem[i];
        let curElementCategory = curElement.getAttribute("data-ex");
        if (curElementCategory === "question") {
            question = curElement.innerText || curElement.textContent;
            break;
        }
    }

    try {
        logExercice(document.title, question, answers, feedbacks, value);
    } catch (e) {
        console.warn("Unable to log exerice information");
        console.warn(e);
    }
}

function showCorrection(elem) {
    let potentialCorrection = elem.parentNode.parentNode.nextElementSibling;
    if (potentialCorrection.className.includes("onlyTeacher")) {
        potentialCorrection.style.display = "block";
        $(potentialCorrection).collapse({
            toggle: true
        })
    }
}