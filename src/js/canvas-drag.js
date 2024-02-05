module.exports.canvasDrag = function canvasDrag(canvas_node, img_url, img_width, img_height){
    var c = canvas_node.getContext("2d");

    var mouseX = 0,
        mouseY = 0;
    var mousePressed = false;
    var dragging = false;

    canvas_node.addEventListener('mousemove', function(e) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
        // console.log(mouseX,mouseY)
    })
    function DragImage(src, x, y) {
        var that = this;
        var startX = 0,
            startY = 0;
        var drag = false;
        
        this.x = x;
        this.y = y;
        var img = new Image();
        img.src = src;
        this.update = function() {
            if (mousePressed ) {
                
                    var left = that.x;
                    var right = that.x + img.width;
                    var top = that.y;
                    var bottom = that.y + img.height;
                    if (!drag) {
                        startX = mouseX - that.x;
                        startY = mouseY - that.y;
                    }
                    if (mouseX < right && mouseX > left && mouseY < bottom && mouseY > top) {
                        if (!dragging){
                            dragging = true;
                            drag = true;
                        }
                        
                    }
                
            } else {
                
                drag = false;
            }
            if (drag) {
                that.x = mouseX - startX;
                that.y = mouseY - startY;
            }
            c.drawImage(img, that.x, 0, canvas_node.height, canvas_node.height);
        }
    }

    var image1 = new DragImage(img_url, 0, 0);

    var loop = setInterval(function() {
        c.clearRect(0, 0, canvas_node.width, canvas_node.height);

        image1.update();
    }, 30);


    document.addEventListener('touchstart', function(e) {
        mousePressed = true;
    });
    document.addEventListener('touchend', function(e) {
        mousePressed = false;
        dragging = false;
    });
    document.addEventListener('mousedown', function(e) {
        mousePressed = true;
    });
    document.addEventListener('mouseup', function(e) {
        mousePressed = false;
        dragging = false;
    });

}