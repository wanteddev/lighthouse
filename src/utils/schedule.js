const schedule = require('node-schedule');

function scheduleJob(s, job) {
    schedule.scheduleJob(s._id.toString(), s.schedule, () => {
        job();
    });
}

function removeJob(id) {
    schedule.cancelJob(id);
}

module.exports = {
    scheduleJob,
    removeJob
};
