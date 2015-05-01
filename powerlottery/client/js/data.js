
Template.data.events({
	'click #add':function(){
		points.insert({
			  date:new Date(),
			value:Math.floor(Math.random() * 100)+500
		});
	},
	'click #remove':function(){
		var toRemove = Random.choice(points.find().fetch());
		points.remove({_id:toRemove._id});
	},
	'click #randomize':function(){
		//loop through bars
		points.find({}).forEach(function(point){
			points.update({_id:point._id},{$set:{value:Math.floor(Math.random() * 100)+500}});
		});
	}
});


Template.data.rendered = function(){
	//Width and height
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 600 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	var x = d3.time.scale()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var line = d3.svg.line()
		.x(function(d) {
			return x(d.date);
		})
		.y(function(d) {
			return y(d.power);
		});

	var svg = d3.select("#lineChart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")");

	svg.append("g")
		.attr("class", "y axis")
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Power (J)");

	Deps.autorun(function(){
		var dataset = points.find({},{sort:{date:-1}}).fetch();
      console.log(dataset[0].date)
      console.log(dataset[0].power)
		var paths = svg.selectAll("path.line")
			.data([dataset]); //todo - odd syntax here - should use a key function, but can't seem to get that working

		x.domain(d3.extent(dataset, function(d) { return d.date; }));
		y.domain(d3.extent(dataset, function(d) { return d.power; }));
      console.log("here")
		//Update X axis
		svg.select(".x.axis")
			.transition()
			.duration(1000)
			.call(xAxis);
			
		//Update Y axis
		svg.select(".y.axis")
			.transition()
			.duration(1000)
			.call(yAxis);
		
		paths
			.enter()
			.append("path")
			.attr("class", "line")
			.attr('d', line);

		paths
			.attr('d', line); //todo - should be a transisition, but removed it due to absence of key
			
		paths
			.exit()
			.remove();
	});
};


