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
                for (let j = 0; j < correctKeyWords.length; j++) {
                    if (answerReply.includes(correctKeyWords[i])) {
                        feedbacks[i] = "correct";
                        break;
                    }
                }
                break;
            default:
                feedbacks[i] = "warning";
                console.warn("Don't handle this kind of tag : " + tagName);
        }
    }

    let feedbackSpan = elem.parentNode.getElementsByClassName("exFeedback")[0];
    let feedbackSpanText = '';
    let showCorrection = true;
    for (let i = 0; i < feedbacks.length; i++) {
        switch(feedbacks[i]) {
            case "unknown":
                feedbackSpanText += '<i class="fas fa-question"></i> ';
                break;
            case "correct":
                feedbackSpanText += '<i class="fas fa-check"></i> ';
                break;
            case "wrong":
                feedbackSpanText += '<i class="fas fa-times"></i> ';
                showCorrection = false;
                break;
            case "warning":
                feedbackSpanText += '<i class="fas fa-exclamation"></i> ';
                break;
        }
    }
    feedbackSpan.innerHTML = feedbackSpanText;

    if (showCorrection) {
        let potentialCorrection = elem.parentNode.parentNode.nextElementSibling;
        if (potentialCorrection.className.includes("onlyTeacher")) {
            potentialCorrection.style.display = "block";
            // TODO : ajouter une transitions
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
        logExercice(document.title, question, answers, feedbacks);
    } catch (e) {
        console.warn("Unable to log exerice information");
        console.warn(e);
    }


}