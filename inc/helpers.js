exports.hhmm = function () {

const withZero = function (n) {
	if (n <= 9) return "0" + n;
	return n
}
const timeNow = function () {
	let d = new Date();
	return d.getFullYear() + "."
		+ withZero(d.getMonth() + 1) + "."
		+ withZero(d.getDate()) + ", "
		+ withZero(d.getHours()) + ":"
		+ withZero(d.getMinutes()) + ":"
		+ withZero(d.getSeconds());
}

return timeNow().slice(0,-3)
}
