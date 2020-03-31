/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

d3.json('data/revenues.json').then(data => {
	console.log(data);
	var width = 1000;
	var height = 500;

	var svg = d3.select('#chart-area')
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.attr('viewBox', '0 0 100 100');


	var chartMargin = { top: 30, left: 10};
	var chartWidth = 100 - chartMargin.left;
	var chartHeight = 100 - chartMargin.top;




	var x = d3.scaleBand()
				.domain(data.map(d => d.month))
				.range([0, chartWidth])
				.paddingInner(0.1)
				.paddingOuter(0.3);

	var y = d3.scaleLinear()
				.domain([0, d3.max(data, d => d.revenue)])
				.range([chartHeight, 0]);

	




	svg.append('g')
		.attr('transform', 'translate('+chartMargin.left+', 0)')
		.selectAll('rect')
		.data(data)
			.enter()
				.append('rect')
				.attr('x', d => x(d.month))
				.attr('y', d => y(d.revenue))
				.attr('width', x.bandwidth)
				.attr('height', d => chartHeight - y(d.revenue))
				.attr('fill', 'pink')


	var xAxis = d3.axisBottom(x);
	svg.append('g')
		.attr('transform', 'translate('+chartMargin.left+', '+( 100 - chartMargin.top)+')')
		.call(xAxis)
		.selectAll('text')
			.attr('x', -5)
			.attr('y', 5)
			.attr('text-anchor', 'end')
			.attr('font-size', 6)
			.attr('transform', 'rotate(-40)');


	var yAxis = d3.axisLeft(y)
		.ticks(6)
		.tickFormat(d => '$' + d);
	

	svg.append('g')
		.attr('transform', 'translate('+chartMargin.left+', 0)')
		.call(yAxis)
		.selectAll('text')
			.attr('font-size', 6);







})