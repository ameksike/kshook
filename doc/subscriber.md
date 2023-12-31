# Subscriber

- Manages all data associated with events, defining the type of database to use and the required fields for each subscriber record.
- Interacts with different data storage sources (memory, databases, files, MySQL, MongoDB, Redis, etc.).
- Defines the data type and handles interactions with various data storage solutions.

By default KsHook provides support for the following subscribers:

- **Model**: Based on ORM models such as Sequelize, it allows the management of subscribers in relational databases.


## Start 

Install the library:

` npm install kshook`

Import the KsHook library

```js
const KsHook = require("kshook");
```

Create a KsHook instance

```js
const hook = KsHook.get();
```

## Model Subscriber

The DaoModel is equivalent to Sequelize models, the manager property of the SubscriberOption is the equivalent of the **Sequelize** class, and the driver property is the equivalent of a **Sequelize instance** or connection.

### Configuring the Model Subscriber with a Sequelize ORM

```js
const { Sequelize } = require("sequelize");

const connection = new Sequelize({
  dialect: "sqlite",
  storage: "path/to/database.sqlite",
});

const hooks = sequelize.define(
  "hooks",
  {
    id: {
      field: "id",
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    event: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    notifier: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    owner: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    group: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    }
  },
  {}
);

hook.subscriber.get("Model").configure({
  driver: connection,
  manager: Sequelize,
  models: [hooks],
});
```

## Structure

```js
class Subscriber {
  /**
   * @description Configure the model subscriber lib
   * @param {SubscriberOption} options
   * @returns {Subscriber} self reference
   */
  configure(options) {}

  /**
   * @description Get the event list
   * @param {Object} payload
   * @returns {Arrar<{name: String, description: String}>} list
   */
  async events(payload) {}

  /**
   * @description Get subscriptions list filtering by subscription
   * @param {Subscription} payload
   * @returns {Array<Subscription>} subscription
   */
  async subscriptions(payload) {}

  /**
   * @description Save subscription
   * @param {Subscription|Array<Subscription>} payload
   * @returns {Subscription|Array<Subscription>} subscribed
   */
  async subscribe(payload) {}

  /**
   * @description Remove subscription
   * @param {Subscription|Array<Subscription>} payload
   * @returns {Subscription|Array<Subscription>} unsubscription
   */
  async unsubscribe(payload) {}
}
```

```js
class Subscription {
    id: Number,
    event: String,
    value: String,
    notifier: String,
    group: Number,
    owner: Number,
    status: Number,
    processor: String,
    expression: String
}
```

```js
class SubscriberOption {
    // Model configuration
    cfg: {
        // Attributes names association
        attr: {
            id: 'id',
            notifier: 'notifier',
            event: 'event',
            value: 'value',
            owner: 'owner',
            group: 'group',
            status: 'status',
            processor: 'processor',
            expression: 'expression'
        },
        // Model names association
        model: {
            hook: "hooks",
            event: "events",
        }
    }
    // DaoModel list
    models: {
        [name: String]: DaoModel
    },
    // db manager or DaoManager class
    manager: DaoManager,
    // db connection or DaoManager instance
    driver: Object,
    // log manager
    logger: {
        error(ops: Object){},
        info(ops: Object){},
        debug(ops: Object){},
        log(ops: Object){}
    }
}
```

## Create a custom Subscriber

Register a custom or anonymous Subscriber named **NoSQLDB**

```js
hook.notifier.set({
  name: "NoSQLDB",
  target: class {
    configure(options) {}
    async events(payload) {}
    async subscriptions(payload) {}
    async subscribe(payload) {}
    async unsubscribe(payload) {}
  },
});
```
