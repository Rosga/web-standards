const handler = require('serve-handler');
const http = require('http');
const fs = require('fs');


console.log('create server');
const folders = fs.readdirSync('./app').filter(folder => fs.existsSync('./app/' + folder + '/index.html'));
console.log('folders: ', folders);
fs.writeFileSync('./app/.structure.json', JSON.stringify(folders));
const server = http.createServer((request, response) => {


    // You pass two more arguments for config and middleware
    // More details here: https://github.com/vercel/serve-handler#options
    return handler(request, response, {
        public: './app'
    });
});

server.listen(3000, () => {
    console.log('Running at http://localhost:3000');
});

server.once('close', () => {
    console.log('remove structure json');
    fs.rmSync('./app/.structure.json');
});

process.on('SIGINT', function() {
    server.close();
  });