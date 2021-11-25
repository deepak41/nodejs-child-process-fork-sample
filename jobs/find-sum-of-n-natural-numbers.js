// find sum of N natural numbers
function findSum() {
	var sum = 0;
	for (var i=0; i<10000000000; i++)
		sum += i;
	return sum;
}

function run() {
	var result = findSum();
	return result;
}

module.exports = {
	run: run
};
