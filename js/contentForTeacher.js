$(document).ready(function () {
    if(window.location.href.indexOf("corr") > -1) {
        let allStudentHiddenContent = document.getElementsByClassName("onlyTeacher");
        for (let i = 0; i < allStudentHiddenContent.length; i++) {
            allStudentHiddenContent[i].style.display = "inherit";
        }
    }
});
