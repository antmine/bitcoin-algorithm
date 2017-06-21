var sha256 = require("sha256");

var job = {
  version : "00000002",
  prev_block : "000000000000000117c80378b8da0e33559b5997f2ad55e2f7d18ec1975b9717",
  mrkl_root : "871714dcbae6c8193a2bb9b2a69fe1c0440399f38d94b3a0f1b447275a29978a",
  time : "53058b35",
  bit : "19015f53",
  target : "00000000000000015f5300000000000000000000000000000000000000000000"
};
job.mrkl_root = Util.returnString(job.mrkl_root);
job.prev_block = Util.returnString(job.prev_block);

function scanhash(job, nounce) {
  var nounce_str = Util.intToHexString(nounce);
  console.log("nounce str :"+nounce_str);
  var header = Util.BEToLE(job.version)
              + job.prev_block
              + job.mrkl_root
              + Util.BEToLE(job.time)
              + Util.BEToLE(job.bit)
              + Util.BEToLE(nounce_str);

  var h1 = sha256(Util.decode(header));
  console.log("hash1 : " + h1);
  h2 = sha256(Util.decode(h1));
  console.log("hash2 : " + h2);

}

scanhash(job, 15);
scanhash(job, 856192328);
