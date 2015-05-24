$(function() {
  console.log("Hello");
  $('form#search').submit(function(e) {
    var city = $('#city').val()
    console.log(city);

    e.preventDefault();

    var interval_id = window.setInterval("", 9999); // Get a reference to the last
     
    function load() {
      $.getJSON('/' + city, function(data) {
        $('#search').hide();
        $('.jumbotron').hide();
        $('.navbar').show();
        $('#content').show();

        txt = "";
        $('#content').html('');
        for(i = 0; i < data.length; i++) {
          var x = data[i];
          if (x.media != '') {
            $('#content').append('<div class="col-xs-12"><img src="' + x.media + '" alt="' + x.title + '"></div>');
          } else {
            $('#content').append('<div class="col-xs-12"><h4>' + x.title + '</h4></div>');
          }
        }
      });
    }

    load();

    for (var i = 1; i < interval_id; i++)
      window.clearInterval(i);
      setInterval(load, 5000);
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

  $('.navbar-brand').click(function(e) {
    $('#search').show();
    $('.jumbotron').show();
    $('.navbar').hide();
    $('#content').hide();

    e.preventDefault();
  });
});