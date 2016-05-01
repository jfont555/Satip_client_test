# Satip_client_test
SAT>IP client for test rtsp communication with SAT>IP server.

How to:

satips=(server IP):(Server Port/Default 554) [args]

List of arguments:

freq=
fe=
src=
pol=
ro=
msys=
sr=
fec=
pids=
mtype=
bw=
tmode=
gi=

(eg: node index.js satips=192.168.1.2:554 freq=12727 pids=501,502,18 msys=dvbs pol=h sr=22000 fec=89 -p 52050-52051 -d 192.168.1.100)

-p Unicast RTP/RTCP port pair (eg: 52000-52001)
-m Boolean to indicate multicast
-P RTP/RTCP port pair for multicast session
-d Destination IP to send stream
