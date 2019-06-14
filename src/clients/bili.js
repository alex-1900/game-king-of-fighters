(function(window, document) {
    "use strict"

    function rebuildImage(image) {
        // var hw_scale = image.height / image.width;
        // var width = app.width * 1 / 4;
        // var height = width * hw_scale;
        // image.style.width = width + 'px';
        // image.style.height = height + 'px';
        return image;
    }

    function bili(id, layer, images, direction, name, reload) {
        AbstructClient.call(this, id, layer);
        this.reload = reload ? reload : 90;
        this.name = name;
        this.images = this.prepareImages(images, name);
        this.defaultImageType = constants.IMAGE_TYPE_WALK;
        this.baseImage = this.images[this.name + '_'+ this.defaultImageType +'_0'];
        var x = layer.canvas.width * (direction == constants.DIRECTION_LEFT ? 0.7 : 0.1);
        var y = layer.canvas.height - this.baseImage.height - constants.LAND_HEIGHT;
        this.state = {
            imageType: this.defaultImageType,
            previousImageType: this.defaultImageType,
            direction: direction,
            imageIndex: 0,
            previousImageIndex: 0,
            speed: 0,
            X: x,
            Y: y,
            previousX: x,
            previousY: y,
            skilling: false,
            swapX: x,
            swapY: y
        };
    }

    extend(bili, AbstructClient);

    bili.prototype.update = function(timestamp) {
        if (this.isOvertime(timestamp, this.reload)) {
            var actionCount = constants[this.name]['COUNT_'+this.state.imageType];
            var isLastImage = this.state.imageIndex == actionCount;
            var isNextImage = this.state.previousImageIndex == actionCount;
            var isNotDefaultImageType = this.state.imageType != this.defaultImageType;
            var newX = this.state.X + this.state.speed;

            this.setStates({
                previousImageType: this.state.imageType,
                previousImageIndex: this.state.imageIndex,
                imageType: isLastImage && isNotDefaultImageType ? this.defaultImageType : this.state.imageType,
                imageIndex: isLastImage ? 0 : this.state.imageIndex + 1,
                skilling: isNotDefaultImageType ? true : false,
                previousX: this.state.X,
                previousY: this.state.Y,
                X: newX,
                swapX: isNotDefaultImageType ? this.state.swapX : newX,
                swapY: isNotDefaultImageType ? this.state.swapY : this.state.Y
            });

            if (isNotDefaultImageType) {
                var currentImage = this.getCurrentImage();
                var isLeftSkill = !isLastImage && this.state.direction == constants.DIRECTION_LEFT;
                var fixedWidth = currentImage.width - this.baseImage.width;
                var fixedH = this.baseImage.height - currentImage.height;
                var fixedHeight;
                if (this.state.imageType == constants.IMAGE_TYPE_UP) {
                    var fixedHeight = this.state.swapY - fixedH;
                } else {
                    fixedHeight = this.state.swapY + fixedH;
                }
                this.setStates({
                    X: isLeftSkill ? this.state.swapX - fixedWidth : this.state.swapX,
                    Y: isLastImage ? this.state.swapY : fixedHeight
                });
            }
        }
    };

    bili.prototype.getPreviousImage = function() {
        var fixed = this.state.direction == constants.DIRECTION_LEFT ? '_r' : '';
        var previousImage = this.images[
            this.name + '_' +
            this.state.previousImageType +
            '_'+this.state.previousImageIndex + fixed
        ];
        return previousImage;
    };

    bili.prototype.getCurrentImage = function() {
        var fixed = this.state.direction == constants.DIRECTION_LEFT ? '_r' : '';
        var image = this.images[
            this.name + '_' +
            this.state.imageType +
            '_' + this.state.imageIndex + fixed
        ];
        return image;
    };

    bili.prototype.render = function() {
        // clear
        this.clear();
        // render
        var image = this.getCurrentImage();
        this.layer.drawImage(image, this.state.X, this.state.Y);
    };

    bili.prototype.clear = function() {
        var image = this.getPreviousImage();
        this.layer.clearRect(
            this.state.previousX,
            this.state.previousY,
            image.width,
            image.height
        );
    };

    bili.prototype.isSkilling = function() {
        return this.state.skilling;
    };

    bili.prototype.handleImageType = function(type) {
        this.setStates({
            imageType: type,
            imageIndex: 0,
            skilling: true,
            speed: 0
        });
    };

    bili.prototype.handleDirection = function(type) {
        var speed = 0;
        var direction = this.state.direction;
        if (type == constants.ACTION_LEFT) {
            speed = -10;
            direction = constants.DIRECTION_LEFT;
        } else if (type == constants.ACTION_RIGHT) {
            speed = 10;
            direction = constants.DIRECTION_RIGHT;
        }
        this.setStates({
            speed: speed,
            direction: direction
        });
    };

    bili.prototype.getInfo = function() {
        return {
            direction: this.state.direction,
            x: this.state.X,
            y: this.state.Y,
            baseWidth: this.baseImage.width,
            type: this.state.imageType
        };
    };

    bili.prototype.prepareImages = function(images, name) {
        var data = {};
        var regExp = new RegExp('^' + name + '_');
        for (var key in images) {
            if (regExp.test(key)) {
                data[key] = images[key];
            }
        }
        return data;
    }

    bili.prototype.terminate = function() {
        this.layer.clearRect(0, 0, this.layer.canvas.width, this.layer.canvas.height);
        app.detachClient(this.id);
    };

    window.ClientBili = bili;
})(window, document);
