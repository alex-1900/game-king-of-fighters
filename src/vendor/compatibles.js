(function(window, document) {
    "use strict"
    /**
     * requestAnimationFrame 的兼容函数
     * @param {TimerHandler} timerHandler 
     */
    function compatibleRequestAnimationFrame(timerHandler) {
        setTimeout(timerHandler, 1000 / 60);
    }

    /**
     * cancelAnimationFrame 的兼容函数
     * @param {Number} handle 
     */
    function compatibleCancelAnimationFrame(handle) {
        clearTimeout(handle);
    }

    window.requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        compatibleRequestAnimationFrame;

    window.cancelAnimationFrame = window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        compatibleCancelAnimationFrame;

    /**
     * 继承器
     * @param {any} child 子类
     * @param {any} parent 父类
     * 
     * @return {any} 继承后的子类
     */
    window.extend = function(child, parent) {
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
        return child;
    };

    /**
     * 全屏显示
     * @param {HTMLElement} element (e.g. document.documentElement.requestFullScreen())
     */
    window.requestFullScreen = function() {
        var element = document.documentElement;
        var requestMethod = element.requestFullScreen ||
        element.webkitRequestFullScreen ||
        element.mozRequestFullScreen ||
        element.msRequestFullScreen;
        if (requestMethod) {
            requestMethod.call(element);
        }
        else if (typeof window.ActiveXObject !== "undefined") {
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    };

    /**
     * 反转多张图片
     * @param {Image[]} images
     */
    window.pixelReverseArray = function(images) {
        var newImages = [];
        for (var key in images) {
            newImages[key] = images[key];
            newImages[key + '_r'] = pixelReverse(images[key]);
        }
        return newImages;
    };

    /**
     * 反转一张图片
     * @param {Image} image
     */
    window.pixelReverse = function(image) {
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var ctx = canvas.getContext('2d');
        for (var pixel = 1; pixel <= image.width; pixel++) {
            ctx.drawImage(image, image.width - pixel, 0, 1, image.height, pixel, 0, 1, image.height);
        }
        return canvas;
    };

})(window, document);
