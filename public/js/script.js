// tests found in test/qunit/script-tests.js

$(".sign-in").on('click', function() {
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

$(".logout").on('click', function() {
    $.get('/logout');
});

function activateLightBox (toadd) {
    $(toadd).css("display", "block");
    $("div").first().addClass("overlay");
}

function deactivateLightBox (toremove) {
    $(toremove).css("display", "none");
    $("div").first().removeClass("overlay");
}

$(".sign-in").on('click', function() {
    slideEffect();
});

$(".add-class").on('click', function() {
    activateLightBox(".add-class-lightbox");
});

$(".add-student").on('click', function() {
    activateLightBox(".add-student-lightbox");
});

$(".exit-button-class").on('click', function() {
    deactivateLightBox(".add-class-lightbox");
});

$(".exit-button-student").on('click', function() {
    deactivateLightBox(".add-student-lightbox");
});

function sendRequest(){
    var firstname = document.getElementById('firstname').value;
    var surname = document.getElementById('surname').value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var isAdmin = document.getElementById('isAdmin').value;
    var isTeacher = document.getElementById('isTeacher').value;
    var obj = {
        firstname : firstname,
        surname : surname,
        username : username,
        password : password,
        role : "teacher",
        isTeacher: isTeacher,
        isAdmin: isAdmin
    };
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/newUser');
    xhr.send(JSON.stringify(obj));
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          console.log(xhr.responseText);
        }
    };
}
