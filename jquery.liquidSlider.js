/*
* LiquidSlider - jQuery Plugin
* Image slider plugin to provide flexible dimensions (both width and height)
* on each slide step.
*
* Copyright (c) 2013 Alex Vanyan (http://alex-v.net)
* Version: 1.1
* Requires: jQuery v1.4.2+
* 
*/

(function($) {

    $.fn.liquidSlider = function(options) {

        return this.each(function() {

            // default options: do not change!
            var defaults = {
                initialResizeSpeed: 100,
                resizeSpeed: 100,
                slideSpeed: 150,
                navigation: true,
                removeNavOnLastSlide: true,
                prevButtonLabel: "",
                nextButtonLabel: "",
                onLoad: null,
				onImageLoad: null,
                onNextSlide: null,
                onPrevSlide: null,
                onSlideChange: null,
                onBeforeNextSlide: null,
                onBeforePrevSlide: null,
                onBeforeSlideChange: null
            };
            
            var opts = $.extend( {}, defaults, options );
            var $this = $(this);

            // constructor
            var init = function(opts, $this) {

                var firstSlideIndex = 0;
                var sliderWrapper = $this.wrap( $("<div />").attr("class", "liquid-wrap") ).parent();
                var slideWrappers = $this.children();
                var sliderImages = $this.children().find("img");
                var currentSlideWrap = slideWrappers.eq(firstSlideIndex);
                var currentSlideImg = currentSlideWrap.find("img");

                // set current slide (attribute data-cslide to the top-level parent) to 1st set slide
                sliderWrapper.attr("data-cslide", parseInt(firstSlideIndex) + 1);
                slideWrappers.eq(parseInt(firstSlideIndex)).addClass("active");

                // slideshow wrapper and slide css goes here...
                $this.css({
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: $(window).width()
                });

                slideWrappers.css({
                    float: "left",
                    margin: 0,
                    padding: 0
                });

                // allow slider to preload before being shown
                sliderWrapper.css({
                    position: "absolute",
                    left: "-50000px",
                    top: "-50000px"
                });
                
                var imagesLoaded = 0;
                var checkInit = function() {
                    if ( imagesLoaded !== sliderImages.length ) return false;
					var childrenWidth = 0;
                    $this.children().each(function() {
                        childrenWidth += $(this).outerWidth(true);
                    });
					$this.css("width", childrenWidth);
                    sliderWrapper.css({
                        position: "relative",
                        overflow: "hidden",
                        left: "auto",
                        top: "auto",
                        margin: 0,
                        padding: 0
                    });
                    // auto-resize the slider for the 1st set slide
                    resizeTo(opts.initialResizeSpeed, sliderWrapper, firstSlideIndex);
                    // check if "navigation" option is enabled to add next/prev buttons
                    if ( true === opts.navigation ) addNavigation(opts, sliderWrapper);
                    slideIndexCheck(sliderWrapper);

					if ( typeof opts.onLoad === "function" ) opts.onLoad.call($this);
                };
                
                // attach the onLoad event handler to the slider images
                sliderImages.bind("load", function() {
					if ( typeof opts.onImageLoad === "function" ) opts.onImageLoad.call($(this));
                    imagesLoaded++;
                    checkInit();
                });
            };

            // default $.animate() begin and callback hooks
            var defaultAnimBegin = function() {};
            var defaultAnimCallback = function() {};

            // helper method: resizes slide scope to slide with index "slideIndex" with "speed" milliseconds
            var resizeTo = function(speed, sliderWrapper, slideIndex) {
                var slidesWrapper = sliderWrapper.children().eq(0);
                var imageObject = slidesWrapper.children().eq(slideIndex).find("img");
                defaultAnimBegin.call(slidesWrapper);
                sliderWrapper.animate({
                    width: imageObject.outerWidth(),
                    height: imageObject.outerHeight()
                }, parseInt(speed), function() {
                    defaultAnimCallback.call(slidesWrapper);
                });
            };

            // method to add prev/next buttons to the slider
            var addNavigation = function(opts, sliderWrapper) {
                // attach previous navigation button
                $('<a class="liquid-prev" href="#">' + opts.prevButtonLabel + '</a>').bind("click", function(e) {
                    e.preventDefault();
                    navigateToSlide( opts, sliderWrapper, -1 );
                }).insertBefore(sliderWrapper);
                // attach next navigation button
                $('<a class="liquid-next" href="#">' + opts.nextButtonLabel + '</a>').bind("click", function(e) {
                    e.preventDefault();
                    navigateToSlide( opts, sliderWrapper, 1 );
                }).insertAfter(sliderWrapper);
            };

            // slide nagivation generic function - direction depends on "delta" var
            var navigateToSlide = function(opts, sliderWrapper, delta) {
                var slidesWrapper = sliderWrapper.children().eq(0);
                var currentSlideIndex = parseInt(sliderWrapper.attr("data-cslide")) - 1;
                var upcomingSlideIndex = (currentSlideIndex + (delta * 1));

                // callback variables
                var navName = (-1 === delta ? "Prev" : "Next");
                var beforeCb = opts['onBefore' + navName + 'Slide'];
                var afterCb = opts['on' + navName + 'Slide'];
                var gBeforeCb = opts.onBeforeSlideChange;
                var gAfterCb = opts.onSlideChange;
                
                // check if the upcoming slide exists and return "false" if it does not
                if ( upcomingSlideIndex > slidesWrapper.children().length - 1 || upcomingSlideIndex < 0 ) return false;
                // pre-animation callbacks
                if ( typeof gBeforeCb === "function" ) gBeforeCb.call(slidesWrapper);
                if ( typeof beforeCb === "function" ) beforeCb.call(slidesWrapper);
                // next/prev animation is processed here...
                defaultAnimBegin.call(slidesWrapper);
                slidesWrapper.animate({
                    left: "-" + (slidesWrapper.children().eq(upcomingSlideIndex).offset().left - slidesWrapper.offset().left)
                }, opts.slideSpeed, function() {
                    var newCurrentSlideIndex = upcomingSlideIndex + 1;
                    // set current slide index attribute to the wrapper after slide navigation is complete
                    sliderWrapper.attr("data-cslide", newCurrentSlideIndex);
                    slideIndexCheck(sliderWrapper);
					slidesWrapper.children().removeClass("active").eq(newCurrentSlideIndex - 1).addClass("active");
                    // post-animation callbacks
                    if ( typeof gAfterCb === "function" ) gAfterCb.call(slidesWrapper);
                    if ( typeof afterCb === "function" ) afterCb.call(slidesWrapper);
                    defaultAnimCallback.call(slidesWrapper);
                });
                // start resizing the slide scope in a parallel way to the next/prev animation
                resizeTo(opts.resizeSpeed, sliderWrapper, upcomingSlideIndex);
            };
            
            var slideIndexCheck = function(sliderWrapper) {
                if ( true === opts.removeNavOnLastSlide ) {
                    switch ( parseInt(sliderWrapper.attr("data-cslide")) ) {
                        case 1:
                            sliderWrapper.prev(".liquid-prev").hide();
                            break;
                        case sliderWrapper.children().eq(0).children().length:
                            sliderWrapper.next(".liquid-next").hide();
                            break;
                        default:
                            sliderWrapper.prev(".liquid-prev").show();
                            sliderWrapper.next(".liquid-next").show();
                            break;
                    }
                }
            };

            // check to see if no element exists in DOM by the time plugin was called
            if ( ! $this.length ) {
                // if not check the browser to have a console in window top-level object
                if ( typeof window.console !== "undefined" ) {
                    // raise some error here
                    console.log("$.liquidSlider() cannot be called on a non-existing element");
                }
                return false;
            }

            init(opts, $this);

        });

    };

})(jQuery);
