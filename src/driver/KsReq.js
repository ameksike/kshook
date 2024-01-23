const kscryp = require('kscryp');
class KsReq {

    constructor() {
        this.drv = this.handler();
    }

    get(payload, headers = {}, options = {}) {
        return this.run(payload, headers, options);
    }

    post(payload, headers = {}, options = {}) {
        payload = (typeof payload === 'string' ? { url: payload } : payload) || {};
        payload.method = 'POST';
        return this.run(payload, headers, options);
    }

    put(payload, headers = {}, options = {}) {
        payload = (typeof payload === 'string' ? { url: payload } : payload) || {};
        payload.method = 'PUT';
        return this.run(payload, headers, options);
    }

    delete(payload, headers = {}, options = {}) {
        payload = (typeof payload === 'string' ? { url: payload } : payload) || {};
        payload.method = 'DELETE';
        return this.run(payload, headers, options);
    }

    async run(payload, headers = {}, options = {}) {
        try {
            payload = typeof payload === 'string' ? { url: payload } : payload;
            const opts = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                },
                ...options
            };

            if (payload.method && ['POST', 'PUT'].includes(payload.method)) {
                opts.method = payload.method;
                opts.body = kscryp.encode(payload.data, 'json');
            }

            const response = await this.drv.req(payload.url, opts);
            const data = this.drv.type === 'fetch' ? await response.json() : response.data;
            return { data };
        }
        catch (error) {
            return {
                error,
                payload,
                headers,
                options,
                version: process.version
            }
        }
    }

    handler() {
        try {
            return {
                type: 'fetch',
                req: fetch
            };
        }
        catch (error) {
            return {
                type: 'axios',
                req: require('axios')
            }
        }
    }
}

module.exports = KsReq;
