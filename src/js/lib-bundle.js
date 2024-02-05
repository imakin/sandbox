(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.lib = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
};
},{}]},{},[1])(1)
});
