;(function ($, window, document, undefined) {

    var pluginName = "Scrollah",
        defaults = {
            itemSelector: '',
            scrollElementSelector: 'window'
        };

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

    function recalculateItemPosition(scrollBottom, item, directionCoef) {
        var itemHeight = item.height() - 0.25 * item.height(),
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
        }
    }

    Scrollah.prototype = {

        init: function() {
            var self = this;

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
        },

        recalculateItemsPosition: function(scrollBottom) {
            var item, i, length = this._items.length, even;

            for (var i = 1; i <= length; i++) {
                even = i % 2 === 0;
                coef = even ? 1 : -1;
                item = this._itemsQ[i-1];

                (function (scrollBottom, item) {
                    recalculateItemPosition(scrollBottom, item, coef);
                })(scrollBottom, item);
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