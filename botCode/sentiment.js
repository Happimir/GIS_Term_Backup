//all great things, start small

var mysql = require('mysql'); //mysql
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js'); //watson natural language processing. 
//dacd2a8f-6765-4925-9a67-b90aef0578ec
//plqnAWZXxGkH
var watson = new NaturalLanguageUnderstandingV1({
  'username': 'b4e6a34f-2207-43c0-9f12-a67cc535b21e',
  'password': 'JdpJlrrkiOCs',
  'version_date': '2017-02-27'
});

var parameters = {
          'text': '',

          'features': {
            'entities': {
              'emotion': false,
              'sentiment': true,
              'limit': 2
            },
            'keywords': {
              'emotion': false,
              'sentiment': true,
              'limit': 2
            }
          }
    }

var async = require("async");

var con = mysql.createConnection(
{
    
   host: "localhost",
   user: "root",
   port:"3306",
   password: "Jaljap2732!",
   dateStrings: true,
   datebase: "gis_term"
});

function doConnect() {
    con.connect(function(err) {
        if(err) {
            console.log("Error Connecting " + err);
        } else {
            console.log("DEUS VULT, INFIDEL!");
            populateArray();
        }
    });
}

var array = [];
function populateArray() {
    
    var iterator = 0;
    con.query("use gis_term");
    con.query("select * from tweet t where t.sentiment = 0;" , function(err, rows, fields) {
        if(err) {
            console.log("Select error: " + err);
        } else {
            
            for(var i in rows) {
                iterator++;
                array.push(rows[i].tweet);
                
                if(iterator == rows.length) {
                    console.log("iterator is: " + iterator);
                    console.log("Length is: " + rows.length);
                    console.log("array length is: " + array.length);
                    console.log("GOing to create sentiment")
                    createSentiment(array, 0);
                    
                }
            }
        }
    });
}

var watsonSentiment = [];
function createSentiment(result, index) {
    
    var localArray = result;
    console.log("In create sentiment");
    var iterator = 0;
    var innerIndex = index;
    var avg = 0;
    
    
    parameters.text = localArray[innerIndex];
    console.log("Text: " + parameters.text);
    //select * from tweet t where t.sentiment is null;
    //694
    watson.analyze(parameters, function(err, data) {
       
        if(err) {
            console.log("Error in Analyze: " + err);
            innerIndex++;
            watsonSentiment.push(0.50);
            createSentiment(localArray, innerIndex);
            
        } else {
            
            try {
            for(var i = 0; i < data['keywords'].length; i++) {
                iterator++;
                try {
                avg = avg + data['keywords'][i]['sentiment'].score;
                } catch(e) {
                    innerIndex++;
                    console.log(e);
                    watsonSentiment.push(0.50);
                }
            }
            
            if(iterator == data['keywords'].length) {
                avg = avg/(data['keywords'].length); 
                console.log("avg is: " + avg);
                watsonSentiment.push(avg);
                console.log("array length: " + watsonSentiment.length);
                innerIndex++;
                createSentiment(localArray, innerIndex);
            }
            } catch (e){
                console.log(e);
            }
            
        }
        
    });
    
    if(innerIndex == 530) {
        console.log("inserting to sql");
        insertIntoSQL(watsonSentiment);
    }
}

function insertIntoSQL(watsonArray) {
    
    var localArray = watsonArray;
    //var localIndex = myIndex;
    
    con.query("use gis_term");
    con.query("select * from tweet t where t.sentiment = 0;", function(err, rows) {
        if(err) {
            console.log("Selection error: " + err);
        } else {
            for(var k in rows) {
                con.query("use gis_term");
                 con.query("UPDATE tweet SET ? WHERE ?", [{sentiment: localArray[k]}, {id: rows[k].id}], function(err) {
                     if(err) {
                         console.log("Error in updating: " + err);
                     } else {
                         console.log("Successfully Updated");
//                         console.log("Recursion");
//                         insertIntoSQL(localArray);
                     }
                 });
            }
        }
    });
    
   
}

doConnect();