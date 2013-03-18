;(function ( $, window, document, undefined ) {
    // Create the defaults once
    var pluginName = "scrollAffix",
        addedClass = 'scroll-affix-fixed',
        $window = $(window),
        defaults = {
            offset: 0
        };

    // The actual plugin constructor
    function ScrollAffix( element, options ) {
        this.element = $(element);
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;
        this._wrapper = null;
        this._wrapperId = '#' + Date.now() + 'sc-aff-wrapper';
        this._offsetTop = 0;
        this._isFixed = false;

        this.init();
    }

    ScrollAffix.prototype = {

        init: function() {
            var self = this;
            this._wrapper = $('<div />').attr('id',this._wrapperId).css('height', this.element.height());
            this._offsetTop = this.element.offset().top;

            this.element.wrap(this._wrapper);
            this.processScroll();

            $window.on('scroll', function(event) {
                self.processScroll();
            });
        },

        processScroll: function() {
            var i, scrollTop = $window.scrollTop(), 
                offsetTop = this._offsetTop - this.options.offset,
                elementHeight = this.element.height();

            if (this._wrapper.height() !== elementHeight) {
                this._wrapper.css('height', elementHeight);
            }

            if (scrollTop >= offsetTop && !this._isFixed) {
                this._isFixed = 1;
                this.element.addClass(addedClass);
            } else if (scrollTop <= offsetTop && this._isFixed) {
                this._isFixed = 0;
                this.element.removeClass(addedClass);
            }
        }
    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new ScrollAffix( this, options ));
            }
        });
    };

})( jQuery, window, document );