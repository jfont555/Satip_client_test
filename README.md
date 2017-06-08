# Satip-client

###SAT>IP client for test rtsp communication with SAT>IP server.

##How to install:##

From Source:

    git clone https://github.com/jfont555/satip-client

Install dependencies with:

    npm install

Use it like other node tools

##How to use it:##

satips=(server IP):(Server Port/Default 554) cmd="?freq=1234&msys=dvbs&fec=89&pids=504,234,0,12 ..." dst=(Client for the stream):(client port)

**-m --multicast:** Boolean to indicate to receive multicast stream from server.

**-t --ttl:** time to live for multicast

**-c --Commands:** Force to construct the rtsp message without parsing arguments. Message will be constructed with string under double mark.

**-i --info:** show some info

**-v --verbosity:** Verbosity level, info: 0, verbose: 1, debug: 2. Usage: -v {number}

**-l --logFile:** Save all log to a logFile

**-p --Port:** RTP port to be used by client, note that port+1 is used too. If is not defined destination port+2 will be used

**-l --logFile:** Save all log to a logFile

**--help:** All available args

There are some default parameters if are not specified: (User parameters override them)

    src: '1',
    ro: '0.35',
    mtype: 'qpsk',
    plts: 'off',
    serverPort: '554',

##Examples##

    node index.js satips=192.168.1.30:554 cmd="?src=1&freq=11347&pol=v&ro=0.35&msys=dvbs2&mtype=8psk&plts=on&sr=22000&fec=23&pids=0,17,18,6600,6610,6620,6630" dst=192.168.1.32:12345

    node index.js satips=192.168.1.30:554 cmd="?src=1&freq=10773&pol=h&ro=0.20&msys=dvbs2&mtype=8psk&plts=on&sr=22000&fec=34&pids=0,17,18,96,255,259" dst=192.168.1.32:12345

    node index.js satips=192.168.1.31:554 cmd="?freq=11627&pol=v&msys=dvbs&sr=22000&pids=all" dst=224.0.0.5:1234 -c


##Check RTP stream:##

**TReader:** RTPUnicast/12345

**VLC:** rtp://192.168.1.32:12345

**Save Stream** Use 'dumprtp' tool (dvbstream packet):

put dst=127.0.0.1:12345

Execute in a shell:

    dumprtp 127.0.0.1 12345 > capture.ts
    
    ##Contribution##
    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
">
<input type="image" src="https://www.paypalobjects.com/es_ES/ES/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal, la forma rápida y segura de pagar en Internet.">
<img alt="" border="0" src="https://www.paypalobjects.com/es_ES/i/scr/pixel.gif" width="1" height="1">
</form>



##TO-DO##

* Improve log
* Make a script to execute like: 'satipClient [args]'
* Change SETUP & PLAY behavior with pids=all. Send all pids with SETUP command. (Now it is send with PLAY addpids).
