(function(window, document) {
    "use strict"

    /**
     * 图层对象, 包装一个 canvas 及其操作接口
     * @param {HTMLElement} element 外层元素
     * @param {Number} width canvas 宽度
     * @param {Number} height canvas 高粗
     * @param {Number} fixed 对 canvas 的边距进行修饰
     */
    function layer(element, width, height, fixed) {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'layer';
        this.canvas.style.left = fixed + 'px';
        this.canvas.width = width;
        this.canvas.height = height
        this.context = this.canvas.getContext('2d');

        element.appendChild(this.canvas);
    };

    layer.prototype.clearRect = function(x, y, w, h) {
        this.context.clearRect(x, y, w, h);
    };

    layer.prototype.drawImage = function(image, x, y) {
        this.context.drawImage(image, x, y);
    };

    window.Layer = layer;
})(window, document);
