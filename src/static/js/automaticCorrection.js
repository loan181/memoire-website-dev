function checkAnswer(elem) {
    let parent = elem.parentNode.parentNode.children[1];
    let all = parent.querySelectorAll('[data-answer]');

    let feedback = "unknown";
    for (let i = 0; i < all.length; i++) {
        let curElement = all[i];
        let tagName = curElement.tagName;
        let curElementAnswer = curElement.getAttribute("data-answer");

        switch(tagName) {
            case "SELECT":
                let selectText = curElement.options[curElement.selectedIndex].text;
                if (selectText === curElementAnswer) {
                    feedback = "correct";
                }
                else {
                    feedback = "wrong";
                }
                break;
            case "TEXTAREA":
                let correctKeyWords = curElementAnswer.split(',');
                let answerReply = curElement.value;
                for (let j = 0; j < correctKeyWords.length; j++) {
                    if (answerReply.includes(correctKeyWords[i])) {
                        feedback = "correct";
                        break;
                    }
                }
                break;
            default:
                feedback = "warning";
                console.warn("Don't handle this kind of tag : " + tagName);
        }
    }

    let feedbackSpan = elem.parentNode.getElementsByClassName("exFeedback")[0];
    let feedbackSpanText = 'default';
    switch(feedback) {
        case "unknown":
            feedbackSpanText = '<i class="fas fa-question"></i>';
            break;
        case "correct":
            feedbackSpanText = '<i class="fas fa-check"></i>';
            break;
        case "wrong":
            feedbackSpanText = '<i class="fas fa-times"></i>';
            break;
        case "warning":
            feedbackSpanText = '<i class="fas fa-exclamation"></i>';
            break;
    }
    feedbackSpan.innerHTML = feedbackSpanText;
}