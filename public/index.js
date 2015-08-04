function slideEffect () {
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
}

$(".sign-in").on('click', function() {
    slideEffect();
});

$("#add-class").on('click', function() {

    console.log('workin');

    $(".add-class-lightbox").css("display", "block");
    $("div").first().addClass("overlay");

});
