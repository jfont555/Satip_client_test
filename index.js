/**
 * Created by jfont on 17/04/16.
 */
var Client = require('./Client.js');
var stdio = require('stdio');
var sleep = require('sleep');
var VerEx = require('verbal-expressions');


var  optionss= stdio.getopt({
    'multicast': {
        key: 'm',
        description: 'Multicast',
        args: 0
    },
    'debug': {
        key: 'd',
        description: 'Show parsed Options',
        args: 1
    },
    'ttl': {
        key: 't',
        description: 'Time multicast',
        args: 1
    },
    'Commands' :{
        key: 'c',
        description: 'Use command specified without parsing it',
        args: 0
    },
    'info': {
        description: 'Available parameters:\n satips=SERVER_IP:SERVER_PORT\n cmd="All_Parameters(eg:?freq=1234&msys=dvbs&fec=89"\n' +
        ' dst=DESTINATION_IP:CLIENT_PORT (PORT TO SEND UDP traffic)'
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
if(process.argv.toString().match(/satips=/) && process.argv.toString().match(/cmd=/) && process.argv.toString().match(/dst=/)) {

    process.argv.forEach(function (val) {
        if (val !== undefined) {
            var arrayAux = val.split(/=/);
            console.log(arrayAux[0]);

            switch (arrayAux[0]) {
                case 'satips':
                    options.protocolType = 'satips';
                    var serverIp = arrayAux[1].split(/:/);
                    if (serverIp[0] !== undefined) {
                        options.externServer = serverIp[0];
                    }
                    else {
                        options.externServer = '127.0.0.1';
                    }
                    console.log("\nServer: " + options.externServer + ":" + options.serverPort);
                    if (serverIp[1] !== undefined) {
                        options.serverPort = serverIp[1];
                    } else {
                        options.serverPort = 554;
                    }
                    break;
                case 'dst':
                    var destinationIP = arrayAux[1].split(/:/);
                    if(destinationIP[0] !== undefined) {
                        options.destination = destinationIP[0];
                    }else{
                        console.log('ERROR Missing destination\n');
                        process.exit();
                    }if(destinationIP[1] !== undefined){
                        options.clientports = destinationIP[1]+"-"+(parseInt(destinationIP[1])+1);
                    }
                    break;

                case 'cmd':
                    if (val.split(/=/)[1].match(/\?/)) {
                        var comanda = val.slice(5).split(/&/);
                    } else {
                        var comanda = val.slice(4).split(/%/);
                    }
                    options.comanda = VerEx().find(/&pids=[\d*,*]*/).replace(val.slice(4),"");
                    comanda.forEach(function (val) {
                        var individual = val.split(/=/);

                        switch (individual[0]) {

                            case 'freq':
                                options.freq = individual[1];
                                break;
                            case 'fe':
                                options.fe = individual[1];
                                break;
                            case 'src':
                                options.src = individual[1];
                                break;
                            case 'pol':
                                options.pol = individual[1];
                                break;
                            case 'ro':
                                options.ro = individual[1];
                                break;
                            case 'msys':
                                options.msys = individual[1];
                                break;
                            case 'sr':
                                options.sr = individual[1];
                                break;
                            case 'fec':
                                options.fec = individual[1];
                                break;
                            case 'pids':
                                options.pids = individual[1];
                                break;
                            case 'mtype':
                                options.mtype = individual[1];
                                break;
                            case 'plts':
                                options.plts = individual[1];
                                break;

                            case 'bw':
                                options.bw = individual[1];
                                break;
                            case 'tmode':
                                options.tmode = individual[1];
                                break;
                            case 'gi':
                                options.gi = individual[1];
                                break;

                        }
                    });
                    break;
            }
        } else {
            console.log("Wrong parameters!\n");
            process.exit();
        }
    });

    console.log(options)

    console.log("\n### SATIPC Tool ###\n");

    if (optionss.multicast) {
        options.multicast = true;
    } else {
        options.multicast = false;
    }
    options.port = optionss.port;
    if (optionss.Commands) {
        options.commands = true;
    } else {
        options.commands = false;
    }

    sleep.sleep(2);
    Client.CreateRTSPClient(options);
}else{
    console.log("Wrong parameters!\n");
    process.exit();
}

