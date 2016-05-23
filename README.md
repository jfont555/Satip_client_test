# Satip_client_test
SAT>IP client for test rtsp communication with SAT>IP server.

How to install:

Download the project

install dependencies with:

npm install

Use it like other node tools

How to use it:

satips=(server IP):(Server Port/Default 554) cmd="?freq=1234&msys=dvbs&fec=89&pids=504,234,0,12 ..." dst=(Client for the stream):(client port)

-m --multicast: Boolean to indicate multicast

-t --ttl: time to live for multicast

-c --Commands: Force to construct the rtsp message without parsing arguments. Message will be constructed with string under double mark.

-d --debug: Show options parsed

-i --info: show some info

--help: All available args
