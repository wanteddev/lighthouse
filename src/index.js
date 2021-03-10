const express = require('express');
const path = require('path');

const utils = require('./utils');
const constants = require('./constants');
const store = require('./store');
const routes = require('./routes');

const PORT = utils.common.checkEnvVar(constants.PORT);

const app = express();
require('run-middleware')(app);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const static_path = path.join(__dirname, "./static");
app.use(express.static(static_path));

app.use('/', routes);

app.listen(PORT, async function() {
    utils.common.logger.info(`bot listening on port ${PORT}!`);
    // On server startup, load all stored schedules and queue them to be run
    const list = await store.schedule.getScheduleList();
    for (let schedule of list) {
        utils.common.logger.debug(`scheduling job with id=${schedule._id}`);
        utils.schedule.scheduleJob(schedule, async function() {
            const options = {
                throttling: schedule.throttling,
                performance: schedule.performance,
                accessibility: schedule.accessibility,
                'best-practices': schedule['best-practices'],
                pwa: schedule.pwa,
                seo: schedule.seo,
            };

            app.runMiddleware('/init_audit', {
                method: 'POST',
                body: {
                    audit_url: schedule.audit_url,
                    user_id: schedule.user_id,
                    channel: schedule.channel,
                    options,
                }
            });
        });
    }
});
