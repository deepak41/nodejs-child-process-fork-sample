var cp = require('child_process');
var cpus = require('os').cpus().length;


module.exports = function(worker) {
	var awaitingJobs = [];
	var readyPool = [];
	var poolSize = 0;

	return function runJob(job, cb) {
		if (!readyPool.length && poolSize > cpus)
			return awaitingJobs.push([ runJob, job, cb ]);

		var childProcess = readyPool.length ? readyPool.shift() : (poolSize++, cp.fork(worker));
		var cbTriggered = false;
		
		childProcess
			.removeAllListeners()
			.once('message', (msg) => {
				cb(null, msg);
				cbTriggered = true;
				readyPool.push(childProcess);
				if (awaitingJobs.length) setImmediate.apply(null, awaitingJobs.shift());
			})
			.once('error', (err) => {
				if (!cbTriggered) {
					cb(err);
					cbTriggered = true;
				}
				childProcess.kill();
			})
			.once('exit', () => {
				if (!cbTriggered)
					cb(new Error('childProcess exited with code: ' + code));
				poolSize--;
				var childProcessIdx = readyPool.indexOf(childProcess);
				if (childProcessIdx > -1) readyPool.splice(childProcessIdx, 1);
			})
			.send(job);
	}
}
