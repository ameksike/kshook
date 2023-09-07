const kscryp = require('kscryp');
class Model {

    constructor() {
        this.cfg = {
            attr: {
                id: 'id',
                notifier: 'notifier',
                event: 'event',
                value: 'value',
                owner: 'owner',
                group: 'group',
                status: 'status'
            },
            model: {
                hook: 'hooks',
                event: 'events',
            }
        };
    }

    configure(cfg) {
        Object.assign(this, cfg);
        return this;
    }

    format(payload) {
        return payload;
    }

    subscribe(payload) {
        this.list[payload?.owner] = this.list[payload?.owner] || [];
        this.list[payload?.owner].push(payload);
    }

    unsubscribe(payload) {
        this.list[payload?.owner] = this.list[payload?.owner] || [];
        this.list[payload?.owner].push(payload);
    }

    /**
     * @description get the subscriptions list
     * @param {Object} payload 
     * @returns {Array} [{ group: String, owner: String, event: String, value: String|Object, notifier: String }]  
     */
    async subscriptions(payload) {
        try {
            if (!this.models || !this.models[this.cfg?.model?.hook]) {
                return [];
            }
            const model = this.models[this.cfg?.model?.hook];
            const where = {};
            payload?.event && (where[this.cfg?.attr?.event] = payload.event);
            payload?.owner && (where[this.cfg?.attr?.owner] = payload.owner);
            payload?.group && (where[this.cfg?.attr?.group] = payload.group);
            payload?.status && (where[this.cfg?.attr?.status] = payload.status);
            if (parseInt(payload.status) !== 0) {
                where[this.cfg?.attr?.status] = 1;
            }
            const res = await model.findAll({ where });
            return (res?.map && res.map(item => {
                let row = {
                    group: item[this.cfg?.attr?.group],
                    owner: item[this.cfg?.attr?.owner],
                    event: item[this.cfg?.attr?.event],
                    value: item[this.cfg?.attr?.value],
                    notifier: item[this.cfg?.attr?.notifier]
                };
                row.value = kscryp.decode(row.value, "json");
                return row;
            })) || [];
        }
        catch (error) {
            this.logger?.error({
                flow: payload?.flow || String(Date.now()) + "00",
                src: "KsHook:Subscriber:Model:subscriptions",
                error: error?.message || error,
                data: payload
            });
        }
    }

    async events(payload) {
        if (!this.models || !this.models[this.cfg?.model?.event]) {
            return [];
        }
    }
}

module.exports = Model;