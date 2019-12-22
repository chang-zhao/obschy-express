exports.withZero = function (n) {
	if (n <= 9) return "0" + n;
	return n
}
exports.myDateTime = function () {
	let d = new Date();
	let f = d.getFullYear() + "." + num.withZero(d.getMonth() + 1) + "." + num.withZero(d.getDate()) + ", "
	+ num.withZero(d.getHours()) + ":" + num.withZero(d.getMinutes()) + ":" + num.withZero(d.getSeconds());
	return f;
};
