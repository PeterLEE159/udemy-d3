/*
*    main.js
*    Mastering Data Visualization with D3.js
*    5.2 - Looping with intervals
*/

var margin = { left:80, right:20, top:50, bottom:100 };

var width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var flag = true;
    
var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// X Label
g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month");

// Y Label
var yLabel = g.append("text")
    .attr("y", -60)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue");
// X Scale
var x = d3.scaleBand()
        .range([0, width])
        .padding(0.2);

// Y Scale
var y = d3.scaleLinear()
        .range([height, 0]);

// X Axis

var xAxisGroup = g.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height +")");

    // Y Axis


var yAxisGroup = g.append("g")
                    .attr("class", "y axis");

var t = d3.transition().duration(750);

d3.json("data/revenues.json").then(function(data){
    // console.log(data);

    // Clean data
    data.forEach(function(d) {
        d.revenue = +d.revenue;
        d.profit = Number(d.profit);
    });

    
    
    var count = 3;
    var i =0;
    d3.interval(function(){
        i++;
        //if(count < i) return;

        var newarr = [data[0], data[1], data[3], data[4], data[5], data[6], 
            { month: 'August', revenue: 24631, profit: 17402 }, 
            { month: 'September', revenue: 74151, profit:  50956}
        ];
        var newData = flag ? data : newarr;
        update(newData);
        flag = !flag;
    }, 1000);

    update(data);
    
   
});


function update(data) {

    var value = flag ? 'revenue' : 'profit'
    x.domain(data.map(function(d){ return d.month }));
    y.domain([0, d3.max(data, function(d) { return d[value] })])

    var xAxisCall = d3.axisBottom(x);
    var yAxisCall = d3.axisLeft(y).tickFormat(d => "$" + d).ticks(5);

    xAxisGroup
        .transition(t)
        .call(xAxisCall);

    yAxisGroup
        .transition(t)
        .call(yAxisCall);

    

    // Bars
    var rects = g.selectAll("circle")
                    .data(data, d => d.month);

    rects.exit()
        .attr("fill", "red")
    .transition(t)
        .style('opacity', 0)
        .remove();
    
        
    
    rects.enter()
        .append("circle")
            .attr("cx", function(d){ return x(d.month) } )
            .attr("cy", function(d){ return y(d[value]); })
            .attr("r", d => x.bandwidth(d) / 10)
            .attr("fill", "grey")
            // AND UPDATE old elements present in new data.
            .merge(rects)
            .style('opacity', 0)
        .transition(t)
            .attr("cx", function(d){ return x(d.month) })
            .attr("cy", function(d){ return y(d[value]); })
            .style('opacity', 1)
            .attr("r", d => x.bandwidth(d) / 10)
            ;

    var yLabelVal = flag ? 'Revenu' : 'Profit' 
    yLabel.text(yLabelVal);

    
}


// function update(data) {

//     var value = flag ? 'revenue' : 'profit'
//     x.domain(data.map(function(d){ return d.month }));
//     y.domain([0, d3.max(data, function(d) { return d[value] })])

//     var xAxisCall = d3.axisBottom(x);
//     var yAxisCall = d3.axisLeft(y).tickFormat(d => "$" + d).ticks(5);

//     xAxisGroup
//         .transition(t)
//         .call(xAxisCall);

//     yAxisGroup
//         .transition(t)
//         .call(yAxisCall);

    

//     // Bars
//     var rects = g.selectAll("rect")
//                     .data(data, d => d.month);
    
//     console.log(rects)

//     rects.exit()
//         .attr("fill", "red")
//     .transition(t)
//         .attr("y", y(0))
//         .attr("height", 0)
//         .remove();
    
        
    
//     rects.enter()
//         .append("rect")
//             .attr("x", function(d){ return x(d.month) } )
//             .attr("width", x.bandwidth)
//             .attr("y", y(0))
//             .attr("height", 0)
//             .attr("fill", "grey")
//             // AND UPDATE old elements present in new data.
//             .merge(rects)
//         .transition(t)
//             .attr("x", function(d){ return x(d.month) })
//             .attr("width", x.bandwidth)
//             .attr("y", function(d){ return y(d[value]); })
//             .attr("height", function(d){ return height - y(d[value]); });
//             ;

//     var yLabelVal = flag ? 'Revenu' : 'Profit' 
//     yLabel.text(yLabelVal);

    
// }


function init(data) {

}