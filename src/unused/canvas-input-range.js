require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"canvas-input-range":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
const HORIZONTAL = 0;
const VERTICAL = 1;
function draw(ctx, img, v) {
  ctx.drawImage(img, 0, 0);
}
function init(targetElem, cb, railImg, knobImg, options = {}) {
  const doubleClickTimeout = options.doubleClickTimeout || NaN;
  const valueMapping = options.valueMapping || NaN;
  const stepMapping = options.stepMapping || NaN;
  const alpha = options.alpha === undefined ? true : options.alpha;
  let rangeValue = 0;
  let localPos = 0;
  let selected = false;
  let lastClickTime = NaN;
  let offset = 0;
  let width;
  let height;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("draggable", "false");
  canvas.width = targetElem.clientWidth;
  canvas.height = targetElem.clientHeight;
  const ctx = canvas.getContext("2d", {
    alpha: alpha
  });
  let drawRail;
  if (options.drawRail) drawRail = options.drawRail;else drawRail = draw;
  let drawKnob;
  if (options.drawKnob) drawKnob = options.drawKnob;else drawKnob = draw;
  targetElem.appendChild(canvas);
  let imgSize = railImg.width;
  let orientation;
  let railTransform;
  let knobTransform;
  let leftPos;
  let topPos;
  let xScaleRail;
  let yScaleRail;
  let railLength;
  function getSize() {
    const boundingRect = targetElem.getBoundingClientRect();
    leftPos = boundingRect.left;
    topPos = boundingRect.top;
    canvas.width = targetElem.clientWidth;
    canvas.height = targetElem.clientHeight;
    width = canvas.width;
    height = canvas.height;
    if (width > height) {
      orientation = HORIZONTAL;
      railLength = width - height;
      xScaleRail = width / imgSize;
      yScaleRail = height / imgSize;
      railTransform = function railTransform() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(xScaleRail, yScaleRail);
      };
      railTransform();
      drawRail(ctx, railImg, 0);
      knobTransform = function knobTransform(value) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.translate((width - height) * value, 0);
        ctx.scale(yScaleRail, yScaleRail);
      };
      knobTransform();
      drawKnob(ctx, knobImg, 0);
    } else {
      orientation = VERTICAL;
      railLength = height - width;
      xScaleRail = width / imgSize;
      yScaleRail = height / imgSize;
      railTransform = function railTransform() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.rotate(Math.PI / 2);
        ctx.translate(0, -width);
        ctx.scale(yScaleRail, xScaleRail);
      };
      railTransform();
      drawRail(ctx, railImg, 0);
      knobTransform = function knobTransform(value) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.translate(0, height - width - value * (height - width));
        ctx.scale(xScaleRail, xScaleRail);
      };
      knobTransform(0);
      drawKnob(ctx, knobImg, 0);
    }
  }
  window.addEventListener("resize", getSize);
  getSize();
  function move(newValue) {
    // Browser wrongfully can trigger a mousemove event just after leaving the targer element so the range value must be clipped.
    if (newValue > 1) newValue = 1;else if (newValue < 0) newValue = 0;
    rangeValue = newValue;
    if (stepMapping) {
      let stepValue = stepMapping(rangeValue);
      if (stepValue === null) return;else rangeValue = stepValue;
    }
    railTransform();
    // When a transparent rail image is used the canvas should be cleared before every re-paint to avoid alpha channel saturation
    if (alpha) ctx.clearRect(0, 0, railImg.width, railImg.height);
    drawRail(ctx, railImg, rangeValue);
    knobTransform(rangeValue);
    drawKnob(ctx, knobImg, rangeValue);
    if (valueMapping) cb(valueMapping(rangeValue), localPos, targetElem);else cb(rangeValue, localPos, targetElem);
  }
  function mousemove(e) {
    if (orientation === HORIZONTAL) {
      localPos = e.clientX - leftPos;
      move((localPos - height) / railLength + offset);
    } else {
      localPos = e.clientY - topPos;
      move(1 - (localPos - width) / railLength + offset);
    }
  }
  function wheel(e) {
    if (!selected) return;
    e.preventDefault();
    console.log(e.deltaY);
    offset += e.deltaY / Math.abs(e.deltaY) / 200;
    console.log(e.clientX);
    mousemove(e);
  }
  function mouseup(e) {
    if (selected && doubleClickTimeout !== doubleClickTimeout) return;
    mousemove(e);
    window.removeEventListener("mousemove", mousemove);
    window.removeEventListener("mouseup", mouseup);
    window.removeEventListener("wheel", wheel);
  }
  ;
  function mousedown(e) {
    console.log(e);
    if (e.which !== 1 || "button" in e && e.button !== 0) return;
    let time = Date.now();
    if (time - lastClickTime < doubleClickTimeout) {
      if (!selected) {
        selected = true;
      } else {
        selected = false;
        offset = 0;
      }
      lastClickTime = NaN;
      console.log(selected);
    } else {
      lastClickTime = time;
    }
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);
    targetElem.addEventListener("wheel", wheel);
  }
  ;
  targetElem.addEventListener("mousedown", mousedown);
  targetElem.addEventListener("touchstart", e => {
    e.preventDefault();
    function touchmove(e) {
      e.preventDefault();
      if (orientation === HORIZONTAL) {
        localPos = e.changedTouches[0].clientX - leftPos;
        move((localPos - height) / railLength);
      } else {
        localPos = e.changedTouches[0].clientY - topPos;
        move(1 - (localPos - width) / railLength);
      }
      return false;
    }
    function touchend(e) {
      e.preventDefault();
      touchmove(e);
      window.removeEventListener("touchmove", touchmove);
      window.removeEventListener("touchend", touchend);
      return false;
    }
    ;
    window.addEventListener("touchmove", touchmove);
    window.addEventListener("touchend", touchend);
    return false;
  });
  const ctrl = {
    changeValue: function changeValue(v) {
      move(v);
    },
    selection: function selection(selectChange) {
      if (selectChange === true) {
        selected = selectChange;
        mousedown({
          clientX: 0,
          clientY: 0,
          which: 1,
          button: 0
        });
      } else if (selectChange === false) {
        selected = selectChange;
        mouseup({
          clientX: 0,
          clientY: 0,
          which: 1,
          button: 0
        });
      } else {
        console.error(`${selectChange} is not a boolean, required for change selection state`);
      }
    }
  };
  return ctrl;
}

},{}]},{},[]);
