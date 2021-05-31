const {getScoreElement, logger} = require('./common');

function generateScheduleDetails(schedule, isInfo) {
    let blocks = [];
    const url_section = generateMarkdownSection(`*URL:* ${schedule.audit_url}`);
    blocks.push(url_section);

    const id_section = generateMarkdownSection(`*Schedule ID:* \`${schedule._id}\``);
    blocks.push(id_section);

    const creator_section = generateMarkdownSection(`*Creator:* @${schedule.username}`);
    blocks.push(creator_section);

    const channel_section = generateMarkdownSection(`*Channel:* ${schedule.channel}`);
    blocks.push(channel_section);

    const schedule_section = generateMarkdownSection(`*Schedule (CRON Format):* \`${schedule.schedule}\``);
    blocks.push(schedule_section);

    if (isInfo) {
        blocks.push({type: 'divider'});
        
        const options_title = generateMarkdownSection('Audit Options:\n');
        blocks.push(options_title);

        const throttling_text = generateBulletCheckbox('Throttling', schedule.throttling);
        const throttling_section = generateMarkdownSection(throttling_text);
        blocks.push(throttling_section);

        const performance_text = generateBulletCheckbox('Performance', schedule.performance);
        const performance_section = generateMarkdownSection(performance_text);
        blocks.push(performance_section);

        const accessibility_text = generateBulletCheckbox('Accessibility', schedule.accessibility);
        const accessibility_section = generateMarkdownSection(accessibility_text);
        blocks.push(accessibility_section);

        const best_practices_text = generateBulletCheckbox('Best Practices', schedule['best-practices']);
        const best_practices_section = generateMarkdownSection(best_practices_text);
        blocks.push(best_practices_section);

        const pwa_text = generateBulletCheckbox('PWA', schedule.pwa);
        const pwa_section = generateMarkdownSection(pwa_text);
        blocks.push(pwa_section);

        const seo_text = generateBulletCheckbox('SEO', schedule.seo);
        const seo_section = generateMarkdownSection(seo_text);
        blocks.push(seo_section);
    }

    return {
        blocks,
    };
}

function generateMarkdownSection(text) {
    return {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text,
        }
    };
}

function generateBulletCheckbox(key, value) {
    let text = '';
    if (value) {
        text += ':white_check_mark: ';
    } else {
        text += ':heavy_multiplication_x: ';
    }
    text += key;
    return text;
}

function generateAuditDialog(is_schedule) {
    let title = {
        type: 'plain_text',
        text: 'Run Lighthouse Audit',
    };
    let blocks = [];

    const url = {
        type: 'input',
        element: {
            type: 'plain_text_input',
            action_id: 'audit_url',
            placeholder: {
                type: 'plain_text',
                text: 'https://google.com'
            }
        },
        label: {
            type: 'plain_text',
            text: 'Audit URL'
        }
    };

    blocks.push(url);

    if (is_schedule) {
        title = {
            type: 'plain_text',
            text: 'Register Audit Schedule',
        };

        const schedule = {
			type: 'input',
			element: {
                type: 'plain_text_input',
                action_id: 'schedule',
				placeholder: {
					type: 'plain_text',
					text: '* * * * *',
				}
			},
			label: {
				type: 'plain_text',
				text: 'Schedule (CRON format)',
			}
		};
        blocks.push(schedule);
    }

    const auth_header = {
        type: 'input',
        optional: true,
        element: {
            type: 'plain_text_input',
            action_id: 'auth_header',
            placeholder: {
                type: 'plain_text',
                text: 'JWT ofma3103dSFNsUJasn311ndSN'
            }
        },
        label: {
            type: 'plain_text',
            text: 'Authorization Header'
        }
    };
    blocks.push(auth_header);

    const cookie_name = {
        type: 'input',
        optional: true,
        element: {
            type: 'plain_text_input',
            action_id: 'cookie_name',
            placeholder: {
                type: 'plain_text',
                text: 'jwt'
            }
        },
        label: {
            type: 'plain_text',
            text: 'Cookie Name'
        }
    };
    blocks.push(cookie_name);

    const cookie_value = {
        type: 'input',
        optional: true,
        element: {
            type: 'plain_text_input',
            action_id: 'cookie_value',
            placeholder: {
                type: 'plain_text',
                text: 'ofma3103dSFNsUJasn311ndSN...'
            }
        },
        label: {
            type: 'plain_text',
            text: 'Cookie Value'
        }
    };
    blocks.push(cookie_value);

    // Option dropdowns
    const options = {
        type: 'input',
        label: {
            type: 'plain_text',
            text: 'Audit Options',
        },
        element: {
            type: 'checkboxes',
            action_id: 'audit_options',
            initial_options: [],
            options: [],
        }
    };

    const throttling = generateCheckbox('Throttling', 'throttling');
    options.element.options.push(throttling);
    options.element.initial_options.push(throttling);

    const category_performance = generateCheckbox('Performance', 'performance');
    options.element.options.push(category_performance);
    options.element.initial_options.push(category_performance);

    const category_accessibility = generateCheckbox('Accessibility', 'accessibility');
    options.element.options.push(category_accessibility);

    const category_best_practices = generateCheckbox('Best Practices', 'best-practices');
    options.element.options.push(category_best_practices);

    const category_pwa = generateCheckbox('PWA', 'pwa');
    options.element.options.push(category_pwa);

    const category_seo = generateCheckbox('SEO', 'seo');
    options.element.options.push(category_seo);

    blocks.push(options);

    return {
        type: 'modal',
        callback_id: 'create_schedule',
        title,
        close: {
            type: 'plain_text',
            text: 'Close',
        },
        submit: {
            type: 'plain_text',
            text: 'Submit',
        },
        blocks,
    };
}

function generateReportAttachment(report, url, time, report_url) {
    let fields = [];
    let total_score = 0;
    let category_count = 0;
    const categories = report.categories;

    // Add scores per category
    for(const key in categories) {
        const category = categories[key];
        logger.debug(category);
        if (category && category.score) {
            total_score += category.score;
            category_count++;
            fields.push({
                short: true,
                title: category.title,
                value: `\`${Math.floor(category.score * 100)}\``
            });
        }
    }

    const avg_score = total_score / category_count;
    const color = getScoreElement(avg_score, 'color');

    // Add division
    fields.push({
        short: false,
        title: '',
        value: `---`
    });

    // Audits
    const audits = report.audits;
    const tti = generateAuditField(audits['interactive']);
    const fcp = generateAuditField(audits['first-contentful-paint']);
    const fmp = generateAuditField(audits['first-meaningful-paint']);
    const si = generateAuditField(audits['speed-index']);
    const fci = generateAuditField(audits['first-cpu-idle']);
    const mpfid = generateAuditField(audits['max-potential-fid']);

    fields.push(tti);
    fields.push(fcp);
    fields.push(fmp);
    fields.push(si);
    fields.push(fci);
    fields.push(mpfid);

    return {
        title: `Results for ${url}`,
        text: `Test started at: \`${time}\`\n\n<${report_url}|View full report here>`,
        color,
        fields
    };
}

function generateCheckbox(text, value) {
    return {
        text: {
            type: 'plain_text',
            text,
        },
        value,
    };
}

function generateAuditField(audit) {
    const emoji = getScoreElement(audit.score, 'emoji');

    return {
        short: true,
        title: audit.title,
        value: `${emoji} \`${audit.displayValue}\``
    };
}

module.exports = {
    generateAuditDialog,
    generateReportAttachment,
    generateScheduleDetails,
};
