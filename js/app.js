$(document).ready(function() {
    var articleList = $('#article-list');
    
    $('.dropdown-toggle').dropdown();

    if (articleList) {
        articleList.Scrollah({
            itemSelector: '.article-slide',
            scrollElement: $(window),
            easeFn: 'tan',
            itemsLoadOffset: 4
        });

        articleList.on('scrollah.loadMore', function(event, page) {
            $.ajax({
                url: 'http://presslecturade.apiary.io/articles',
                data: 'page=' + page,
                dataType: 'html',
                success: function(items) {
                    articleList.trigger('scrollah.loaded', items);
                }
            });
        });
    }

    // fix sub nav on scroll
    var $win = $(window)
        , $nav = $('.scrollspy')
        , navTop = $nav.length && $nav.offset().top
        , isFixed = 0
        , posLeft = $nav.length && $nav.offset().left;

    $('#scrollspy-wrapper').css('height', $nav.height());
    processScroll();

    // hack sad times - holdover until rewrite for 2.1
    $nav.on('click', function () {
        if (!isFixed) setTimeout(function () {
            $win.scrollTop($win.scrollTop() - 47);
        }, 10);
    })

    $win.on('scroll', processScroll);

    function processScroll() {
        var i, scrollTop = $win.scrollTop()

        if (scrollTop >= navTop && !isFixed) {
            isFixed = 1;
            $nav.addClass('scrollspy-fixed');
            $nav.css('left', posLeft);
        } else if (scrollTop <= navTop && isFixed) {
            isFixed = 0;
            $nav.removeClass('scrollspy-fixed');
        }
    }
});