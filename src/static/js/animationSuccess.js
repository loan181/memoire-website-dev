
// Click "Congratulations!" to play animation
var particles = ['.blob', '.star'],
    $congratsSection = $('#congrats'),
    $title = $('#sucessMessage');

$(function() {
    init({
        numberOfStars: 20,
        numberOfBlobs: 10
    });

    fancyPopIn();
});

// $congratsSection.click(fancyPopIn);

function fancyPopIn() {
    reset();
    animateText();

    for (var i = 0, l = particles.length; i < l; i++) {
        animateParticles(particles[i]);
    }
}

function animateText() {
    TweenMax.from($title, 0.65, {
        scale: 0.4,
        opacity: 0,
        rotation: 15,
        ease: Back.easeOut.config(5),
    });
}

function animateParticles(selector) {
    var xSeed = _.random(350, 380);
    var ySeed = _.random(120, 170);

    $.each($(selector), function(i) {
        var $particle = $(this);
        var speed = _.random(1, 4);
        var rotation = _.random(20, 100);
        var scale = _.random(0.8, 1.5);
        var x = _.random(-xSeed, xSeed);
        var y = _.random(-ySeed, ySeed);

        TweenMax.to($particle, speed, {
            x: x,
            y: y,
            ease: Power1.easeOut,
            opacity: 0,
            rotation: rotation,
            scale: scale,
            onStartParams: [$particle],
            onStart: function($element) {
                $element.css('display', 'block');
            },
            onCompleteParams: [$particle],
            onComplete: function($element) {
                $element.css('display', 'none');
            }
        });
    });
}

function reset() {
    for (var i = 0, l = particles.length; i < l; i++) {
        $.each($(particles[i]), function() {
            TweenMax.set($(this), { x: 0, y: 0, opacity: 1 });
        });
    }

    TweenMax.set($title, { scale: 1, opacity: 1, rotation: 0 });
}

function init(properties) {
    for (var i = 0; i < properties.numberOfStars; i++) {
        $congratsSection.append('<div class="particle star fa fa-star ' + i + '"></div>');
    }

    for (var i = 0; i < properties.numberOfBlobs; i++) {
        $congratsSection.append('<div class="particle blob ' + i + '"></div>');
    }
}
