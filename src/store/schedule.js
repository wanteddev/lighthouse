const mongoose = require('mongoose');
const utils = require('../utils');

const schema = new mongoose.Schema({
    created_date: Number, // unix timestamp
    user_id: String, // id of person who registered a given schedule
    username: String,
    channel: String,

    // Audit options
    schedule: String,
    audit_url: String,
    performance: Boolean,
    accessibility: Boolean,
    'best-practices': Boolean,
    seo: Boolean,
    pwa: Boolean,
    throttling: Boolean,
    auth_header: String,
    cookie_name: String,
    cookie_value: String,
});

const ScheduleModel = mongoose.model('Schedule', schema);

async function createSchedule(payload) {
    const new_schedule = new ScheduleModel({
        created_date: utils.common.generateTimestamp(),
        user_id: payload.user_id,
        channel: payload.channel,
        username: payload.username,
        schedule: payload.schedule,
        audit_url: payload.audit_url,
        performance: payload.performance,
        accessibility: payload.accessibility,
        'best-practices': payload['best-practices'],
        seo: payload.seo,
        pwa: payload.pwa,
        throttling: payload.throttling,
        auth_header: payload.auth_header,
        cookie_name: payload.cookie_name,
        cookie_value: payload.cookie_value,
    });

    const data = await new_schedule.save();
    return data;
}

async function getSchedule(id) {
    const data = await ScheduleModel.findById(id);
    return data;
}

async function getScheduleList() {
    const list = await ScheduleModel.find();
    return list;
}

async function deleteScheduleWithId(id) {
    const data = await ScheduleModel.findByIdAndDelete(id);
    return data;
}

module.exports = {
    createSchedule,
    getSchedule,
    getScheduleList,
    deleteScheduleWithId,
};
