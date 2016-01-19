(function () {

    var IframeWatcher = function () {
        var self = this;
        this.linkId       = '<%= iframeUid %>';
        this.scaffoldLite = '<%= scaffoldLite %>';
        this.initIstatsIfRequiredThen(function () {
            self.createIframe();
        });
        this.updateSizeWhenWindowResizes();
    };

    IframeWatcher.prototype = {

        updateSizeWhenWindowResizes: function () {
            var self = this;
            this.onEvent(window, 'resize', function () {
                self.setDimensions();
            });
        },

        onEvent: function (domElement, eventName, callback, useCapture) {
            if (useCapture === undefined) {
                useCapture = false;
            }

            if (domElement.addEventListener) {
                domElement.addEventListener(eventName, callback, useCapture);
            } else {
                domElement.attachEvent('on' + eventName, callback);
            }
        },

        data: {},

        updateFrequency: 32,

        createIframe: function () {

            var linkId        = this.linkId,
                link          = document.getElementById(linkId),
                href          = link.href,
                token         = link.parentNode.className,
                iframeWatcher = this,
                hostId        = this.getWindowLocationOrigin(),
                urlParams     = window.location.hash || '',
                hostUrl       = encodeURIComponent(window.location.href.replace(urlParams, '')),
                onBBC         = this.onBbcDomain();

            this.staticHeight = link.getAttribute('data-static-iframe-height');
            this.addLoadingSpinner(link, linkId);

            if (this.hostIsNewsApp(token)) {
                hostId = token;
            }

            this.elm = document.createElement('iframe');
            this.elm.className = 'responsive-iframe';
            this.elm.style.width = '100%';
            this.elm.scrolling = 'no';
            this.elm.setAttribute('allowfullscreen', '');
            this.elm.frameBorder = '0';

            this.decideHowToTalkToIframe(href);

            this.elm.src = href + '&hostid=' + hostId.split('//')[1] + '&hostUrl=' + hostUrl + '&iframeUID=' + linkId + '&onbbcdomain=' + onBBC + urlParams;

            link.parentNode.appendChild(this.elm);
            link.parentNode.removeChild(link);

            this.lastRecordedHeight = this.elm.height;

            this.handleIframeLoad(function startIframing() {
                iframeWatcher.getAnyInstructionsFromIframe();
                iframeWatcher.setDimensions();
            });

            // Uncomment this line if you require the "app hack"
            // https://github.com/BBCVisualJournalism/iframe-scaffold/wiki/Issues:-Scaffold-Issues
            // this.removeAppWebViewLinksFromHostPage();

            this.removeFallbackImageFromHostPage();
        },

        addLoadingSpinner: function (link, iframeUID) {
            var spinnerHolder = document.createElement('div');
            spinnerHolder.id  = iframeUID + '--bbc-news-visual-journalism-loading-spinner';
            spinnerHolder.className = 'bbc-news-visual-journalism-loading-spinner';
            link.parentNode.appendChild(spinnerHolder);
        },

        handleIframeLoad: function (startIframing) {
            // IMPORTANT: Had to make this an onload because the
            // polyfilling and jquery on one page causes issues
            this.onEvent(window, 'load', function () {
                startIframing();
            }, true);

            if (this.elm.onload) {
                this.elm.onload = startIframing;
            }
            // Bug in IE7 means onload doesn't fire when an iframe
            // loads, but the event will fire if you attach it correctly
            else if ('attachEvent' in this.elm) {
                this.elm.attachEvent('onload', startIframing);
            }
        },

        decideHowToTalkToIframe: function (href) {
            if (window.postMessage) { // if window.postMessage is supported, then support for JSON is assumed
                var uidForPostMessage = this.getPath(href);
                this.uidForPostMessage = this.getPath(href);
                this.setupPostMessage(uidForPostMessage);
            }
            else {
                this.data.height = this.staticHeight;
                this.elm.scrolling = 'yes';
            }
        },

        onBbcDomain: function () {
            return window.location.host.search('bbc.co') > -1;
        },

        setupPostMessage: function (uid) {
            var iframeWatcher = this;
            this.onEvent(window, 'message', function (e) {
                iframeWatcher.postMessageCallback(e.data);
            });
        },

        postMessageCallback: function (data) {
            if (this.postBackMessageForThisIframe(data)) {
                this.processCommunicationFromIframe(
                    this.getObjectNotationFromDataString(data)
                );
                this.processIStatsInstructions(this.data);
            }
        },

        postBackMessageForThisIframe: function (data) {
            return data && (data.split('::')[0] === this.uidForPostMessage);
        },

        getObjectNotationFromDataString: function (data) {
            return JSON.parse(data.split('::')[1]);
        },

        processCommunicationFromIframe: function (data) {
            this.data = data;
            this.setDimensions();
            this.getAnyInstructionsFromIframe();
        },

        hostIsNewsApp: function (token) {
            return (token.indexOf('bbc_news_app') > -1);
        },

        getIframeContentHeight: function () {
            if (this.data.height) {
                this.lastRecordedHeight = this.data.height;
            }
            return this.lastRecordedHeight;
        },

        setDimensions: function () {
            this.elm.width  = this.elm.parentNode.clientWidth;
            this.elm.height = this.getIframeContentHeight();
        },

        getAnyInstructionsFromIframe: function () {
            if (this.data.msg === 'removeLoadingSpinner') {
                this.removeLoadingSpinner();
            }
        },

        removeLoadingSpinner: function () {
            var iframeDivContainer = document.getElementById(this.linkId + '--bbc-news-visual-journalism-loading-spinner');
            if (iframeDivContainer) {
                iframeDivContainer.parentNode.removeChild(iframeDivContainer);
            }
        },

        getPath: function (url) {
            var urlMinusProtocol = url.replace('http://', '');
            return urlMinusProtocol.substring(urlMinusProtocol.indexOf('/')).split('?')[0];
        },

        getWindowLocationOrigin: function () {
            if (window.location.origin) {
                return window.location.origin;
            }
            else {
                return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
            }
        },

        removeAppWebViewLinksFromHostPage: function () {
            this.removeElementFromHostPage('a', 'href', window.location.pathname);
        },

        removeFallbackImageFromHostPage: function () {
            var imageName = this.getQueryStringValue('fallback');
            if (imageName) {
                this.removeElementFromHostPage('img', 'src', imageName);
            }
        },

        getQueryStringValue: function (name) {
            var queryString = '<!--#echo var="QUERY_STRING" -->',
                regex       = new RegExp('(?:[\\?&]|&amp;)' + name + '=([^&#]*)'),
                results     = regex.exec(queryString);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        },

        removeElementFromHostPage: function (tagName, attrName, attrValue) {
            var element;
            if (typeof document.querySelector !== 'undefined') {
                element = document.querySelector(tagName + '[' + attrName + '*="' + attrValue + '"]');
                if (element) {
                    element.parentNode.removeChild(element);
                }
            } else {
                // Support for older browsers
                element = document.getElementsByTagName(tagName);
                for (var idx = 0; idx < element.length; ++idx) {
                    if (element[idx][attrName].indexOf(attrValue) >= 0) {
                        element[idx].parentNode.removeChild(element[idx]);
                    }
                }
            }
        },

        // ###########################################
        // #### ALL ISTATS FUNCTIONALITY IS BELOW ####
        // ###########################################

        initIstatsIfRequiredThen: function (initIframe) {
            var self = this;
            if (this.scaffoldLite === 'false' && this.onBbcDomain() && ('require' in window)) {
                require(['istats-1'], function (istats) {
                    self.istats = istats;
                    initIframe();
                });
            } else {
                // mock iStats behaviour
                self.istats = {
                    log: function () {}
                };
                if ('console' in window && !('require' in window)) {
                    window.console.log('BBC News Visual Journalism warning: require not defined');
                }
                initIframe();
            }
        },

        istatsQueue: [],

        processIStatsInstructions: function (data) {
            if (this.istatsInTheData(data)) {
                this.addToIstatsQueue(data);
                this.emptyQueue(this.istatsQueue);
            }
        },

        istatsInTheData: function (data) {
            return data.istats && data.istats.actionType;
        },

        addToIstatsQueue: function (data) {
            this.istatsQueue.push({
                'actionType': data.istats.actionType,
                'actionName': data.istats.actionName,
                'viewLabel':  data.istats.viewLabel
            });
        },

        istatsQueueLocked: false,

        emptyQueue: function (queue) {
            var istatCall;
            if (this.istats && queue) {
                this.istatsQueueLocked = true;
                for (var i = 0, len = queue.length; i < len; i++) {
                    istatCall = queue.pop();
                    this.istats.log(istatCall.actionType, istatCall.actionName, {'view': istatCall.viewLabel});
                }
                this.istatsQueueLocked = false;
            }
        }
    };

    function cutsTheMustard() {

        var modernDevice =
                document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1') &&
                'querySelector' in document &&
                'localStorage' in window &&
                'addEventListener' in window,
            atLeastIE8   = !!(document.documentMode && (document.documentMode >= 8));

        return modernDevice || atLeastIE8;
    }

    if (cutsTheMustard()) {
        var iframe = new IframeWatcher();
    }

})();
