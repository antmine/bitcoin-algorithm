
function CurrBlock() {
  this.sha256 = require('sha256');
  this.ba = require('binascii');

  this.jobId = "";
  this.target = 0;
  this.coinBase = {};
  this.coinBase.data = "";
  this.coinBase.extranonce1 = "";
  this.coinBase.extranonce2 = "";
  this.header = {};
  this.header.merkelRoot = "";
  this.header.version = "";
  this.header.prevHash = "";
  this.header.time = "";
  this.header.bits = "";

  this.setExtranonce2 = function(extranonce2Size) {
    for (var i = 0; i < extranonce2Size; i++) {
      this.coinBase.extranonce2 += "00";
    }
  }
  this.makeCoinBase = function(coinb1, coinb2) {
    if (this.coinBase.extranonce1 == undefined
        || this.coinBase.extranonce2 == ""
        || this.coinBase.extranonce2 == undefined
        || this.coinBase.extranonce2 == "") {
        console.error("Error : makeCoinBase function");
        return ;
    }
    this.coinBase.data = coinb1
                        + this.coinBase.extranonce1
                        + this.coinBase.extranonce2
                        + coinb2;
  }
  this.makeMerkelRoot = function(tabMerkelBranches) {
      var mrklRoot = this.sha256(Util.decode(this.sha256(Util.decode(this.coinBase.data))));
      for (var i = 0; i < tabMerkelBranches.length; i++) {
          mrklRoot = this.sha256(Util.decode(this.sha256(Util.decode(mrklRoot) + Util.decode(tabMerkelBranches[i]))));
      }
      this.header.merkelRoot = mrklRoot;//.toString('hex');
  }
  this.makeTarget = function(difficulty) {
    var targetBase= "0x0000ffff00000000000000000000000000000000000000000000000000000000";
    this.target = eval("("+targetBase+"/"+difficulty+").toString(16)");
  }
  this.isCleanJob = function(param){
    console.log(param);
    if (param) {
      this.header.cleanJob = '000000800000000000000000000000000000000000000000000000000000000000000000000000000000000080020000';
    }
  }

  return this;
}
