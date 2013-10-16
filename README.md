liquid-slider
=============

Dynamically resizable jQuery slider plugin

Usage
=====
```html
<script type="text/javascript">
    $(document).ready(function() {
        $("ul#slideshow").liquidSlider();
    });
</script>
<ul id="slideshow">
    <li><img src="/image1.png" /></li>
    <li><img src="/image2.png" /></li>
    <li><img src="/image3.png" /></li>
</ul>
```

Options
=======

**initialResizeSpeed** - [default: 100] - time value in milliseconds to process resizing for the 1st set slide  
**resizeSpeed** - [default: 100] - time value in milliseconds to process resizing for other slidesn(after next/prev navigation)  
**slideSpeed** - [default: 150] - time value in milliseconds to process next/previous navigation  
**navigation** - true|false [default: true] - to show next/previous navigation or not  
**prevButtonLabel** - [default: ""] - string value to have as a label for previous slide button (leave empty to have empty button, e.g. if you have image instead of character/text)  
**nextButtonLabel** - [default: ""] - string value to have as a label for next slide button (leave empty to have empty button, e.g. if you have image instead of character/text)  
**removeNavOnLastSlide** - true|false [default: true] - specifies whether to remove the next/prev navigation control button when the last/first slide has been reached

Callbacks
=======

**onLoad()** - callback function called on plugin initialized state (when all images have been loaded and slider is ready to use)  
**onImageLoad()** - is called when each single image has been loaded  
**onPrevSlide()** - is called after navigation to previous slide has been complete  
**onBeforePrevSlide()** - called before navigation to previous slide has been started  
**onNextSlide()** - is called when navigation to the next slide has been complete  
**onBeforeNextSlide()** - called before navigation to next slide has been started  
**onSlideChange()** - triggered after change to any slide has been complete  
**onBeforeSlideChange()** - triggered before change to any slide has been started  

