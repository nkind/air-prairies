var http = require('http');
const sqlite3 = require('sqlite3').verbose();

// Connect to database
let db = new sqlite3.Database('fantasticFour.db', (err) => {
    if (err){
        console.error(err.message);
    }
    console.log("Connected to fantastic four database at port 8888");
});

// query table
let sql = 'SELECT * FROM FantasticFour';

// create server and write
http.createServer(function(httpRequest, httpResponse) {
    httpResponse.writeHead(200, {'Content-Type' : 'text/plain'});
    httpResponse.write('Hello World!' + "\n\n");
    httpResponse.write('The Fantastic 4: ' +  "\n");
    db.all(sql, [], (err, rows) => {
        if (err) throw err;
        httpResponse.write('TEAM: ' + JSON.stringify(rows));
        httpResponse.write("\n");
        httpResponse.end();
    });
}).listen(8888);
