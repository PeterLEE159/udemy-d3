function pie(id)  {


	var width = 600, height = 300;
	var radius = Math.min(width, height) / 2;

	


	var g = d3.select(id)
				.append('svg')
				.attr('width', width)
				.attr('height', height)
					.append('g')
					.attr('transform', 'translate('+(width / 2)+', '+ (height / 2) +')');

	var tip = d3.tip()
			.attr('class', 'd3_tip')
			.html(d => {

				d = d[0].data;
				var html = "<div><span class='title'>나이</span>"+(d.age)+"</div>"
						+	"<div><span class='title'>인구</span>"+(d.population)+"</div>";
				return html
			});

	g.call(tip);


	
    d3.csv("data/donut1.csv").then(data => {
    	

    	data = data.map(d => {
    		d.population = +d.population;
    		return d;
    	});

    	

    	var arc = d3.arc()
    				.innerRadius(radius * 0.4)
    				.outerRadius(radius);

    	var pie = d3.pie()
    				.sort(null)
    				.value(d => d.population);

    	var color = d3.scaleOrdinal()
    					.domain(data.map(d => d.age))
    					.range(d3.schemeCategory10)

    	var t = d3.transition().duration(1500);
    	


		function update() {
			var p = g.selectAll('path');
			
			data.forEach(d => d.population = Math.floor(1000 * Math.random()));

			var removeIdx = Math.floor(Math.random() * 1000) % data.length;
			var formatData = data.filter((d, i) => i != removeIdx);

			var data0 = p.data(),
				data1 = pie(formatData);
			

    		var p = g.selectAll('path').data(data1, d => d.data.age);

    		p.exit()
				.transition()
				.duration(750)
					.attrTween('d', d => {
						var i = d3.interpolate(d, { startAngle: d.endAngle, endAngle: d.endAngle })
						return t => arc(i(t));
					})
					.remove();

			p
				.transition()
				.duration(750)
				.attrTween('d', d => {
					var prev = d;
					if(data0.length > 0) {
						var d0 = (data0.filter(d0 => d0.data.age == d.data.age))[0];
						if(d0) prev = { startAngle: d0.startAngle, endAngle: d0.endAngle };
					}

					var i = d3.interpolate(prev, d);
					return t => arc(i(t));
				});

    		p.enter()
    			.append('path')
				.attr('class', 'spath')
				.style('opacity', 0.6)
				.on('mouseover', function() {
					d3.select(this).style('opacity', 1)
					tip.show(arguments);
				})
				.on('mouseout', function() {
					d3.select(this).style('opacity', 0.6)
					tip.hide(arguments);
				})
				.attr('fill', d => color(d.data.age))
				.attr('id', (d, idx) => 'path' + idx)
				.attr('stroke', '#fff')
				.attr('stroke-width', 2)
					.transition()
					.duration(750)
						.attrTween('d', d => {

							var i = d3.interpolate({ startAngle: d.startAngle, endAngle: d.startAngle }, d);
							return t => arc(i(t));
						});
		    		
    	}


		setInterval(update, 1000)
		update();
	    			
    			

        
    });







};

pie('#chart1');

