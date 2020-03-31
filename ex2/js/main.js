/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

d3.json('data/revenues.json').then(data => {


	var k = d3.select('.row')
		.selectAll('p')
		.data(data)
			.enter()
				.append('p')
				.text(d => d.month)
				.exit()
				.remove();
			//.attr('style', 'color: green');

	return;
	console.log(data);

	
	var width = 1000, height = 300;

	var chartYTitleWidthPercent = 10;
	var chartYLegendWidthPercent = 30;
	var chartWidthPercent = 60;

	var chartXTitleHeightPercent = 10;
	var chartXLegendHeightPercent = 30;
	var chartHeightPercent = 60;





	var svg = d3.select('#chart-area')
		.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', '0 0 100 100');


	var x = d3.scaleBand()
				.domain(data.map(d => d.month))
				.range([0, chartWidthPercent])
				.paddingInner(0.1)
				.paddingOuter(0.3);


	var y = d3.scaleLinear()
				.domain([0, d3.max(data, d => d.revenue)])
				.range([chartHeightPercent, 0]);

	


	
	
	svg.append('g')
		.attr('transform', 'translate('+(100 - chartWidthPercent)+', 0)')
		.attr('height', chartHeightPercent)
		.selectAll('rect')
		.data(data)
			.enter()
				.append('rect')
					.attr('x', d => x(d.month))
					.attr('y', d => y(d.revenue))
					.attr('width', x.bandwidth )
					.attr('height', d => chartHeightPercent - y(d.revenue) - 0.5)
					.attr('fill', 'pink');


	var xLegend = svg.append('g')
						.attr('transform', 'translate('+ (100 - chartWidthPercent) +', '+chartHeightPercent+')')
						.call(d3.axisBottom(x));



	xLegend.selectAll('text')
				.attr('x', -5)
				.attr('y', 5)
				.attr('text-anchor', 'end')
				.attr('transform', 'rotate(-40)')
				.attr('font-size', '4px');

	xLegend.selectAll('path, line')
				.attr('stroke-width', '0.5px');

	var yLegend = svg.append('g')
					.attr('transform', 'translate('+ (100 - chartWidthPercent) +', 0)')
					.attr('height', chartHeightPercent)
					.call(d3.axisLeft(y).ticks(5, 's'));
	

	yLegend.selectAll('text')
				.attr('font-size', '4px');

	yLegend.selectAll('path, line')
				.attr('stroke-width', '0.5px');

	svg.append('g')
			.append('text')
				.attr('font-size', '6px')
				.attr('x', 30)
				.attr('y', -15)
				.attr('transform', 'rotate(90)')
				.text('Revenue');

	svg.append('g')
		.attr('transform', 'translate('+ ( 100 - chartWidthPercent ) +', '+ ( 100 - chartXTitleHeightPercent - 5) +')')
			.append('text')
					.attr('width', '100%')
					.attr('text-anchor', '	')
					.attr('font-size', '6px')
					.attr('x', chartWidthPercent / 2 - 10)
					.text('Month');

    
	

})