var version = "00000002";
var prev_block = "000000000000000117c80378b8da0e33559b5997f2ad55e2f7d18ec1975b9717";
var mrkl_root = "871714dcbae6c8193a2bb9b2a69fe1c0440399f38d94b3a0f1b447275a29978a";
var time = "53058b35";
var bit = "19015f53";

var exp = bits >> 24
var mant = bits & 0xffffff
var target_hexstr = '%064x' % (mant * (1<<(8*(exp - 3))))
var target_str = target_hexstr.decode('hex')



function scanhash(vesrion, prev_block, mrkl_root, time, bit) {
  var header =
}
