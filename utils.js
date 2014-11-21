/*
 * @module Utils
 * @desc Javascript utility snippets.
 * @requires {@linkplain http://underscorejs.org/|underscore}
 * @requires {@linkplain https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise|Promise}
 *
 * @license   The MIT License (MIT)
 * @copyright Copyright (c) 2014 Takeharu Oshida <georgeosddev@gmail.com>
 */

// For command line test
(function(global, _, Promise, undefined) {
  "use strict";

  if (typeof _ === "undefined" || typeof Promise === "undefined") {

    if (typeof module !== "undefined" && module.exports) {
      /*jshint -W079 */
      _            = require("underscore");
      Promise      = require("es6-promise").Promise;
      /*jshint +W079 */
    } else{
      // // underscorify
      // // https://github.com/georgeosddev/devtools-snippets
      // (function () {
      //   var _InUse = !!window._;
      //   if (_InUse) return false;
      //   var s = document.createElement('script');
      //   s.setAttribute('src', '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js');
      //   document.body.appendChild(s);
      // })();
      if (global.console && global.console.log) return console.error("Missing dependency, this utility needs underscore.js & es6-promise");
    }
  }

  var previousUtils = global.Utils;

  /**
   * Javascript utility snippets
   * @namespace Utils
   * @static
   */
  var Utils = {};

  /**
   * Run function on nextTick
   * @function
   * @memberof Utils
   * @static
   * @param {function} f This function will be executed on next tick
   */
  var nextTick = function(func){
    setTimeout(func, 0);
  };
  Utils.nextTick = nextTick;


  /**
   * Return promised object
   * @function
   * @memberof Utils
   * @static
   * @param {function} f This function is called as f(done, reject, {array of arguments})should call `done` and `reject`.
   * @param {Any} args arguments for f..
   * @return {Promise} promise thenable object
   * @example
   *
   *  var heavyTask = function(done, reject, args){
   *    var cnt = args[0]
   *    var idx = 1;
   *    var limit = 1000;
   *    var result = 0;
   *    while (cnt--){
   *       try {
   *         if (idx > limit) throw new Error("limit over")
   *         result = result + idx;
   *         idx++
   *       } catch (e) {
   *         reject(e);
   *       }
   *    }
   *    done(result);
   *  }
   *
   *  willBeSuccess = Utils.defer(heavyTask, 1000);
   *  willBeSuccess.then(
   *    function(result){console.log("1000 success", result);},
   *    function(error) {console.log("1000 fail",    error);}
   *  );
   *  willBeFail    = Utils.defer(heavyTask, 1001);
   *  willBeFail.then(
   *    function(result){console.log("1001 success", result);},
   *    function(error) {console.log("1001 fail",    error);}
   *  );
   *
   */
  var defer = function() {
    var args     = Array.prototype.slice.apply(arguments),
        f        = args[0],
        realArgs = args.slice(1)
        ;
    return new Promise(function(done, reject) {
      return f(done, reject, realArgs);
    });
  };
  Utils.defer = defer;


  /**
   * Return promised object
   * @function
   * @memberof Utils
   * @static
   * @param {function} f This function is called as f(done, reject, {arguments}...)should call `done` and `reject`.
   * @param {Any} args arguments for f.
   * @return {Promise} promise thenable object
   */
  var deferApply = function() {
    var args     = Array.prototype.slice.apply(arguments),
        f        = args[0],
        realArgs = args.slice(1)
        ;
    return new Promise(function(done, reject) {
      return f.apply(null, [done, reject].concat(realArgs));
    });
  };
  Utils.deferApply = deferApply;

  /**
   * Run function queue
   * @see https://gist.github.com/georgeOsdDev/6914757
   * @function
   * @memberof Utils
   * @static
   * @return {Object} queue
   */
  var queueing = function(){
    var q = (function(){
      var cbs = [];
      return {
        next: function(){
          if (_.isFunction(_.head(cbs))){
            var func = _.head(cbs);
            cbs = _.tail(cbs);
            func.apply(this, Array.prototype.slice.apply(arguments));
          }else{
            void 0;
          }
        },
        push:function(func){
          cbs.push(func);
        },
        debug:function(){return cbs;}
      };
    })();
    return q;
  };
  Utils.queueing = queueing;

  /**
   * Browser-friendly inheritance fully compatible with standard node.js inherits<br>
   * This method have Side-effect
   * @see https://github.com/isaacs/inherits
   * @function
   * @memberof Utils
   * @static
   * @param {Function} ctor constructor
   * @return {Function} superCtor constructor of superClass
   */
  var inherits = function(ctor, superCtor) {
    if (typeof Object.create === "function") {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    } else {
      ctor.super_ = superCtor;
      var TempCtor = function () {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }
  };
  Utils.inherits = inherits;

  /**
   * Return cloneed object
   * @function
   * @memberof Utils
   * @static
   * @param {Object} obj
   * @return {Object} cloned
   */
  var clone = function(obj) {
    if (null === obj || "object" !== typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  };
  Utils.clone = clone;

  /**
   * Return deep cloneed object
   * @function
   * @memberof Utils
   * @static
   * @param {Object} obj
   * @return {Object} deepCloned
   */
  var deepClone = function(obj) {
    if (null === obj || "object" !== typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        if (typeof obj[attr] === "object") {
          copy[attr] = deepClone(obj[attr]);
        } else {
          copy[attr] = obj[attr];
        }
      }
    }
    return copy;
  };
  Utils.deepClone = deepClone;
  Utils.previousUtils = deepClone(previousUtils);

  /**
   * return prefixed logger.
   * @function
   * @memberof Utils
   * @static
   * @param {prefix}
   * @return {Object} logger
   */
  var createLogger = function(prefix, loglevel) {
    var lookup = {
      "log": 4,
      "debug": 3,
      "info": 2,
      "warn": 1,
      "error": 0,
    };
    var _logger = {
      log: function() {},
      debug: function() {},
      info: function() {},
      warn: function() {},
      error: function() {}
    };
    var level = lookup[loglevel + "".toLowerCase()] || 5;
    if (!global.console) return _logger;

    if (level > 3 && global.console.log && global.console.log.bind) {
      _logger.log = (function() {
        return global.console.log.bind(global.console, prefix);
      })();
    }

    if (level > 2 && global.console.debug && global.console.debug.bind) {
      _logger.debug = (function() {
        return global.console.debug.bind(global.console, prefix);
      })();
    }

    if (level > 1 && global.console.info && global.console.info.bind) {
      _logger.info = (function() {
        return global.console.info.bind(global.console, prefix);
      })();
    }

    if (level > 0 && global.console.warn && global.console.warn.bind) {
      _logger.warn = (function() {
        return global.console.warn.bind(global.console, prefix);
      })();
    }

    if (global.console.error && global.console.error.bind) {
      _logger.error = (function() {
        return global.console.error.bind(global.console, prefix);
      })();
    }
    return _logger;
  };
  Utils.createLogger = createLogger;
  var sysLogger = createLogger("[UnexpectedError]", "error");

  /**
   * Decode Uint16Array to String
   * @see http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/#toc-transferables
   * @see http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
   * @function
   * @memberof Utils
   * @static
   * @param {Uint16Array} buf Uint16Array
   * @return {String} str decoded string
   */
  var ab2str = function(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  };
  Utils.ab2str = ab2str;

  /**
   * Encode String to Uint16Array for zero-copy messageing
   * @see Utils.ab2str
   * @see http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/#toc-transferables
   * @see http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
   * @function
   * @memberof Utils
   * @static
   * @param {String} str target string
   * @return {Uint16Array} buf encoded Uint16Array
   */
  var str2ab = function(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return bufView.buffer;
  };
  Utils.str2ab = str2ab;

  /**
   * Do nothing
   * @function
   * @memberof Utils
   * @static
   * @return undefined
   */
  var noop = function() {
      return void 0;
  };
  Utils.noop = noop;

  /**
   * Alias for `Array.prototype.slice.apply`.
   * @function
   * @memberof Utils
   * @static
   * @param {Object} arguments argument object
   * @return {Array} result
   */
  var slice = function(obj) {
    return Array.prototype.slice.apply(obj);
  };
  Utils.slice = slice;

  /**
   * return input as Array.
   * @function
   * @memberof Utils
   * @static
   * @param {Object} val
   * @return {Array} result
   */
  var toArray = function(obj) {
    return _.isArray(obj) ? obj : [obj];
  };
  Utils.toArray = toArray;

  /**
   * return true if input is not `null` or `undefined`.
   * @function
   * @memberof Utils
   * @static
   * @param {Object} val
   * @return {Boolean} result
   */
  var existy = function(val) {
    return val !== null && val !== undefined;
  };
  Utils.existy = existy;

  /**
   * return true if input is not `null` or `undefined` or `false`<br>
   * `0`, `-1`, `""` is detected as truthy
   * @function
   * @memberof Utils
   * @static
   * @param {Object} val
   * @return {Boolean} result
   */
  var truthy = function(val) {
    return (val !== false) && existy(val);
  };
  Utils.truthy = truthy;

  /**
   * return true if input is the `true`
   * @function
   * @memberof Utils
   * @static
   * @param {Object} val
   * @return {Boolean} result
   */
  var isTrue = function(val) {
      return val === true;
  };
  Utils.isTrue = isTrue;

  /**
   * return true if input is the `false`
   * @function
   * @memberof Utils
   * @static
   * @param {Object} val
   * @return {Boolean} result
   */
  var isFalse = function(val) {
    return val === false;
  };
  Utils.isFalse = isFalse;

  /**
   * return true if input is less than 0
   * @function
   * @memberof Utils
   * @static
   * @param {Object} val
   * @return {Boolean} result
   */
  var isNegativeNum = function(val) {
    return _.isNumber(val) && val < 0;
  };
  Utils.isNegativeNum = isNegativeNum;

  /**
   * return true if input is the 0
   * @function
   * @memberof Utils
   * @static
   * @param {Object} val
   * @return {Boolean} result
   */
  var isZero = function(val) {
    return val === 0;
  };
  Utils.isZero = isZero;

  /**
   * return true if input is the 1
   * @function
   * @memberof Longo.Utils
   * @static
   * @param {Object} val
   * @return {Boolean} result
   */
  var isOne = function(val) {
    return val === 1;
  };
  Utils.isOne = isOne;

  /**
   * return true if input is greater than 0
   * @function
   * @memberof Utils
   * @static
   * @param {Object} val
   * @return {Boolean} result
   */
  var isPositiveNum = function(val) {
    return _.isNumber(val) && val > 0;
  };
  Utils.isPositiveNum = isPositiveNum;

  /**
   * execute action with values when condition is truthy else execute alternative
   * @function
   * @memberof Utils
   * @static
   * @param {Boolean} cond
   * @param {Function} action
   * @param {Function} alternative
   * @param {Array} values
   * @param {Object} context
   * @return {Any} result
   */
  var doWhenOrElse = function(cond, action, alternative, values, context) {
      var arr = toArray(values);
      if (truthy(cond))
        return action.apply(context, arr);
      else
        return alternative.apply(context, arr);
  };
  Utils.doWhenOrElse = doWhenOrElse;

  /**
   * execute action with values when condition is truthy
   * @function
   * @memberof Utils
   * @static
   * @param {Boolean} cond
   * @param {Function} action
   * @param {Array} values
   * @param {Object} context
   * @return {Any} result
   */
  var doWhen = function(cond, action, values, context) {
    doWhenOrElse(cond, action, noop, values, context);
  };
  Utils.doWhen = doWhen;

  /**
   * return input if input is existy else return els
   * @function
   * @memberof Utils
   * @static
   * @param {Object} val
   * @param {Object} els
   * @return {Any} result
   */
  var getOrElse = function(val, els) {
    return existy(val) ? val : els;
  };
  Utils.getOrElse = getOrElse;

  /**
   * return val if result of input has been evaluated by predictor is truthy else return els
   * @function
   * @memberof Utils
   * @static
   * @param {Object} val
   * @param {Object} els
   * @param {Function} pred predictor
   * @return {Any} result
   */
  var checkOrElse = function(val, els, pred) {
    return truthy(pred(val)) ? val : els;
  };
  Utils.checkOrElse = checkOrElse;


  /**
   * return simple router
   * @function
   * @memberof Utils
   * @static
   * @return {Object} router
   * @example
   *
   *  var router = Utils.router();
   *  router.add("A", function(args){ console.log("a", args);});
   *  router.add("B", function(args){ console.log("b", args);});
   *  router.add("C", function(args){ console.log("c", args);});
   *
   *  router.route("A", 1)  //=> "a",1
   *  router.route("B", 2)  //=> "b",2
   *  router.route("X", 10) //=> noop
   */
  var router = function(){
    var routingTable = {};
    var router = {
      route: function(path, values) {
        doWhen(_.isFunction(routingTable[path]), routingTable[path], values);
      },
      add: function(path, func) {
        routingTable[path] = func;
      },
    };
    return router;
  };
  Utils.router = router;


  /**
   * Try parse string to JSON object
   * @function
   * @memberof Utils
   * @static
   * @param {String} str JSON formated string
   * @return {Array} result A Tuple `[error, parsed]`
   */
  var tryParseJSON = function(str) {
    var result = [null, null];
    try {
      result[1] = JSON.parse(str);
    } catch (e) {

      sysLogger.log("Failed to parse JSON", e.stack);
      result[0] = e;
    }
    return result;
  };
  Utils.tryParseJSON = tryParseJSON;

  /**
   * Parse string to JSON object with ignoring error.
   * @function
   * @memberof Utils
   * @static
   * @param {String} str JSON formated string
   * @return {Object} result
   */
  var parseJsonWithoutError = function(str) {
    return getOrElse(tryParseJSON(str)[1], {});
  };
  Utils.parseJsonWithoutError = parseJsonWithoutError;

  /**
   * Generate MongoDB like objectId
   * @function
   * @memberof Utils
   * @static
   * @param {String} [id=null]
   * @return {String} MongoDB like objectId (e.g. "141412018394502septzmylf") if id is specified return that id
   */
  var objectId = (function(){
    var lastNow = Date.now();
    var seq = 0;
    var CHARS = "0123456789abcdef0123456789abcdef".split("");
    return function(id) {
      if(id) return id;
      var n = (Math.ceil(Date.now()/1000)).toString(16);
      if (n === lastNow) {
        seq++;
        n = n + "" + Number(seq+"", 16);
      } else {
        lastNow = n;
        seq = 0;
        n = n + "" + seq;
      }
      return (n + _.shuffle(CHARS).join("")).substr(0,24);
    };
  })();
  Utils.objectId = objectId;

  /**
   * Return uuid like random value
   * @function
   * @memberof Utils
   * @static
   * @return {String} uuid uuid like random value
   */
  var uuid = (function() {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return function() {
      return s4() + s4() + s4() + s4();
    };
  })();
  Utils.uuid = uuid;

  /**
   * Return timestamp from mongodb's objectID
   * @see http://docs.mongodb.org/manual/reference/method/ObjectId.getTimestamp/
   * @function
   * @memberof Utils
   * @static
   * @param {String} mongoDBId(objectId)
   * @return {Long} Unix timestamp (second)
   */
  var mongoDBId2Ts = function(mongoDBId) {
    var hex = (mongoDBId+"").substring(0, 8);
    return parseInt(hex, 16);
  };
  Utils.mongoDBId2Ts = mongoDBId2Ts;

  /**
   * Return Date object from mongodb's objectID
   * @see http://docs.mongodb.org/manual/reference/method/ObjectId.getTimestamp/
   * @function
   * @memberof Utils
   * @static
   * @param {String} mongoDBId(objectId)
   * @return {Date} date object
   */
  var mongoDBId2Date = function(mongoDBId) {
    return new Date(mongoDBId2Ts(mongoDBId)*1000);
  };
  Utils.mongoDBId2Date = mongoDBId2Date;

  /**
   * Return left padded string
   * @function
   * @memberof Utils
   * @static
   * @param {String} target target character or string
   * @param {Number} n size of result
   * @param {Char} p padding character
   * @return {String} result
   */
  var padLeft = function(target, n, p) {
    var pad = p ? p + "" : "0";
    if ((target + "").length >= n) return target + "";
    return padLeft(pad + target, n, pad);
  };
  Utils.padLeft = padLeft;

  /**
   * Return specified number zefo padding function
   * @function
   * @memberof Utils
   * @static
   * @param {Number} n size of result
   * @return {Function} f left padding function
   */
  var padLeftNZero = function(n){
    return function(c){
      return padLeft(c, n, "0");
    };
  };
  Utils.padLeftNZero = padLeftNZero;
  var twoDigits = padLeftNZero(2);

  /**
   * Return formatted "MM/DD hh:mm"
   * @function
   * @memberof Utils
   * @static
   * @param {Date} d target date object
   * @return {String} result as "MM/DD hh:mm" format
   */
  var formatMMDDhhmm = function(d) {
    return twoDigits(d.getMonth() + 1) + "/" + twoDigits(d.getDate()) + " " + twoDigits(d.getHours()) + ":" + twoDigits(d.getMinutes());
  };
  Utils.formatMMDDhhmm = formatMMDDhhmm;

  /**
   * Return formatted "YYYY/"MM/DD hh:mm:ss"
   * @function
   * @memberof Utils
   * @static
   * @param {Date} d target date object
   * @return {String} result as "YYYY/"MM/DD hh:mm:ss" format
   */
  var formatYYYYMMDDHHMMSS = function(d) {
    return d.getFullYear() + "/" + formatMMDDhhmm(d) + ":" + twoDigits(d.getSeconds());
  };
  Utils.formatYYYYMMDDHHMMSS = formatYYYYMMDDHHMMSS;

  /**
   * Return empty string when target is undefined or null
   * @function
   * @memberof Utils
   * @static
   * @param {Any} t target
   * @return {Any} t if target is null or undefined return empty string
   */
  var nullGuard = function(t) {
    return existy(t) ? t : "";
  };
  Utils.nullGuard = nullGuard;

  /**
   * Return sanitized html string
   * @function
   * @memberof Utils
   * @static
   * @param {String} html node tree
   * @return {String} html sanitized html
   */
  var escapeHtml = function(html) {
    return html.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      ;
  };
  Utils.escapeHtml = escapeHtml;

  var ajaxObject = (function(){
    if (global.XMLHttpRequest) {
      return function(){
        var httpRequest = new XMLHttpRequest();
        if (httpRequest.overrideMimeType) {
            httpRequest.overrideMimeType("text/plain");
        }
        return httpRequest;
      };
    } else if (global.ActiveXObject) {
      return function(){
        try {
            return new global.ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
          try {
              return new global.ActiveXObject("Microsoft.XMLHTTP");
          } catch (error) {}
        }
      };
    } else {
      return Utils.noop;
    }
  })();

  /**
   * Return thenable ajax request
   * @function
   * @memberof Utils
   * @static
   * @param {Object} option
   * @param {String} option.method httpRequestMethod Only GET and POST are supported, other method type are handled as _method parameter of POST request
   * @param {String} option.url url request url
   * @param {String} option.async url request url
   * @param {Object} option.data data request data request data will send to server as form
   * @return {Promise} thenable respons status and body will be passed to done and reject function.
   */
  var ajax = function(option){
    var p = new Promise(function(done, reject){
      var httpRequest = ajaxObject();
      if (!httpRequest) return reject();
      httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
            return done({status:httpRequest.status, body:httpRequest.responseText});
          } else {
            return reject({status:httpRequest.status});
          }
        }
      };
      var method      = option.method === "GET" ? "GET" : "POST",
          url         = option.url,
          contentType = "application/x-www-form-urlencoded",
          data        = option.data || {}
          ;

      httpRequest.open(method, url, true);
      httpRequest.setRequestHeader("Content-Type", contentType);
      if (method === "POST"){
        var formString = _.map(data, function(val, key){
                            return key+"="+val;
                          }).join("&");
        if (option.method !== "POST") formString += "&_method="+option.method;
        httpRequest.send(formString);
      } else {
        httpRequest.send();
      }
    });
    return p;
  };
  Utils.ajax = ajax;


  if (typeof exports !== "undefined") {
    if (typeof module !== "undefined" && module.exports) {
      module.exports = Utils;
    }
    exports.Utils = Utils;
  } else {
    global.Utils = Utils;
  }

})(this, typeof _ === "undefined" ? undefined : _,  typeof Promise === "undefined" ? undefined : Promise, undefined);