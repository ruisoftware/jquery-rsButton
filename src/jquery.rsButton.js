/**
* jQuery Button - Push button with animation capabilities.
* ===============================================================
*
* Licensed under The MIT License
* 
* @version   1
* @author    Jose Rui Santos
*
* For info, please scroll to the bottom.
*/
(function ($, undefined) {
    'use strict';
    var ButtonClass = function ($elem, opts) {
        var mouseIsDown = false,
            $animObj = null,
            isDocumentKeyEventsBound = false,
            currFrame = 1,
            
            init = function() {
                $(document).bind('mouseup.rsButton touchend.rsButton', onMouseup);
                $elem.
                    bind('mousedown.rsButton touchstart.rsButton', onMousedown).
                    bind('focus.rsButton', gotFocus).
                    bind('blur.rsButton', loseFocus).
                    bind('destroy.rsButton', onDestroy);
                doAnim(false, false);
            },
            doAnim = function(anim, buttonGoesDown, onFinish) {
                var qtFrames = opts.frameClasses ? opts.frameClasses.length : 0;
                if (qtFrames > 0) {
                    var dest = buttonGoesDown ? qtFrames : 1,
                        prevFrame = 0,
                        doStep = function (now) {
                            var frame = Math.round(now);
                            if (prevFrame === 0 || frame !== prevFrame) {
                                $elem.removeClass(opts.frameClasses[(prevFrame === 0 ? currFrame : prevFrame) - 1]).addClass(opts.frameClasses[frame - 1]);
                                prevFrame = currFrame = frame;
                            }
                        },
                        doComplete = function () {
                            $animObj = null;
                            currFrame = dest;
                            if (onFinish) {
                                onFinish();
                            }
                        };
                    if (anim) {
                        $animObj = $({ 'n': currFrame });
                        $animObj.animate({ 'n': dest }, { 
                            queue: false,
                        	duration: opts.speed, 
                            step: doStep, 
                            complete: doComplete
                        });
                    } else {
                        doStep(dest);
                        doComplete();
                    }
                }
            },
            onMousedown = function (e) {
                e.preventDefault();
                mouseIsDown = true;
                if ($animObj) { // is some animation going on?
                    $animObj.stop();
                }
                doAnim(true, true, null);
                $elem.focus();
            },
            onMouseup = function (e) {
                e.preventDefault();
                if (mouseIsDown) {
                    if ($animObj) { // is some animation going on?
                        $animObj.stop();
                    }
                    mouseIsDown = false;
                    doAnim(true, false, null);
                }
            },
            onKeydown = function (event) {
                var key = {
                    enter: 13,
                    space: 32
                },
                allowedKey = function () {
                    switch (event.which) {
                        case key.enter: return $.inArray('enter', opts.keyboard) > -1;
                        case key.space: return $.inArray('space', opts.keyboard) > -1; 
                    }
                    return false;
                };

                if (allowedKey()) {
                    switch (event.which) {
                        case key.space:
                        case key.enter:
                            // button goes down and then
                            doAnim(true, true, function () {
                                // immediately goes up
                                doAnim(true, false, null);
                            });
                    }
                }
            },
            gotFocus = function () {
                if (!isDocumentKeyEventsBound) {
                    $(document).bind('keydown.rsButton', onKeydown);
                    isDocumentKeyEventsBound = true;
                }
            },
            loseFocus = function () {
                $(document).unbind('keydown.rsButton', onKeydown);
                isDocumentKeyEventsBound = false;
            },
            onDestroy = function () {
                $(document).
                    unbind('mouseup.rsButton touchend.rsButton', onMouseup).
                    unbind('keydown.rsButton', onKeydown);
                $elem.
                    unbind('mousedown.rsButton touchstart.rsButton', onMousedown).
                    unbind('focus.rsButton', gotFocus).
                    unbind('blur.rsButton', loseFocus).
                    unbind('destroy.rsButton', onDestroy);
                $elem.
                    removeClass(opts.frameClasses.join(' '));
                if ($elem.attr('class') === '') {
                    $elem.removeAttr('class');
                }
            };
            
        init();
    };
        
    $.fn.rsButton = function (options) {
        var destroy = function () {
            this.trigger('destroy.rsButton');
        };

        if (typeof options === 'string') {
            switch (options) {
                case 'destroy': return destroy.call(this);
                default: return this;
            }
        }
        var opts = $.extend({}, $.fn.rsButton.defaults, options);
        return this.each(function () {
            new ButtonClass($(this), opts);
        });
    };

    // public access to the default input parameters
    $.fn.rsButton.defaults = {
        frameClasses: ['frm1', 'frm2'], // Each class represents a frame in the animation that runs from unpushed to pushed position. Type: array of String.
                                        // The first class is used for the unpushed state, the last for the pushed state. Optional frames in the middle can be used to create a more realistic animation.
        keyboard: ['enter', 'space'],   // Allowed keys. Type: String array.
        speed: 30                       // Amount of milliseconds each frame is visible. Type: positive integer.
    };
})(jQuery);
