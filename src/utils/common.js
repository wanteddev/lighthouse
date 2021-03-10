const logger = {
    debug: function(message) {
        const timestamp = generateCurrentTime();
        console.log('\x1b[36m%s\x1b[0m', `[DEBU]: ${timestamp} - ${message}`);
    },
    
    error: function(message) {
        const timestamp = generateCurrentTime();
        console.error('\x1b[31m%s\x1b[0m', `[ERRO]: ${timestamp} - ${message}`);
    },

    info: function(message) {
        const timestamp = generateCurrentTime();
        console.log('\x1b[32m%s\x1b[0m', `[INFO]: ${timestamp} - ${message}`);
    },
};

function checkEnvVar(variable) {
    if (process.env[variable]) {
        return process.env[variable];
    }

    logger.error(`Error: the environment variable ${variable} has not been set!`);
    process.exit(1);
}

function generateCurrentTime() {
    return new Date().toLocaleTimeString([], {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h24'});
}

function generateTimestamp() {
    return Math.floor(new Date() / 1000);
}

function getScoreElement(score, type) {
    let color = '#0BCE6B';
    let emoji = ':white_check_mark:';
    if (score >= 0 && score < 0.5) {
        color = '#FF4F42';
        emoji = ':x:';
    } else if (score >= 0.5 && score < 0.9) {
        color = '#FFA400';
        emoji = ':warning:';
    }
    return type === 'color' ? color : emoji;
}

module.exports = {
    logger,
    checkEnvVar,
    generateTimestamp,
    generateCurrentTime,
    getScoreElement,
};
