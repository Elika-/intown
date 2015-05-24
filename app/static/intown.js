/*
var load = function() {
  console.log("abc");
  $.get( "http://localhost:3000/hamburg", function( data ) {
  $( ".result" ).html( bla(data) );
  });

  function bla(data) {
    var res = "";
    var obj = JSON.parse(data);
    for(i  = 0; i < obj.length; i++) {
      res += 
      "<div><h4>"+obj[i].title+"</h4></div>"
    }
    return res;
  };
};
$('#sbmt').click(load);
//$(document).ready( load);
*/

$(function() {
  console.log("Hello");
  $('form#search').submit(function(e) {
    var city = $('#city').val()
    console.log(city);

    e.preventDefault();

    $.getJSON('/' + city, function(data) {
      console.log(data);
    })
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