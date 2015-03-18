(function(){
    function render_bg(){
        var bg = document.getElementById('bglayer'),
            img_size = { x: 49, y: 43 },
            max_chunks = { x: 40, y: 30 },
            chunks_that_fit = { x: max_chunks.x, y: max_chunks.y };

        var wwidth  = window.innerWidth,
            wheight = window.innerHeight;

        chunks_that_fit.x = Math.min(Math.ceil(wwidth/img_size.x), chunks_that_fit.x);
        chunks_that_fit.y = Math.min(Math.ceil(wheight/img_size.y), chunks_that_fit.y);

        for (var x = 0; x < chunks_that_fit.x; ++x){
            for (var y = 0; y < chunks_that_fit.y; ++y){
                create_tile(x, y, img_size, bg, wwidth, wheight, max_chunks);
            }
        }
    }

    function create_tile(x, y, img_size, bg, wwidth, wheight, max_chunks){
        function pad(x){
            return  x < 10  ? '0' + x : '' + x;
        }
        var id = '' + pad(x) + pad(y);
        var div = document.getElementById(id);
        var created = false;
        if (!div){
            div = document.createElement('div');
            div.setAttribute('id', id);
            created = true;
        }
        div = fill_tile.apply(this, [div].concat(Array.prototype.slice.call(arguments, 0)));
        if (created){
            bg.appendChild(div);
        }
    }

    function fill_tile(div, x, y, img_size, bg, wwidth, wheight, max_chunks){
        var calc_top   = 1+y /* fake padding */ + img_size.y*y /* image offset */,
            calc_left  = 1+x + img_size.x*x;

        div.style.top  = calc_top + 'px';
        div.style.left = calc_left + 'px';

        div.className = 'shown';

        var clip = {x: img_size.x, y: img_size.y, changed: false};

        if (calc_top + 1 + img_size.y > wheight){
            clip.y = wheight - (calc_top+1);
            clip.changed = true;
        }
        if (calc_left + 1 + img_size.x > wwidth){
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
            div.style.width = img_size.x + 'px';
            div.style.height = img_size.y + 'px';
        }

        var default_opacity = 1 - Math.max(x/max_chunks.x, y/max_chunks.y);
        div.style.opacity = default_opacity;

        div.addEventListener('mouseover', function(){
            div.style.opacity = 1.0;
            setTimeout(function(){ div.style.opacity = default_opacity; }, 1000);
        });

        return div;
    }

    render_bg();

    var called_at = undefined,
        resize_grace = 100;
    window.addEventListener('resize', function(){
        // resize with basic locking to avoid multiple calls
        called_at = new Date();
        setTimeout(
            function(){
                var now = new Date();
                if (now - called_at >= resize_grace){
                    called_at = now;
                    render_bg();
                }
            },
            resize_grace
        );
    });
})();

