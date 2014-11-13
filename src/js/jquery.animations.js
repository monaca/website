"use strict";

/**
 *
 * @param DOMelement el
 */
function animateLivereload(el) {
    // livereload
    var editor = CodeMirror($('.livereload-editor', el)[0], {
        value: '',
        mode: 'htmlmixed',
        readOnly: true,
        lineNumbers: true
    });

    var exampleLines = [];
    $.get('/animation_livereload_content.txt').success(function(response) {
        exampleLines = response.split(/\n/);
        runAnimationLoop(exampleLines);
    });

    function runAnimationLoop(exampleLines) {
        var lines = Array.apply(null, exampleLines);

        var savedMark = $('.livereload-saved', el);
        var connector = $('.livereload-connect', el);
        var screen = $('.livereload-device-screen-reloaded', el);

        var timer = setInterval(function() {
// editor animation
            editor.setValue(
                editor.getValue() +
                (editor.getValue() ? '\n' : '') +
                lines.splice(0, 4).join('\n')
            );

            if (lines.length == 0) {
                clearInterval(timer);

// saved mark & connector animation begin
                savedMark.addClass('on');
                connector.removeClass('stop');
                setTimeout(function() {
// reload end
                    savedMark.removeClass('on');
                    connector.addClass('stop');
                    screen.removeClass('hidden');

                    setTimeout(function() {
// clear state
                        editor.setValue('');
                        screen.addClass('hidden');

                        setTimeout(function() {
                            runAnimationLoop(exampleLines);
                        }, 1000);
                    }, 4000);
                }, 1000);
            }
        }, 400);

    }
}