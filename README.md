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

**initialResizeSpeed** time value in milliseconds to process resizing for the 1st set slide
**resizeSpeed**          time value in milliseconds to process resizing for other slidesn(after next/prev navigation)
**slideSpeed**         time value in milliseconds to process next/previous navigation
**navigation**         true | false - to show next/previous navigation or not
**prevButtonLabel**    string value to have as a label for previous slide button (leave empty to have empty button, e.g. if you have image instead of character/text)
**nextButtonLabel**    string value to have as a label for next slide button (leave empty to have empty button, e.g. if you have image instead of character/text)
