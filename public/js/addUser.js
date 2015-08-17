$('form').unbind();
$('form').submit(function(e){
  var form = $(this).serialize();
  // console.log(form);
  e.preventDefault();
  $.ajax({
    url: $('form').attr('action'),
    type: 'POST',
    data: form,
    success: function(){
      location.reload();
    }
  });
});
