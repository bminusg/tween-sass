## tween-sass

tween-sass is a SASS single code-line mixin that delivers the possibility for chaining multiple tween components to one tween animation

### Usage

1. Install tween-sass package `npm install tween-sass --save-dev`
2. Define mixin on your SASS file `@use "tween-sass" as *`
3. Define your animation tweening chain on your element
4. Run animation with adding ".is--tweening" class to your parent or root element

### Custom Configuration

```SASS
@use "tween-sass" as * with ($parent: "#flyTarget", $activeClass: ".flyContentActive")

```

### Tween Components

There is an overview of all existing components on http://projects.bminusg.de/tween-sass

```SASS
@use "tween-sass" as *

#example
    @include tween(slideInLeft, wait 2.5s, slideOutRight)
    animation-iteration-count: infinite
```

### Ideation

- Use tween-group(tween, index, length) mixin for a dynamic offset calculating depending of multiple tweens
