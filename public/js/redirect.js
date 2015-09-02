$(document).ready(function(){
    console.log(document.title);
    if (document.title.match(/Incorrect username\/password/) !== null || document.title.match(/Missing username\/password/)) {
        setTimeout(function(){
            window.location.href = '/';
        }, 2000);
    }
});
