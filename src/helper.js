(function(window, document) {
    "use strict"

    function helper(
        elementUp,
        elementRight,
        elementDown,
        elementLeft,
        elementA,
        elementB,
        elementC,
        elementD,
        localClient,
        remoteClient,
        elementBloodFillRemote,
        elementBloodFillLocal,
        elementPopup
    ) {
        this.elementUp = elementUp;
        this.elementRight = elementRight;
        this.elementDown = elementDown;
        this.elementLeft = elementLeft;
        this.elementA = elementA;
        this.elementB = elementB;
        this.elementC = elementC;
        this.elementD = elementD;
        this.localClient = localClient;
        this.remoteClient = remoteClient;
        this.elementBloodFillRemote = elementBloodFillRemote;
        this.elementBloodFillLocal = elementBloodFillLocal;
        this.elementPopup = elementPopup;

        this.state = {
            remoteBlood: 100,
            localBlood: 100
        }

        this.elementUp.ontouchstart = this._handleImageType(constants.IMAGE_TYPE_UP);
        this.elementRight.ontouchstart = this._handleDirection(constants.ACTION_RIGHT);
        this.elementDown.ontouchstart = this._handleImageType(constants.IMAGE_TYPE_DOWN);
        this.elementLeft.ontouchstart = this._handleDirection(constants.ACTION_LEFT);

        this.elementUp.ontouchend
            = this.elementRight.ontouchend
            = this.elementDown.ontouchend
            = this.elementLeft.ontouchend
            = this._handleDirection(constants.ACTION_STAY);

        this.elementA.ontouchstart = this._handleImageType(constants.IMAGE_TYPE_A);
        this.elementB.ontouchstart = this._handleImageType(constants.IMAGE_TYPE_B);
        this.elementC.ontouchstart = this._handleImageType(constants.IMAGE_TYPE_C);
        this.elementD.ontouchstart = this._handleImageType(constants.IMAGE_TYPE_D);
    }

    /**
     * @private
     */
    helper.prototype._handleDirection = function(type) {
        return (function(event) {
            if (!this.localClient.isSkilling()) {
                this.localClient.handleDirection(type);
            }
        }).bind(this);
    };

    /**
     * @private
     */
    helper.prototype._handleImageType = function(type) {
        return (function(event) {
            if (!this.localClient.isSkilling()) {
                this.localClient.handleImageType(type);
                var isCollision = this.collisionTest(type);
                if (isCollision) {
                    var localName = this.localClient.name;
                    var remoteBloodOff = constants[localName]['BLOOD_' + type];
                    this.state.remoteBlood -= remoteBloodOff;
                    if (this.state.remoteBlood > 0) {
                        setTimeout((function() {
                            this.elementBloodFillRemote.style.width = this.state.remoteBlood + '%';
                        }).bind(this), 300);
                    } else {
                        app.stop();
                        this.elementBloodFillRemote.style.width = '0';
                        this.elementPopup.style.display = 'block';
                    }
                }
            }
        }).bind(this);
    };

    /**
     * @private
     */
    helper.prototype.collisionTest = function(type) {
        var localInfo = this.localClient.getInfo();
        var remoteInfo = this.remoteClient.getInfo();

        if (
            type == constants.IMAGE_TYPE_C && remoteInfo.type == constants.IMAGE_TYPE_UP ||
            type == constants.IMAGE_TYPE_D && remoteInfo.type == constants.IMAGE_TYPE_UP ||
            type == constants.IMAGE_TYPE_A && remoteInfo.type == constants.IMAGE_TYPE_DOWN
        ) {
            return false;
        }

        var fixSize = app.width * constants[this.localClient.name]['SCOPE_' + type];
        if (localInfo.direction == constants.DIRECTION_LEFT) {
            var leftX = localInfo.x - fixSize;
            if (
                leftX < remoteInfo.x + remoteInfo.baseWidth && 
                localInfo.x >= remoteInfo.x - remoteInfo.baseWidth / 2
            ) {
                return true;
            }
        }
        if (localInfo.direction == constants.DIRECTION_RIGHT) {
            var rightX = localInfo.x + localInfo.baseWidth + fixSize;
            if (
                rightX > remoteInfo.x && 
                localInfo.x + localInfo.baseWidth <= remoteInfo.x + remoteInfo.baseWidth / 2
            ) {
                return true;
            }
        }
        return false;
    };

    window.Helper = helper;

})(window, window.document);
