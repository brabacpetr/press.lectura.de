;(function ( $, window, document, undefined ) {
    // Create the defaults once
    var pluginName = "scrollAffix",
        addedClass = 'scroll-affix-fixed',
        $window = $(window),
        defaults = {
            offset: 0,
            stopElement: null,
            stopElementOffset: 0
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
        this._isStopped = false;

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
                scrollBottom = scrollTop + $window.height(),
                offsetTop = this._offsetTop - this.options.offset,
                elementHeight = this.element.outerHeight(),
                checkStopElement = this.options.stopElement ? true : false,
                elementBottom = this.element.offset().top + elementHeight;
                stopElementOffset = checkStopElement ? this.options.stopElement.offset().top - this.options.stopElementOffset : 0,

            this._wrapper.css('height', elementHeight);
            
            if (checkStopElement && this._isFixed && scrollTop + elementHeight + this._posTop >= stopElementOffset) {
                this.element.css({
                    position: 'absolute',
                    top: stopElementOffset - elementHeight
                });
                this._isFixed = false;
                this._isStopped = true;
            } else {

                if (checkStopElement && this._isStopped && scrollTop + elementHeight + this._posTop <= stopElementOffset) {
                    this.element.css({
                        position: '',
                        top: '',
                    });
                    this._isStopped = false;
                    this._isFixed =  true;
                } else if (!this._isStopped) {
                    if (scrollTop >= offsetTop && !this._isFixed) {
                        this._isFixed = 1;
                        this.element.addClass(addedClass);
                        this._posTop = this.element.position().top;
                    } else if (scrollTop <= offsetTop && this._isFixed) {
                        this._isFixed = 0;
                        this.element.removeClass(addedClass);
                    }
                }
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