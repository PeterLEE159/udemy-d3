/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

d3.json('data/revenues.json').then(data => {

	var margin = { top: 50, right: 120, bottom: 100, left: 100 };
	var width = 1200 - margin.right - margin.left,
		height = 800 - margin.bottom - margin.top;

	data = data.map(d => {
		d.revenue = +d.revenue;
		d.profit = +d.profit;
		return d;
	})


	function $trans(left, top) {
		return 'translate(' + left + ', ' + top + ')';
	}

	var g = d3.select('#chart-area').append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.left)
					.append('g')
					.attr('transform', $trans(margin.left, margin.top));

	

	
	var x = d3.scaleBand()
				.domain(data.map(d => d.month))
				.range([0, width])
				.padding(0.2);

	var y = d3.scaleLinear()
				.domain([0, d3.max(data, d => d.profit)])
				.range([height, 0]);

	var xAxisCall = d3.axisBottom(x);

	var yAxisCall = d3.axisLeft(y);


	g.append('g')
		.attr('transform', $trans(0, height))
		.call(xAxisCall);

	g.append('g')
		.call(yAxisCall);

	var t = d3.transition().duration(1000);

	g.selectAll('rect')
		.data(data)
		.enter()
			.append('rect')
			.attr('x', d => x(d.month))
			.attr('width', x.bandwidth)
			// .attr('y', d => y(d.profit))
			// .attr('height', d => height - y(d.profit))
			.attr('fill', 'pink')
			.transition()
			.duration(500)
				.attrTween('y', d => {
					var i = d3.interpolate(height, y(d.profit));
					return t => i(t);
				})
				.attrTween('height', d => {
					var i = d3.interpolate(height, y(d.profit));
					return t => height - i(t);
				});
})