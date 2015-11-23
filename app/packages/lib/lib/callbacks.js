/**
 * Callback hooks provide an easy way to add extra steps to common operations.
 * @namespace Telescope.callbacks
 */
ShareBJ.callbacks = {};

/**
 * Add a callback function to a hook
 * @param {String} hook - The name of the hook
 * @param {Function} callback - The callback function
 */
ShareBJ.callbacks.add = function (hook, callback) {

    // if callback array doesn't exist yet, initialize it
    if (typeof ShareBJ.callbacks[hook] === "undefined") {
        ShareBJ.callbacks[hook] = [];
    }

    ShareBJ.callbacks[hook].push(callback);
};

/**
 * Remove a callback from a hook
 * @param {string} hook - The name of the hook
 * @param {string} functionName - The name of the function to remove
 */
ShareBJ.callbacks.remove = function (hookName, callbackName) {
    ShareBJ.callbacks[hookName] = _.reject(ShareBJ.callbacks[hookName], function (callback) {
        return callback.name === callbackName;
    });
};

/**
 * Successively run all of a hook's callbacks on an item
 * @param {String} hook - The name of the hook
 * @param {Object} item - The post, comment, modifier, etc. on which to run the callbacks
 * @param {Object} [constant] - An optional constant that will be passed along to each callback
 * @returns {Object} Returns the item after it's been through all the callbacks for this hook
 */
ShareBJ.callbacks.run = function (hook, item, constant) {

    var callbacks = ShareBJ.callbacks[hook];

    if (typeof callbacks !== "undefined" && !!callbacks.length) { // if the hook exists, and contains callbacks to run

        return callbacks.reduce(function(result, callback) {
            // console.log(callback.name);
            return callback(result, constant);
        }, item);

    } else { // else, just return the item unchanged
        return item;
    }
};

/**
 * Successively run all of a hook's callbacks on an item, in async mode (only works on server)
 * @param {String} hook - The name of the hook
 * @param {Object} item - The post, comment, modifier, etc. on which to run the callbacks
 * @param {Object} [constant] - An optional constant that will be passed along to each callback
 */
ShareBJ.callbacks.runAsync = function (hook, item, constant) {

    var callbacks = ShareBJ.callbacks[hook];

    if (Meteor.isServer && typeof callbacks !== "undefined" && !!callbacks.length) {

        // use defer to avoid holding up client
        Meteor.defer(function () {
            // run all post submit server callbacks on post object successively
            callbacks.forEach(function(callback) {
                // console.log(callback.name);
                callback(item, constant);
            });
        });

    } else {
        return item;
    }
};