/*
    이벤트
        가상화폐 선택
            -> data array 선택

        종류 선택
            -> list item column 선택

        날짜 범위 선택
            -> 선택된 날짜 범위에 해당하는 데이터 추출
*/


setTimeout(() => {

    
    var xLabelMap = {
        'price_usd': 'Price (USD)',
        'market_cap': 'Market Capitalization',
        '24h_vol': '24 Hour Sales'
    }
    var allData = undefined;



    function $translate(left, top) {
        if(!left) left = 0;
        if(!top) top = 0;
        return 'translate(' + left + ', ' + top + ')';
    }
    var margin = { top: 30, right: 50, bottom: 100, left: 100 };

    var t = d3.transition().duration(500);

    var width = 1200 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var formatTime = d3.timeFormat("%d/%m/%Y");
    var bisectDate = d3.bisector(function(d) { return d.date; }).left;
    var parseTime = d3.timeParse("%d/%m/%Y");


    var g = d3.select('#chart-area')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', $translate(margin.left, margin.top));

    g.append('text')
        .attr('class', 'ylabel')
        .attr('x', -height / 2)
        .attr('y', -50)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .attr('font-size', '18px')
        .text(xLabelMap[$('#var-select').val()]);

    g.append('text')
        .attr('x', width / 2)
        .attr('y', height + 50)
        .attr('text-anchor', 'middle')
        .attr('font-size', '18px')
        .text('Year')

    var x = d3.scaleTime()
                .range([0, width]);

    var y = d3.scaleLinear()
                .range([height, 0]);

    var xAxisCall = d3.axisBottom(x)
                    .ticks(5);

    var yAxisCall = d3.axisLeft(y)
                    //.tickFormat(d => (d / 1000).toFixed(1) + 'K');

    var xAxis = g.append('g').attr('transform', $translate(0, height));

    var yAxis = g.append('g');



    g.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-width", "3px")

    var gPopper = g.append('g').style('visibility', 'hidden');
    
    g.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'action-container')
        .attr('fill', 'none')
        .style('pointer-events', 'all')
        .on('mouseover', () => gPopper.style('visibility', 'visible'))
        .on('mouseout', () => gPopper.style('visibility', 'hidden'))
        .on('mousemove', mousemove);

    
    gPopper.append('line')
            .attr('class', 'yline')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('stroke-width', '1px')
            .attr('stroke', 'grey')
            .attr('stroke-dasharray', '3,3')

    gPopper.append('line')
            .attr('class', 'xline')
            .attr('y1', 0)
            .attr('y2', 0)
            .attr('stroke-width', '1px')
            .attr('stroke', 'grey')
            .attr('stroke-dasharray', '3,3')
    
    gPopper.append('circle')
            .attr('r', 10)
            .attr('fill', 'white')
            .attr('stroke', 'grey')
            .attr('stroke-width', 2);

    gPopper.append('text')
            .attr('x', 15)
            .attr('y', 5)
            .attr('fill', 'grey')
            .attr('font-size', 12);


    
            //.attr('stroke-dasharray', '3,3')
    
            // .attr('stroke', 'grey')
            // .attr('stroke-width', '1px');

    $(function() {
        $('#coin-select, #var-select').on('change', () => {
            update();
        })
    })

    var prevD, formatData;
    function mousemove() {
        if(!formatData) return;

        var loc = d3.mouse(this);
        var xloc = x.invert(loc[0]),
            yloc = y.invert(loc[1]);
        var idx = bisectDate(formatData, xloc, 1);
        if(idx == -1) return;

        var d = formatData[idx];
        if(!d) return;
        if(prevD == d) return;

        //console.log(bisectDate(formatData, xloc, 1), bisectDate(formatData, xloc, 0), bisectDate(formatData, xloc, 1))
        prevD = d;
        var yval = $("#var-select").val()
        gPopper.attr('transform', $translate(x(d.date), y(d[yval])));
        gPopper.select('.xline').attr('y2', height - y(d[yval]));
        gPopper.select('.yline').attr('x2', -x(d.date));
        gPopper.select('text').text(d[yval]);
        
        
    }
    
    
    function update() {
        var coin = $("#coin-select").val(),
            yValue = $("#var-select").val(),
            sliderValues = $("#date-slider").slider("values");


        formatData = allData[coin].filter(d => sliderValues[0] <= d['date_long'] && sliderValues[1] >= d['date_long']);

        var yExtent = d3.extent(formatData, d => d[yValue]);
        x = x.domain(d3.extent(formatData, d => d.date));
        y = y.domain(yExtent);

        var ylen = ((yExtent[0] + yExtent[1]) / 2).toFixed(0).length;
        
        var units = { unit: 1, char: '' }
        if(ylen >= 10) units = { unit: 1000000000, char: 'B' }
        else if(ylen >= 7) units = { unit: 1000000, char: 'M' }
        else if (ylen >= 4) units = { unit: 1000, char: 'K' }

        

        yAxisCall.tickFormat(d => ( d / units.unit ).toFixed(1) + units.char);

        var line = d3.line()
                .x(d => x(d.date))
                .y(d => y(d[yValue]));


        xAxisCall.scale(x);
        

        g.select('.line')
            .transition(t)
            .attr('d', line(formatData))

        xAxis.transition(t).call(xAxisCall);
        yAxis.transition(t).call(yAxisCall);

         g.select('.ylabel')
            .text(xLabelMap[yValue]);
    }

    d3.json("data/coins.json").then((data) => {
        var keys = Object.keys(data);
        var minDate = Infinity, maxDate = -Infinity;

        for(var i =0 ; i < keys.length; i ++) {
            data[keys[i]] = data[keys[i]].filter(d => d.date);
            data[keys[i]].forEach(d => {
                if(!d['24h_vol']) d['24h_vol'] = 0;
                if(!d['market_cap']) d['market_cap'] = 0;
                if(!d['price_usd']) d['price_usd'] = 0;

                d['24h_vol'] = +d['24h_vol'];
                d['market_cap'] = +d['market_cap'];
                d['price_usd'] = +d['price_usd'];
                d['date'] = parseTime(d['date']);
                d['date_long'] = +d['date'].getTime();

                if(minDate > d['date_long']) minDate = d['date_long'];
                if(maxDate < d['date_long']) maxDate = d['date_long'];
            })
        }


        var extentDates = [ minDate, maxDate ];

        allData = data;

        $("#date-slider").slider({
            range: true,
            min: extentDates[0],
            max: extentDates[1],
            step: 86400000, // One day 60 * 60 * 24
            values: [ extentDates[0], extentDates[1] ],
            slide: (event, ui) => {
                $("#dateLabel1").text(formatTime(new Date(ui.values[0])));
                $("#dateLabel2").text(formatTime(new Date(ui.values[1])));
                update();
            }
        });

        update();
        
    });


});