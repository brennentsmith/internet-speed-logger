/* eslint-env jquery, browser */

const container = document.getElementById('visualization');
// eslint-disable-next-line no-undef
const groups = new vis.DataSet();
let debounceGlobal = true;


const options = {
  start: new Date().getTime() - 24 * 60 * 60 * 1000,
  end: new Date().getTime() + 60 * 60 * 1000,
  height: '100%',
  legend: true,
  zoomMax: 31536000000,
  zoomMin: 3600000,
  maxMinorChars: 15,
  dataAxis: {
    showMinorLabels: false,
  },
};

groups.add({
  id: 0,
  content: 'Download - Mbps',
  options: {
    drawPoints: {
      style: 'circle', // square, circle
    },
    shaded: {
      orientation: 'bottom', // top, bottom
    },
  },
});

groups.add({
  id: 1,
  content: 'Upload - Mbps',
  options: {
    drawPoints: {
      style: 'circle', // square, circle
    },
    shaded: {
      orientation: 'bottom', // top, bottom
    },
  },
});

groups.add({
  id: 2,
  content: 'Ping - Milliseconds',
  options: {
    drawPoints: {
      style: 'circle', // square, circle
    },
    shaded: {
      orientation: 'bottom', // top, bottom
    },
  },
});

groups.add({
  id: 3,
  content: 'Jitter - Milliseconds',
  options: {
    drawPoints: {
      style: 'circle', // square, circle
    },
    shaded: {
      orientation: 'bottom', // top, bottom
    },
  },
});

function convertTime(val) {
  if (typeof val !== 'number') {
    const d = Date.parse(val);
    return d.toString();
  }
  return val;
}

function normalizeAvg(val) {
  return val === null ? '-' : val.toFixed(2);
}

function rangeChanged(event) {
  if (!debounceGlobal) { return; }

  const start = convertTime(event.start);
  const end = convertTime(event.end);
  const params = $.param({ end, start });
  $.getJSON(`/api/avg?${params}`, (data) => {
    let legendText = {
      down: '-',
      up: '-',
      ping: '-',
      jitter: '-',
    };
    if (data.length > 0) {
      legendText = {
        down: `Avg. ${normalizeAvg(data[0].avgd)}`,
        up: `Avg. ${normalizeAvg(data[0].avgu)}`,
        ping: `Avg. ${normalizeAvg(data[0].avgp)}`,
        jitter: `Avg. ${normalizeAvg(data[0].avgj)}`,
      };
    }
    $('.vis-legend-stats #avg-download').text(legendText.down);
    $('.vis-legend-stats #avg-upload').text(legendText.up);
    $('.vis-legend-stats #avg-ping').text(legendText.ping);
    $('.vis-legend-stats #avg-jitter').text(legendText.jitter);
  });
  debounceGlobal = false;
  setTimeout(() => {
    debounceGlobal = true;
  }, 300);
}

$.getJSON('/api/', (data) => {
  if (data.length === 0) {
    $('body').append('<div class="vis-legend-text vis-legend-stats">No Data Found in Database - The first test may be in progress.</div>');
    return;
  }
  // eslint-disable-next-line no-undef
  const dataset = new vis.DataSet(data);
  // eslint-disable-next-line no-undef
  const Graph2d = new vis.Graph2d(container, dataset, groups, options);
  $('.vis-legend').append('<div class="vis-legend-text vis-legend-stats"><span id="avg-download"></span><span id="avg-upload"></span><span id="avg-ping"></span><span id="avg-jitter"></span></div>');
  Graph2d.on('rangechanged', rangeChanged);
  rangeChanged(options);
  let loadTime = new Date().getTime();

  window.setInterval(() => {
    const earlyLoadTime = new Date().getTime();
    $.getJSON(`/api?sd=${loadTime}`, (output) => {
      if (output.length > 0) {
        // datavis will automatically deduplicate via ID
        loadTime = earlyLoadTime;
        dataset.update(output);
      }
    });
  }, 5000);
});
