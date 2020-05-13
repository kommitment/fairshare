//
//
//	Johannes Mainusch
//	20160312 ff
// 
//

var global = {
  test: {
    token: "test",
    url: "test/data.json"
  },
  dev: {
    token: "l.sqaTVDu6JloMdw5bXl",
    url: "https://dev.picue.com/2/logs"
  },
  production: {
    token: "l.02m8p2OY47r9ygKc02",
    url: "https://api.picue.com/2/logs"
  },
  logContinuously: false,
  interval: "",
  targetServer: this.production
}
var data = new Array();
var filters = new Array();
var DEBUG = false;


// ****************
function loadData() {
  var tail = getQueryVariable("tail");
  global.targetServer = eval("global." + getQueryVariable("switch"))
  after_time = getAfterTime();

  // construct query url
  var url = global.targetServer.url
    + "?foo=bar" + (tail ? "&tail=" + tail : "")
    + (after_time ? "&after_time=" + after_time : "")
    + "";
  console.log("xhr: " + url);
  if (!after_time) d3.select('#page-wrap').selectAll("table").remove(); // remove any table in #page-wrap

  d3.json(url)
    .header('X-Parse-Session-Token', global.targetServer.token)
    .response(parseXhrResponse)
    .get(renderData);
}


// ****************
function parseXhrResponse(xhr) {
  var logs = JSON.parse(xhr.responseText).logs;
  console.log("in parseXhrResponse, logs.length = " + logs.length);
  if (!logs.length) return data;

  logs.map(
    function (d, i) {
      var date = new Date(d._meta.time);
      // // correct for CEST timezone, or wherever you are
      //date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
      var datestring = date.toISOString().substring(0, 23);
      data.push(
        {
          "time": datestring,
          "clientTime": d.timestamp,
          "client": d._meta.client,
          "key": d._meta.key,
          "duration": ("" + d.duration).replace(/ms/g, '').replace(/-/g, '0'),
          "host": d.host,
          "network": d.network,
          "operation": d.operation,
          "size": d.size,
          "status": d.status,
          "uploadIdentifer": d.uploadIdentifer,
          "user": d.user,
          "reason": d.failureReason
        }
      );
    });
  return data;
}


// ****************
// very much inspired by: http://bl.ocks.org/AMDS/4a61497182b8fcb05906
function renderData(error, data) {
  if (error) throw error;
  d3.select('#page-wrap').selectAll("table").remove(); // remove any table in #page-wrap

  var sortAscending = true;
  var titles = d3.keys(data[0]);
  var table = d3.select('#page-wrap').append('table');
  var headers = table.append('thead').append('tr')
    .selectAll('th')
    .data(titles).enter()
    .append('th')
    .text(function (d) { return d; })
    .on('click', function (d) {
      headers.attr('class', 'header');
      if (d == "duration") {
        rows.sort(function (a, b) { return sortNumbers(a, b, d, sortAscending) });
      }
      else {
        rows.sort(function (a, b) { return sortStrings(a, b, d, sortAscending) });
      }
      if (sortAscending) {
        sortAscending = false;
        this.className = 'aes';
      } else {
        sortAscending = true;
        this.className = 'des';
      }
    });



  // create the histogram
  var hist = Histogram1D(0, 50000, 100);

  // render the table
  var tnow = new Date();
  var rows = table.append('tbody').selectAll('tr')
    .data(filterData(data, filters))
    .enter()
    .append('tr')
    .attr("class", function (d) {
      var ageInSeconds = (tnow.getTime() - new Date(d.time).getTime()) / 1000;
      hist.fill(d.duration);
      if (ageInSeconds < 42) {
        return "new";
      }
      else {
        return null;
      }
    });


  rows.selectAll('td')
    .data(function (d, i) {
      return titles.map(function (k) {
        return { 'value': d[k], '  name': k };
      });
    })
    .enter()
    .append('td')
    .attr('data-th', function (d) { return d.name; })
    .text(function (d) { return d.value })
    .on('mouseover', function (d) {
      this.className = 'filter';
    })
    .on('mouseout', function (d) {
      this.className = '';
    })
    .on('click', function (d) {
      var title = titles[this.cellIndex];
      console.log("-->" + d.value + " " + title);
      filters.push({ "title": title, "value": d.value });
      renderFilters(error, data, filters);
      renderData(error, data, filters);
      this.className = '';
    })
    ;
  hist.plot();

  // initial sort is descending by time, i.e. most adctual first
  rows.sort(function (a, b) { return sortStrings(a, b, titles[0], false) });
}



// ****************
function renderFilters(error, data, filters) {
  d3.select('#filterDiv').selectAll("span").remove(); // remove any table in #page-wrap
  var filterdiv = d3.select('#filterDiv');
  filterdiv.selectAll('div').data(filters).enter()
    .append('span')
    .classed("filter", true)
    .text(function (d) { return d.title + "=" + d.value; })
    .on('click', function (d, i) {
      filters.splice(i, 1);
      this.remove();
      renderData(error, data, filters);
    });
}


// ****************
function sortNumbers(a, b, d, sortAscending) {
  if (sortAscending) {
    return (1.0 * b[d] < 1.0 * a[d]) ? 1 : (1.0 * b[d] > 1.0 * a[d]) ? -1 : 0;
  }
  else {
    return (1.0 * b[d] > 1.0 * a[d]) ? 1 : (1.0 * b[d] < 1.0 * a[d]) ? -1 : 0;
  }
}

// ****************
function sortStrings(a, b, d, sortAscending) {
  if (sortAscending) {
    return (b[d] < a[d]) ? 1 : (b[d] > a[d]) ? -1 : 0;
  }
  else {
    return (b[d] > a[d]) ? 1 : (b[d] < a[d]) ? -1 : 0;
  }
}

// ****************
function filterData(data, filters) {
  return data.filter(function (row) {
    retval = true;
    filters.forEach(function (d, i) {
      if (row[d.title] != d.value) retval = false;
    });
    return retval;
  });
}

// ****************
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  //    console.log('Query variable %s not found', variable);
}

// ****************
function tailLog() {
  // console.log ("in tailLog: global.logContinuously="+global.logContinuously);
  global.logContinuously = !global.logContinuously;
  document.getElementById("trackDataLink").classList.toggle('active');
  if (global.logContinuously) {
    global.interval = setInterval(function () {
      document.getElementById("trackDataLink").classList.toggle('active');
      loadData();
    }, 1000);
  } else {
    document.getElementById("trackDataLink").classList.remove('active');
    window.clearInterval(global.interval);
  }
}

// ****************
function getAfterTime() {
  // if there is already data, after_time is the last entry pus one millisecond
  // if the request contains a time limit in query variable "hours", another date will be created
  // return the youngest date or null
  var after_time = data.length ? data[data.length - 1].time : null;
  if (data.length) {
    var date = new Date(after_time);
    // add one millisecond to selector
    date.setTime(date.getTime() + 1);
    after_time = date.toISOString();
  }
  var hours = getQueryVariable("hours");
  if (hours) {
    console.log("found query variable hours..." + hours);
    var hoursAgo = new Date(((new Date) - hours * 60 * 60 * 1000)).toISOString();
  }
  if (DEBUG) console.log("after_time = " + after_time + "   hoursAgo = " + hoursAgo + "  " + (after_time < hoursAgo));
  if (!after_time) {
    return hoursAgo;
  }
  else if (!hoursAgo) {
    return after_time
  }
  else {
    return after_time < hoursAgo ? hoursAgo : after_time;
  }
}