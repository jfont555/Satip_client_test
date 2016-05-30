/**
 * Created by jfont on 01/05/16.
 */

var UdProxy = function(toAddress, toPort, localPort,logger) {
    this.toAddress = toAddress;
    this.toPort = toPort;
    this.localPort = localPort;

    var proxy = require('udp-proxy'),


        options = {
            address: this.toAddress,
            port: this.toPort,
            localaddress: '0.0.0.0',
            localport: this.localPort,
            timeOutTime: 5000
        };
// This is the function that creates the server, each connection is handled internally
    var server = proxy.createServer(options);
    var traffic = false;
    var infoTraffic = false;

    function traficCheck() {
        if (traffic){
            if(!infoTraffic) {
                logger.info("UDP proxy is sending data...");
                infoTraffic = true;
            }else {

                logger.verbose("UDP proxy is sending data...");
                traffic = false;
            }
        }
    }


// this should be obvious
    server.on('listening', function (details) {
        logger.info('Listening on: ', details.server.family + '  ' + details.server.address + ':' + details.server.port);
        logger.info('traffic is forwarded to ' + details.target.family + '  ' + details.target.address + ':' + details.target.port);
        setInterval(traficCheck, 10*1000);
    });

// 'bound' means the connection to server has been made and the proxying is in action
    server.on('bound', function (details) {
        //console.log('proxy is bound to ' + details.route.address + ':' + details.route.port);
        //console.log('peer is bound to ' + details.peer.address + ':' + details.peer.port);
    });

// 'message' is emitted when the server gets a message
    server.on('message', function (message, sender) {
        traffic = true;
        //console.log('message from ' + sender.address + ':' + sender.port);
    });

// 'proxyMsg' is emitted when the bound socket gets a message and it's send back to the peer the socket was bound to
    server.on('proxyMsg', function (message, sender) {
        //console.log('answer from ' + sender.address + ':' + sender.port);
    });

// 'proxyClose' is emitted when the socket closes (from a timeout) without new messages
    server.on('proxyClose', function (peer) {
        //console.log('disconnecting socket from ' + peer.address);
    });

    server.on('proxyError', function (err) {
        logger.error('ProxyError! ' + err);
    });

    server.on('error', function (err) {
        logger.error('Error! ' + err);
    });
}
exports.createUdpforward= function (toAddress, toPort, localPort, logger) {
    return new UdProxy(toAddress, toPort, localPort, logger);
};