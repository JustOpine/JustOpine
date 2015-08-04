$(".sign-in").on('click', function() {
    console.log("hey");

    $(".landing-container-firstview").animate({
           left: '-100%'
       }, 300, function() {
           $(".landing-container-firstview").css('left', '150%');
           $(".landing-container-firstview").appendTo('.landingcontainer');

           $(".landing-container-secondview").css({
               display: 'block',
               position: 'relative'
           });

           $(".landing-container-secondview").animate({
               left: '0%'
           }, 300);
       });

});
var login = document.getElementsByClassName('landing-container-secondview')[0];
var formData = new FormData(login);

console.log(formData);
function sendRequest(){
    var obj = {
        dbmethod: "addTeacher",
        firstname : "Edita",
        lastname : "Memisi",
        role : "teacher"
    };
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/justopineapi');
    xhr.send(JSON.stringify(obj));
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          console.log(xhr.responseText);
        }
    };
}
