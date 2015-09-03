$('form').unbind();
$('form').submit(function(e){
  var form = $(this).serialize();
  e.preventDefault();
  $.ajax({
    url: $('form').attr('action'),
    type: 'POST',
    data: form,
    success: function(className){
      location.assign("/pupils?" + className);
    }
  });
});
