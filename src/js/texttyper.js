
export default class TextTyper {
    constructor(selector, interval=100) {
        this.interval_time = interval;
        if (selector instanceof Node) {
            this.make_typed(selector);
        } else {
            this.make_typed(document.querySelector(selector));
        }
    }
  
    make_typed(elem) {
        this.text = elem.textContent;
        elem.textContent = "";
        this.counter = 0;
        this.intrvl = setInterval(() => {
            if (this.counter<this.text.length) {
                elem.textContent += this.text[this.counter];
            }
            else{
                clearInterval(this.intrvl);
            }
            this.counter += 1;
        }, this.interval_time);
    }
};