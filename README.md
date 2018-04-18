#  auto-mitm

A simple tool to preform a mitm attack on a network using [mitmproxy](https://github.com/mitmproxy/mitmproxy), [dsniff 2.4](https://www.monkey.org/~dugsong/dsniff/)  and [nmap](https://nmap.org/)

# Install

## Git clone

```
https://github.com/x052/auto-mitm.git
```

##  Setup environment

1.  [Download and install Node.js](https://nodejs.org/download/)
    
2.  Navigate to the project directory and run  `npm install`  to install local dependencies listed in  `package.json`.
3. Install  [mitmproxy](https://github.com/mitmproxy/mitmproxy), [dsniff 2.4](https://www.monkey.org/~dugsong/dsniff/)  and [nmap](https://nmap.org/), this should be made easy by your package manager.

## Injecting custom JavaScript

This tool will try to inject arbitrary JavaScript into every web page the target visits,  in order to inject your own JavaScript code you need to modify the `payload.js` file.

## Usage
1.  Navigate to the project discretionary `cd auto-mitm`
2. Run the program with `node index` and supply the required arguments

```
  Usage: node index [options]

  Options:

    -V, --version               output the version number
    -i, --interface [value]     Interface to preform the attack on
    -g, --gateway [value]       Network default gateway
    -a, --attacker-ip [value]   Your local ip adress (to avoid arp spoofing yourself
    -n, --network-mask [value]  The network mask to scan for targets
    -h, --help                  output usage information
