var container = document.getElementById('visualization');
var groups = new vis.DataSet();

groups.add({
    id: 0,
    content: "Download - Mbps",
    options: {
        drawPoints: {
            style: 'circle' // square, circle
        },
        shaded: {
            orientation: 'bottom' // top, bottom
        }
    }
});

groups.add({
    id: 1,
    content: "Upload - Mbps",
    options: {
        drawPoints: {
            style: 'circle' // square, circle
        },
        shaded: {
            orientation: 'bottom' // top, bottom
        }
    }
});

groups.add({
    id: 2,
    content: "Ping - Milliseconds",
    options: {
        drawPoints: {
            style: 'circle' // square, circle
        },
        shaded: {
            orientation: 'bottom' // top, bottom
        }
    }
});

groups.add({
    id: 3,
    content: "Avg Download",
    options: {
        drawPoints: {
            style: 'square' // square, circle
        },
        shaded: {
            orientation: 'bottom' // top, bottom
        }
    }
});

var options = {
    start: new Date().getTime() - 24 * 60 * 60 * 1000,
    end: new Date().getTime() + 60 * 60 * 1000,
    height: '100%',
    legend: true,
    zoomMax: 31536000000,
    zoomMin: 3600000,
    maxMinorChars: 15,
    dataAxis: {
        showMinorLabels: false
    }
};
$.getJSON('/api/', function(data) {
    var dataset = new vis.DataSet(data);
    var Graph2d = new vis.Graph2d(container, dataset, groups, options);
    $(".vis-legend").append('<div class="vis-legend-text vis-legend-stats"><span id="avg-download"></span><span id="avg-upload"></span><span id="avg-ping"></span></div>');
    Graph2d.on('rangechanged', rangeChanged);
    canCall = true
    rangeChanged(options);
    var loadTime = new Date().getTime();

    window.setInterval(function() {
        earlyLoadTime = new Date().getTime();
        $.getJSON('/api?sd=' + loadTime, function(data) {
          if (data.length > 0) {
            // datavis will automatically deduplicate via ID
            loadTime = earlyLoadTime;
            dataset.update(data);
          }
        });
    }, 5000);
});

function rangeChanged(event) {
    if (!canCall)
        return;

    start = convertTime(event.start)
    end = convertTime(event.end)
    $.getJSON('/api/avg?ed=' + end + '&sd=' + start, function(data) {
        $('.vis-legend-stats #avg-download').text("Avg. " + data[0].avgd.toFixed(2));
        $('.vis-legend-stats #avg-upload').text("Avg. " + data[0].avgu.toFixed(2));
        $('.vis-legend-stats #avg-ping').text("Avg. " + data[0].avgp.toFixed(2));
    });
    canCall = false;
    setTimeout(function() {
        canCall = true;
    }, 300);
}

function convertTime(val) {
    if (typeof val !== 'number') {
        var d = Date.parse(val)
        return d.toString()
    } else {
        return val;
    }
}