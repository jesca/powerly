var usageOverTimePoints = new Meteor.Collection(null);

Template.data.rendered = function() {
    // initialization code
    var margin = {top: 20, right: 20, bottom: 40, left: 80},
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([width, 0]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(5)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(5)
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) {
            return x((new Date().getTime() - d.time)/1000);
        })
        .y(function(d) {
            return y(d.value);
        });

    var svg = d3.select("#usageOverTime")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .append("text")
        .attr("transform", "translate(" + width/2 + "," + (margin.bottom - 5) + ")")
        .style("text-anchor", "middle")
        .text("Time since present (s)");

    svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "translate(" + (25 - margin.left) + "," + height/2 + ") rotate(-90)")
        .text("Power (W)");

    function update() {
        usageOverTimePoints.insert({time: new Date().getTime(), value: Meteor.user().profile.power_usage });
        usageOverTimePoints.remove({ time: {$lte: new Date().getTime() - 500000}});

        var dataset = usageOverTimePoints.find({}, {sort:{time: 1}}).fetch();

        var paths = svg.selectAll("path.line")
            .data([dataset]);

        x.domain(d3.extent(dataset, function(d) { return (new Date().getTime() - d.time)/1000; }));
        y.domain(d3.extent(dataset, function(d) { return d.value; }));

        //Update X axis
        svg.select(".x.axis")
            .transition()
            .duration(200)
            .call(xAxis);

        //Update Y axis
        svg.select(".y.axis")
            .transition()
            .duration(200)
            .call(yAxis);

        paths
            .enter()
            .append("path")
            .attr("class", "line")
            .attr('d', line);

        paths
            .attr('d', line);

        paths
            .exit()
            .remove();
    }

    Meteor.setInterval(update, 1000);
    update();
};