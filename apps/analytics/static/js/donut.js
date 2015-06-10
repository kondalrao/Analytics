  var duration   = 500;
  var transition = 200;
    
function drawDonutChart(element, percent, width, height, text_y) {
  width = typeof width !== 'undefined' ? width : 290;
  height = typeof height !== 'undefined' ? height : 290;
  text_y = typeof text_y !== 'undefined' ? text_y : "-.10em";

  var dataset = {
        lower: calcPercent(0),
        upper: calcPercent(percent)
      },
      radius = Math.min(width, height) / 2,
      pie = d3.layout.pie().sort(null),
      format = d3.format(".0%");

  var arc = d3.svg.arc()
        .innerRadius(radius - 40)
        .outerRadius(radius);

  var svg = d3.select(element).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var path = svg.selectAll("path")
        .data(pie(dataset.lower))
        .enter().append("path")
        .attr("class", function(d, i) { return "color" + i })
        .attr("d", arc)
        .each(function(d) { this._current = d; }); // store the initial values

  var text = svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", text_y)
        .attr("font-family", '"RamaGothicM-Heavy","Impact","Haettenschweiler","Franklin Gothic Bold","Charcoal","Helvetica Inserat","Bitstream Vera Sans Bold","Arial Black","sans-serif"')
        .attr("font-size", "7rem")
        .attr("font-weight", 400)
        .attr("line-height", "16rem")
        .attr("fill", "#1072b8");

  if (typeof(percent) === "string") {
    text.text(percent);
  }
  else {
    var progress = 0;
    var timeout = setTimeout(function () {
      clearTimeout(timeout);
      path = path.data(pie(dataset.upper)); // update the data
      path.transition().duration(duration).attrTween("d", function (a) {
        // Store the displayed angles in _current.
        // Then, interpolate from _current to the new angles.
        // During the transition, _current is updated in-place by d3.interpolate.
        var i  = d3.interpolate(this._current, a);
        var i2 = d3.interpolate(progress, percent)
        this._current = i(0);
        return function(t) {
          text.text( format(i2(t) / 100) );
          return arc(i(t));
        };
      }); // redraw the arcs
    }, 200);
  }
};

function calcPercent(percent) {
  return [percent, 100-percent];
};