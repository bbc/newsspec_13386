define(['bootstrap', 'multiLineChart', 'data'], function (news, MultiLineChart, Data) {

    news.pubsub.emit('pageLoaded');

    new MultiLineChart(
        '.newsspec_13386__temperature-chart__svg',
        Data['temperature'], 'http://news.bbcimg.co.uk/news/special/2015/newsspec_13386/content/english/img/temperature_fallback.gif'
    );
    news.pubsub.emit('istats', ['app-initiated', 'newsspec-nonuser']);
});
