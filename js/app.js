$(document).ready(function() {
    var articleList = $('#article-list'),
        sideBanner = $('#side-banner');
    
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

    $('.scrollspy').scrollAffix();

    if (sideBanner) {
        sideBanner.scrollAffix({offset: $(window).height() * 0.35});
    }
});