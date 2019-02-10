// Hide content if url does not contains "corr"
$(document).ready(function () {
    if(window.location.href.indexOf("corr") > -1) {
        let allStudentHiddenContent = document.getElementsByClassName("onlyTeacher");
        for (let i = 0; i < allStudentHiddenContent.length; i++) {
            allStudentHiddenContent[i].style.display = "inherit";
        }
    }
});

// Automatic collapse
// Source : https://stackoverflow.com/questions/12805825/can-you-specify-a-data-target-for-bootstrap-which-refers-to-a-sibling-dom-elem
function toggleNext(e) {
    var $target = $(e).parent().next();
    $target.collapse('toggle');
}