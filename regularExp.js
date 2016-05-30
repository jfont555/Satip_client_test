/**
 * Created by jfont on 17/04/16.
 */
var regularExp = function () {};

regularExp.prototype.SessionCheck = function (data){
    var sessionCheck = /Session: \w*/;
    return (data.toString().match(sessionCheck));
};


regularExp.prototype.pids = function (data){
    var pids = /pids=\d*(\w*\d)*/
    var pidds = data.toString().match(pids);
    return pidds;
};

regularExp.prototype.comStreamID = function (data) {
    var numStream = /com.ses.streamID: \d*/;
    var stream = data.toString().match(numStream);
    return stream.toString().slice(18);
}

regularExp.prototype.responseType = function (data){
    var responseTypr = /200 OK/;
    var response = data.toString().match(responseTypr);

    if(response === undefined || response === null){
        return false;
    }else{
        return true;
    }
}

exports.regularExp = new regularExp();