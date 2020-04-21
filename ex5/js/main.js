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
    	
    	var arc = d3.arc()
    				.innerRadius(radius * 0.4)
    				.outerRadius(radius);

    	var pie = d3.pie()
    				.sort(null)
    				.value(d => d.population);

    	var color = d3.scaleOrdinal()
    					.domain(data.map(d => d.age))
    					.range(d3.schemeCategory10)

    	var t = d3.transition().duration(2000);

    	var p = g.selectAll('path')
    		.data(pie(data))
    		.enter()
    			.append('path');

    	

		p.attr('class', 'spath')
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
    		.attr('d', arc);


	    // setTimeout(() => {
	    // 	data.forEach(d => {
	    // 		d.population = 	Number((d.population * (Math.random() * 2)).toFixed(0));
	    // 		if(d.population == 0) d.population = 1000;
	    // 	})

	    // 	d3.selectAll('.spath')
	    // 		.data(pie(data))
	    // 		.transition(t)
	    // 			.attr('d', arc);

	    // }, 500)
	    			
    			

        
    });




};

pie('#chart1');
pie('#chart2');



