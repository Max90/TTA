/**
 * Created by max on 01.10.14.
 */

var data = [
    ['Year', 'Sales', 'Expenses']
];
google.load("visualization", "1", {packages: ["corechart"]});


$(document).ready(function () {
    var temp = [2014, 500, 300];
    data.push(temp);
    console.log(data);


    google.setOnLoadCallback(drawChart);
    function drawChart() {
        data = google.visualization.arrayToDataTable(data);

        var options = {
            title: 'Company Performance'
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

        chart.draw(data, options);
    }
});