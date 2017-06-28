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
var res1 = JSON.parse('{"error":null,"id":1,"result":[[["mining.set_difficulty","1"],["mining.notify","1"]],"23680500a3d3c1",4]}');
var res2 = JSON.parse('{"params":[2048],"id":null,"method":"set_difficulty"}');
var res3 = JSON.parse('{"params":[\
  "96db1",\
  "c3541cf325629e51d23bd74451e20afde805bb8400648e800000000000000000",\
  "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff4503e03407fabe6d6d0d4ceead2bfe162812e480fb107bc5bdd996fb0ec8b2d6a15e4aff7de00d6bb70100000000000000",\
  "b16d092f736c7573682f0000000001cfcd6060000000001976a9147c154ed1dc59609e3d26abb2df2ea3d587cd8c4188ac00000000",\
  ["36b4193c5af017268c900bdf4d08c24af9cfdaec9e5f10a42b0e115b2ee40a74","7911b98062a5f0613ceb1efc6d50d8b835e9737e23c031c73531c0273029cde8","f15a78ede7170b6ebb7faf06a2da3f028610882e2c254ba34e1c26900ae28ddf","6b5b3ed549ec2bac4185346abd00ca817dae8ec174e6b120f522058f9a7ff30f","d83e14b22f6eea89d68c2cffc3a634d63f88e9afa9f3cf4f6cb3dab8697b7d6e","94c35f4b4741f3de1ad9e05ebb27b99d4c0ba8863e8fc2dd11acb28a17a402df","6f374002efc6cc6d597b3f36ab60022dc77c49b88914c92775d9044946592c3d","ced6e43765c431f3fb1f1a86c2afb274a0ef2a98009b586bde98dd013189c046","b4b74f8369b1bf2448ed6412694001f454802deef168d787b36ca65baa02ce92","944253ac332a5b4dc6b8d11a5d51f25141342acc5b42965e31442a1ed1326be5","2e548871fd1e0cbbbf766c421d72af1622fb3c7ce208c43d736ce3f4a1ba9375","b032de512f1635b1dc595042a948c8c145ce85b9fee31a319608c865bc83ec2d"],\
  "20000002",\
  "18018b7e",\
  "594ab82a",\
  true],\
  "id":null,\
  "method":"notify"}');


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
console.log(currBlock.merkelRoot);
currBlock.header.version = res3.params[5];
currBlock.header.prevHash = res3.params[1];
console.log("reev : " + Util.returnString(res3.params[1]));
currBlock.header.time = res3.params[7];
currBlock.header.bits = res3.params[6];
currBlock.isCleanJob(res3.params[8]);

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
