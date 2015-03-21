(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var config = {
    tile_size:  { x: undefined, y: undefined },
    num_tiles:  { x: 16, y: 10 },
    image_size: { x: undefined, y: undefined },
    layer_id: 'bglayer'
};

config.load = function (opts){
    if (!opts){
        opts = {}
    }
    if (opts.id){
        config.layer_id = opts.id;
    }
    if (!config.layer_id){
        throw new Error('Missing "id" option to draw()');
    }
    if (opts.image){
        config.image_src = opts.image;
    }
    if (!config.image_src){
        throw new Error('Missing "image" option to draw()');
    }
    config.fade_opacity = opts.fade_opacity === true;
    if (!opts.image_size || !opts.image_size.x || !opts.image_size.y){
        if (!config.image_size.x){
            throw new Error('Missing "image_size" option to draw()');
        }
    }else{
        config.image_size = {
            x: opts.image_size.x,
            y: opts.image_size.y
        }
    }
    if (opts.tile_size && opts.tile_size.x){
        config.tile_size = {
            x: opts.tile_size.x,
            y: opts.tile_size.y
        }
    }
    if (opts.num_tiles && opts.num_tiles.x){
        config.num_tiles = {
            x: opts.num_tiles.x,
            y: opts.num_tiles.y
        }
    }
    if (config.tile_size.x && !config.num_tiles.x){
        config.num_tiles = {
            x: Math.floor(config.image_size.x / config.tile_size.x),
            y: Math.floor(config.image_size.y / config.tile_size.y)
        }
    }else if (!config.tile_size.x && config.num_tiles.x){
        config.tile_size = {
            x: Math.floor(config.image_size.x / config.num_tiles.x),
            y: Math.floor(config.image_size.y / config.num_tiles.y)
        }
    }
}

function draw(opts){
    config.load(opts);

    var bg = document.getElementById(config.layer_id),
        wwidth  = window.innerWidth,
        wheight = window.innerHeight;
        tiles_that_fit = {
            x: Math.min(Math.ceil(wwidth/config.tile_size.x), config.num_tiles.x),
            y: Math.min(Math.ceil(wheight/config.tile_size.y), config.num_tiles.y)
        };

    for (var x = 0; x < tiles_that_fit.x; ++x){
        for (var y = 0; y < tiles_that_fit.y; ++y){
            create_tile(x, y, bg, wwidth, wheight);
        }
    }
}

function create_tile(x, y, bg, wwidth, wheight){
    var id = '_grid_bg_' + x + '_' + y;
    var div = document.getElementById(id);
    var created = false;
    if (!div){
        div = document.createElement('div');
        div.setAttribute('id', id);
        created = true;
    }
    div.style['background-size'] = wwidth + 'px ' + wheight + 'px';
    div.style['background-image'] = 'url(' + config.image_src + ')';
    div = fill_tile.apply(this, [div].concat(Array.prototype.slice.call(arguments, 0)));
    if (created){
        bg.appendChild(div);
    }
}

function fill_tile(div, x, y, bg, wwidth, wheight){
    var calc_top   = 1+y /* fake padding */ + config.tile_size.y*y /* image offset */,
        calc_left  = 1+x + config.tile_size.x*x;

    div.style.top  = calc_top + 'px';
    div.style.left = calc_left + 'px';

    div.className = 'shown';

    var clip = {x: config.tile_size.x, y: config.tile_size.y, changed: false};

    if (calc_top + 1 + config.tile_size.y > wheight){
        clip.y = wheight - (calc_top+1);
        clip.changed = true;
    }
    if (calc_left + 1 + config.tile_size.x > wwidth){
        clip.x = wwidth - (calc_left+1);
        clip.changed = true;
    }

    if (clip.changed){
        if (clip.x < 2 || clip.y < 2){
            div.className = 'hidden';
        }else{
            div.style.width = clip.x + 'px';
            div.style.height = clip.y + 'px';
        }
    }else{
        div.style.width = config.tile_size.x + 'px';
        div.style.height = config.tile_size.y + 'px';
    }

    if (config.fade_opacity){
        var default_opacity = 1 - Math.max(x/config.num_tiles.x, y/config.num_tiles.y);
        div.style.opacity = default_opacity;

        div.addEventListener('mouseover', function(){
            div.style.opacity = 1.0;
            setTimeout(function(){ div.style.opacity = default_opacity; }, 1000);
        });
    }

    return div;
}

var called_at = undefined,
    resize_grace = 100;

window.addEventListener('resize', function(){
    // basic locking to avoid multiple calls
    called_at = new Date();
    setTimeout(
        function(){
            var now = new Date();
            if (now - called_at >= resize_grace){
                called_at = now;
                draw();
            }
        },
        resize_grace
    );
});

exports.draw = draw;

},{}],2:[function(require,module,exports){
(function (global){
global.gridbackground = require('./gridbackground');


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./gridbackground":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvZ3JpZGJhY2tncm91bmQuanMiLCJsaWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOUpBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY29uZmlnID0ge1xuICAgIHRpbGVfc2l6ZTogIHsgeDogdW5kZWZpbmVkLCB5OiB1bmRlZmluZWQgfSxcbiAgICBudW1fdGlsZXM6ICB7IHg6IDE2LCB5OiAxMCB9LFxuICAgIGltYWdlX3NpemU6IHsgeDogdW5kZWZpbmVkLCB5OiB1bmRlZmluZWQgfSxcbiAgICBsYXllcl9pZDogJ2JnbGF5ZXInXG59O1xuXG5jb25maWcubG9hZCA9IGZ1bmN0aW9uIChvcHRzKXtcbiAgICBpZiAoIW9wdHMpe1xuICAgICAgICBvcHRzID0ge31cbiAgICB9XG4gICAgaWYgKG9wdHMuaWQpe1xuICAgICAgICBjb25maWcubGF5ZXJfaWQgPSBvcHRzLmlkO1xuICAgIH1cbiAgICBpZiAoIWNvbmZpZy5sYXllcl9pZCl7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBcImlkXCIgb3B0aW9uIHRvIGRyYXcoKScpO1xuICAgIH1cbiAgICBpZiAob3B0cy5pbWFnZSl7XG4gICAgICAgIGNvbmZpZy5pbWFnZV9zcmMgPSBvcHRzLmltYWdlO1xuICAgIH1cbiAgICBpZiAoIWNvbmZpZy5pbWFnZV9zcmMpe1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgXCJpbWFnZVwiIG9wdGlvbiB0byBkcmF3KCknKTtcbiAgICB9XG4gICAgY29uZmlnLmZhZGVfb3BhY2l0eSA9IG9wdHMuZmFkZV9vcGFjaXR5ID09PSB0cnVlO1xuICAgIGlmICghb3B0cy5pbWFnZV9zaXplIHx8ICFvcHRzLmltYWdlX3NpemUueCB8fCAhb3B0cy5pbWFnZV9zaXplLnkpe1xuICAgICAgICBpZiAoIWNvbmZpZy5pbWFnZV9zaXplLngpe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIFwiaW1hZ2Vfc2l6ZVwiIG9wdGlvbiB0byBkcmF3KCknKTtcbiAgICAgICAgfVxuICAgIH1lbHNle1xuICAgICAgICBjb25maWcuaW1hZ2Vfc2l6ZSA9IHtcbiAgICAgICAgICAgIHg6IG9wdHMuaW1hZ2Vfc2l6ZS54LFxuICAgICAgICAgICAgeTogb3B0cy5pbWFnZV9zaXplLnlcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAob3B0cy50aWxlX3NpemUgJiYgb3B0cy50aWxlX3NpemUueCl7XG4gICAgICAgIGNvbmZpZy50aWxlX3NpemUgPSB7XG4gICAgICAgICAgICB4OiBvcHRzLnRpbGVfc2l6ZS54LFxuICAgICAgICAgICAgeTogb3B0cy50aWxlX3NpemUueVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChvcHRzLm51bV90aWxlcyAmJiBvcHRzLm51bV90aWxlcy54KXtcbiAgICAgICAgY29uZmlnLm51bV90aWxlcyA9IHtcbiAgICAgICAgICAgIHg6IG9wdHMubnVtX3RpbGVzLngsXG4gICAgICAgICAgICB5OiBvcHRzLm51bV90aWxlcy55XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNvbmZpZy50aWxlX3NpemUueCAmJiAhY29uZmlnLm51bV90aWxlcy54KXtcbiAgICAgICAgY29uZmlnLm51bV90aWxlcyA9IHtcbiAgICAgICAgICAgIHg6IE1hdGguZmxvb3IoY29uZmlnLmltYWdlX3NpemUueCAvIGNvbmZpZy50aWxlX3NpemUueCksXG4gICAgICAgICAgICB5OiBNYXRoLmZsb29yKGNvbmZpZy5pbWFnZV9zaXplLnkgLyBjb25maWcudGlsZV9zaXplLnkpXG4gICAgICAgIH1cbiAgICB9ZWxzZSBpZiAoIWNvbmZpZy50aWxlX3NpemUueCAmJiBjb25maWcubnVtX3RpbGVzLngpe1xuICAgICAgICBjb25maWcudGlsZV9zaXplID0ge1xuICAgICAgICAgICAgeDogTWF0aC5mbG9vcihjb25maWcuaW1hZ2Vfc2l6ZS54IC8gY29uZmlnLm51bV90aWxlcy54KSxcbiAgICAgICAgICAgIHk6IE1hdGguZmxvb3IoY29uZmlnLmltYWdlX3NpemUueSAvIGNvbmZpZy5udW1fdGlsZXMueSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhdyhvcHRzKXtcbiAgICBjb25maWcubG9hZChvcHRzKTtcblxuICAgIHZhciBiZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbmZpZy5sYXllcl9pZCksXG4gICAgICAgIHd3aWR0aCAgPSB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgICAgd2hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgdGlsZXNfdGhhdF9maXQgPSB7XG4gICAgICAgICAgICB4OiBNYXRoLm1pbihNYXRoLmNlaWwod3dpZHRoL2NvbmZpZy50aWxlX3NpemUueCksIGNvbmZpZy5udW1fdGlsZXMueCksXG4gICAgICAgICAgICB5OiBNYXRoLm1pbihNYXRoLmNlaWwod2hlaWdodC9jb25maWcudGlsZV9zaXplLnkpLCBjb25maWcubnVtX3RpbGVzLnkpXG4gICAgICAgIH07XG5cbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRpbGVzX3RoYXRfZml0Lng7ICsreCl7XG4gICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgdGlsZXNfdGhhdF9maXQueTsgKyt5KXtcbiAgICAgICAgICAgIGNyZWF0ZV90aWxlKHgsIHksIGJnLCB3d2lkdGgsIHdoZWlnaHQpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVfdGlsZSh4LCB5LCBiZywgd3dpZHRoLCB3aGVpZ2h0KXtcbiAgICB2YXIgaWQgPSAnX2dyaWRfYmdfJyArIHggKyAnXycgKyB5O1xuICAgIHZhciBkaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgdmFyIGNyZWF0ZWQgPSBmYWxzZTtcbiAgICBpZiAoIWRpdil7XG4gICAgICAgIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcbiAgICAgICAgY3JlYXRlZCA9IHRydWU7XG4gICAgfVxuICAgIGRpdi5zdHlsZVsnYmFja2dyb3VuZC1zaXplJ10gPSB3d2lkdGggKyAncHggJyArIHdoZWlnaHQgKyAncHgnO1xuICAgIGRpdi5zdHlsZVsnYmFja2dyb3VuZC1pbWFnZSddID0gJ3VybCgnICsgY29uZmlnLmltYWdlX3NyYyArICcpJztcbiAgICBkaXYgPSBmaWxsX3RpbGUuYXBwbHkodGhpcywgW2Rpdl0uY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkpKTtcbiAgICBpZiAoY3JlYXRlZCl7XG4gICAgICAgIGJnLmFwcGVuZENoaWxkKGRpdik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmaWxsX3RpbGUoZGl2LCB4LCB5LCBiZywgd3dpZHRoLCB3aGVpZ2h0KXtcbiAgICB2YXIgY2FsY190b3AgICA9IDEreSAvKiBmYWtlIHBhZGRpbmcgKi8gKyBjb25maWcudGlsZV9zaXplLnkqeSAvKiBpbWFnZSBvZmZzZXQgKi8sXG4gICAgICAgIGNhbGNfbGVmdCAgPSAxK3ggKyBjb25maWcudGlsZV9zaXplLngqeDtcblxuICAgIGRpdi5zdHlsZS50b3AgID0gY2FsY190b3AgKyAncHgnO1xuICAgIGRpdi5zdHlsZS5sZWZ0ID0gY2FsY19sZWZ0ICsgJ3B4JztcblxuICAgIGRpdi5jbGFzc05hbWUgPSAnc2hvd24nO1xuXG4gICAgdmFyIGNsaXAgPSB7eDogY29uZmlnLnRpbGVfc2l6ZS54LCB5OiBjb25maWcudGlsZV9zaXplLnksIGNoYW5nZWQ6IGZhbHNlfTtcblxuICAgIGlmIChjYWxjX3RvcCArIDEgKyBjb25maWcudGlsZV9zaXplLnkgPiB3aGVpZ2h0KXtcbiAgICAgICAgY2xpcC55ID0gd2hlaWdodCAtIChjYWxjX3RvcCsxKTtcbiAgICAgICAgY2xpcC5jaGFuZ2VkID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGNhbGNfbGVmdCArIDEgKyBjb25maWcudGlsZV9zaXplLnggPiB3d2lkdGgpe1xuICAgICAgICBjbGlwLnggPSB3d2lkdGggLSAoY2FsY19sZWZ0KzEpO1xuICAgICAgICBjbGlwLmNoYW5nZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChjbGlwLmNoYW5nZWQpe1xuICAgICAgICBpZiAoY2xpcC54IDwgMiB8fCBjbGlwLnkgPCAyKXtcbiAgICAgICAgICAgIGRpdi5jbGFzc05hbWUgPSAnaGlkZGVuJztcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBkaXYuc3R5bGUud2lkdGggPSBjbGlwLnggKyAncHgnO1xuICAgICAgICAgICAgZGl2LnN0eWxlLmhlaWdodCA9IGNsaXAueSArICdweCc7XG4gICAgICAgIH1cbiAgICB9ZWxzZXtcbiAgICAgICAgZGl2LnN0eWxlLndpZHRoID0gY29uZmlnLnRpbGVfc2l6ZS54ICsgJ3B4JztcbiAgICAgICAgZGl2LnN0eWxlLmhlaWdodCA9IGNvbmZpZy50aWxlX3NpemUueSArICdweCc7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5mYWRlX29wYWNpdHkpe1xuICAgICAgICB2YXIgZGVmYXVsdF9vcGFjaXR5ID0gMSAtIE1hdGgubWF4KHgvY29uZmlnLm51bV90aWxlcy54LCB5L2NvbmZpZy5udW1fdGlsZXMueSk7XG4gICAgICAgIGRpdi5zdHlsZS5vcGFjaXR5ID0gZGVmYXVsdF9vcGFjaXR5O1xuXG4gICAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgZGl2LnN0eWxlLm9wYWNpdHkgPSAxLjA7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IGRpdi5zdHlsZS5vcGFjaXR5ID0gZGVmYXVsdF9vcGFjaXR5OyB9LCAxMDAwKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpdjtcbn1cblxudmFyIGNhbGxlZF9hdCA9IHVuZGVmaW5lZCxcbiAgICByZXNpemVfZ3JhY2UgPSAxMDA7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbigpe1xuICAgIC8vIGJhc2ljIGxvY2tpbmcgdG8gYXZvaWQgbXVsdGlwbGUgY2FsbHNcbiAgICBjYWxsZWRfYXQgPSBuZXcgRGF0ZSgpO1xuICAgIHNldFRpbWVvdXQoXG4gICAgICAgIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGlmIChub3cgLSBjYWxsZWRfYXQgPj0gcmVzaXplX2dyYWNlKXtcbiAgICAgICAgICAgICAgICBjYWxsZWRfYXQgPSBub3c7XG4gICAgICAgICAgICAgICAgZHJhdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZXNpemVfZ3JhY2VcbiAgICApO1xufSk7XG5cbmV4cG9ydHMuZHJhdyA9IGRyYXc7XG4iLCJnbG9iYWwuZ3JpZGJhY2tncm91bmQgPSByZXF1aXJlKCcuL2dyaWRiYWNrZ3JvdW5kJyk7XG5cbiJdfQ==
