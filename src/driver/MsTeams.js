const axios = require('axios').default;
const ksdp = require('ksdp');
const kscryp = require('kscryp');

class MsTeams extends ksdp.integration.Dip {

    /**
     * @type {Console|null}
     */
    logger;

    constructor() {
        super();
        this.cfg = {
            url: process.env.CHANNEL_URL_OUT
        };
        this.cmd = new ksdp.behavioral.Command({});
        this.logger = null;
    }

    configure(cfg = {}) {
        cfg && Object.assign(this.cfg, cfg);
        return this;
    }

    /**
     * @description Register user account
     * @param {Object} payload
     * @param {String} [payload.title] 
     * @param {String} [payload.text] 
     * @param {String} [payload.subtitle] 
     * @param {Object} [payload.facts] 
     * @param {String} [payload.flow] 
     * @param {*} [payload.result] 
     * @param {Object} [opt] 
     * @param {String} [opt.url] 
     * @param {String} [opt.format] 
     * @param {String} [opt.flow] 
     * @returns {Promise<boolean>} status
     */
    async send(payload, opt = {}) {
        try {
            const url = opt?.url || this.cfg.url;
            const act = "format" + (opt?.format || "Simple");
            payload = this.cmd.run(act, [payload], this);
            await axios({ url, method: 'post', data: payload.result });
            return true;
        }
        catch (/** @type {any} */ error) {
            this.logger?.error({
                flow: opt?.flow || payload?.flow,
                src: "KsHook:Connector:MsTeams:send",
                message: error?.message,
                data: arguments
            });
            return false;
        }
    }

    /**
     * @description Structure the output with a simple format
     * @param {*} payload 
     * @returns {*} structure
     */
    formatSimple(payload) {
        return typeof (payload) === 'string' ? { text: payload } : payload;
    }

    /**
     * @description Structure the output items with a tuple format for MsgCard
     * @param {*} itm 
     * @returns {*} structure Item
     */
    formatMsgCardItem(itm) {
        let name = itm?.name || "Datos";
        let value = kscryp.encode(itm?.value || itm, "json");
        return { name, value }
    }

    /**
     * @description Structure the output items with an object format for MsgCard
     * @param {*} itm 
     * @returns {*} structure Item
     */
    formatMsgCardItemObj(itm) {
        let tmp = [];
        for (let i in itm) {
            let name = i;
            let value = kscryp.encode(itm[i], "json");
            tmp.push({ name, value });
        }
        return tmp;
    }

    /**
     * @description Structure the output with a card format
     * @param {Object} payload 
     * @param {Array<any>} [payload.facts] 
     * @param {String} [payload.themeColor] 
     * @param {String} [payload.summary] 
     * @param {String} [payload.sections] 
     * @param {String} [payload.title] 
     * @param {String} [payload.subtitle] 
     * @param {String} [payload.image] 
     * @param {String} [payload.text] 
     * @returns {*} structure
     */
    formatMsgCard(payload) {
        payload = payload || {};
        payload.facts = Array.isArray(payload.facts) ?
            payload.facts.map(itm => this.formatMsgCardItem(itm)) :
            this.formatMsgCardItemObj(payload?.facts);
        return {
            "@type": "MessageCard",
            "@context": "http://schema.org/extensions",
            "themeColor": payload.themeColor || "0076D7",
            "summary": payload.summary || "AUTH ALERT",
            "sections": payload.sections || [
                {
                    "activityTitle": payload.title || "Messaje title",
                    "activitySubtitle": payload.subtitle || "Messaje subtitle",
                    "text": payload.text || "",
                    "activityImage": payload.image || "",
                    "facts": payload.facts || [{ "name": "Dato 1", "value": "Valor 1" }],
                    "markdown": true
                }
            ]
        }
    }
}

module.exports = MsTeams;