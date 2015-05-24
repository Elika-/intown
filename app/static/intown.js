$(function() {
  console.log("Hello");
  $('form#search').submit(function(e) {
    var city = $('#city').val()
    console.log(city);

    e.preventDefault();


    setInterval( function() {
    $.getJSON('/' + city, function(data) {
      console.log("======");
      txt ="";
      $('#content').html('');
      for(i = 0; i < data.length; i++) {

      $('#content').append("<div>");   
      $('#content').append("<h4>"+data[i].title+"</h4>");
    //  $('#content').append("<h4>"+data[i].title+"</h4>");   
      $('#content').append("<div>");      
      }

    })
  }, 10000);
  });

  $('.sources').on('click', function(e) {
      var btn = $(this);
      console.log(btn.hasClass('active'));
      if (btn.hasClass('active')) {
        btn.removeClass('active');
      } else {
        btn.addClass('active');
      }
      e.preventDefault();
  });
});