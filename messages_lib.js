/**
 * Created by jfont on 16/04/16.
 */
/* RTSP messages for communication */

exports.optionsMessage = function(options,cb){

    var msgOut = new String();
    msgOut += "OPTIONS rtsp://"+options.serverHost+"/ RTSP/1.0\r\n";
    msgOut += "Cseq: "+options.Cseq+"\r\n";
    if(options.session !== undefined){
        msgOut += options.session+"\r\n";
    }
    msgOut += "\r\n";
    cb(msgOut);
}
exports.setupMessageDVBT = function(options,cb){

    var msgOut = new String();
    msgOut += "SETUP rtsp://"+options.serverHost+":554/?freq="+options.freq+"&msys=dvbt&bw=8&pids="+options.pids;
    msgOut += " RTSP/1.0\r\n";
    msgOut += "CSeq: "+options.Cseq+"\r\n";
    if(options.session !== undefined){
        msgOut += options.session+"\r\n";
    }
    //msgOut += "Date: Sat, Jun 07 2014 12:22:43 GMT\r\n";
    msgOut += "Transport: RTP/AVP;unicast;client_port: "+options.clientports+"\r\n";
    msgOut += "\r\n";
    cb(msgOut);
}
exports.playMessageDVBT = function(options,cb){// server Address = extern server ip

    var msgOut = new String();
    msgOut += "PLAY rtsp://"+options.serverHost+":554/"+options.stream+"?"+options.source+"&"+options.freqPlay+"&msys=dvbt"+"\r\n";
    msgOut += "CSeq: "+options.Cseq+"\r\n";
    //msgOut += "Date: Sat, Jun 07 2014 12:22:43 GMT\r\n";
    if(options.session !== undefined) {
        msgOut += "Session: " + options.session + "\r\n";
    }
    cb(msgOut);
}

exports.setupMessageDVBS = function(options,cb){

    var msgOut = new String();
    msgOut += "SETUP rtsp://"+options.serverHost+":554/?src=1&freq="+options.freq+"&msys=dvbs&plts=off&fec="+options.fec+"&pol="+options.pol+"&ro=0.35&sr="+options.sr+"&mtype=&pids=0";
    msgOut += " RTSP/1.0\r\n";
    msgOut += "CSeq: "+options.Cseq+"\r\n";
    if(options.session !== undefined){
        msgOut += "Session: "+options.session+"\r\n";
    }
    //msgOut += "Date: Sat, Jun 07 2014 12:22:43 GMT\r\n";
    //msgOut += "Transport: RTP/AVP;unicast;client_port: "+options.clientports+"\r\n";
    msgOut += "Transport: RTP/AVP;unicast;client_port="+options.clientports+"\r\n";
    msgOut += "\r\n";
    cb(msgOut);
}
exports.playMessageDVBS = function(options,cb){

    var msgOut = new String();
    msgOut += "PLAY rtsp://"+options.serverHost+":554/"+options.stream+"?"+options.source+"&"+options.freqPlay+"&msys=dvbt"+"\r\n";
    msgOut += "CSeq: "+options.Cseq+"\r\n";
    //msgOut += "Date: Sat, Jun 07 2014 12:22:43 GMT\r\n";
    if(options.session !== undefined) {
        msgOut += "Session: " + options.session + "\r\n";
    }
    cb(msgOut);
}
exports.teardownMessage =function(options,cb){
    var msgOut = new String();
    msgOut += "TEARDOWN rtsp://"+options.serverHost+":"+options.serverPort+"/"+options.stream+" RTSP/1.0\r\n";
    msgOut += "CSeq: "+options.Cseq+"\r\n";
    if(options.session !== undefined) {
        msgOut += "Session: " + options.session + "\r\n";
    }
    msgOut += "\r\n";
    cb(msgOut);
}

exports.playAddpids = function(options,cb){
    var msgOut = new String();
    msgOut += "PLAY rtsp://"+options.serverHost+"/stream="+options.stream+"?addpids="+options.pids+" RTSP/1.0\r\n";
    msgOut += "Cseq: "+options.Cseq+"\r\n";
    if(options.session !== undefined) {
        msgOut += "Session: " + options.session+"\r\n";
    }
    msgOut += "\r\n";
    cb(msgOut);
}