$(document).ready(function () {
    console.log("hey");
});

// $(".sign-in").on('click', function() {
//     $(".landing-container-firstview").hide("slide", {direction: "left"}, 1000);
//     $(".landing-container-secondview").show("slide", {direction: "right"}, 1000);
// });

$(".sign-in").on('click', function() {
    console.log("hey");

    $(".landing-container-firstview").animate({
           left: '-100%'
       }, 500, function() {
           $(".landing-container-firstview").css('left', '150%');
           $(".landing-container-firstview").appendTo('.landingcontainer');

           console.log("hello");

           $(".landing-container-secondview").css({
               display: 'block',
               position: 'relative'
           }, 500);

           $(".landing-container-secondview").animate({
               left: '0%'
           }, 500);
       });


});
