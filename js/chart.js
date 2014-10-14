/**
 * Created by max on 01.10.14.
 */
google.load("visualization", "1", {packages: ["corechart"]});
Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");


google.setOnLoadCallback(drawChart);
function drawChart() {
    data = [];
    data.push(['Datum', 'Spieler']);
    var tdata;
//    tdata.addColumn('date', 'Datum');
//    tdata.addColumn('number', 'Spieler');
    var options = {
        title: 'Spieler im Training',
        curveType: 'function'
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    function getDataForChart() {
        var teamName = Parse.User.current()['attributes']['teamname'] + "_trDates";
        var trDates = Parse.Object.extend(teamName);
        var query = new Parse.Query(trDates);

        query.find({
            success: function (results) {
                // Do something with the returned Parse.Object values
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    data.push([new Date(object.get('dateTraining')), parseInt(object.get('trPlayerCount'))]);
                }
                data.sort(function (x, y) {
                    return x > y;
                });
                console.log(data);
                tdata = new google.visualization.arrayToDataTable(data);
                chart.draw(tdata, options);
            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }

    getDataForChart();


}