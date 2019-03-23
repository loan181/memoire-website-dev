
// Every img in the file is a pop up
$("img").addClass("pop");
$(function() {
    $('img').on('click', imgOnClick);
});

function imgOnClick() {
    $('#imagepreviewLink').attr('href', $(this).attr('src'));
    $('.imagepreview').attr('src', $(this).attr('src')); // here asign the image to the modal when the user click the enlarge link
    $('#imagemodal').modal('show');// imagemodal is the id attribute assigned to the bootstrap modal, then i use the show function
}

