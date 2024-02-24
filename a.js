const { Client } = require('ssh2');
const { readFileSync } = require('fs');
const conn = new Client();

conn.on('ready', () => {
    console.log('Client :: ready');
    conn.exec('uptime; sleep 10; date', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
        }).on('data', (data) => {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
        });
    });
    conn.exec('uptime; sleep 10; date', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
        }).on('data', (data) => {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
        });
    });
}).connect({
    host: 'rayleigh.cipher.moe',
    port: 22,
    username: 'cipher',
    privateKey: readFileSync('/home/cipher/.ssh/rayleigh')
});