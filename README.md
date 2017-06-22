# Satip-client

### SAT>IP client for test rtsp communication with SAT>IP server.

## How to install: ##

From Source:

    git clone https://github.com/jfont555/satip-client

Install dependencies with:

    npm install

Use it like other node tools

## How to use it: ##

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

## Examples

    node index.js satips=192.168.1.30:554 cmd="?src=1&freq=11347&pol=v&ro=0.35&msys=dvbs2&mtype=8psk&plts=on&sr=22000&fec=23&pids=0,17,18,6600,6610,6620,6630" dst=192.168.1.32:12345

    node index.js satips=192.168.1.30:554 cmd="?src=1&freq=10773&pol=h&ro=0.20&msys=dvbs2&mtype=8psk&plts=on&sr=22000&fec=34&pids=0,17,18,96,255,259" dst=192.168.1.32:12345

    node index.js satips=192.168.1.31:554 cmd="?freq=11627&pol=v&msys=dvbs&sr=22000&pids=all" dst=224.0.0.5:1234 -c

## Motivate us!
Feel free to star the project and/or message me about it. It is always super-exciting to see real-world people using this , and it helps us to prioritize new features and bug fixes.

And if you find this useful, ensure that it is kept alive by donating:

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FVAPQNL7S9GRS)

## Check RTP stream: ##

**TReader:** RTPUnicast/12345

**VLC:** rtp://192.168.1.32:12345

**Save Stream** Use 'dumprtp' tool (dvbstream packet):

put dst=127.0.0.1:12345

Execute in a shell:

    dumprtp 127.0.0.1 12345 > capture.ts

## TO-DO

* Improve log
* Make a script to execute like: 'satipClient [args]'
* Change SETUP & PLAY behavior with pids=all. Send all pids with SETUP command. (Now it is send with PLAY addpids).
