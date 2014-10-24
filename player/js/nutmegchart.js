google.load("visualization", "1.1", {packages: ["corechart"]});
Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");


google.setOnLoadCallback(drawChart);
function drawChart() {
    data = [];
    data.push(['Datum', 'Beiner']);
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Datum');
    data.addColumn('number', 'Beiner');
    data.addColumn({type: 'number', role: 'annotation'});
    var options = {
        title: 'Beiner',
        seriesType: "bars",
        series: {
            1: {
                type: "line",
                visibleInLegend: false
            }
        },

        tooltip: {
            trigger: 'selection'
        }
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));

    function getDataForChart() {
        var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
        var trDates = Parse.Object.extend(teamName);
        var query = new Parse.Query(trDates);

        query.find({
            success: function (results) {
                // Do something with the returned Parse.Object values


                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    data.addRow([new Date(object.get('dateTraining')), parseInt(object.get('trPlayerCount')), parseInt(object.get('trPlayerCount'))]);

                }

                // Create a DataView that adds another column which is all the same (empty-string) to be able to aggregate on.
                var viewWithKey = new google.visualization.DataView(data);
                viewWithKey.setColumns([0, 1, {
                    type: 'string',
                    label: '',
                    calc: function (d, r) {
                        return ''
                    }
                }])

                // Aggregate the previous view to calculate the average. This table should be a single table that looks like:
                // [['', AVERAGE]], so you can get the Average with .getValue(0,1)
                var group = google.visualization.data.group(viewWithKey, [2], [
                    {
                        column: 1,
                        id: 'avg',
                        label: 'Durchschnitt',
                        aggregation: google.visualization.data.avg,
                        'type': 'number'
                    }
                ]);

                // Create a DataView where the third column is the average.
                var dv = new google.visualization.DataView(data);
                dv.setColumns([0, 1, {
                    type: 'number',
                    label: 'Durchschnitt',
                    calc: function (dt, row) {
                        return group.getValue(0, 1);
                    }
                }]);

                chart.draw(dv, options);
            },
            error: function (error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });
    }


    getDataForChart();


}