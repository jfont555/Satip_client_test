/**
 * Created by jfont on 16/04/16.
 */
var util = require('util');
var net = require('net');
var logger = require('./node_modules/logger/logger.js').createLogger('development.log'); ;
var messages = require('./messages_lib.js');
var regularUtils = require('./regularExp.js').regularExp;
var util = require('util');
var sleep = require('sleep');

//process.on("uncaughtException", function (e) {
//  console.log(e);
//});

//var serverHost = config.localproxy.serverHost;


console.log("\nInit SAT>IP RTSP-Client test\n\n\n");
logger.debug({timestamp: Date.now()}, "Init SAT>IP RTSP-Client test");

var RTSPClient = function(Options) {

    var Client = new net.Socket();
    var State = 0; // State 0 = Initial; 1 = Setup; 2 = Play; 3 = Teardown
    var Cseq = 1;
    Options
//console.log(Options.serverHost);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    var ClientState = false;
    process.stdin.on('data', function (text) {
        console.log('received data:', util.inspect(text));
        if (text === 'quit\n') {
            done();
        }
        if (Client.remoteAddress !== undefined){
            ClientState = true;
        }
        switch (text){
            case 'quit\n':
                done();
                break
            case 'play\n':
                console.log(ClientState);
                if(ClientState){
                    Options.Cseq++;
                    messages.playMessageDVBS(Options, function(message){
                        Client.write(message);
                        console.log(message);
                        State = 2;
                    });
                }
                break
            case 'setup\n':
                if(ClientState){
                    Options.Cseq++;
                    messages.setupMessageDVBS(Options, function(message){
                        Client.write(message);
                        //console.log(message);
                        State = 1;
                    })
                }
                break
            case 'options\n':
                if(ClientState){
                    Options.Cseq++;
                    messages.optionsMessage(Options, function (message) {
                        Client.write(message);
                        console.log(message);
                    })
                }
                break
            case 'teardown\n':
                if(ClientState){
                    Options.Cseq++;
                    messages.teardownMessage(Options, function(message){
                        Client.write(message);
                        console.log(message);
                        State = 3;
                    })
                }
                break
            default :

        }
    });

    function done() {
        console.log('Now that process.stdin is paused, there is nothing more to do.');
        process.exit();
    }


    Client.connect(Options.serverPort, Options.serverHost, function () {
        logger.debug({timestamp: Date.now()}, "Conncetion to server established");
        console.log("Connected");
        messages.optionsMessage(Options, function (messageOptions){
            console.log(messageOptions+" \n");
            Client.write(messageOptions);
            State = 0;
            Options.Cseq++;
        })
    });

    Client.on('data', function (data) {
        console.log(data.toString());

        if(State == 0) {
            if (Options.Type === 't') {
                messages.setupMessageDVBT(Options, function (message) {
                    console.log(message + "\n")
                    Client.write(message);
                    Options.Cseq++;
                    State = 5;
                });
            }
            else if (Options.Type === 's') {
                messages.setupMessageDVBS(Options, function (messageSETUP) {
                    sleep.sleep(1);
                    console.log(messageSETUP + "Enviant DVBS\n")
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
        if(State == 5){
            messages.playAddpids(Options, function(messagePlayAdd){
               console.log(messagePlayAdd+"\n");
                Client.write(messagePlayAdd);
                State = 2;
            });
        }
        console.log("End\n");
        //Quan rep qualsevol informació del server
    });

    Client.on('end', function () {

    });
    Client.on('close', function(){
        console.log('Connection closed');
    });

    Client.on('error', function(e){
        console.log('Error');
        console.log(e);
        process.exit();

    })
    function connectionMant() {
        if (State == 2){
            Options.Cseq++;
            console.log("maint_connect");
            messages.optionsMessage(Options, function(messageOpt){
                console.log("\n"+messageOpt+"\n");
                Client.write(messageOpt);
            })
        }
    }
    setInterval(connectionMant, 20*1000);

};

exports.CreateRTSPClient = function (Options) {
    return new RTSPClient(Options);
};