
## Create a hook service in your project

For more information on how to create your custom hook service and how to use this notifier, see [Create a custom notifier ](./notifier.md).

```js
const KsHook = require("kshook");

// load your custom notifier 
const locator = require('./locator');

// load your logger services, it is not required
const logger = require('../services/log.service');

// load your database models using Sequelize
const { models, driver, manager } = require("../models/db");

// create singleton instance from Hook library
const hook = KsHook.get();

// set the custom notifier which implement a service locator pattern
hook.notifier.set({
    name: "locator",
    target: locator.inject({ logger })
});

// configure your subscriber handler based on Sequelize models
hook.subscriber.get("Model").configure({
    models,
    driver,
    manager,
    logger
});

// export your custom hook service
module.exports = hook;
```

For further information, check the following topics: 
- [Notifiers](./notifier.md)
- [Processors](./processor.md)
- [Subscribers](./subscriber.md)
- [Ksdp Hooks Model](https://github.com/ameksike/ksdp/blob/HEAD/doc/integration.hook.md)
- [Create a preconfigured hook service in your project.](./create.service.md)
- [Create a route/controller to handle hooks](./create.controllers.md)
