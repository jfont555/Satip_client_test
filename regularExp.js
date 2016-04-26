/**
 * Created by jfont on 17/04/16.
 */
var regularExp = function () {};

regularExp.prototype.isRTSP = function (data){
    var traficRtsp = /RTSP/;
    return (data.toString().match(traficRtsp));
};

regularExp.prototype.isHTTP = function (data){
    var httpCheck = /http/;
    return (data.toString().match(httpCheck));
}

regularExp.prototype.isOptions= function (data){
    var optionsRtsp = /OPTIONS rtsp/;
    return (data.toString().match(optionsRtsp));
};

regularExp.prototype.isCseq = function (data){
    var seqCheck = /CSeq: 1\r/;
    return (data.toString().match(seqCheck));
};

regularExp.prototype.isSetup = function (data){
    var setupCheck = /SETUP rtsp/;
    return (data.toString().match(setupCheck));
};

regularExp.prototype.isTeardown = function (data){
    var teardownCheck = /TEARDOWN rtsp/;
    return (data.toString().match(teardownCheck));
};

regularExp.prototype.isPlay = function (data){
    var playCheck = /PLAY rtsp/;
    return (data.toString().match(playCheck));
};
regularExp.prototype.isDvbt = function (data){
    var checkDvbt = /msys=dvbt/;
    return (data.toString().match(checkDvbt));
};

regularExp.prototype.Freq = function (data){
    var freqfrom = /freq=\d*/;
    return (data.toString().match(freqfrom));
};

regularExp.prototype.Ports = function (data){
    var checkPorts = /client_port=\d+\-\d+/;
    return (data.toString().match(checkPorts));
};
regularExp.prototype.Stream = function (data){
    var checkStream = /stream=\d*/;
    return (data.toString().match(checkStream));
};
regularExp.prototype.Src = function (data){
    var checkSrc = /src=\d*/;
    return (data.toString().match(checkSrc));
};
regularExp.prototype.SessionCheck = function (data){
    var sessionCheck = /Session: \w*/;
    //console.log("\nNUM SESSIO"+data.toString().match(sessionCheck));
    return (data.toString().match(sessionCheck));
};

regularExp.prototype.individualPorts = function (data,cb){
    var checkPorts = /client_port=\d+\-\d+/;
    var ports =  (data.toString().match(checkPorts));
    if(ports !== null) {
        ports = ports.toString().slice(12, 23);
        cb(ports.toString().split("-"));
    }
    else{
        cb(null);
    }
};

regularExp.prototype.pids = function (data){
    var pids = /pids=\d*(\w*\d)*/
    //Falla segur en mes de un pid
    var pidds = data.toString().match(pids);
    return pidds;
};

regularExp.prototype.afterTnr = function(data){
    var aftertnr = /tnr=\d(,\d*)*/;
    var after = data.toString().match(aftertnr);
    return after;
};

regularExp.prototype.SeqNum = function (data){
    var numSeq = /CSeq: \d*/;
    var num = data.toString().match(numSeq);
    return num;
};
regularExp.prototype.comStreamID = function (data) {
    var numStream = /com.ses.streamID: \d*/;
    var stream = data.toString().match(numStream);
    return stream.toString().slice(18);
}
exports.regularExp = new regularExp();