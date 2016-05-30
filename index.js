/**
 * Created by jfont on 17/04/16.
 */
var Client = require('./Client.js');
var stdio = require('stdio');
var VerEx = require('verbal-expressions');
var logger = require('winston');


console.log("\n\n\n");

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
    var loggerOptions = {
        colorize: true
    }

    logger.remove(logger.transports.Console);

    // Check if contains at least 3 important options to execute client
    if (process.argv.toString().match(/satips=/) && process.argv.toString().match(/cmd=/) && process.argv.toString().match(/dst=/)) {

        if (optionss.verbosity) { // Set logger levels
            if (optionss.verbosity == 0) {
                loggerOptions.level = 'warn';
            } else if (optionss.verbosity == 1) {
                loggerOptions.level = 'info';
            } else if (optionss.verbosity == 2) {
                loggerOptions.level = 'debug';
            } else {
            }
            logger.add(logger.transports.Console, loggerOptions);
        } else {
            loggerOptions.level = 'error'
            logger.add(logger.transports.Console, loggerOptions);
        }
        loggerOptions.filename = 'logFile.log'
        logger.add(logger.transports.File, loggerOptions);

        options.logger = logger;
        options.logger.info("Init SAT>IP RTSP-Client test\n\n");

        process.argv.forEach(function (val) { // Parse all the arguments, also args in cmd string
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
                    case 'dst': // Check destination IP & port, Also assign base port
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

                    case 'cmd': //Parse 'cmd=' arguments and assign to var
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
        if(!options.commands){
            if(options.msys == 'dvbt') {
                options.logger.debug("Parameters Parsed: Freq=" + options.freq+" mtype="+options.mtype+" pids="+options.pids+" fe="+options.fe+" bw="+options.bw+" tmode="+options.tmode+" gi="+options.gi+"\n");
            }else if (options.msys === 'dvbs' || options.msys === 'dvbs'){
                options.logger.debug("Parameters Parsed: Freq=" + options.freq+" mtype="+options.mtype+" fe="+options.fe+" pids="+options.pids+" pol="+options.pol+" src="+options.src+" plts="+options.plts+" ro="+options.ro+" fec="+options.fec+"\n");
            }
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

