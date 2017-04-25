<?php
/**
 * Created by PhpStorm.
 * User: Michael Kovalsky
 * Date: 4/24/2017
 * Time: 10:11 PM
 */

if(isset($_GET['reg']) && isset($_GET['hash']) && isset($_GET['cat'])) {

    $reg = $_GET['reg'];
    $hash = $_GET['hash'];
    $cat = $_GET['cat'];

    $dsn = 'mysql:host=localhost:3306;dbname=gis_term;charset=utf8';
    $user = 'root'; //Insert your username in here when testing.
    $pass = 'Jaljap2732!';//Insert your password in here when testing.
    $dbh = new PDO($dsn, $user, $pass);

    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);


    $sqlQuery = "SELECT * FROM tweet t WHERE t.category = ? AND t.region = ? AND t.tweet LIKE '%'".$hash."'%'";
    $execute = $dbh ->prepare($sqlQuery);
    $execute->execute(array($cat, $reg));

    $result = $execute->fetchAll();
    $rowCount = $execute->rowCount();

    $table = "<table class='table table-striped'>";
    $table .= "<thead><tr><th>Tweet</th><th>Category</th><th></th>Sentiment</tr></thead>";
    $table .= "<tbody>";
    foreach ($result as $item) {

        if(floatval($item['sentiment']) < -0.20 )
            $tr = "<tr style='background-color: red'><td>". $item['tweet']."</td>";
        if(floatval($item['sentiment']) > 0.20 )
            $tr = "<tr style='background-color: green'><td>". $item['tweet']."</td>";
        if(floatval($item['sentiment']) < 0.20 && floatval($item['sentiment']) > -0.20)
            $tr = "<tr style='background-color: yellow'><td>". $item['tweet']."</td>";

        $tr .= "<td>" . $item['category']."</td>";
        $tr .= "<td>" . $item['sentiment']."</td>";
        $tr .= "</tr>";
        $table .= $tr;

    }

    $table .= "</tbody>";
    $table .= "</table>";

    echo $table;



} else {
    echo "YOU DONE FUCKED IT UP!";
}