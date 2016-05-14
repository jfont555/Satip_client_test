/**
 * Created by jfont on 16/04/16.
 */
/* RTSP messages*/

exports.optionsMessage = function(options,cb){

    var msgOut = new String();
    msgOut += "OPTIONS rtsp://"+options.externServer+"/ RTSP/1.0\r\n";
    msgOut += "Cseq: "+options.Cseq+"\r\n";
    if(options.session !== undefined){
        msgOut +="Session: "+ options.session+"\r\n";
    }
    msgOut += "\r\n";
    cb(msgOut);
}
exports.setupMessageDVBT = function(options,cb){

    var msgOut = new String();
    msgOut += "SETUP rtsp://"+options.externServer+":"+options.serverPort+"/?freq="+options.freq;
    if(options.bw !== undefined){msgOut +="&bw="+options.bw;}
    msgOut += "&msys=dvbt;";
    if(options.tmode !== undefined){msgOut += "&tmode="+options.tmode;}
    if(options.mtype !== undefined){msgOut += "&mtype="+options.mtype;}
    if(options.gi !== undefined){msgOut += "&gi="+options.gi;}
    if(options.fec !== undefined){msgOut += "&fec="+options.fec;}
    msgOut += "&pids=0";
    msgOut += " RTSP/1.0\r\n";
    msgOut += "CSeq: "+options.Cseq+"\r\n";
    if(options.session !== undefined){
        msgOut += options.session+"\r\n";
    }
    msgOut += "Transport: RTP/AVP;";
    if(options.multicast) {
        msgOut += "multicast;";
        msgOut += "destination="+options.destination;
        var ports = options.port.split(/-/);
        msgOut += "port="+ports[0]+";port="+ports[1];
    }
    else{
        msgOut += "unicast;";
        msgOut += "client_port:"+options.port;
    }
   //  msgOut +="\r\n";
    msgOut += "\r\n";
    cb(msgOut);
}
exports.setupMessageDVBS = function(options,cb){

    var msgOut = new String();
    msgOut += "SETUP rtsp://"+options.externServer+":"+options.serverPort+"/?src="+options.src;
    if(options.fe !== undefined){msgOut += "&fe="+options.fe;}
    msgOut +="&freq="+options.freq+"&msys=dvbs&plts="+options.plts;
    if(options.fec !== undefined){msgOut += "&fec="+options.fec;}
    msgOut += "&pol="+options.pol+"&ro="+options.ro;
    if(options.sr !== undefined){msgOut += "&sr="+options.sr;}
    if(options.mtype !== undefined){msgOut += "&mtype="}//+options.mtype}
    msgOut += "&pids=0";
    msgOut += " RTSP/1.0\r\n";
    msgOut += "CSeq: "+options.Cseq+"\r\n";
    if(options.session !== undefined){
        msgOut += "Session: "+options.session+"\r\n";
    }
    //msgOut += "Transport: RTP/AVP;unicast;client_port: "+options.clientports+"\r\n";
    msgOut += "Transport: RTP/AVP;";
    if(options.multicast) {
        msgOut += "multicast;";
        if(options.destination !== undefined) {
            msgOut += "destination="+options.destination+";";
        }
        if(options.ttl == undefined) {
            msgOut += "port=" + options.port + "\r\n";
        }else{
            msgOut += "port=" + options.port +";ttl="+options.ttl+ "\r\n";
        }
    }
    else{
        msgOut += "unicast;";
        msgOut += "client_port="+options.port+"\r\n";
    }
    msgOut += "\r\n";
    cb(msgOut);
}
exports.teardownMessage =function(options,cb){
    var msgOut = new String();
    msgOut += "TEARDOWN rtsp://"+options.externServer+":"+options.serverPort+"/"+"stream="+options.stream+" RTSP/1.0\r\n";
    msgOut += "CSeq: "+options.Cseq+"\r\n";
    if(options.session !== undefined) {
        msgOut += "Session: " + options.session + "\r\n";
    }
    msgOut += "\r\n";
    cb(msgOut);
}

exports.playAddpids = function(options,cb){
    var msgOut = new String();
    msgOut += "PLAY rtsp://"+options.externServer+"/stream="+options.stream+"?addpids="+options.pids+" RTSP/1.0\r\n";
    msgOut += "Cseq: "+options.Cseq+"\r\n";
    if(options.session !== undefined) {
        msgOut += "Session: " + options.session+"\r\n";
    }
    msgOut += "\r\n";
    cb(msgOut);
}