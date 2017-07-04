
var console = window.console ?  window.console : { log: function() {} };
var worker = null;
var repeat_to = null;
var use_to = 5;
var no_cache = false;
var init = false;
var start = null;
var id = 1;
// use this in case we can directly connect to a given pool
// var _url = 'http://' + g_user + ':' + g_password + '@' + g_url + ':' + g_port;
var hostRPC = 'http://hamiyoca.antmine.io';
var hostFile = 'http://127.0.0.1:3000';
var _url = hostRPC + '/index.php';

function onError(data) {
    $('#info').val(data.status + " " + data.responseText);
}

function onSuccess(jsonresp) {
    if (worker) {
        try {
            worker.postMessage( { run: false } );
            worker.terminate();
            console.log("Erase Worker");
        } catch (e) {}
    }
    id = Number(jsonresp.id) + 1;
    var response = jsonresp.result;
    var data = JSON.stringify(response);

  //  $('#info').val(data);
    eventEmiter.trigger("scriptData", [response]);
    var job = {};
    job.run = true;
    job.work = data;

    job.midstate = derMiner.Util.fromPoolString(response.midstate);
    job.half = derMiner.Util.fromPoolString(response.data.substr(0, 128));
    job.data = derMiner.Util.fromPoolString(response.data.substr(128, 256));
    job.hash1 = derMiner.Util.fromPoolString(response.hash1);
    job.target = derMiner.Util.fromPoolString(response.target);

    /*var t = derMiner.Util.ToUInt32(derMiner.Util.fromPoolString(response.target, false)[6]);
    var d = (4273753909.69051265) / t;
    $('#target').val(t + "/" + d.toFixed(3));
*/

    job.nonce = Math.floor ( Math.random() * 0xFFFFFFFF );

    job.hexdata = response.data;


    worker = new Worker(hostFile+"/public/build/miner.min.js");
    worker.onmessage = onWorkerMessage;
    worker.onerror = onWorkerError;
    worker.postMessage(job);

    init = true;
}

function begin_mining() {
    start = (new Date()).getTime();

    if (use_to) {
        var enqueuMiner = function() {
            get_work();
            repeat_to = window.setTimeout(enqueuMiner, use_to * 1000);
        };
        repeat_to = window.setTimeout(enqueuMiner, 1000);
    } else {
        get_work(true);
        long_poll();
    }
}

var long_poll_suc = null;
function long_poll() {
  console.log("long_poll");
    var done = function(resp) {
        if (resp.result || long_poll_suc) {
            long_poll_suc = true;
            if (resp.result) {
                onSuccess(resp);
                // Workaround to allow the WebWorker to load all files from single threaded web servers like "php -S"
                window.setTimeout(long_poll, 1000);
            } else {
                long_poll();
            }

        } else if (long_poll_suc === null) {
            console.log('Stop polling!!!!');
            long_poll_suc = false;
            window.setInterval(get_work, 3 * 60 * 1000);
        }
    };

    $.ajax({ url: _url + "/long-polling" + (no_cache ? "?cache=0&ts=" + (new Date().getTime()) : ''),
             data: '{ "method": "long-poll", "id": "' + id + ' ", "params": [] }',
             type: "POST",
             headers: {
             },
             success: done,
             error: done,
             dataType: "json" });
}

function get_work() {
  console.log("get_work");

    $.post(_url + (no_cache ? "?cache=0&ts=" + (new Date().getTime()) : ''),
           '{ "method": "getwork", "id": "' + id + '", "params": [] }',
           onSuccess,
           "text json");
}
var total_hashed = 0;
function onWorkerMessage(event) {
    var job = event.data;

    if(job.print) console.log('worker:' + job.print);

    if (job.golden_ticket) {
        if (job.nonce) console.log("nonce: " + job.nonce);
        //$('#golden-ticket').val(job.golden_ticket);
        eventEmiter.trigger("scriptMessage", [{golden_ticket: job.golden_ticket}]);

        if (repeat_to) {
            window.clearTimeout(repeat_to);
        }
    }

    if (!job.total_hashes) job.total_hashes = 1;

    var total_time = ((new Date().getTime()) - start) / 1000;
    total_hashed += job.total_hashes;
    var hashes_per_second = total_hashed / (total_time+1);
    eventEmiter.trigger("scriptMessage", [{
          'total_hashed': total_hashed,
          'hashes_per_second': hashes_per_second
        }]);
/*    $('#total-hashes').val(total_hashed);
    var old = Number($('#hashes-per-second').val());
    if (old == "NaN" || old == "Infinity") old = 0;
    $('#hashes-per-second').val(Math.round((old + hashes_per_second) / 2));*/
}

function onWorkerError(event) {
	throw event.data;
}
