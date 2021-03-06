;(function ($, window, document, undefined) {

    var pluginName = "Scrollah",
        defaults = {
            itemSelector: '',
            scrollElementSelector: 'window',
            easeFn: 'tan',
            pagerParamName: 'page',
            itemsLoadOffset: 0
        };
        

    function Scrollah(element, options) {
        this.element = $(element);

        this.options = $.extend({}, defaults, options);

        if (!this.options.itemSelector) {
            throw new Error("You need to specify item selector");
        }

        this._defaults = defaults;
        this._name = pluginName;
        this.prepareItems();
        this._itemsShowed = [];
        this._perPage = this._items.length;
        this._page = 1;
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

            this.options.scrollElement.scroll(function(event) {
                var scrollBottom = self._scrollElement.scrollTop() + self._window.height();

                self.recalculateItemsPosition(scrollBottom);
            });

            this.options.scrollElement.on('resize.Scrolling', function(event) {
                var scrollBottom = self._scrollElement.scrollTop() + self._window.height();

                self.recalculateItemsPosition(scrollBottom);
            });

            this.element.on('scrollah.item.showed', function(event, index) {
                self.itemShowed(index);
            });
            this.element.on('scrollah.item.hidden', function(event, index) {
                self.itemHidden(index);
            });
            this.element.on('scrollah.loaded', function(event, items) {
                var scrollBottom = self._scrollElement.scrollTop() + self._window.height(),
                    responseItems = $('<div>').html(items).children();

                self.element.append(responseItems);
                self.prepareItems();
                self.recalculateItemsPosition(scrollBottom);
            });

            this.recalculateItemsPosition(scrollBottom);
        },

        prepareItems: function() {
            this._items = $(this.options.itemSelector);
            this._itemsQ = [];

            var iLength = this._items.length;
            for (var i = 0; i < iLength; i++) {
                this._itemsQ.push($(this._items[i]));
            }

            this._items.css({
                "position": "relative"
            });
        },

        recalculateItemsPosition: function(scrollBottom) {
            var item, i, length = this._items.length, even, fn, windowHeight = this._window.height();
            fn = this.posFns[this.options.easeFn], el = this.element;

            for (var i = 1; i <= length; i++) {
                even = i % 2 === 0;
                coef = even ? 1 : -1;
                item = this._itemsQ[i-1];

                if (item.offset().top >= windowHeight) {
                    (function (fn, element, scrollBottom, item, index) {
                        fn(element, scrollBottom, item, coef, index);
                    })(fn, el, scrollBottom, item, i);
                }
            };
        },

        itemShowed: function(index) {
            if (this._itemsShowed.length % this._perPage === 0) {
                this._page = this._itemsShowed.length / this._perPage + 1;
                this.element.trigger('scrollah.pageChanged', [this._page]);
            }

            if (this._itemsShowed.indexOf(index) === -1) {
                this._itemsShowed.push(index);
            }

            var itemsCount = this._itemsShowed.length + this.options.itemsLoadOffset,
                page = parseInt(itemsCount / this._perPage, 10) + 1;

            if (itemsCount === this._items.length) {
                this.element.trigger('scrollah.loadMore', [page]);
            }
        },

        itemHidden: function(index) {
            var ind = this._itemsShowed.indexOf(index);

            if (ind > -1) {
                this._itemsShowed.splice(ind, 1);

                if (this._itemsShowed.length % this._perPage === 0) {
                    this._page = this._itemsShowed.length / this._perPage;
                    
                    if (this._page > 0) {
                        this.element.trigger('scrollah.pageChanged', [this._page]);
                    }
                }
            }
        },

        posFns: {
            'sin': function(element, scrollBottom, item, directionCoef) {
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
            'tan': function(element, scrollBottom, item, directionCoef, index) {
                var itemHeight = 1.5 * item.height(),
                    itemWidth = item.width(),
                    itemTop = item.offset().top,
                    scrollOverItem = scrollBottom - itemTop,
                    position = scrollOverItem > itemHeight ? 0 : directionCoef * itemWidth,
                    boundary = item.width() * 0.5,
                    start;

                if (scrollOverItem >= 0 && scrollOverItem <= itemHeight) {
                    start = scrollOverItem * (1 / itemHeight) * (Math.PI / 4);
                    position = (directionCoef * itemWidth) - (directionCoef * itemWidth * Math.tan(start));
                }

                if (item.position().left !== position) {
                    item.css('left', position);

                    if (Math.floor(position) === 0) {
                        element.trigger('scrollah.item.showed', index);
                    } else if(Math.abs(Math.floor(position)) === itemWidth) {
                        element.trigger('scrollah.item.hidden', index);
                    }
                }
            }
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