$(document).ready(function() {
    var articleList = $('#article-list');
    
    $('.dropdown-toggle').dropdown();

    if (articleList) {
        articleList.Scrollah({
            itemSelector: '.article-slide',
            scrollElement: $(window),
            easeFn: 'tan'
        });
    }
});