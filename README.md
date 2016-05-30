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

**-m --multicast:** Boolean to indicate multicast

**-t --ttl:** time to live for multicast

**-c --Commands:** Force to construct the rtsp message without parsing arguments. Message will be constructed with string under double mark.

**-i --info:** show some info

**-v --verbosity:** Verbosity level, info: 0, verbose: 1, debug: 2. Usage: -v {number}

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

**Check RTP stream:**

**TReader:** RTPUnicast/12345

**VLC:** rtp://192.168.1.32:12345

**Save Stream** Use 'dumprtp' tool (dvbstream paquet):
put dst=127.0.0.1:12345

and execut in a shell:

    dumprtp 127.0.0.1 12345 > capture.ts



##TO-DO##

