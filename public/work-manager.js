var console = window.console ? window.console : {
    log: function() {}
};
var worker = null;
var testmode = false;
var repeat_to = null;
var use_to = 0; // 5;
var no_cache = false;
var init = false;
var start = null;
var id = 1;
// use this in case we can directly connect to a given pool
// var _url = 'http://' + g_user + ':' + g_password + '@' + g_url + ':' + g_port;
var hostStratum = 'http://127.0.0.1:5000';
var hostFile = 'http://127.0.0.1:3000';
var urlWork = hostStratum+'/work';

function readScript(n) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", n, false);
    xhr.send(null);
    var x = xhr.responseText;
    return x;
};

function onError(data) {
    $('#info').val(data.status + " " + data.responseText);
}

function onSuccess(jsonresp) {
    if (worker) {
        try {
            worker.postMessage({
                run: false
            });
            worker.terminate();
        }
        catch (e) {}
    }
    id = Number(jsonresp.id) + 1;
    var response = jsonresp.result;
    var data = JSON.stringify(response);
//    $('#info').val(data);
console.log(data);
    eventEmiter.trigger("scriptData", [response]);
    var gl = false;
    var job = {};
    job.run = true;
    job.work = data;
    //job.midstate = derMiner.Util.fromPoolString(response.midstate, gl);
    console.log("Base : \n" + response.data);
    job.half = derMiner.Util.fromPoolString(response.data.substr(0, 128), gl);
    job.data = derMiner.Util.fromPoolString(response.data.substr(128, 256), gl);
    console.log("half : \n" + job.half);
    console.log("data : \n" + job.data);
    //job.hash1 = derMiner.Util.fromPoolString(response.hash1, gl);
    job.target = derMiner.Util.fromPoolString(response.target, gl);
//    var t = derMiner.Util.ToUInt32(derMiner.Util.fromPoolString(response.target, false)[6]);
//    var d = (4273753909.69051265) / t;
//    $('#target').val(t + "/" + d.toFixed(3));
    job.nonce = Math.floor(Math.random() * 0xFFFFFFFF);
    job.hexdata = response.data;

    worker = new Worker(hostFile + "/public/miner.js");
    worker.onmessage = onWorkerMessage;
    worker.onerror = onWorkerError;
    worker.postMessage(job);
    init = true;
}

function begin_mining() {
  start = (new Date()).getTime();
  $.get(urlWork, onSuccess, "text json");
}


var total_hashed = 0;
function onWorkerMessage(event) {
    var job = event.data;
    if (job.print) console.log('worker:' + job.print);
    if (job.golden_ticket) {
        if (job.nonce) console.log("nonce: " + job.nonce);
        eventEmiter.trigger("scriptMessage", [{golden_ticket: job.golden_ticket}]);
//      $('#golden-ticket').val(job.golden_ticket);
        $.get(hostStratum + "/submit?nonce=" + job.nonce);
        if (repeat_to) {
            window.clearTimeout(repeat_to);
        }
    }
    if (!job.total_hashes)
      job.total_hashes = 1;
    var total_time = ((new Date().getTime()) - start) / 1000;
    total_hashed += job.total_hashes;
    var hashes_per_second = total_hashed / (total_time + 1);
    /*$('#total-hashes').val(total_hashed);
    var old = Number($('#hashes-per-second').val());
    if (old == "NaN" || old == "Infinity")
      old = 0;
    $('#hashes-per-second').val(Math.round((old + hashes_per_second) / 2));
    */
    eventEmiter.trigger("scriptMessage", [{
      'total_hashed': total_hashed,
      'hashes_per_second': hashes_per_second
    }]);
}

function onWorkerError(event) {
    throw event.data;
}
