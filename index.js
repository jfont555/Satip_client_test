/**
 * Created by jfont on 17/04/16.
 */
var Client = require('./Client.js');
var stdio = require('stdio');
var sleep = require('sleep');


var  optionss= stdio.getopt({
    'clientports': {
        key: 'p',
        description: 'Provides the unicast RTP/RTCP port pair on which the client has chosen to recive the media stream and contol information',
        args: 1
    },
    'multicast': {
        key: 'm',
        description: 'Multicast',
        args: 0
    },
    'destination': {
        key: 'd',
        description: 'indicates the address to wich the stream will be sent.',
        args: 1
    },
    'ttl': {
        key: 't',
        description: 'Time multicast',
        args: 1
    }
});

var options = { //According to satip specification (pag.43 update 8th jan 2015), this should be the default values for client queries.
    src:'1',
    ro: '0.35',
    mtype: 'qpsk',
    plts: 'off',
    serverPort: '554',
    Cseq : '1'
}

process.argv.forEach(function (val) {
    var arrayAux = val.split(/=/);

    switch(arrayAux[0]){
        case 'satips':
            options.protocolType = 'satips';
            var serverIp = arrayAux[1].split(/:/);
            options.externServer = serverIp[0];
            console.log("\nExtern"+options.externServer+":"+options.serverPort);
            if(serverIp[1] !== undefined){
                options.serverPort = serverIp[1];
            }
            break;
        case 'freq':
            options.freq = arrayAux[1];
            break;
        case 'fe':
            options.fe = arrayAux[1];
            break;
        case 'src':
            options.src = arrayAux[1];
            break;
        case 'pol':
            options.pol = arrayAux[1];
            break;
        case 'ro':
            options.ro = arrayAux[1];
            break;
        case 'msys':
            options.msys = arrayAux[1];
            break;
        case 'sr':
            options.sr = arrayAux[1];
            break;
        case 'fec':
            options.fec = arrayAux[1];
            break;
        case 'pids':
            options.pids = arrayAux[1];
            break;
        case 'mtype':
            options.mtype = arrayAux[1];
            break;

        case 'bw':
            options.bw = arrayAux[1];
            break;
        case 'tmode':
            options.tmode = arrayAux[1];
            break;
        case 'gi':
            options.gi = arrayAux[1];
            break;
    }
});

console.log("\n### SATIPC Tool ###\n");

options.clientports = optionss.clientports;
if (optionss.multicast){
    options.multicast = true;
}else{options.multicast = false;}
options.port = optionss.port;
options.destination = optionss.destination;

    sleep.sleep(2);
Client.CreateRTSPClient(options);

