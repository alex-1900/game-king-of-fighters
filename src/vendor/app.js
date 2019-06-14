(function(window, document) {
    "use strict"

    /**
     * 应用程序主接口
     * @param {HTMLElement} element App 对应的 HTML 元素
     * @param {HTMLElement} width App 元素的宽度
     * @param {HTMLElement} height App 元素的高度
     */
    function app(element, width, height) {
        this.width = width;
        this.height = height;
        this.element = this._buildAppElements(element);

        this._process = this._process.bind(this);
    }

    app.prototype = {
        constructor: app,
        clients: {},
        state: {
            isRunning: false,
            frameId: 0,
            accumulator: 0
        }
    };

    /**
     * 应用程序开始运行
     */
    app.prototype.start = function() {
        if (!this.state.isRunning) {
            this._setState('isRunning', true);
            requestAnimationFrame(this._process);
        }
    };

    /**
     * 应用程序暂停
     */
    app.prototype.pause = function() {
        this._setState('isRunning', false);
    };

    /**
     * 应用程序停止，注销所有 clients
     */
    app.prototype.stop = function() {
        this.pause();
        for (var i in this.clients) {
            this.clients[i].terminate();
        }
        this.clients = {};
    };

    /**
     * 监听一个 client
     * @param {Client} client
     */
    app.prototype.attachClient = function(callback) {
        var nextClientId = this.state.accumulator;
        var client = callback(nextClientId);
        if (client instanceof AbstructClient) {
            this.clients[nextClientId] = client;
            this._setState('accumulator', nextClientId + 1);
            return client;
        }
        throw new Error('需要返回 AbstructClient 实例');
    };

    /**
     * 移除一个 client
     * @param {Number} clientId
     */
    app.prototype.detachClient = function(clientId) {
        delete this.clients[clientId];
    };

    /**
     * @private
     * 每一帧所做的操作
     * @param {HTMLElement} timestamp 当前的时间戳
     */
    app.prototype._process = function(timestamp) {
        if (this.state.isRunning) {
            for (var i in this.clients) {
                var client = this.clients[i];
                if (client instanceof AbstructClient) {
                    client.update(timestamp);
                    if (client.isSynchronized()) {
                        client.render();
                        client.sync();
                    }
                }
            }
            this.state.frameId = requestAnimationFrame(this._process);
        } else {
            // 必须在 _process 里终止，否则会串号
            cancelAnimationFrame(this.state.frameId);
        }
    };

    /**
     * @private
     * 重构 app 元素，使它适应当前环境
     * @param {HTMLElement} element App 元素
     */
    app.prototype._buildAppElements = function(element) {
        element.style.width = this.width + 'px';
        element.style.height = this.height + 'px';
        element.ontouchstart
            = element.ontouchend
            = element.ontouchmove
            = element.ontouchcancel
            = function(event) {event.preventDefault()};
        return element;
    };

    app.prototype._setState = function(key, value) {
        console.log('prevState', this.state);
        this.state[key] = value;
        console.log('currentState', this.state);
    };

    window.App = app;
})(window, window.document);
