$(function() {
  var interval = null;

  console.log("Hello");
  $('form#search').submit(function(e) {
    var city = $('#city').val()
    console.log(city);

    e.preventDefault();

    // var interval_id = window.setInterval("", 9999); // Get a reference to the last

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
          html = '<div class="col-xs-12 ' + x.service + '">';
          if (x.media != '') {
            html += '<img src="' + x.media + '" alt="' + x.title + '" class="feed-media">';
          } else {
            html += '<h4>' + x.title + '</h4>';
          }
          if (x.link != undefined) {
            html += '<a href="' + x.link + '" class="clear">See more...</a>';
          }
          $('#content').append(html + '</div>');
        }
      });
    }

    load();
    interval = setInterval(load, 10000);
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
    clearTimeout(interval);

    e.preventDefault();
  });
});