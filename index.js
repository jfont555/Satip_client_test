/**
 * Created by jfont on 17/04/16.
 */
var Client = require('./Client.js');
var stdio = require('stdio');
var VerEx = require('verbal-expressions');
var logger = require('winston');

var optionss = stdio.getopt({
    'multicast': {
        key: 'm',
        description: 'Multicast',
        args: 0
    },
    'verbosity': {
        key: 'v',
        description: 'Verbosity level, error: 0, verbose: 1, debug: 2',
        args: 1
    },
    'ttl': {
        key: 't',
        description: 'Time multicast',
        args: 1
    },
    'Commands': {
        key: 'c',
        description: 'Use command specified without parsing it',
        args: 0
    },
    'Port': {
        key: 'p',
        description: 'RTP port to be used by client, note that port+1 is used too. If is not defined destination port+2 will be used',
        args: 1
    },
    'info': {
        description: 'Available parameters:\n\n                                satips=SERVER_IP:SERVER_PORT' +
        '\n\n                                cmd="All_Parameters(eg:?freq=1234&msys=dvbs&fec=89"' +
        '\n\n                                dst=DESTINATION_IP:CLIENT_PORT (PORT TO SEND RTP traffic)\n\n'
    }
});
function Init(cb) {

    var options = { //According to satip specification (pag.43 update 8th jan 2015), this should be the default values for client queries.
        src: '1',
        ro: '0.35',
        mtype: 'qpsk',
        plts: 'off',
        serverPort: '554',
        Cseq: '1'
    };

    logger.add(logger.transports.File, {filename: 'logFile.log'});

    var colors = {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        verbose: 'brown',
        debug: 'blue'
    };

    logger.addColors(colors);


    if (process.argv.toString().match(/satips=/) && process.argv.toString().match(/cmd=/) && process.argv.toString().match(/dst=/)) {

        if (optionss.verbosity) {
            if (optionss.verbosity == 0) {
                logger.transports.Console.level = 'warn';
            } else if (optionss.verbosity == 1) {
                logger.transports.Console.level = 'info';
            } else if (optionss.verbosity == 2) {
                logger.transports.Console.level = 'debug';
            } else {
            }
        } else {
            logger.transports.Console.level = 'error'
        }
        options.logger = logger;

        process.argv.forEach(function (val) {
            if (val !== undefined) {
                var arrayAux = val.split(/=/);

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
                        if (serverIp[1] !== undefined) {
                            options.serverPort = serverIp[1];
                        } else {
                            options.serverPort = 554;
                        }
                        break;
                    case 'dst':
                        var destinationIP = arrayAux[1].split(/:/);
                        if (destinationIP[0] !== undefined) {
                            options.destination = destinationIP[0];
                        } else {
                            options.logger.error('ERROR Missing destination\n');
                            process.exit();
                        }
                        if (destinationIP[1] !== undefined) {
                            options.clientports = destinationIP[1] + "-" + (parseInt(destinationIP[1]) + 1);
                            if (optionss.Port !== undefined) {
                                options.destinationPorts = optionss.Port + "-" + (parseInt(optionss.Port) + 1);
                            } else {
                                options.destinationPorts = (parseInt(destinationIP[1]) + 2) + "-" + (parseInt(destinationIP[1]) + 3);
                            }
                        }
                        break;

                    case 'cmd':
                        if (val.split(/=/)[1].match(/\?/)) {
                            var comanda = val.slice(5).split(/&/);
                        } else {
                            var comanda = val.slice(4).split(/%/);
                        }
                        options.comanda = VerEx().find(/&pids=[\d*,*]*/).replace(val.slice(4), "");
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
                options.logger.error("Wrong parameters!\n");
                process.exit();
            }
        });


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
        cb(options);
    } else {
        options.logger.error("Wrong parameters!\n");
        process.exit();
    }
}

Init(function (initParameters) {
    Client.CreateRTSPClient(initParameters);
});

