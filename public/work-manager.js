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
var _url = '/work';

function readScript(n) {
    var xhr = new XMLHttpRequest();(Math.round((old + hashes_per_second)
    xhr.open("GET", n, f(Math.round((old + hashes_per_second) alse);
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
    $('#info').val(data);

    var job = {};
    job.run = true;
    job.work = data;
    //job.midstate = derMiner.Util.fromPoolString(response.midstate, gl);
    //job.half = derMiner.Util.fromPoolString(response.data.substr(0, 128), gl);
    job.data = derMiner.Util.fromPoolString(response.data.substr(128, 256), gl);
    //job.hash1 = derMiner.Util.fromPoolString(response.hash1, gl);
    job.target = derMiner.Util.fromPoolString(response.target, gl);
//    var t = derMiner.Util.ToUInt32(derMiner.Util.fromPoolString(response.target, false)[6]);
//    var d = (4273753909.69051265) / t;
//    $('#target').val(t + "/" + d.toFixed(3));
    job.nonce = Math.floor(Math.random() * 0xFFFFFFFF);
    job.hexdata = response.data;

    worker = new Worker("/public/miner.js");
    worker.onmessage = onWorkerMessage;
    worker.onerror = onWorkerError;
    worker.postMessage(job);
    init = true;
}

function begin_mining() {
  start = (new Date()).getTime();
  $.get(_url, onSuccess, "text json");
}

function onWorkerMessage(event) {
    var job = event.data;
    if (job.print) console.log('worker:' + job.print);
    if (job.golden_ticket) {
        if (job.nonce) console.log("nonce: " + job.nonce);
        $('#golden-ticket').val(job.golden_ticket);
        $.get("/submit?nonce=" + job.nonce);
        if (repeat_to) {
            window.clearTimeout(repeat_to);
        }
    }
    if (!job.total_hashes) job.total_hashes = 1;
    var total_time = ((new Date().getTime()) - start) / 1000;
    var total_hashed = job.total_hashes + Number($('#total-hashes').val());
    var hashes_per_second = total_hashed / (total_time + 1);
    $('#total-hashes').val(total_hashed);
    var old = Number($('#hashes-per-second').val());
    if (old == "NaN" || old == "Infinity") old = 0;
    $('#hashes-per-second').val(Math.round((old + hashes_per_second) / 2));
}

function onWorkerError(event) {
    throw event.data;
}
