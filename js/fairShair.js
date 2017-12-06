// 2017-10-28ff
// Johannes Mainusch


var d3 = d3 || alert("d3 ist not loaded, thus you are doomed to fail...");

var global = {
    develop: {
        url: "data/szenario01.json"
    },
    test: {
        url: "data/szenario01.json"
    },
    production: {
        url: "https://krukas.dynamicns.de/kommitment-fairshair/getData"
    },
    targetServer: "empty"
};

var DEBUG = true;
var log = {
    debug: function (data) { if (DEBUG) console.log(data) }
};
var filters = new Array();

// ****************
function trigger_calculateShairs(theForm) {
    console.clear();
    log.debug("in trigger_calculateShairs: ", theForm);
    loadData(function (data) { alert("callback got called") },theForm);
}

// ****************
function loadData(callback, theForm) {
    var domain = getQueryVariable("switch");
    log.debug("in loadData... " + domain);
    // remove all tables in element with id #page-wrap
    d3.select('#page-wrap').selectAll("table").remove();
    if (domain == "develop") {
        log.debug("in loadData: Development Mode, Data comes from file...");
        renderData("", calculateShairs(data, theForm));
    }
    else {
        global.targetServer = eval("global." + domain)

        // construct query url
        var url = global.targetServer.url
            + "?thisdoes=nothing";
        log.debug("in loadData, url = '" + url + "'");

        d3.json(url)
            .header('X-Parse-Session-Token', global.targetServer.token)
            .response(callback)
            .get(renderData);
    }
}

// ****************
function calculateShairs(input, theForm) {
    var output = [];
    /*
      [  { 
        Abrechenzeitpunkt : 2016-04-13,
        Contribution : "1500€",
        Beteiligte : [
            { Name : "Anke Nehrenberg", Arbeit : "100%" },
            { Name : "Ralf Wirdemann", Arbeit : "100%" },
            { Name : "Johannes Mainusch", Arbeit : "100%" }]
        }, ...]
    */
    var k_value = 0.0;
    var vestingDuration = theForm.vestingDuration.value;
    var companyValueFactor = theForm.companyValueFactor.value;
    var foundersShares = theForm.foundersShares.value/100;
    var kShare = [];
    
    var kContributionSum = 0;
    for (var entry in input) {
        console.log("in calculateShairs, entry", entry, input[entry]);
        k_value = parseFloat(input[entry].Contribution) * companyValueFactor;
        kContributionSum += parseFloat(input[entry].Contribution);
        output[entry] = {
            "Abrechenzeitpunkt": input[entry].Abrechenzeitpunkt,
            "k-Contribution\nAusschüttung": input[entry].Contribution,
            "k-value": k_value,
            "sum fairShares" : kContributionSum
        }
        // find the SumVestingArbeit (sum of Arbeit)
        var SumVestingArbeit = 0.0;
        var sharesInDistribution = 1;
        // loop through kommanditisten to find the "SumVesting*Arbeit"  of this year
        for (i in input[entry].kommanditisten) {
            var kommanditist = input[entry].kommanditisten[i].Name;
            var vesting = 0.0;
            kShare[kommanditist] = kShare[kommanditist] || {};
            kShare[kommanditist].versting = kShare[kommanditist].versting|| 0;
            kShare[kommanditist].foundersShares = kShare[kommanditist].foundersShares|| 0;
            // founders 100% vesting and founders shares
            kShare[kommanditist].foundersShares += ( entry < 1) ? foundersShares : 0;            
            kShare[kommanditist].versting += ( entry < 1) ? 1 : 0;            
            kShare[kommanditist].versting += ( kShare[kommanditist].versting < 1) ? 1/vestingDuration : 0;
            // vesting per kommanditist is now determined, so now factor it into SumVesting*Arbeit
            SumVestingArbeit += kShare[kommanditist].versting * parseFloat(input[entry].kommanditisten[i].Arbeit) / 100;
            // sharesInDistribution, the shares to be ditributed...
            sharesInDistribution -= kShare[kommanditist].foundersShares;
        }
        output[entry]["SumVestingArbeit"] = Math.round (100*SumVestingArbeit)/100;
        // loop through kommanditisten to calculate shares
        for (i in input[entry].kommanditisten) {
            var kommanditist = input[entry].kommanditisten[i].Name;
            kShare[kommanditist].owner = kommanditist;
            kShare[kommanditist].contribution = input[entry].Contribution 
                * parseFloat(input[entry].kommanditisten[i].Arbeit)/100 / output[entry]["SumVestingArbeit"]
                * kShare[kommanditist].versting;
            kShare[kommanditist].contributionSum = kShare[kommanditist].contributionSum || 0;
            kShare[kommanditist].contributionSum += kShare[kommanditist].contribution;

            anteil = ""
            anteil += "foundersShares: " + round100(kShare[kommanditist].foundersShares*100)+"%"  ;
            anteil += "\nVesting: " + Math.round (100*kShare[kommanditist].versting)/100;
            anteil += " - Arbeit: " + input[entry].kommanditisten[i].Arbeit;
            anteil += "\nContribution: " +  Math.round (kShare[kommanditist].contribution)+"€";
            anteil += "\nfairShares: " +  Math.round (kShare[kommanditist].contributionSum)
                    + " / " + kContributionSum;
            // here it comes
            kShare[kommanditist].anteil = 
                kShare[kommanditist].foundersShares +
                sharesInDistribution * kShare[kommanditist].contributionSum / kContributionSum;
            anteil += "\nAnteil: " + Math.round (10000*kShare[kommanditist].anteil ) / 100 +"%";
            anteil += "  = " + Math.round (k_value*kShare[kommanditist].contributionSum / kContributionSum ) +"€";
            anteil += "\nAusschüttung: " + Math.round (100*kShare[kommanditist].anteil * input[entry].Contribution)/100 +"€";
            output[entry][kommanditist] = anteil;
            // if there is a yet new person, add it to output[0]
            output[0][kommanditist] = output[0][kommanditist] || "";
        }
        // this check should always sum up to whats there to be shared
        var checkSumAnteilePercent = 0;
        var checkSumAnteile = 0;
        for (kommanditist in kShare) {
            checkSumAnteilePercent += kShare[kommanditist].anteil;
            checkSumAnteile += Math.round (100*kShare[kommanditist].anteil * input[entry].Contribution)/100;
        }
        output[entry]["k-value"] += "\nCheck: "+Math.round (100000* checkSumAnteilePercent)/1000 + "%";
        output[entry]["k-value"] += "\nCheck: "+Math.round (checkSumAnteile)+ "€";
        output[entry]["k-value"] += "\nsharesInDistribution: "+Math.round (10000*sharesInDistribution)/100+ "%";
    }
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
    var headers = table.append('thead').append('tr')
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
        });

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