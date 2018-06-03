var d3 = d3 || alert("d3 ist not loaded, thus you are doomed to fail...");


function plotFairShares (error, data) {

  var svg = d3.select("svg"),
  margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = window.innerWidth - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

  var x = d3.scaleTime().range([0, width]),
  y = d3.scaleLinear().range([height, 0]),
  z = d3.scaleOrdinal(d3.schemeCategory10);

  var stack = d3.stack();

  var area = d3.area()
  .x(function(d, i) { return x(d.data.date); })
  .y0(function(d) {  return y(d[0]/100) || 0; })
  .y1(function(d) {  return y(d[1]/100) || 0; });

  var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  if (error) throw error;
  data = normalizeData (data);

  var keys = Object.keys(data[0]);

  x.domain(d3.extent(data, function(d) { return d.date; }));
  z.domain(keys);
  stack.keys(keys.slice(1)) // get rid of the first date column

  console.log ("data: ", data );

  var layer = g.selectAll(".layer")
  .data(stack(data))
  .enter().append("g")
  .attr("class", "layer");

  layer.append("path")
  .attr("class", "area")
  .style("fill", function(d) { return z(d.key); })
  .attr("d", area);

  layer.filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
  .append("text")
  .attr("class", function(d) {console.log (">>>", d.key); return d.key})
  .attr("x", width - 6)
  .attr("y", function(d) { return y((d[d.length - 1][0] + d[d.length - 1][1]) / 200); })
  .attr("dy", ".35em")
  .attr("fill", "white")
  .style("font", "10px sans-serif")
  .style("text-anchor", "end")
  .text(function(d) {
    return d.key;
  });

  // handle mouse and touch events
  var chart = d3.selectAll(".chart");
  chart.on("mousemove", function () { plotRedCrosshair(x, y, width, height, margin, chart)} );
  chart.on("touchstart", function () { plotRedCrosshair(x, y, width, height, margin, chart)} );
  chart.on("touchmove", function () { plotRedCrosshair(x, y, width, height, margin, chart)} );

  g.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

  g.append("g")
  .attr("class", "axis axis--y")
  .call(d3.axisLeft(y).ticks(10, "%"));
}


// take care for years, where not all the stakeholders in the data appear,
// i.e. Ralfs leaving or Katjas later entry...
function normalizeData (data) {
  newData = [];
  keys = [];
  for (i in data) {
    var row = data[i];
    Object.keys(row).map (function (key) {
      if (keys.indexOf (key) == -1) {
        keys.push(key);
      }
    })
  }
  // now I have all possible keys
  for (i in data) {
    newData[i] = {};
    for (key in keys) {
      newData[i][keys[key]] = data [i][keys[key]] || 0;
    }
  }
  return newData;
}


function plotRedCrosshair(x, y, width, height, margin, chart) {
  //
  // draw a red crosshair at the mouse position
  //
  var svg = d3.select("svg");
  var mx = d3.mouse(d3.event.currentTarget)[0];
  var my = d3.mouse(d3.event.currentTarget)[1];
  chart.selectAll(".redLine").remove();
  chart.append("path").attr("class", "redLine").attr("stroke", "white")
  .attr("d", "M " + (mx) + "," + (margin.top) + ",L " + (mx) + "," + (my ) + " Z");
  chart.append("path").attr("class", "redLine").attr("stroke", "white")
  .attr("d", "M " + (mx) + "," + (height + margin.top) + ",L " + (mx) + "," + (my ) + " Z");
  chart
  .append("text")
  .attr("class", "redLine")
  .text(x.invert(mx - margin.left).getFullYear() + ":" + x.invert(mx - margin.left).getMonth())
  .attr("x", mx - 2)
  .attr("y", my - 15)
  .attr("dy", ".75em")
  .attr("fill", "white")
  .attr("text-anchor", "end")
  .style("font", "12px sans-serif");
  chart
  .append("text")
  .attr("class", "redLine")
  .text(Math.round(100 * y.invert(my - margin.top))  + "%")
  .attr("x", mx - 2)
  .attr("y", my - 5)
  .attr("dy", ".75em")
  .attr("fill", "white")
  .attr("text-anchor", "end")
  .style("font", "12px sans-serif");
}
