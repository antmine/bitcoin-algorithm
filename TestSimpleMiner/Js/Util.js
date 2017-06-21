if (typeof(Util) == 'undefined')
  var Util = {};

Util = {
 returnString: function (str) {
    var res = "";
    for (var i = 0; i < str.length; i += 2) {
      res = str[i] + str[i + 1] + res;
    }
    return res;
  },
  BEToLE: function (str) {
    var res = "";
    for (var i = 0; i < 8; i+=2) {
      res = str[i] + str[i + 1] + res;
    }
    return res;//parseInt(res, 16);
  },
  intToHexString: function (str) {
    var res = str.toString(16);
    while (res.length < 8) {
      res = "0" + res;
    }
    return res;
  },
  decode: function (str){
    var res = "";
    for (var i = 0; i < str.length; i+=2) {
      res += String.fromCharCode(parseInt(str[i]+str[i+1], 16));
    }
    return  res;
  }
}
