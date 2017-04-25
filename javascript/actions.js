/**
 * Created by koval on 4/24/2017.
 */

function buttonClick() {
    $("#submission").submit(function(e) {
        e.preventDefault();
    });
    sendData();
}

function sendData() {

    var region = $("#region").val();
    var hashtag = $("#hashtag").val();
    var category = $("#category").val();

    var result;

    var positiveArray = [];
    var negativeArray = [];
    var neutralArray = [];

    var positiveAvg = 0.0;
    var negativeAvg = 0.0;
    var neutralAvg = 0.0;

    $.when(

        $.get("../php/PrintOutTweets.php",
            {
                reg: region,
                hash: hashtag,
                cat: category
            }, function (data) {

                $("#tweets").html(data);

            }),
        $.get("../php/ProduceGraphData.php",
            {
                reg: region,
                hash: hashtag,
                cat: category
            }, function (data_two) {


                result = JSON.parse(data_two);

                for(var i = 0; i < result.length; i++) {

                    console.log(result[i][0].score);

                    if(result[i][0].sentiment == 'negative') {
                        negativeArray.push(result[i][0].score);
                    }
                    if(result[i][0].sentiment == 'positive') {
                        positiveArray.push(result[i][0].score);
                    }
                    if(result[i][0].sentiment == 'neutral') {
                        neutralArray.push(result[i][0].score);
                    }
                }

                for(var k = 0; k < positiveArray.length; k++) {
                    positiveAvg += parseFloat(positiveArray[k]);
                }
                for(var j = 0; j < negativeArray.length; j++) {
                    negativeAvg += parseFloat(negativeArray[j]);
                }
                for(var l = 0; l < neutralArray.length; l++) {
                    neutralAvg += parseFloat(neutralArray[l]);
                }

                positiveAvg = positiveAvg/(positiveArray.length);
                negativeAvg = negativeAvg/(negativeArray.length);
                neutralAvg = negativeAvg/(neutralArray.length);

            })
    ).then(function () {



        drawGraph(positiveAvg, negativeAvg, neutralAvg, positiveArray, negativeArray, neutralArray);

    });

}

function drawGraph(posAvg, negAvg, neutAvg, posArr, negArr, neuArr) {

    var posAvgs = posAvg;
    var neutAvgs = neutAvg;
    var negAvgs = negAvg;
    var posArrs = posArr;
    var negArrs= negArr;
    var neuArrs = neuArr;


    console.log("Positive Avg: " + posAvg);
    console.log("Negative Avg: " + negAvg);
    console.log("Neutral Avg: " + neutAvg);

    //graph cannot display negative values.
    negAvgs = -1 * negAvgs;

    if(neutAvg < 0) {
        neutAvgs = -1 * neutAvgs;
    }

    //left graph is for avg sentiments
    $("#left-graph").highcharts({

        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: "Averages Pie Chart"
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Averages',
            colorByPoint: true,
            data: [{
                name: 'Negative Average',
                y: negAvgs
            }, {
                name: 'Positive Average',
                y: posAvgs
            }, {
                name: "Neutral Averages",
                y: neutAvgs
            }
            ]
        }]

    });

    //right is for total number
    $("#right-graph").highcharts({

        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: "Number of Occurrences"
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Count of Instances',
            colorByPoint: true,
            data: [{
                name: 'Negative Count',
                y: negArrs.length
            }, {
                name: 'Positive Count',
                y: posArrs.length
            }, {
                name: "Neutral Count",
                y: neuArrs.length
            }
            ]
        }]

    });


}