(function(window, document) {
    "use strict"

    function imageLoader(files) {
        this.files = files;
        this.promises = [];
        this.eachLoadHandle = null;
        this.data = {};
    }

    imageLoader.prototype._loadByFileName = function(key, fileName) {
        return new Promise((function(resolve, reject) {
            var image = new Image();
            image.setAttribute('src', fileName);
            image.onload = (function() {
                return resolve(this._onImageLoad(event, key));
            }.bind(this));
            image.onabort = (function(event) {
                reject(event);
            }.bind(this));
        }).bind(this));
    };

    imageLoader.prototype._onImageLoad = function(event, key) {
        var image = event.target;
        if (typeof(this.eachLoadHandle) === 'function') {
            this.eachLoadHandle(image, key);
        }
        this.data[key] = image;
        return image;
    };

    imageLoader.prototype.attach = function(key, fileName) {
        this.promises.push(this._loadByFileName(key, fileName));
    };

    imageLoader.prototype.onEachLoaded = function(callback) {
        this.eachLoadHandle = callback;
    };

    imageLoader.prototype.load = function() {
        for (var key in this.files) {
            var fileName = this.files[key];
            this.attach(key, fileName);
        }
        var data = this.data;
        return Promise.all(this.promises).then(function(images) {
            return data
        });
    };

    window.ImageLoader = imageLoader;

    window.App.prototype.loadImages = function(files) {
        return new imageLoader(files);
    };
})(window, document);
