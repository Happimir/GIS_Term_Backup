var fs = require('fs');
var mysql = require('mysql');

var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  'username': 'f3550111-bd50-4e5f-8d44-8f0cc493c05e',
  'password': 'XSG0rEW0UOlB',
  'version_date': '2017-02-27'
});


var con = mysql.createConnection(
{
    
   host: "localhost",
   user: "root",
   port:"3306",
   password: "Jaljap2732!",
   dateStrings: true,
   datebase: "gis_term"
});

var Stext ='Death to all the muslims, death to IBMs godawful documentation as well. It must have been written by a fool!'
var parameters = {
  'text': Stext,

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

function doConnect() {
    
    con.connect(function(err) {
        if(err) {
            console.log("Sorry Fam, error connecting");
        }else {
            console.log("Connection Successful")
        }
    });
}

var mysql = require("mysql");
var async = require("async");
var dbSize;

/*
    The idea of this function is simple, it will keep running and it will test to see the size of the database. If the database size is changed then it will know that new data 
    has been added, and that we need update what we have. 
*/


function calculateSentiment() {
    
    natural_language_understanding.analyze(parameters, function(err, data) {
        if (err)
            console.log('error:', err);
        else {
            var myData = JSON.stringify(data, null, 2);
            //console.log(myData[0][0][0]);
            //var json = JSON.stringify(JSON.parse(data));
            //console.log("Score: " + json);
            
            //var prsed = (JSON.parse(data));
            
            var iterator = 0;
            for(var i = 0; i < data['keywords'].length; i++) {
                iterator++;
               console.log("Parsed: " + data['keywords'][i]['sentiment'].score);
            }
            
            console.log("Data Length: " + data['keywords'].length);
            console.log("Iterator: " + iterator);
            }
        }
    ); 
}

function checkDataBaseSize() {
    
    doConnect();
    
    var count;
    var iterator = 0;
    
    fs.readFile('databasesize.txt', 'utf8', function (err, data) {
       
        if(err) {
            console.log("Error Reading File: " + err);
        } else {
            dbSize = parseInt(data, 10);
            
            
            con.query("use gis_term");
            con.query("SELECT count(*) AS count FROM tweet", function(err, rows, fields) {
        
                if(err) {
                    console.log("Error Querying Table For Size: " + err);
                } else {
                    for(var i in rows) {
                        
                        count = parseInt(rows[i].count, 10);
                        console.log('Count is: '+ count);
                        console.log("Db FIle SIze: " + dbSize);
                        
                        if(count != dbSize) {
                            console.log("Our Count Is not the same");
                            
                            con.query('use gis_term');
                            con.query("SELECT * FROM tweet", function(err, row) {
                                
                                if(err) {
                                    console.log("Error in updating " + err);
                                } else {
                                    
                                    console.log("Number of results: " + row.length);
                                    for(var j in row) {
                                        
                                        con.query("UPDATE tweet SET  ? WHERE ?", [{sentiment: 0.45}, {id: row[j].id}], function(err) {
                                            if(err) {
                                                console.log("error: " + err);
                                            } else {
                                                iterator++;
                                                console.log("Scccessfully updated");
                                                console.log("iterator " + iterator);
                                                if(iterator == row.length) {
                                                    process.exit();
                                                }
                                                
                                            }
                                        });
                                    }
                                   
                                }
                            });
                        }
                    }
                }
            });
        }   
    });
}

calculateSentiment();
//setInterval(checkDataBaseSize, 30000);
