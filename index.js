var worker = {};
worker.username = "SebastienLauret.BicraveBoy";
worker.password = "";

var serveurPool = {};
serveurPool.host = "stratum.slushpool.com";
serveurPool.port = 3333;


var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var curr_block = {};
var createHash = require('sha.js');
var sha256 = createHash('sha256');
var ba = require('binascii');


app.listen(port);
app.use('/public', express.static(__dirname + '/public'));

app.get('/work', function(req, res) {
    res.json({
        result: curr_block
    });
});
app.get('/submit', function(req, res) {
    client.stratumSubmit(worker_name, curr_block.job_id, curr_block.extranonce2, curr_block.ntime, req.query.nonce);
    res.json({
        error: null
    });
});


//communicate with bitcoin network via stratum tcp protocol
var Client = require('stratum').Client;
var client = Client.create();
client.on('mining.error', function(msg, socket) {
    console.log(msg);
});

// the client is a one-way communication, it receives data from the server after issuing commands
client.on('mining', function(data, socket, type) {
    // type will be either 'broadcast' or 'result'
    console.log('\n\nMining data (%s): %s', type, JSON.stringify(data));

    if (data.method === "notify") {
        curr_block.job_id = data.params[0];
        curr_block.extranonce2 = "00000000";
        curr_block.ntime = data.params[7];
        var coinbase = data.params[2] + curr_block.extranonce1 + curr_block.extranonce2 + data.params[3];
        var coinbase_hash_bin = sha256.update(sha256.update(coinbase, "hex").digest()).digest();        //compute the merkle root
        var merkle_branches = data.params[4];
        var merkle_root = coinbase_hash_bin;
        for (var i = 0; i < merkle_branches.length; i++) {
            merkle_root = sha256.update(sha256.update(merkle_root + ba.unhexlify(merkle_branches[i])).digest()).digest();
        }
        merkle_root = merkle_root.toString('hex');
        var version = data.params[5];
        var prevhash = data.params[1];
        var ntime = data.params[7];
        var nbits = data.params[6];
        var header = version + prevhash + merkle_root + ntime + nbits + '00000000' + '000000800000000000000000000000000000000000000000000000000000000000000000000000000000000080020000';
        curr_block.data = header;
        curr_block.target = "00000000ffff0000000000000000000000000000000000000000000000000000";
        console.log("computed block!");
    }
    else if (data.result) {
        curr_block.extranonce1 = data.result[1];
        curr_block.extranonce2_size = data.result[2];
        console.log('got subscription data');
    }
    if (!socket.authorized) {
        console.log('Asking for authorization');
        socket.stratumAuthorize("", '');
    }
    else {
        console.log("authorized");
    }
});
client.connect({
    host: serveurPool.host,
    port: serveurPool.port
}).then(function(socket) {
    console.log('Connected! subscribing');
    socket.stratumSubscribe();
});
