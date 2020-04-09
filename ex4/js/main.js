d3.tsv("data/stacked_area1.tsv").then(data => {

    

    var margin = { top: 30, left: 100, right: 300, bottom: 100 };

    var width = 1200 - margin.left - margin.right;
    var height = 800 - margin.top - margin.bottom;

    var timeParser = d3.timeParse("%Y %b %d");
    var timeYYYYMMParser = d3.timeParse("%Y%m");
    var timeYYYYMMFormat = d3.timeFormat('%Y.%m');

    var tip = d3.tip();
    //data.forEach(d => d.date = timeParser(d.date));

    /*
    	stack 구조 그래프
    		1. data import
    		2. data -> stack 구조화
    		3. opacity 적용 (onmouseover => opacity: 1)
    		4. color scheme
    */
    function $translate(top, left) {
    	if(!top) top = 0;
    	if(!left) left = 0;
    	return 'translate(' + left + ', ' + top + ')';
    }

    function generateObj(arr, defaultVal) {
    	var obj = {};
    	arr.forEach(item => obj[item] = defaultVal);
    	return obj;
    }
    function lpad(target, len, padval) {
    	if(!target) target = '';
    	if(!len) return target;
    	target = String(target);
    	if(len < target.length) return target;
    	if(!padval) padval = '0';

    	for(var i = 0; i < len - target.length; i ++) target = padval + target;

    	return target;
    }

    var keys = data.columns.filter(d => d != 'date');
    var yearMap = {};
    var dts = [];
    data.forEach(d => {
    	var dt = timeParser(d.date);
    	var yyyymm = dt.getFullYear() + String(lpad(( dt.getMonth() + 1), 2, '0'));
    	dts.push(dt);

    	var yearObj = yearMap[yyyymm];
    	if(!yearObj) {
    		yearObj = generateObj(keys, 0);
    		yearMap[yyyymm] = yearObj;
    	}

    	keys.forEach(k => {
    		d[k] = +d[k];
    		yearObj[k] += d[k];
    	});


    	d.date = timeParser(d.date);

    });

    var yearKeys = Object.keys(yearMap);
    var bkeys = [];
    keys.forEach(k => {
    	for(var i= 0 ; i < yearKeys.length ; i ++) yearMap[yearKeys[i]][k] = Math.round(yearMap[yearKeys[i]][k]);
    });
    yearKeys.forEach(y => bkeys.push(generateObj(keys, 0)));
    

    for(var i= 0 ; i < yearKeys.length ; i ++) {
    	var cyear = yearKeys[i]
    	var cdata = yearMap[cyear];    	

    	keys.forEach(k => bkeys[i][k] = cdata[k])
    }
    
    

    var stackData = d3.stack().keys(keys)(bkeys);

    var dtArr = [];
    stackData.forEach((sd, idx) => {
    	var yyyymm = timeYYYYMMFormat(timeYYYYMMParser(yearKeys[idx]))
    	dtArr.push(yyyymm);

    	sd.dt = yyyymm;
    });
    
    var maxData = stackData[stackData.length - 1];
    
    var maxVal = -Infinity;
    maxData.forEach(m0 => {
		if(maxVal < m0[1]) maxVal = m0[1];
	})
    
    var x = d3.scaleBand().domain(dtArr)
    						.range([0, width])
    						.paddingInner(0.1)
    						.paddingOuter(0.3);

    var y = d3.scaleLinear().domain([0, maxVal])
    						.range([height, 0]);

    var color = d3.scaleOrdinal()
    						.domain(keys)
    						.range(d3.schemePastel1);


    var formatData = [];
    dtArr.forEach((dt, idx) => {
    	var formatObj = {};
    	formatObj.dt = dt;
    	formatObj.data = [];
    	formatData.push(formatObj);
    	stackData.forEach(sd => {
    		formatObj.data.push(sd[idx]);
   		})	
    })

    var g = d3.select('body')
    	.append('svg')
    		.attr('width', width + margin.left + margin.right)
    		.attr('height', height + margin.top + margin.bottom)
    		.style('display', 'block')
    		.style('margin', 'auto')
    			.append('g')
    				.attr('transform', $translate(margin.top, margin.left));

    

    g.append('g')
    	.attr('transform', $translate(height, 0))
    	.call(d3.axisBottom(x).ticks(yearKeys.length - 1));

    g.append('g')
    	.call(d3.axisLeft(y).tickFormat(d => (d / 1000).toFixed(1) + 'K'));
    
    formatData.forEach((fd, fidx) => {
		
    	var ng = g.append('g')
			.attr('class', 'xcontent')
			.attr('transform', d => $translate(0, x(fd.dt)))
			.style('opacity', 0.8);

		ng
			.on('mouseover', () => ng.style('opacity', 1))
			.on('mouseout', () => ng.style('opacity', 0.8))

		

		fd.data.forEach((ed, idx) => {

			ng.append('rect')
				.attr('key', keys[idx])
				.attr('fill', color(keys[idx]))
				.attr('y', y(ed[1]))
				.attr('width', x.bandwidth)
				.attr('height', y(ed[0]) - y(ed[1]))

		})
    })

    var legend = g.append('g')
    	.attr('transform', $translate(30, width + 10))
    	.attr('width', 100)
    	.style('padding', '6px');

    

    keys.forEach((key, kidx) => {
    	var el = legend.append('g')
    		.attr('transform', $translate(kidx * 30, 0));

    	el.append('rect')
    		.attr('width', 15)
    		.attr('height', 15)
    		.attr('fill', color(key))

    	el.append('text')
    		.attr('x', 30)
    		.attr('y', 10)
    		.attr('dy', '0.2rem')
    		.text(key);
    		
    })
    





   	
    


});