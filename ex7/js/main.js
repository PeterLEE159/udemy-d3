var kgeo, usgeo;

(() => {

 	var margin = { top: 50, right: 200 },
 		width = 800,
 		height = 800 - margin.top;

 	var g = d3.select('#chart1')
 				.append('svg')
 				.attr('width', width + margin.right)
 				.attr('height', height + margin.top)
 					.append('g')
 					.attr('transform', 'translate(0, '+margin.top+')');

	var path = d3.geoPath()

	var color = d3.scaleThreshold()
	 				.domain(d3.range(0, 10))
	 				.range(d3.schemeBlues[9]);

	var xcscale = d3.scaleLinear()
					.domain([124, 132])
					.range([0, width])

	var ycscale = d3.scaleLinear()
					.domain([33, 39])
					.range([height, 0])

	// g.append('g')
	// 	.attr('transform', 'translate('+(width - 200)+')')
	// 	.call(
	// 		d3.axisBottom(x)

	// 	)
 
	Promise.all([
		d3.json('/data/topo-korea.json'),
		d3.json('/data/us-map.json')
	]).then(data => {

		kgeo = data[0];
		usgeo = data[1];

		var formatData = topojson.feature(kgeo, kgeo.objects.sido).features;

		formatData.forEach(d => {
			d.geometry.coordinates.forEach(co => {
				co.forEach(c => {
					c[0] = xcscale(c[0]);
					c[1] = ycscale(c[1]);
				})
			})

		})

		g.selectAll('path')
			.data(formatData)
			.enter()
				.append('path')
				.attr('fill', (d, i) => color(Math.random() * 15))
				.attr('d', path);


	});
})();