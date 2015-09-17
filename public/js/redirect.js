$(document).ready(function(){
    if (document.title.match(/Incorrect username\/password/) || document.title.match(/Missing username\/password/) || document.title.match(/Not authenticated/)) {
        setTimeout(function(){
            $(".redirect-msg").css({display:"block"});
        }, 1500);setTimeout(function(){
            window.location.href = "/";
        }, 3000);

    } else if (document.title.match(/Added teacher/)) {
        setTimeout(function(){
            window.location.href = "/registration";
        }, 2700);
    }
});
$('.go-back').click(function() {
    window.history.back();
});
