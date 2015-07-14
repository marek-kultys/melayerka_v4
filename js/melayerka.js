(function(){

    /* read more... button */

    $('button.read-more').each(function(){

        var button = this;

        $(this).click(function(ev){

            $(button).addClass('pressed');
            
            /* for older webkit */
            var more = $(button).next('.more');

            /* hopefully jump out of main thread */
            var t = setTimeout(function() {

                if ($(more).css('visibility') == 'hidden') {
                    $(more).removeClass('more');
                    $(more).addClass('more-visible');
                }

            }, 100);

        });

    });

    /* mobile_divider preloading */

    (function() {

        $([ 'mobile_divider.png', 'mobile_divider-dark.png' ]).each(
            function() {

                var n = $('<img>');

                n.attr('src', this);
                n.css('display', 'none');
                n.appendTo($('body'));

        });

    })();

    /* light on/off effect */

    function gen_dark_src(img) {

        var path, data;

        img = $(img);

        path = img.attr('src');//.split('.');
        data = path.match(/^(.*)(\.[a-z]*)$/);
        return data[1] + '-dark' + data[2];

    }

    (function() {

        $('img.glow').each(function() {

            $('<img>').attr('src', gen_dark_src(this)).css('display', 'none').appendTo('body');

        });        

    })();

    $('button.toggle-light').each(function(){

        $(this).click(function(ev){

            $('body').toggleClass('dark');

            var t = $(this).text();

            if ($('body').hasClass('dark'))
                $(this).text(t.replace(/dark/, 'light'));
            else
                $(this).text(t.replace(/light/, 'dark'));

            $('img.glow').each(function() {

                var img = $(this),
                    orig_src,
                    path,
                    dark_src;

                if ($('body').hasClass('dark')) {

                    dark_src = gen_dark_src(img);

                    orig_src = img.attr('src');
                    img.data('orig-src', orig_src);
                    img.attr('src', dark_src);
                    img.css('opacity', 1);

                }
                else 
                    img.attr('src', img.data('orig-src'));

            });

        });

    });

})();
