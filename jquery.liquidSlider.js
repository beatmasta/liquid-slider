/*
* LiquidSlider - jQuery Plugin
* Image slider plugin to provide flexible dimensions (both width and height)
* on each slide step.
*
* Copyright (c) 2013 Alex Vanyan (http://alex-v.net)
* Version: 1.0
* Requires: jQuery v1.4.2+
*
* Options:
*   | initialResizeSpeed: time value in milliseconds to process resizing for the 1st set slide
*   | resizeSpeed:        time value in milliseconds to process resizing for other slides
*   |                     (after next/prev navigation)
*   | slideSpeed:         time value in milliseconds to process next/previous navigation
*   | navigation:         true | false - to show next/previous navigation or not
*   | prevButtonLabel:    string value to have as a label for previous slide button
*   |                     (leave empty to have empty button, e.g. if you have image instead
*   |                     of character/text)
*   | nextButtonLabel:    string value to have as a label for next slide button
*   |                     (leave empty to have empty button, e.g. if you have image instead
*   |                     of character/text)
* Examples:
*   | simple call:
*   |                     <script type="text/javascript">
*   |                         $(document).ready(function() {
*   |                             $("ul#slideshow").liquidSlider();
*   |                         });
*   |                     </script>
*   |                     <ul>
*   |                         <li><img src="/image1.png" /></li>
*   |                         <li><img src="/image2.png" /></li>
*   |                         <li><img src="/image3.png" /></li>
*   |                     </ul>
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
                prevButtonLabel: "",
                nextButtonLabel: ""
            };
            
            var opts = $.extend( {}, defaults, options );
            var $this = $(this);

            // constructor
            var init = function(opts, $this) {
                var firstSlideIndex = 0;
                var sliderWrapper = $this.wrap( $("<div />").attr("class", "liquid-wrap") ).parent();
                var slideWrappers = $this.children();
                var sliderImages = $this.children().find("> img");
                var currentSlideWrap = slideWrappers.eq(firstSlideIndex);
                var currentSlideImg = currentSlideWrap.find("> img");

                // set current slide (attribute data-cslide to the top-level parent) to 1st set slide
                sliderWrapper.attr("data-cslide", parseInt(firstSlideIndex) + 1);

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
                sliderWrapper.css({
                    position: "relative",
                    overflow: "hidden",
                    margin: 0,
                    padding: 0
                });

                // auto-resize the slider for the 1st set slide
                resizeTo(opts.initialResizeSpeed, sliderWrapper, firstSlideIndex);
                // check if "navigation" option is enabled to add next/prev buttons
                if ( true === opts.navigation ) addNavigation(opts, sliderWrapper);
            };

            // default $.animate() callback to check whether animation is in progress
            // to postpone next one if it is...
            var animationInProgress = false;
            var animationPostponeTime = 2000;
            var defaultAnimBegin = function() { animationInProgress = true };
            var defaultAnimCallback = function() { animationInProgress = false };

            // helper method: resizes slide scope to slide with index "slideIndex" with "speed" milliseconds
            var resizeTo = function(speed, sliderWrapper, slideIndex) {
                // check if "animationInProgress" and postpone next one by "animationPostponeTime" if it is...
                //if ( animationInProgress ) return false;
                var imageObject = sliderWrapper.children().eq(0).children().eq(slideIndex).find("> img");
                defaultAnimBegin();
                sliderWrapper.animate({
                    width: imageObject.outerWidth(),
                    height: imageObject.outerHeight()
                }, parseInt(speed), defaultAnimCallback);
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
                // check if "animationInProgress" and postpone next one by "animationPostponeTime" if it is...
                //if ( animationInProgress ) return false;
                var slidesWrapper = sliderWrapper.children().eq(0);
                var currentSlideIndex = parseInt(sliderWrapper.attr("data-cslide")) - 1;
                var upcomingSlideIndex = (currentSlideIndex + (delta * 1));
                // check if the upcoming slide exists and return "false" if it does not
                if ( upcomingSlideIndex > slidesWrapper.children().length - 1 || upcomingSlideIndex < 0 ) return false;
                // next/prev animation is processed here...
                defaultAnimBegin();
                slidesWrapper.animate({
                    left: "-" + (slidesWrapper.children().eq(upcomingSlideIndex).offset().left - slidesWrapper.offset().left)
                }, opts.slideSpeed, function() {
                    // set current slide index attribute to the wrapper after slide navigation is complete
                    sliderWrapper.attr("data-cslide", upcomingSlideIndex + 1);
                    defaultAnimCallback();
                });
                // start resizing the slide scope in a parallel way to the next/prev animation
                resizeTo(opts.resizeSpeed, sliderWrapper, upcomingSlideIndex);
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