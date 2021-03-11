const path = require('path');

module.exports = {
    apps: [{
        name: 'lighthouse-bot',
        script: 'src/index.js',
        instances: 1,
        autorestart: true,
        watch: process.env.NODE_ENV !== 'production' ? path.resolve(__dirname) : false,
        node_args: ['--experimental-worker'],
        max_memory_restart: '1G',
        env: {
            PORT: 3001,
            TOKEN: 'xoxb-393798891191-dsadasdas-xxxxxxxxxxxxx',
            MONGO_USERNAME: 'root',
            MONGO_PASSWORD: 'test_passwd',
            MONGO_SERVER: '127.0.0.1:27017',
            CHATBOT_SERVER: 'https://localhost:3001',
            TZ: 'Asia/Seoul'
        }
    }]
};
