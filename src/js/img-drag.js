/**
 * @author: Muhammad Izzulmakin 2024
 * Enables HORIZONTAL dragging functionality for an image element within specified edges.
 * @param {HTMLElement} img_node - The image element to enable dragging for. must have position absolute or fixed. and transition left some seconds;
 * @param {number} edge_left - The left edge limit for dragging in vw.
 * @param {number} edge_right - The right edge limit for dragging in vw.
 * @param {boolean, function} snap_half - If true, img drag will be snapped to the nearest half from edge_left or edge_right.
 *  if a function, snap_half will be called when edge_right reached.
 */
;export default function imageDrag(img_node, edge_left=0, edge_right=100, snap_half=false){
    let img = img_node;
    let mousedown = false;
    let on_move = (e)=>{
        if (mousedown){
            window.last_e = e;
            let vw = window.innerWidth;
            let clientX;
            // Check if this is a touch event
            if (e.touches) {
                // Get the first touch
                let touch = e.touches[0];
                // Get the position of the touch
                clientX = touch.clientX;
            } else {
                clientX = e.clientX;
            }
    
            let target_pos_px = clientX - (img.clientWidth/2);
            let target_pos = 100*target_pos_px/vw;
            target_pos = Math.min(Math.max(target_pos,edge_left),edge_right);
            img.style.left = target_pos+'vw';
        }
    };
    let on_mouse_up = (e)=>{
        let posx_px = img_node.offsetLeft;
        let posx = 100*posx_px/window.innerWidth;//in vw
        if (posx>=(edge_left + edge_right*0.4 - edge_left*0.4)){
            img_node.style.left = edge_right+'vw';
            document.removeEventListener('mouseup',on_mouse_up);
            document.removeEventListener('touchend',on_mouse_up);
            if (typeof snap_half=='function'){
                snap_half();
            }
        }
        else {
            img_node.style.left = edge_left+'vw';
        }
    };
    img.addEventListener(
        'mousedown', (e)=>{
            mousedown = true;
        }
    );
    img.addEventListener(
        'touchstart', (e)=>{
            mousedown = true;
        }
    );
    document.addEventListener(
        'mouseup', (e)=>{
            mousedown = false;
        }
    );
    document.addEventListener(
        'touchend', (e)=>{
            mousedown = false;
        }
    );
    document.addEventListener('mousemove',on_move);
    document.addEventListener('touchmove',on_move);
    if (snap_half){
        document.addEventListener('mouseup',on_mouse_up);
        document.addEventListener('touchend',on_mouse_up);
    }
    return this;
};