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


	4. 동적제어
		4.1 stop and go
			- stop: setInterval clear
			- go: begin setInterval

		4.2 reset, year slider
			# year 변수화
			- reset: year = 0
			- year-slider: year = x?

		4.3 continents filter
			# continent 변수화
			- select#onChange
			- data formatting process filtering

*/

function $translate(left, top) {
	if(!left) left = 0;
	if(!top) top = 0;
	return 'translate('+left+', '+top+')'
}

var margin = { left: 50, top: 30, bottom: 100, right: 20 };

var idx = 0, continents = 'all', interval = undefined, formatData = [];

var width = 800 - margin.left - margin.right, 
	height = 600 - margin.top - margin.bottom;

$(() => {
	function onStop() {
		if(!interval) return;
		clearInterval(interval)
		interval = undefined;
		$('#play-button').text('Play');
	}
	function onFire() {

		if(interval) return;

		$('#play-button').text('Stop');

		interval = setInterval(() => {

			var filterData = formatData[idx++];
			if(continents != 'all') filterData.countries = filterData.countries.filter(c => c.continent == continents);

			update(filterData);

			if(idx >= formatData.length - 1) idx = 0;
		}, 400);
	}

	$('#play-button').on('click', () => {
		if(interval) onStop();
		else onFire();
	});
	$('#reset-button').on('click', () => {
		idx = 0;
		onFire();
	});

	$('#continent-select').on('change', () => {
		continents = $('#continent-select').val();
		onFire();
	})

})


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

var tip = d3.tip()
	.attr('class', 'd3_tip')
    .html(d => {
        var text = "<strong>Country:</strong> <span>" + d.country + "</span><br>";
        text += "<strong>Continent:</strong> <span style='text-transform:capitalize'>" + d.continent + "</span><br>";
        text += "<strong>Life Expectancy:</strong> <span>" + d3.format(".2f")(d.life_exp) + "</span><br>";
        text += "<strong>GDP Per Capita:</strong> <span>" + d3.format("$,.0f")(d.income) + "</span><br>";
        text += "<strong>Population:</strong> <span>" + d3.format(",.0f")(d.population) + "</span><br>";
        return text;
    });
g.call(tip);


d3.json("data/data.json").then(function(data){
	// 변경되어야 할 것
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

	formatData = data.map(datum => {
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

})



function update(datum) {

	var t = d3.transition().duration(300);

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
			.attr('fill', c => colorScale(c.continent))
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);
}