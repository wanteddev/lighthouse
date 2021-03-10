const mongoose = require('mongoose');
const utils = require('../utils');

const schema = new mongoose.Schema({
    created_date: Number, // unix timestamp
    audit_url: String,
    user_id: String, // id of person who ran an audit
    report: String, // json formatted string of report object
});

const AuditModel = mongoose.model('Audit', schema);

async function createAudit(user_id, report, audit_url) {
    const new_audit = new AuditModel({
        created_date: utils.common.generateTimestamp(),
        audit_url,
        user_id,
        report,
    });

    const data = await new_audit.save();
    return data;
}

async function getAuditReport(id) {
    const audit = await AuditModel.findById(id);
    const report = JSON.parse(audit.report);
    return report;
}

async function getAuditReportsByUrl(url, reportNumber) {
    const audits = await AuditModel.find({audit_url: url}).sort({_id: -1}).limit(reportNumber || 5);
    return audits.reverse();
}

module.exports = {
    createAudit,
    getAuditReport,
    getAuditReportsByUrl
};
