/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

/*
	1. 그룹화
		1.1 원형 컨텐츠
		1.2 x축 label
		1.3 x축 axis
		1.3 y축 label
		1.4 y축 axis
		1.5 년도 label

	2. 변경되지 말아야 할 것
		2.1 x축 label
		2.2 x축 axis
		2.3 y축 label
		2.4 y축 axis
		2.5 x, y축 도메인 scale

	3. 변경되어야 할 것
		3.1 년도 label
		3.2 원형의 개수, 크기 및 위치

*/

function $translate(left, top) {
	if(!left) left = 0;
	if(!top) top = 0;
	return 'translate('+left+', '+top+')'
}

var margin = { left: 50, top: 30, bottom: 100, right: 20 };

var width = 800 - margin.left - margin.right, 
	height = 600 - margin.top - margin.bottom;





var svg = d3.select('#chart-area')
				.append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.style('visibility', 'hidden')
var g = svg.append('g')
			.attr('transform', $translate(margin.left, margin.top));


g.append('text')
	.attr('x', - height / 2)
	.attr('y', - margin.left / 2)
	.attr('transform', 'rotate(-90)')
	.attr('font-size', '20px')
	.text('평균수명');

g.append('text')
	.attr('x', width / 2)
	.attr('y', height + (margin.bottom / 2))
	.attr('text-anchor', 'middle')
	.attr('font-size', '20px')
	.text('수입');

var yearLabel = g.append('text')
				.attr('x', width)
				.attr('y', height - 10)
				.attr('text-anchor', 'end')
				.attr('font-size', '24px')
				.attr('fill', 'grey');


var x = d3.scaleLog().range([0, width]);

var y = d3.scaleLinear().range([height, 0]);

var r = d3.scaleLinear().range([25*Math.PI, 1500*Math.PI]);

// var r = d3.scaleLinear()
//     .domain([2000, 1400000000])
//     .range([25*Math.PI, 1500*Math.PI]);

var colorScale = d3.scaleOrdinal().range(d3.schemePastel1);


d3.json("data/data.json").then(function(data){
	// 변경되어야 할 것	

	console.log(data);
	svg.style('visibility', 'visible');

	

	var minAge = Infinity;
	var minIncome = Infinity;
	var minYear = Infinity;
	var minPopulation = Infinity;

	var maxAge = -Infinity;
	var maxIncome = -Infinity;
	var maxYear = -Infinity;
	var maxPopulation = -Infinity;



	var continents = [];
	var income = { total: 0, count: 0 }

	var formatData = data.map(datum => {
		var year = +datum.year;
		if(minYear < year) minYear = year;
		if(maxYear > year) maxYear = year;

		var countries = !datum.countries ? [] :
			datum.countries.filter(country => {
				if(continents.indexOf(country.continent) == -1) continents.push(country.continent);
				if(!country.income || !country.life_exp || !country.population) return false;
				
				country.income = +country.income;
				country.life_exp = +country.life_exp;
				if(minAge > country.life_exp) minAge = country.life_exp;
				if(maxAge < country.life_exp) maxAge = country.life_exp;

				if(minIncome > country.income) minIncome = country.income;
				if(maxIncome < country.income) maxIncome = country.income;

				if(minPopulation > country.population) minPopulation = country.population;
				if(maxPopulation < country.population) maxPopulation = country.population;

				income.total += country.income;
				income.count++;


				return true;
			});

		return {
			year: year,
			countries: countries
		}
	})



	x.domain([ minIncome, maxIncome ]);
	y.domain([ minAge, maxAge ]);
	r.domain([ minPopulation, maxPopulation ]);
	

	colorScale.domain([ continents ]);

	//var avgIncome = Number((( minIncome + maxIncome ) / 2).toFixed(0));
	var avgIncome = Number(( income.total / income.count ).toFixed(0));

	
	var xAxis = d3.axisBottom(x)
			.tickFormat(d => '$' + d)
			.tickValues([ minIncome, avgIncome, maxIncome ]);

	var yAxis = d3.axisLeft(y).ticks(3);

	g.append('g')
		.attr('transform', $translate(0, height))
		.call(xAxis);

	g.append('g')
		.call(yAxis);

	function update(datum) {


		

		var t = d3.transition().duration(50);

		yearLabel.text(datum.year);

		var circles = g.selectAll('circle').data(datum.countries, c => c.country);

		circles.exit().remove();

		circles.transition(t)
			.attr('cx', c => x(c.income))
			.attr('cy', c => y(c.life_exp))
			.attr('r', c => Math.sqrt(r(c.population) / Math.PI))

		circles.enter()
			.append('circle')
				.attr('cx', c => x(c.income))
				.attr('cy', c => y(c.life_exp))
				.attr('r', c => Math.sqrt(r(c.population) / Math.PI))
				.attr('fill', c => colorScale(c.continent));

		// circles.enter()
  //       .append("circle")
  //       .attr("class", "enter")
  //       .attr("fill", function(d) { return colorScale(d.continent); })
  //       .merge(circles)
  //       .transition(t)
  //           .attr("cy", function(d){ return y(d.life_exp); })
  //           .attr("cx", function(d){  return x(d.income); })
  //           .attr("r", function(d){ return Math.sqrt(r(d.population) / Math.PI) });


	}

	var i =0;
	var interval = setInterval(() => {
		//if( i >= 3) return;
		update(formatData[i++]);
		if(i >= formatData.length - 1) i = 0;
	}, 100);


})


