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
  console.log(str);
  console.log(res);
  return res;
}

job.mrkl_root = returnString(job.mrkl_root);

job.prev_block = returnString(job.prev_block);
//job.prev_block = "17975b97c18ed1f7e255adf297599b55330edab87803c8170100000000000000"
//job.mrkl_root = "8a97295a2747b4f1a0b3948df39900344c0e19fa6b2b92b3a19c8e6badc141787"
function scanhash(job, nounce) {
  console.log(job);
  var nounce_str = nounce.toString(16);
  while (nounce_str.length < 8) {
    nounce_str = "0" + nounce_str;
  }
  console.log("nounce_str = " + nounce_str);
  var header = job.version
              + job.prev_block
              + job.mrkl_root
              + job.time
              + job.bit
              + nounce_str;
  console.log("job.header = " + header);
  job.header = derMiner.Util.fromPoolString(header, false);
  console.log("job.header = " + job.header);
  job.targetHex = derMiner.Util.fromPoolString(job.target, true);
  console.log("targetHex = " + job.targetHex);
  sha256.reset();
  var hash1 = sha256.update(job.header).state;
  console.log("hash1 = " +  derMiner.Util.toPoolString(hash1));
  sha256.reset();
  var hash2 = sha256.update(hash1).state;
  console.log("hash1 = " +  derMiner.Util.toPoolString(hash2));
}

scanhash(job, 15);

scanhash(job, 856192328);
