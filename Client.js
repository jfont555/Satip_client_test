/**
 * Created by jfont on 16/04/16.
 */
var net = require('net');
var messages = require('./messages_lib.js');
var regularUtils = require('./regularExp.js').regularExp;
var udpf = require('./udp_forward');




var RTSPClient = function(Options) {

    var Client = new net.Socket();
    var State = 0; // State 0 = Initial; 1 = Setup; 2 = Play; 3 = Teardown
    var udpActive = false;

    Client.connect(Options.serverPort, Options.externServer, function () {
        Options.logger.info("Connection to server established");
        Options.logger.verbose("Connected to: "+Options.externServer);
        messages.optionsMessage(Options, function (messageOptions){
            Options.logger.debug(">>>Client Message:\n"+messageOptions.toString());
            Client.write(messageOptions);
            State = 0;
            Options.Cseq++;
        })
    });

    Client.on('data', function (data) {

        var responseStatus = null;
        responseStatus = regularUtils.responseType(data);
        if(responseStatus == false) {
            Options.logger.error("Response from server: Error code in response\n");
            Options.logger.debug("\n<<<\nServer Response:\n"+data.toString());
            process.exit();
        }else{
            Options.logger.verbose("Response from server: 200 OK response\n");
        }
        Options.logger.debug("\n<<<\nServer Response:\n"+data.toString());

        if(State == 0) {
            if (Options.msys === 'dvbt') {
                messages.setupMessageDVBT(Options, function (message) {
                    Options.logger.verbose("SETUP DVBT\n");
                    Options.logger.debug("\n>>>\nClient Message:\n"+message)
                    Client.write(message);
                    Options.Cseq++;
                    State = 5;
                });
            }
            else if (Options.msys === 'dvbs' || Options.msys === 'dvbs2') {
                messages.setupMessageDVBS(Options, function (messageSETUP) {
                    Options.logger.verbose("SETUP DVBS/DVBS2\n");
                    Options.logger.debug("\n>>>\nClient Message:\n"+messageSETUP);
                    Client.write(messageSETUP);
                    Options.Cseq++;
                    State = 5;
                });
            }else{
                messages.setupMessageGeneric(Options,function(messageGeneric){
                    Options.logger.verbose("SETUP Generic\n");
                    Options.logger.debug("\n>>>\nClient Message:\n"+messageGeneric);
                    Client.write(messageGeneric);
                    Options.Cseq++;
                    State = 5;
                })
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
                Options.logger.verbose("PLAY\n");
                Options.logger.debug(">>>\nClient Message:\n"+messagePlayAdd);
                Client.write(messagePlayAdd);
                State = 2;
            });
        }
        if(State == 2 && udpActive == false && !Options.multicast){
            var destinationPorts = Options.clientports.split(/-/);
            var clientDestination = Options.destinationPorts.split(/-/);
                Options.logger.verbose("Using Client ports: "+clientDestination[0]+"-"+clientDestination[1])
                var udp1 = udpf.createUdpforward(Options.destination, destinationPorts[0], clientDestination[0],Options.logger);//Modificar ports a els reservats pel servidor
                var udp2 = udpf.createUdpforward(Options.destination, destinationPorts[1], clientDestination[1],Options.logger);

            udpActive = true;
        }
    });

    Client.on('end', function () {

    });
    Client.on('close', function(){
        Options.logger.info('Connection closed');
        process.exit();
    });

    Client.on('error', function(e){
        Options.logger.error('Connection Error');
        process.exit();
    });

    function connectionMant() {
        if (State == 2 && Options.session !== undefined){
            Options.Cseq++;
            messages.optionsMessage(Options, function(messageOpt){
                Options.logger.verbose("OPTIONS ( Maintain Connection )\n");
                Options.logger.debug(">>>\nClient Message:\n"+messageOpt.toString());
                Client.write(messageOpt);
            })
        }
    }
    setInterval(connectionMant, 20*1000);

    process.on('SIGINT', function() {
        Options.logger.warn("Caught interrupt signal");
        if(Options.session !== undefined) {
            Options.Cseq++;
            messages.teardownMessage(Options, function (message) {
                Client.write(message);
                Options.logger.debug(message);
                State = 3;
            });
        }
            process.exit();
    });

};

exports.CreateRTSPClient = function (Options) {
    return new RTSPClient(Options);
};