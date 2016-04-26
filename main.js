/**
 * Created by jfont on 17/04/16.
 */
var Client = require('./Client.js');
var config = require('./configuration.json'); //només es llegeix una vegada, la resta es tira de caché. (eliminar require si es vol canviar)
var stdio = require('stdio');

var options = stdio.getopt({
    'clientports': {
        key: 'p',
        description: 'Port on enviar el tràffic',
        args: 1
    },
    'freq': {
        key: 'f',
        description: 'Freqüència a realitzar el primer SETUP',
        args: 1
    },
    'freqPlay': {
        key: '-q',
        description: 'Freqüència a realitzar el primer PLAY',
        args: 1
    },
    'pids': {
        key: 'P',
        description: 'Pids a demanar a la comanda',
        args: 1
    },
    'Type': {
        key: 't',
        description: 'DVB-S or DVB-T message',
        args: 1
    },
    'pol': {
        key: 'l',
        descriptions: 'Polarization',
        args: 1
    }

});

options.serverHost = config.Server.externServer; // Adreça servidor SAT>IP extern
options.serverPort = config.Server.externPort; // Port Servidor Sat>IP extern
options.Cseq = 1;
options.source = 1;
options.stream = 1;

if(options.pids == undefined){
    options.pids = '0';
}
if(options.pol == undefined){
    options.pol = 'h';
}
if(options.Type == undefined){
    options.Type = 's';
}
if(options.sr == undefined){
    options.sr = 22000;
}
if(options.fec == undefined){
    options.fec = 89;
}
Client.CreateRTSPClient(options);

