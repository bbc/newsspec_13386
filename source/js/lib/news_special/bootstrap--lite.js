define(['lib/news_special/iframemanager__frame--lite'], function (iframemanager__frame) {

    iframemanager__frame.init();

    return {
        setStaticIframeHeight: function (newStaticHeight) {
            iframemanager__frame.setStaticHeight(newStaticHeight);
        },
        hostPageSetup: function (callback) {
            iframemanager__frame.setHostPageInitialization(callback);
        },
        scaffoldLite: true
    };
});