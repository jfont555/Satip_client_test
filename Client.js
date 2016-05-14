/**
 * Created by jfont on 16/04/16.
 */
var net = require('net');
var logger = require('./node_modules/logger/logger.js').createLogger('development.log'); ;
var messages = require('./messages_lib.js');
var regularUtils = require('./regularExp.js').regularExp;
var sleep = require('sleep');
var udpf = require('./udp_forward');


console.log("\nInit SAT>IP RTSP-Client test\n\n\n");
logger.debug({timestamp: Date.now()}, "Init SAT>IP RTSP-Client test");

var RTSPClient = function(Options) {

    var Client = new net.Socket();
    var State = 0; // State 0 = Initial; 1 = Setup; 2 = Play; 3 = Teardown
    var udpActive = false;

    Client.connect(Options.serverPort, Options.externServer, function () {
        logger.debug({timestamp: Date.now()}, "Conncetion to server established");
        console.log("Connected");
        messages.optionsMessage(Options, function (messageOptions){
            console.log("\nClient Message:\n"+messageOptions+" \n");
            Client.write(messageOptions);
            State = 0;
            Options.Cseq++;
        })
    });

    Client.on('data', function (data) {
        console.log("\nServer Response:\n"+data.toString());

        if(State == 0) {
            if (Options.msys === 'dvbt') {
                messages.setupMessageDVBT(Options, function (message) {
                    console.log("\nClient Message:\n"+message + "\n")
                    Client.write(message);
                    Options.Cseq++;
                    State = 5;
                });
            }
            else if (Options.msys === 'dvbs') {
                messages.setupMessageDVBS(Options, function (messageSETUP) {
                    sleep.sleep(1);
                    console.log("\nClient Message:\n"+messageSETUP);
                    Client.write(messageSETUP);
                    Options.Cseq++;
                    State = 5;
                });
            }
            return;
        }
        if(regularUtils.SessionCheck(data) !== null){
            var session = regularUtils.SessionCheck(data).toString().slice(9);
            if(Options.session !== session){
                Options.session = session;
            }
            if(State == 5){
                Options.stream = regularUtils.comStreamID(data);
            }
        }
        if(State == 5 && Options.session !== undefined){
            messages.playAddpids(Options, function(messagePlayAdd){
               console.log("\nClient Message:\n"+messagePlayAdd+"\n");
                Client.write(messagePlayAdd);
                State = 2;
            });
        }
        if(State == 2 && udpActive == false && !Options.multicast){
            var destinationPorts = Options.clientports.split(/-/);
            var udp1 = udpf.createUdpforward(Options.destination, destinationPorts[0], destinationPorts[0]);//Modificar ports a els reservats pel servidor
            var udp2 = udpf.createUdpforward(Options.destination, destinationPorts[1], destinationPorts[1]);
            udpActive = true;
        }
    });

    Client.on('end', function () {

    });
    Client.on('close', function(){
        console.log('Connection closed');
        process.exit();
    });

    Client.on('error', function(e){
        console.log('Connection Error');
        console.log(e);
        process.exit();
    });

    function connectionMant() {
        if (State == 2 && Options.session !== undefined){
            Options.Cseq++;
            messages.optionsMessage(Options, function(messageOpt){
                console.log("\nClient Message:\n"+messageOpt+"\n");
                Client.write(messageOpt);
            })
        }
    }
    setInterval(connectionMant, 20*1000);

    process.on('SIGINT', function() {
        console.log("Caught interrupt signal");
        if(Options.session !== undefined) {
            Options.Cseq++;
            messages.teardownMessage(Options, function (message) {
                Client.write(message);
                console.log(message);
                State = 3;
            });
        }
            process.exit();
    });

};

exports.CreateRTSPClient = function (Options) {
    return new RTSPClient(Options);
};