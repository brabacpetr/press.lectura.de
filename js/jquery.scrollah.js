;(function ($, window, document, undefined) {

    var pluginName = "Scrollah",
        defaults = {
            itemSelector: '',
            scrollElementSelector: 'window',
            easeFn: 'sin',
            pagerParamName: 'page'
        },
        posFns = {
            'sin': function(scrollBottom, item, directionCoef) {
                var itemHeight = item.height() - 0.4 * item.height(),
                    itemTop = item.offset().top,
                    scrollOverItem = scrollBottom - itemTop,
                    ratio = item.width() / itemHeight,
                    decrease = (Math.PI / 2) / item.width();
                    position = scrollOverItem > itemHeight ? 0 : directionCoef * item.width(),
                    itemLeft = item.position().left,
                    start = parseFloat(item.attr('data-sin')) || Math.PI / 2;
                
                
                if (scrollOverItem >= 0 && scrollOverItem <= itemHeight) {
                    position = (directionCoef * (itemHeight - scrollOverItem) * ratio) * Math.sin(start);
                    start -= decrease;
                }

                item.attr('data-sin', start);
                if (item.position().left !== position) {
                    item.css('left', position);
                } else {
                    item.attr('data-sin', 0);
                }
            },
            'tan': function(scrollBottom, item, directionCoef) {
                var itemHeight = 1.5 * item.height(),
                    itemWidth = item.width(),
                    itemTop = item.offset().top,
                    scrollOverItem = scrollBottom - itemTop,
                    itemLeft = item.position().left,
                    position = scrollOverItem > itemHeight ? 0 : directionCoef * itemWidth,
                    start = scrollOverItem * (1 / itemHeight) * (Math.PI / 4),
                    ratio = itemWidth / itemHeight;

                if (scrollOverItem >= 0 && scrollOverItem <= itemHeight) {
                    position = (directionCoef * itemWidth) - (directionCoef * itemWidth * Math.tan(start));
                }

                if (item.position().left !== position) {
                    item.css('left', position);
                }
            }
        }

    function Scrollah(element, options) {
        this.element = $(element);

        this.options = $.extend({}, defaults, options);

        if (!this.options.itemSelector) {
            throw new Error("You need to specify item selector");
        }

        this._defaults = defaults;
        this._name = pluginName;
        this._items = $(this.options.itemSelector);
        this._itemsQ = [];
        iLength = this._items.length;

        for (var i = 0; i < iLength; i++) {
            this._itemsQ.push($(this._items[i]));
        }

        this._itemsShowed = 0;
        this._window = this._scrollElement = $(window);

        if (this.options.scrollElementSelector !== 'window') {
            this._scrollElement = $(this.options.scrollElementSelector);
        }

        this.init();
    }

    Scrollah.prototype = {

        init: function() {
            var self = this,
                scrollBottom = this._scrollElement.scrollTop() + this._window.height();

            this.element.css({
                "position": "relative",
                "overflow": "hidden"
            });

            this._items.css({
                "position": "relative"
            });

            this.options.scrollElement.scroll(function(event) {
                var scrollBottom = self._scrollElement.scrollTop() + self._window.height();

                self.recalculateItemsPosition(scrollBottom);
            });

            this.options.scrollElement.on('resize.Scrolling', function(event) {
                var scrollBottom = self._scrollElement.scrollTop() + self._window.height();

                self.recalculateItemsPosition(scrollBottom);
            });

            self.recalculateItemsPosition(scrollBottom);
        },

        recalculateItemsPosition: function(scrollBottom) {
            var item, i, length = this._items.length, even, fn, windowHeight = this._window.height();
            fn = posFns[this.options.easeFn];

            for (var i = 1; i <= length; i++) {
                even = i % 2 === 0;
                coef = even ? 1 : -1;
                item = this._itemsQ[i-1];

                if (item.offset().top >= windowHeight) {
                    (function (fn, scrollBottom, item) {
                        fn(scrollBottom, item, coef);
                    })(fn, scrollBottom, item);
                }
            };
        }

    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Scrollah( this, options ));
            }
        });
    };

})(jQuery, window, document);