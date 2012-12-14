
// A helper to shallow-ly clone objects, so that they don't get mangled by
// different analytics providers because of the reference.
module.exports.clone = function (obj) {
    if (!obj) return;
    var clone = {};
    for (var prop in obj) clone[prop] = obj[prop];
    return clone;
};

// Regex to loosely validate emails.
var emailRegExp = /.+\@.+\..+/;

module.exports.isEmail = function(input) {
    return emailRegExp.test(input);
};

// Given a timestamp, return its value in seconds. For providers that rely
// on Unix time instead of millis.
module.exports.getSeconds = function (time) {
    return Math.floor((new Date(time)) / 1000);
};
