/// <reference path="./d3.d.ts" />
/// <reference path="./dc.d.ts" />
/// <reference path="./crossfilter.d.ts" />

/* jshint globalstrict: true */
/* global io, location, d3, drawDonutChart, document, $ */

'use strict';

var namespace = '';
// var namespace = '/test'; // change to an empty string to use the global namespace
// the socket.io documentation recommends sending an explicit package upon connection
// this is specially important when using the global namespace

var socket = io.connect('http://' + document.domain + ':' + location.port + namespace);

// Data buffers
var data = [
	{ipv4: "10.10.10.1", port: 'eth1/1/1', vlan: 10, client_cnt: 10, connections: 10, upload_bytes: 23123, download_bytes: 3431234223, connection_rate: 25, upload_bandwidth: 21, download_bandwidth: 132},
	{ipv4: "10.10.10.2", port: 'eth1/1/1', vlan: 10, client_cnt: 3, connections: 23, upload_bytes: 3453, download_bytes: 342341332, connection_rate: 5, upload_bandwidth: 34, download_bandwidth: 831},
	{ipv4: "10.10.10.3", port: 'eth1/1/1', vlan: 10, client_cnt: 5, connections: 21, upload_bytes: 34234, download_bytes: 9349843342, connection_rate: 8, upload_bandwidth: 24, download_bandwidth: 368},
    {ipv4: "10.10.10.4", port: 'eth1/1/1', vlan: 10, client_cnt: 6, connections: 1, upload_bytes: 234, download_bytes: 994983342, connection_rate: 1, upload_bandwidth: 49, download_bandwidth: 968},
    {ipv4: "10.10.10.5", port: 'eth1/1/1', vlan: 10, client_cnt: 1, connections: 1, upload_bytes: 99234, download_bytes: 9983342, connection_rate: 1, upload_bandwidth: 32, download_bandwidth: 768},
	{ipv4: "10.10.10.4", port: 'eth1/2/1', vlan: 10, client_cnt: 4, connections: 2, upload_bytes: 123, download_bytes: 43342230, connection_rate: 2, upload_bandwidth: 43, download_bandwidth: 852},
	{ipv4: "10.10.10.5", port: 'eth1/2/1', vlan: 10, client_cnt: 9, connections: 20, upload_bytes: 9453, download_bytes: 982341332, connection_rate: 4, upload_bandwidth: 29, download_bandwidth: 81}
];
    
var line_stats = {
    cpu1: [],
    cpu2: [],
    cpu3: [],
    cpu4: [],
    length: 50,
    vis: {
        margin: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        height: 200,
        width: 500,
        svg: null
    }
};

var port_stats = {
    vis: {
        margin: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        height: 200,
        width: 500,
        svg: null
    }
};

var sankey_stats = {
    vis: {
        margin: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        height: 200,
        width: 500,
        svg: null
    }
};

//function print_filter(filter) {
//	var f=eval(filter);
//	if (typeof(f.length) != "undefined") {}else{}
//	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
//	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
//	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
//}

//var update_bar_stats = function (bar_stats) {
//    bar_stats.vis.width = $( "#svg-bar-stats-container" ).width();
//
//    var diag = bar_stats.stats_group.selectAll("rect").data(bar_stats.data, function (d) {
//        return d;
//    });
//
//    // Update Logic - What to do with old elements
//    diag.attr("x", function (d, i) {
//            return i * bar_stats.bar_width;
//        })
//        .attr("y", function (d) {
//            return bar_stats.vis.height - (d * bar_stats.vis.height) / 1000;
//        })
//        .attr("width", bar_stats.bar_width - bar_stats.bar_pad)
//        .attr("height", function (d) {
//            return (d * bar_stats.vis.height) / 1000;
//        })
//        .style("fill", bar_stats.color);
//    //        .attr('fill', function (d, j) {
//    //            return "hsl(" + (d * 360) % 360 + ",100%,50%)";
//    //        });
//
//    // Enter Logic - What to do with new elements
//    diag.enter()
//        .append("rect")
//        .attr("x", function (d, i) {
//            return i * bar_stats.bar_width;
//        })
//        .attr("y", function (d) {
//            return bar_stats.vis.height - (d * bar_stats.vis.height) / 1000;
//        })
//        .attr("width", bar_stats.bar_width - bar_stats.bar_pad)
//        .attr("height", function (d) {
//            return (d * bar_stats.vis.height) / 1000;
//        })
//        .attr("fill", bar_stats.color);
//    //        .attr('fill', function (d) {
//    //            return "hsl(" + (d * 360) % 360 + ",100%,50%)";
//    //        });
//
//    // Exit Logic - What to do with removed elements.
//    diag.exit().remove();
//};

//var init_bar_stats = function () {
//    var idx = 0;
//
//    for (idx = 0; idx < bar_stats.length; idx++) {
//        bar_stats.data[idx] = Math.random() * 1000;
//    }
//
//    bar_stats.vis.width = $( "#svg-bar-stats-container" ).width();
//    bar_stats.bar_width = (bar_stats.vis.width / bar_stats.bar_stats.length);
//    bar_stats.bar_pad = 1;
//    bar_stats.color = d3.scale.linear()
//        .domain([0, 500, 1000])
//        .range(["green", "orange", "red"]);
//
//    bar_stats.vis = d3.select("#svg-bar-stats-container").append("svg")
//        .attr("width", bar_stats.vis.width + bar_stats.vis.margin.left + bar_stats.vis.margin.right)
//        .attr("height", bar_stats.vis.height + bar_stats.vis.margin.top + bar_stats.vis.margin.bottom);
//
//    bar_stats.stats_group = bar_stats.vis.append("g")
//        .attr("transform", "translate(" + svg.margin.left + "," + svg.margin.top + ")");
//
//    update_bar_stats(bar_stats);
//};


// Example using SVG Graph - Entry, Update, Exit
var update_line_stats = function (line_stats) {
    var transtition_duration = 2000; // 1 sec timer interval + 1 sec psutil collection

    line_stats.vis.width = $( "#svg-line-stats-container" ).width();

    line_stats.stats_group.selectAll("#path1")
        .data([line_stats.cpu1]) // set the new data
        .attr("transform", "translate(" + line_stats.xScale(1) + ")")
        .attr("d", line_stats.line)
        .attr('stroke', 'green')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .interrupt()
        .transition()
        .ease("linear")
        .duration(transtition_duration)
        .attr("transform", "translate(" + line_stats.xScale(0) + ")");

    line_stats.stats_group.selectAll("#path2")
        .data([line_stats.cpu2]) // set the new data
        .attr("transform", "translate(" + line_stats.xScale(1) + ")")
        .attr("d", line_stats.line)
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .interrupt()
        .transition()
        .ease("linear")
        .duration(transtition_duration)
        .attr("transform", "translate(" + line_stats.xScale(0) + ")");

    line_stats.stats_group.selectAll("#path3")
        .data([line_stats.cpu3]) // set the new data
        .attr("transform", "translate(" + line_stats.xScale(1) + ")")
        .attr("d", line_stats.line)
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .interrupt()
        .transition()
        .ease("linear")
        .duration(transtition_duration)
        .attr("transform", "translate(" + line_stats.xScale(0) + ")");

    line_stats.stats_group.selectAll("#path4")
        .data([line_stats.cpu4]) // Set the new data
        .attr("transform", "translate(" + line_stats.xScale(1) + ")")
        .attr("d", line_stats.line)
        .attr('stroke', 'yellow')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .interrupt()
        .transition()
        .ease("linear")
        .duration(transtition_duration)
        .attr("transform", "translate(" + line_stats.xScale(0) + ")");

    line_stats.cpu1.shift();
    line_stats.cpu2.shift();
    line_stats.cpu3.shift();
    line_stats.cpu4.shift();
};


var init_line_stats = function () {
    var idx = 0;

    for (idx = 0; idx < line_stats.length; idx++) {
        line_stats.cpu1[idx] = 0; // Math.random() * 100;
        line_stats.cpu2[idx] = 0; //Math.random() * 100;
        line_stats.cpu3[idx] = 0; //Math.random() * 100;
        line_stats.cpu4[idx] = 0; //Math.random() * 100;
    }

    line_stats.vis.width = $( "#svg-line-stats-container" ).width();


    line_stats.xScale = d3.scale.linear().domain([0, line_stats.length]).range([-5, line_stats.vis.width]);
    line_stats.yScale = d3.scale.linear().domain([100, 0]).range([0, line_stats.vis.height]);

    line_stats.vis.svg = d3.select("#svg-line-stats-container").append("svg")
        .attr("width", line_stats.vis.width + line_stats.vis.margin.left + line_stats.vis.margin.right)
        .attr("height", line_stats.vis.height + line_stats.vis.margin.top + line_stats.vis.margin.bottom);

    line_stats.stats_group = line_stats.vis.svg.append("g")
        .attr("transform", "translate(" + line_stats.vis.margin.left + "," + line_stats.vis.margin.top + ")")
        .append("svg")
        .attr("width", line_stats.vis.width - 10)
        .attr("height", line_stats.vis.height + line_stats.vis.margin.top + line_stats.vis.margin.bottom);

    line_stats.line = d3.svg.line()
        .x(function (d, i) {
            return line_stats.xScale(i);
        })
        .y(function (d) {
            return line_stats.yScale(d);
        })
        .interpolate("monotone");

    // Draw the initial line
    line_stats.stats_group.append('path')
        .attr("id", "path1")
        .attr("d", line_stats.line(line_stats.cpu1))
        .attr('stroke', 'green')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
    line_stats.stats_group.append('path')
        .attr("id", "path2")
        .attr("d", line_stats.line(line_stats.cpu2))
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
    line_stats.stats_group.append('path')
        .attr("id", "path3")
        .attr("d", line_stats.line(line_stats.cpu3))
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
    line_stats.stats_group.append('path')
        .attr("id", "path4")
        .attr("d", line_stats.line(line_stats.cpu4))
        .attr('stroke', 'yellow')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
};


var init_pie_stats = function() {
    
    port_stats.vis.width = $( "#port-bandwidth-usage-container" ).width();
    
    drawDonutChart(
        "#port-bandwidth-usage-container",
        42,
        port_stats.vis.width + port_stats.vis.margin.left + port_stats.vis.margin.right,
        port_stats.vis.height + port_stats.vis.margin.top + port_stats.vis.margin.bottom,
        ".35em"
    );
};


var init_download_sankey_stats = function() {
    
    var graph = {"links": [], "nodes": []};
    
    var units = "Bytes/Sec";
    
    var formatNumber = d3.format(",.0f"), // zero decimal places
        format = function(d) { return formatNumber(d) + " " + units; },
        color = d3.scale.category20();

    var convertData = function(data) {
        var nodeMap = {};
    
        // Setup name and push ports as nodes;
        data.forEach(function(d) { d.name = d.ipv4; d.type = 'node'; nodeMap[d.port] = {name: d.port, type: 'port'}; nodeMap[d.name] = d;});
        for(var key in nodeMap) {
            graph.nodes.push(nodeMap[key]);
        };
    
    	data.forEach(function(d) {
    		graph.links.push({
    	            source: nodeMap[d.port],
    	            target: nodeMap[d.name],
    	            value:  d.download_bandwidth
    	        });
    	});
    };
    convertData(data);
    sankey_stats.vis.width = $( "#svg-sankey-download-container" ).width();

    // Append the svg canvas to the page
    var vis = d3.select("#svg-sankey-download-container").append("svg")
        .attr("width", sankey_stats.vis.width + sankey_stats.vis.margin.left + sankey_stats.vis.margin.right)
        .attr("height", sankey_stats.vis.height + sankey_stats.vis.margin.top + sankey_stats.vis.margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + sankey_stats.vis.margin.left + "," + sankey_stats.vis.margin.top + ")");
    
    // Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .size([sankey_stats.vis.width, sankey_stats.vis.height]);
    
    var path = sankey.link();

    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

    // Add in the links
    var link = vis.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .sort(function(a, b) { return b.dy - a.dy; });

    // Add the link titles
    link.append("title")
        .text(function(d) {
            return d.source.name + " → " +
            d.target.name + "\n" + format(d.value); });

    // Add in the nodes
    var node = vis.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
    	       return "translate(" + d.x + "," + d.y + ")"; })
               .call(d3.behavior.drag()
               .origin(function(d) { return d; })
               .on("dragstart", function() {
    	              this.parentNode.appendChild(this); })
                      .on("drag", dragmove));

    // Add the rectangles for the nodes
    node.append("rect")
        .attr("height", function(d) { return d.dy; })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) {
            return d.color = color(d.name.replace(/ .*/, "")); })
                    .style("stroke", function(d) {
            		          return d3.rgb(d.color).darker(2); })
                              .append("title")
                              .text(function(d) {
            		                    return d.name + "\n" + format(d.value); });

    // Add in the title for the nodes
    node.append("text")
        .attr("x", -6)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.name; })
        .filter(function(d) { return d.x < sankey_stats.vis.width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    // The function for moving the nodes
    function dragmove(d) {
        d3.select(this).attr("transform",
            "translate(" + (
                d.x = Math.max(0, Math.min(sankey_stats.svg.width - d.dx, d3.event.x))
                ) + "," + (
                    d.y = Math.max(0, Math.min(sankey_stats.svg.height - d.dy, d3.event.y))
                ) + ")");
                sankey.relayout();
                link.attr("d", path);
            }
};


var init_upload_sankey_stats = function() {
    
    var graph = {"links": [], "nodes": []};
    
    var units = "Bytes/Sec";
    
    var formatNumber = d3.format(",.0f"),    // zero decimal places
        format = function(d) { return formatNumber(d) + " " + units; },
        color = d3.scale.category20();

    var convertData = function(data) {
        var nodeMap = {};
    
         // Setup name and push ports as nodes;
        data.forEach(function(d) { d.name = d.ipv4; d.type = 'node'; nodeMap[d.port] = {name: d.port, type: 'port'}; nodeMap[d.name] = d;});
        for(var key in nodeMap) {
            graph.nodes.push(nodeMap[key]);
        };
    
    	data.forEach(function(d) {
    		graph.links.push({
    	            source: nodeMap[d.port],
    	            target: nodeMap[d.name],
    	            value:  d.upload_bandwidth
    	        });
    	});
    };
    convertData(data);
    sankey_stats.vis.width = $( "#svg-sankey-upload-container" ).width();

    // Append the svg canvas to the page
    var vis = d3.select("#svg-sankey-upload-container").append("svg")
        .attr("width", sankey_stats.vis.width + sankey_stats.vis.margin.left + sankey_stats.vis.margin.right)
        .attr("height", sankey_stats.vis.height + sankey_stats.vis.margin.top + sankey_stats.vis.margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + sankey_stats.vis.margin.left + "," + sankey_stats.vis.margin.top + ")");
    
    // Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .size([sankey_stats.vis.width, sankey_stats.vis.height]);
    
    var path = sankey.link();

    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

    // Add in the links
    var link = vis.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .sort(function(a, b) { return b.dy - a.dy; });

    // Add the link titles
    link.append("title")
        .text(function(d) {
            return d.source.name + " → " +
            d.target.name + "\n" + format(d.value); });

    // Add in the nodes
    var node = vis.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
    	       return "translate(" + d.x + "," + d.y + ")"; })
               .call(d3.behavior.drag()
               .origin(function(d) { return d; })
               .on("dragstart", function() {
    	              this.parentNode.appendChild(this); })
                      .on("drag", dragmove));

    // Add the rectangles for the nodes
    node.append("rect")
        .attr("height", function(d) { return d.dy; })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) {
            return d.color = color(d.name.replace(/ .*/, "")); })
                    .style("stroke", function(d) {
            		          return d3.rgb(d.color).darker(2); })
                              .append("title")
                              .text(function(d) {
            		                    return d.name + "\n" + format(d.value); });

    // Add in the title for the nodes
    node.append("text")
        .attr("x", -6)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.name; })
        .filter(function(d) { return d.x < sankey_stats.vis.width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    // Ahe function for moving the nodes
    function dragmove(d) {
        d3.select(this).attr("transform",
            "translate(" + (
                d.x = Math.max(0, Math.min(sankey_stats.svg.width - d.dx, d3.event.x))
                ) + "," + (
                    d.y = Math.max(0, Math.min(sankey_stats.svg.height - d.dy, d3.event.y))
                ) + ")");
                sankey.relayout();
                link.attr("d", path);
            }
};


var init_data_buffers = function () {
    //init_bar_stats();
    init_line_stats();
    init_pie_stats();
    init_download_sankey_stats();
    init_upload_sankey_stats();
};


var initialize = function () {
    init_data_buffers();

    // Inform the server that we are ready to receive data.
    // io.emit('ready_stats');
};


socket.on('connect', function () {
    socket.emit('ready', {
        data: 'I\'m connected!'
    });
});


// Socket IO recv functions
socket.on('stats', function (data) {
    // console.log("Received stat: " + data);

    // bar_stats.data.push(data.bar_data);
    // if (bar_stats.data.length > bar_stats.length) {
    //     bar_stats.data.shift();
    // }

    line_stats.cpu1.push(data.cpu1);
    line_stats.cpu2.push(data.cpu2);
    line_stats.cpu3.push(data.cpu3);
    line_stats.cpu4.push(data.cpu4);

    // Update_bar_stats(bar_stats);
    update_line_stats(line_stats);
});


$(document).ready(function () {
    console.log("ready!");
    initialize();
});

