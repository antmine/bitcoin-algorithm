var sha256 = require("sha256");

var job = {
  version : "00000002",
  prev_block : "000000000000000117c80378b8da0e33559b5997f2ad55e2f7d18ec1975b9717",
  mrkl_root : "871714dcbae6c8193a2bb9b2a69fe1c0440399f38d94b3a0f1b447275a29978a",
  time : "53058b35",
  bit : "19015f53",
  target : "00000000000000015f5300000000000000000000000000000000000000000000"
};

function returnString (str) {
  var res = "";
  for (var i = 0; i < str.length; i += 2) {
    res = str[i] + str[i + 1] + res;
  }
  return res;
}

job.mrkl_root = returnString(job.mrkl_root);
job.prev_block = returnString(job.prev_block);

function BEToLE(str) {
  var res = "";
  for (var i = 0; i < 8; i+=2) {
    res = str[i] + str[i + 1] + res;
  }
  return res;//parseInt(res, 16);
}

function stringToInt(str) {
    var tmp = "";
    var res = [];
    for (var i = 0; i < str.length; i+=8) {
      tmp = str.substr(i, 8);
      res.push(parseInt(tmp, 16));
    }
    return res;
}

function intToHexString(str) {
  var res = str.toString(16);
  while (res.length < 8) {
    res = "0" + res;
  }
  return res;
}

function tabIntToString(tab) {
  var res = "";
  for (var i = 0; i < tab.length; i++) {
    res = res + intToHexString(tab[i]);
  }
  return res;
}

function intToChar(number) {
  var res = "";

  res += String.fromCharCode((number & 0xff000000) >> 24)
  res += String.fromCharCode((number & 0xff0000) >> 16)
  res += String.fromCharCode((number & 0xff00) >> 8)
  res += String.fromCharCode(number & 0xff)
  if (res.length != 4){
    console.error("Error : intToChar");
  }
  return res;
}

function tabtostr(tab){
  var res = "";
  for (var i = 0; i < tab.length; i++) {
    res += intToChar(tab[i]);
  }
  console.log(res.length);
  return res;
}

//function makeHash()

function scanhash(job, nounce) {
  var nounce_str = intToHexString(nounce);
  console.log("nounce str :"+nounce_str);
  var header = BEToLE(job.version)
              + job.prev_block
              + job.mrkl_root
              + BEToLE(job.time)
              + BEToLE(job.bit)
              + BEToLE(nounce_str);

  job.header = stringToInt(header);

  console.log("hash tab :" + sha256(tabtostr(job.header)));

  console.log(job.header);
  console.log("-"+tabtostr(job.header)+"-");
  var h1 = sha256(tabtostr(job.header));
  h1 = returnString(h1);
  console.log("hash1 : " + h1);
  var tmp = stringToInt(h1);

  h2 = sha256(tabtostr(tmp));
  console.log("hash2 : " + h2);
}

scanhash(job, 15);
scanhash(job, 856192328);
