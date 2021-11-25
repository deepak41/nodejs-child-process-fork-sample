process.on('message', (job) => {
	job = require(job.path);
	var result = job.run();
	process.send({msg: result});
});
