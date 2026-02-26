const https = require('https');
const fs = require('fs');

const data = JSON.stringify({
    Pid: 'a91f3f74-3c0b-4b47-97e8-1a9e466950b3',
    T: 12
});

const options = {
    hostname: 'sap-library.vercel.app',
    port: 443,
    path: '/api/replay-battle',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'Node.js'
    }
};

const req = https.request(options, (res) => {
    console.log('Status:', res.statusCode);
    let body = '';
    res.on('data', (d) => { body += d; });
    res.on('end', () => {
        console.log('Body length:', body.length);
        fs.writeFileSync('tmp/replay-battle-full.json', body);
        console.log('Saved to tmp/replay-battle-full.json');
    });
});

req.on('error', (e) => {
    console.error('Request Error:', e);
});

req.write(data);
req.end();
