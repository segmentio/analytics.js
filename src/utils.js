// Type detection helpers, copied from
// [underscore](https://github.com/documentcloud/underscore/blob/master/underscore.js#L926-L946).
exports.isElement = function(obj) {
  return !!(obj && obj.nodeType === 1);
};


// A helper to track events based on the 'anjs' url parameter
exports.getUrlParameter = function (urlSearchParameter, paramKey) {
  var params = urlSearchParameter.replace('?', '').split('&');
  for (var i = 0; i < params.length; i += 1) {
    var param = params[i].split('=');
    if (param.length === 2 && param[0] === paramKey) {
      return decodeURIComponent(param[1]);
    }
  }
};