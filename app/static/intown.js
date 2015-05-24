$(function() {
  console.log("Hello");
  $('form#search').submit(function(e) {
    var city = $('#city').val()
    console.log(city);

    e.preventDefault();



var interval_id = window.setInterval("", 9999); // Get a reference to the last
     
function load() {
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
  }
load();
                                                // interval +1
for (var i = 1; i < interval_id; i++)
        window.clearInterval(i);


    setInterval( load, 5000);
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