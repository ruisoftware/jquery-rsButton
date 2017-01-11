# jquery-rsButton [![Build Status](https://travis-ci.org/ruisoftware/jquery-rsButton.svg?branch=master)](https://travis-ci.org/ruisoftware/jquery-rsButton)
Animates a toggle control (most commonly a button) with several frames for a realistic state transition look.

Every toggle control has two states: unpressed and pressed. When a button is clicked, the state changes from unpressed to pressed and remains pressed while its down. Once it releases, the state moves back from pressed to unpressed. This plug-in simply displays intermediate frames between these two states, through the use of CSS classes, one class for each frame.

Here is an example:
```html
    <button class="btn">sample frame</button>
```
```javascript
    $(".btn").rsButton({
        frameClasses: ['frm1', 'frm2', 'frm3', 'frm4']
    });
```
When a button is pressed, the frm1, frm2, frm3 and frm4 are displayed one after another for 60 milliseconds (you can change the frame delay).  
![frames](https://cloud.githubusercontent.com/assets/428736/21605695/d6674192-d1bb-11e6-800d-227bbf6527b4.png)  
Notice the subtle differences between these four frames and the changes made to the markup during this process.

When a button is released, the frames are displayed in oposite order: frm4, frm3, frm2 and frm1.  
[Live demo here](http://codepen.io/ruisoftware/pen/rjNMZJ).

#Faq
###I dislike the colors and style. Is it possible to change?
Sure it is possible to change.  
For reasons related with performance and responsive design, each frame is made out of pure CSS with relative `em` units. They are not images at all. These relative units should always be used, even if you wish to use a fixed size layout.  
For your convenience, there is a LESS file at `src/rsButton.less` where you can change the frames to your preference. If you are interested in changing only the color palette, you can change the `@background` variable in the LESS file.  
However, nothing stops you from using images for each frame, although that might cause performance and responsive design issues later on.

###Do I need to specify that `btn` class?
Yes, if you want a 3D layout to your buttons.  
If you prefer a flat layout, then use the class `btnflat` instead.  
Notice that you are free to use whatever class you want, just make sure it is also defined in the `src/rsButton.less`.

###Why my `<input class="btn">` element looks flat and not 3D alike?
In the `src/rsButton.less` you can see that the 3D look is achived via the `:before` and `:after` pseudo-classes.  
These pseudo-classes cannot be applied to `input` elements, since they are not block elements, they are inline, and therefore `input` elements can only have a flat layout.

###Is it limited to 4 frames?
No, you can use as many frames you wish. If you only use 1 or 2 frames, then there is no point using this plug-in, since that can be easly done with CSS alone.  
You need to make sure the frames you specify in `frameClasses` property are defined in the LESS file.

###How can I compile LESS into CSS?
Run 
```bash
grunt less
```
It creates a new `dist/rsButton.css` file.

###This plug-in can only be used for push buttons?
No. It can be used for any control that switches from state A to state B when pressed down and from state B to A when released.  
This means that this plug-in works for any markup, not only for `<button>`.  
Since the most common control with this behaviour is a push button, hence the plug-in name.

###Cannot this be done with CSS alone?
It depends...  
Yes, if you want to simply smooth (interpolate) frames between a start and an end frame. In this case, you should not use this plug-in and must resort to CSS transitions.  
No, if you want to design specific frames that are distinct from each other and thus not possible to replicate via CSS transitions.

###Why cannot use CSS animations to specify distinct frames?
You *almost* can with CSS3 animations.  
By default, CSS3 animations perform interpolations between the animation steps. Since we don't want any frame interpolation (because we define how each frame exactly looks), we need to specify either `step-start` or `step-end` as your [timing function](https://developer.mozilla.org/ru/docs/Web/CSS/single-transition-timing-function#step-start).  
You also need two animations:
- When the control is pressed down, the one that animates the state transition from unpressed to pressed. Easly implemented with the [`:active`](https://developer.mozilla.org/en-US/docs/Web/CSS/:active) pseudo-class. When this animation finishes, it needs to stay on the last frame, so [`animation-fill-mode`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-fill-mode) should be set to `forwards`. The animation shows the frames frm1 -> frm2 -> frm3 -> frm4 and stays on frm4 when animation finishes.
- When the control is released, the one that animates the state transition from pressed to unpressed. This has to be triggered when not in `:active`, which means that should be the default animation. The animation shows the frames frm4 -> frm3 -> frm2 -> frm1.
```css
/* frm1 style goes here */

@keyframes pressAnim {
    33%  { /* frm2 style goes here */ }
    66%  { /* frm3 style goes here */ }
    100% { /* frm4 style goes here */ }
}

@keyframes releaseAnim {
    0%  { /* frm4 style goes here */ }
    33% { /* frm3 style goes here */ }
    66% { /* frm2 style goes here */ }
}

button.btn {
    animation: releaseAnim .5s step-end;
}

button.btn:active {
    animation: pressAnim .5s forwards step-end;
}
```
Basically, there are three problems with this approach:
- The second animation (releaseAnim) runs at page load time;
- If the user presses and releases the button too quickly, before the first animation (pressAnim) finishes, an ugly "jump" to the second animation will be noticed. That is, considering the use case with 4 frames, if a button is pressed down and released so quickly that only the first two frames were displayed, the final chained animation will look like frm1 -> frm2 -> frm4 -> frm3 -> frm2 -> frm1;
- Lack of cross-browser support.

Due to the above problems, a decision was made to implement this functionality in JavaScript.

#Key Features
 - Works with any HTML element;
 - Desktop and mobile devices;
 - Optionally uses the keyboard (space or Enter);
 - Small footprint.

#Installation

You can install from [npm](https://www.npmjs.com/):
```bash
npm install jquery.rsbutton --save
```
or directly from git:
```javascript
<script src="http://rawgit.com/ruisoftware/jquery-rsButton/master/src/jquery.rsButton.js"></script>
```
or you can download the Zip archive from github, clone or fork this repository and include `jquery.rsButton.js` from your local machine.

You also need to download jQuery. In the example below, jQuery is downloaded from Google cdn.

#Usage
```javascript
<!doctype html>
<html>
<head>
    <title>jquery-rsButton plug-in</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="http://rawgit.com/ruisoftware/jquery-rsButton/master/src/jquery.rsButton.js"></script>
    <script>
        $(document).ready(function () {
            $('.btn, .btnflat').rsButton();
        });
    </script>
</head>
<body>
    <button class="btn">push me</button>
    <button class="btnflat">push me</button>
    <div class="btn">push me</div>
<body>
</html>
````
[Live demo here](http://codepen.io/ruisoftware/pen/rjNMZJ).

# License
This project is licensed under the terms of the [MIT license](https://opensource.org/licenses/mit-license.php)

# Bug Reports & Feature Requests
Please use the [issue tracker](https://github.com/ruisoftware/jquery-rsButton/issues) to report any bugs or file feature requests.

# Contributing
Please refer to the [Contribution page](https://github.com/ruisoftware/jquery-rsButton/blob/master/CONTRIBUTING.md) from more information.
