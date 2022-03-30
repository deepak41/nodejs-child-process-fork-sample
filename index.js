var express = require('express');
var workerPool = require('./worker-pool');
var runJob = workerPool('./worker');
const port = 3000;

var app = express();

app.get('/', (req, res) => {
	res.send('Hello World!')
});

app.get('/sum', (req, res) => {
	var path = "./jobs/find-sum-of-n-natural-numbers.js";
	runJob({path: path}, (err, data) => {
		if(err) return res.send('got an error:' + err.message);
		res.send(data);
	});
});

app.listen(port, () => console.log(`The server is running at localhost:${port}`))
