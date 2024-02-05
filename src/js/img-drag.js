/**
 * Enables HORIZONTAL dragging functionality for an image element within specified edges.
 * @param {HTMLElement} img_node - The image element to enable dragging for. must have position absolute or fixed. and transition left some seconds;
 * @param {number} edge_left - The left edge limit for dragging in vw.
 * @param {number} edge_right - The right edge limit for dragging in vw.
 */
;module.exports.imageDrag = function(img_node, edge_left=0, edge_right=100){
    let img = img_node;
    let mousedown = false;
    img.addEventListener(
        'mousedown', function(e){
            mousedown = true;
        }
    );
    img.addEventListener(
        'touchstart', function(e){
            mousedown = true;
        }
    );
    document.addEventListener(
        'mouseup', function(e){
            mousedown = false;
        }
    );
    document.addEventListener(
        'touchend', function(e){
            mousedown = false;
        }
    );
    let on_move = (e)=>{
        if (mousedown){
            let vw = window.innerWidth;
            let clientX = e.clientX;
            try{
                e.clientX = e.touches[0].clientX;
            }catch(e){}
            let target_pos_px = clientX - (img.clientWidth/2);
            let target_pos = 100*target_pos_px/vw;
            target_pos = Math.min(Math.max(target_pos,edge_left),edge_right);
            img.style.left = target_pos+'vw';
        }
    };
    document.addEventListener('mousemove',on_move);
    document.addEventListener('touchmove',on_move);
    return this;
};