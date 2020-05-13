// 2017-10-28ff
// Johannes Mainusch


var d3 = d3 || alert("d3 ist not loaded, thus you are doomed to fail...");

var global = {
    develop: {
        url: "data/szenario01.json"
    },
    test: {
        url: "data/szenario03.json"
    },
    production: {
        url: "https://krukas.dynamicns.de/kommitment-FairShare/getData"
    },
    targetServer: "empty"
};

var DEBUG = false;
var log = {
    debug: function (data) { if (DEBUG) console.log(data) }
};
var filters = new Array();

// ****************
function update(theForm) {
    console.clear();
    log.debug("in update: ", theForm);
    loadData(function (data) { alert("callback got called") },theForm);
}

// ****************
function loadData(callback, theForm) {
    var dataFile = theForm.dataFile.value || "szenario04.js";
    var domain = getQueryVariable("switch") || "develop";
    log.debug("in loadData... " + domain);
    // remove all tables in element with id #page-wrap
    d3.select('#page-wrap').selectAll("table").remove();
    if (domain == "github" || domain == "develop") {
        log.debug("in loadData: Development Mode, Data comes from file...");
        // read dataFile
        var script = document.createElement('script');
        script.onload = function () {
            log.debug ("new script loaded...");
            renderData("", calculateShares(data, theForm));
        };
        script.src = "./data/"+dataFile+ "?thisdoes=cachebusting"+Math.random();;
        document.head.appendChild(script)
    }
    else {
        global.targetServer = eval("global." + domain)

        // construct query url
        var url = global.targetServer.url
            + "?thisdoes=cachebusting"+Math.random();
        log.debug("in loadData, url = '" + url + "'");

        d3.json(url)
            .header('X-Parse-Session-Token', global.targetServer.token)
            .response(callback)
            .get(renderData);
    }
}

// ****************
function calculateShares(input, theForm) {
    /* input is of this format...
      [  {
        Abrechenzeitpunkt : 2016-04-13,
        Beteiligte : [
            { Name : "Anke Nehrenberg", Arbeit : "100%" },
            { Name : "Ralf Wirdemann", Arbeit : "100%", returning: "0%" },
            { Name : "Johannes Mainusch", Arbeit : "100%" }]
        }, ...]
    */
    var output = []; /* output[] is the array for rendering the output table */
    var outputplot = []; /* output[] is the array for rendering the output plot */
    var k_value = 0.0;
    var foundersSharesPercent = theForm.foundersShares.value/100;
    var kShare = [];

    var totalSumFairShares = 0;
    for (var period in input) {

        // find the SumArbeit (sum of Arbeit)
        var SumArbeit = 0.0;
        var sharesInDistribution = 1;

        // loop through kommanditisten to find the "SumArbeit"  of this year
        for (i in input[period].kommanditisten) {
            var kommanditist = input[period].kommanditisten[i].Name;
            kShare[kommanditist] = kShare[kommanditist] || {};
            kShare[kommanditist].foundersSharesPercent = kShare[kommanditist].foundersSharesPercent || 0;
            if (period < 1) {
              // this is the first round, i.e. all kommanditisten in this period are founders...
              // founders get founders shares, if period<1 then these are founders...
              kShare[kommanditist].foundersSharesPercent = foundersSharesPercent;
            }
            // now calculate Arbeit
            SumArbeit += parseFloat(input[period].kommanditisten[i].Arbeit) / 100;
            // sharesInDistribution, the shares to be ditributed...
            sharesInDistribution -= kShare[kommanditist].foundersSharesPercent;
        }


        totalSumFairShares += SumArbeit
        outputplot[period] = {
            "date":  Date.parse(input[period].Abrechenzeitpunkt)
        }
        output[period] = {
            "period" : pad(period,4),
            "date":  input[period].Abrechenzeitpunkt,
            "total\nsum\nfairShares" : totalSumFairShares
        }
        output[period]["checks"] = ""
        output[period]["Sum\nArbeit"] = Math.round (100*SumArbeit)/100;
        //
        var anteil = new Array;
        // handle returned fairShares
        for (i in input[period].kommanditisten) {
          var kommanditist = input[period].kommanditisten[i].Name;
          anteil[kommanditist] = "";
         // handle returnedFairShares
          if (input[period].kommanditisten[i].returnedFairShares) {
            var returnedFairShares = parseFloat(input[period].kommanditisten[i].returnedFairShares)/100;
            var reduceBy = 1.0 - returnedFairShares;
            var sunkenShares = kShare[kommanditist].sumOfFairShares * returnedFairShares;
            anteil[kommanditist] += "<span class='returnedFairShares'>returnedFairShares: "
                +input[period].kommanditisten[i].returnedFairShares+"<br>"
                +"= "+Math.round(kShare[kommanditist].sumOfFairShares)+ " incl. "
                +kShare[kommanditist].foundersSharesPercent+ "% FS</span><br>";
            // return founderShares to sharesInDistribution...
            sharesInDistribution += kShare[kommanditist].foundersSharesPercent;
            // reset shares of kommanditist
            kShare[kommanditist].sumOfFairShares *= reduceBy;
            kShare[kommanditist].foundersSharesPercent  *= reduceBy;
            // now remove the returned shareds from the
            totalSumFairShares -= sunkenShares;
            output[period]["total\nsum\nfairShares"] = Math.round(100*totalSumFairShares)/100;
          }
        }
        //
        // loop through kommanditisten to calculate shares
        for (i in input[period].kommanditisten) {
            var kommanditist = input[period].kommanditisten[i].Name;
            kShare[kommanditist].sumOfFairShares = kShare[kommanditist].sumOfFairShares || 0;

            // use Arbeit  as share generator
            kShare[kommanditist].fairShares = 1.0
                * parseFloat(input[period].kommanditisten[i].Arbeit)/100;

            kShare[kommanditist].sumOfFairShares += kShare[kommanditist].fairShares;
            //
            anteil[kommanditist] += "foundersSharesPercent: " + round100(kShare[kommanditist].foundersSharesPercent*100)+"%"  ;
            anteil[kommanditist] += " - Arbeit: " + input[period].kommanditisten[i].Arbeit;
            anteil[kommanditist] += "\nfairShares: " +  Math.round (100*kShare[kommanditist].fairShares)/100;
            anteil[kommanditist] += "\nsumOfFairShares: " +  Math.round (100*kShare[kommanditist].sumOfFairShares)/100;
            kShare[kommanditist].anteil =
                kShare[kommanditist].foundersSharesPercent +
                sharesInDistribution * kShare[kommanditist].sumOfFairShares / totalSumFairShares;
            anteil[kommanditist] += "\nAnteil: "
                + Math.round (kShare[kommanditist].sumOfFairShares)
                + " / " + Math.round (totalSumFairShares)  + " <br> = "
                + Math.round (10000*kShare[kommanditist].anteil ) / 100 +"%";
            outputplot[period][kommanditist] = Math.round (10000*kShare[kommanditist].anteil ) / 100;
            output[period][kommanditist] = anteil[kommanditist];
            // if there is a yet new person, add it to output[0]
            output[0][kommanditist] = output[0][kommanditist] || "";
        }
        // this check should always sum up to whats there to be shared
        var checkSumAnteilePercent = 0;
        var checkSumAnteile = 0;
        for (kommanditist in kShare) {
            checkSumAnteilePercent += kShare[kommanditist].anteil;
            checkSumAnteile += Math.round (100*kShare[kommanditist].anteil)/100;
        }
        output[period]["checks"] += "\nCheck: "+Math.round (100000* checkSumAnteilePercent)/1000 + "%";
        output[period]["checks"] += "\nCheck: "+Math.round (checkSumAnteile);
        output[period]["checks"] += "\nsharesInDistribution: "+Math.round (10000*sharesInDistribution)/100+ "%";
    }
    plotFairShares("", outputplot);
    return output;
}


// ****************
// very much inspired by: http://bl.ocks.org/AMDS/4a61497182b8fcb05906
function renderData(error, data) {
    log.debug("in renderData... ");
    log.debug(data);

    if (error) throw error;
    d3.select('#page-wrap').selectAll("table").remove(); // remove any table in #page-wrap

    var sortAscending = true;
    var titles = d3.keys(data[0]);
    var table = d3.select('#page-wrap').append('table');
    var head = table.append('thead')
    var headers = head.append('tr')
        .selectAll('th')
        .data(titles).enter()
        .append('th')
        .text(function (d) { log.debug(d); return d; })
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
        }
    );

    table.attr("class", "table table-hover")
    head.attr("class", "thead-dark")

    // render the table
    var tnow = new Date();
    var rows = table.append('tbody').selectAll('tr')
        .data(filterData(data, filters))
        .enter()
        .append('tr')
        .attr("class", function (d) {
            var ageInSeconds = (tnow.getTime() - new Date(d.time).getTime()) / 1000;
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
        .html(function (d) { return d.value })
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

    // initial sort is ascending by time, i.e. most adctual last
    rows.sort(function (a, b) { return sortStrings(a, b, titles[0], true) });
}

// ****************
function getQueryVariable(key) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        log.debug("in getQueryVariable(" + key + "): " + pair[0] + " : " + pair[1])
        if (decodeURIComponent(pair[0]) == key) {
            log.debug("in getQueryVariable, returning: " + pair[1])
            return pair[1];
        }
    }
    //    console.log('Query variable %s not found', variable);
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
function sortStrings(a, b, d, sortAscending) {
    if (sortAscending) {
        return (b[d] < a[d]) ? 1 : (b[d] > a[d]) ? -1 : 0;
    }
    else {
        return (b[d] > a[d]) ? 1 : (b[d] < a[d]) ? -1 : 0;
    }
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
function round100 (value) {
    return Math.round (100.0*value)/100;
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}
