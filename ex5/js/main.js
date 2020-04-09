(() => {


	var width = 1200, height = 600;

	var tip = d3.tip();


	var g = d3.select('#chart')
				.append('g');

	g.call(tip);

    d3.csv("data/donut1.csv", data => {
    	console.log(data);
        
    });




})();

