$(function () {
    var interval = null;

    $('#city').on('keyup', function () {
        var input = $('#city').val();
        if (input.length > 3) {
            $('#citylist').html('');
            $.getJSON('/autocomplete/' + input, function (e) {
                for (var i = 0; i < e.length; i++) {
                    var html = '<option value ="' + e[i] + '" />'
                    $('#citylist').append(html);
                }
            })
        }
    })

    $('form#search').submit(function (e) {
        var city = $('#city').val();

        e.preventDefault();
        // var interval_id = window.setInterval("", 9999); // Get a reference to the last

        function load() {
            $.getJSON('/city/' + city.split('(')[0], function (data) {
                $('#search').hide();
                $('.jumbotron').hide();
                $('.navbar').show();
                $('#results').show();
                txt = '';
                $('#results').html('');
                for (i = 0; i < data.length; i++) {
                    var x = data[i];
                    console.log(x);
                    html = '<div class="col-xs-12 ' + x.service + '">';
                    console.log(x);
                    if (x.media != '') {
                        html += '<div class="feed-media-box"><img src="' + x.media + '" alt="' + x.short + '" class="feed-media"></div>';

                    } else {
                        html += '<h4>' + x.short + '</h4>';
                        html += '<p>' + x.text + '</p>';
                    }
                    html += '<div class="clearfix"></div>';
                    html += '<ul class="feed-meta">';
                    html += '<li>' + moment(x.time).fromNow() + '</li>';
                    if (x.user) {
                        html += '<li> from: ' + x.user + '</li>';
                    }
                    if (x.location) {
                        html += '<li><a href="http://maps.google.com/maps?z=12&t=m&q=loc:' + x.location.lat + '+' + x.location.lon + '" target="_blank">Location</a></li>';
                    }
                    if (x.link != undefined) {
                        html += '<li><a href="' + x.link + '" class="clearfix" target="_blank">See more...</a></li>'
                    }
                    html += '</ul>'

                    $('#results').append(html + '</div>');
                }
            });
        }

        load();
        interval = setInterval(load, 10000);
    });

    $('.sources').on('click', function (e) {
        var btn = $(this);
        console.log(btn.hasClass('active'));
        if (btn.hasClass('active')) {
            btn.removeClass('active');
        } else {
            btn.addClass('active');
        }
        e.preventDefault();
    });

    $('.navbar-brand').click(function (e) {
        $('#search').show();
        $('.jumbotron').show();
        $('.navbar').hide();
        $('#results').hide();
        clearTimeout(interval);

        e.preventDefault();
    });
});