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


var width = 800, height = 600;
var margin = { left: 50, top: 30, bottom: 100, right: 0 };

var t = d3.transition().duration(750);

var xAxisCall = d3.axisBottom().range([0, width]).ticks(5);
var yAxisCall = d3.axisLeft().range([0, height]).ticks(5);

var svg = d3.select('#chart-area')
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.style('visibility', 'hidden');

var yLabel = svg.append('text')
				.attr('x', -height / 2)
				.attr('y', 0)
				.attr('transform', 'rotate(-90)')
				.attr('font-size', '20px')
				.text('평균수명');

var xLabel = svg.append('text')
				.attr('x', (width - margin.left) / 2)
				.attr('y', height - 50)
				.attr('text-anchor', 'middle')
				.attr('font-size', '20px')
				.text('수입');				

var yearLabel = svg.append('text')
				.attr('x', width)
				.attr('y', height - margin.bottom - 30)
				.attr('text-anchor', 'end')
				.attr('font-size', '24px');



var xAxis = svg.append('g')
				.attr('x', margin.left)
				.attr('y', height - margin.bottom);

var yAxis = svg.append('g')
				.attr('x', margin.left)
				.attr('y', height - margin.bottom);


d3.json("data/data.json").then(function(data){
	// 변경되어야 할 것	

	console.log(data);
	svg.style('visibility', 'visible');



	function update(datum) {



		yearLabel.transition(t)
				.text(datum.year);


		var countries = daum.countries;

		xAxisCall = xAxisCall.domain(d3.extent(countries, c => c.life_exp ));
		yAxisCall = yAxisCall.domain(d3.extent(countries, c => c.income ));



	}

	var i =0;
	if(i == 0) return;
	var interval = setInterval(() => {

		update(data[i++]);
		if(i >= data.length - 1) i = 0;
	}, 500);


})


