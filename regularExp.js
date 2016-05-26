/**
 * Created by jfont on 17/04/16.
 */
var regularExp = function () {};

regularExp.prototype.SessionCheck = function (data){
    var sessionCheck = /Session: \w*/;
    //console.log("\nNUM SESSIO"+data.toString().match(sessionCheck));
    return (data.toString().match(sessionCheck));
};


regularExp.prototype.pids = function (data){
    var pids = /pids=\d*(\w*\d)*/
    //Falla segur en mes de un pid
    var pidds = data.toString().match(pids);
    return pidds;
};

regularExp.prototype.comStreamID = function (data) {
    var numStream = /com.ses.streamID: \d*/;
    var stream = data.toString().match(numStream);
    return stream.toString().slice(18);
}
exports.regularExp = new regularExp();