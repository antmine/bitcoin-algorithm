var sha256 = require("sha256");
var currBlock = new CurrBlock();

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
console.log(job.prev_block);
/// JSon example stratum
var res1 = JSON.parse('{"id":1,"result":[[["mining.set_difficulty","b4b6693b72a50c7116db18d6497cac52"],["mining.notify","ae6812eb4cd7735a302a8a9dd95cf71f"]],"4bc6af58",4],"error":null}');
var res2 = JSON.parse('{"id":null,"params":[16],"method":"mining.set_difficulty"}');
var res3 = JSON.parse('{"id":null,"params":[\
  "58af8d8c",\
  "17975b97c18ed1f7e255adf297599b55330edab87803c8170100000000000000",\
  "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff4803636004062f503253482f04428b055308",\
  "2e522cfabe6d6da0bd01f57abe963d25879583eea5ea6f08f83e3327eba9806b14119718cbb1cf04000000000000000000000001fb673495000000001976a91480ad90d403581fa3bf46086a91b2d9d4125db6c188ac00000000",\
  ["ea9da84d55ebf07f47def6b9b35ab30fc18b6e980fc618f262724388f2e9c591","f8578e6b5900de614aabe563c9622a8f514e11d368caa78890ac2ed615a2300c","1632f2b53febb0a999784c4feb1655144793c4e662226aff64b71c6837430791","ad4328979dba3e30f11c2d94445731f461a25842523fcbfa53cd42b585e63fcd","a904a9a41d1c8f9e860ba2b07ba13187b41aa7246f341489a730c6dc6fb42701","dd7e026ac1fff0feac6bed6872b6964f5ea00bd8913a956e6b2eb7e22363dc5c","2c3b18d8edff29c013394c28888c6b50ed8733760a3d4d9082c3f1f5a43afa64"],\
  "00000002",\
  "19015f53",\
  "53058b41",\
  false\
],\
"method":"mining.notify"}');
var res4 = JSON.parse('{"id":2,"result":true,"error":null}');


/// Set var
////// data.result
currBlock.coinBase.extranonce1 = res1.result[1];
currBlock.setExtranonce2(res1.result[2]);
////// set_difficulty
currBlock.makeTarget(res2.params[0]);
////// notify
currBlock.jobId = res3.params[0];
currBlock.makeCoinBase(res3.params[2], res3.params[3]);
currBlock.makeMerkelRoot(res3.params[4]);
currBlock.header.version = res3.params[5];
currBlock.header.prevHash = res3.params[1]
currBlock.header.time = res3.params[7]
currBlock.header.bits = res3.params[6]

console.log("header : "+ JSON.stringify(currBlock.header));

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

//scanhash(job, 15);
//scanhash(job, 856192328);
