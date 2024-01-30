/*!
* vue-functions v1.0.6
* (c) phphe <phphe@outlook.com> (https://github.com/phphe)
* Released under the MIT License.
*/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isArray(v) {
  return Object.prototype.toString.call(v) === '[object Array]';
}

function isFunction(v) {
  return typeof v === 'function';
}

function isPromise(v) {
  return Object.prototype.toString.call(v) === '[object Promise]';
}


function onDOM(el, name, handler) {
  for (var _len6 = arguments.length, args = new Array(_len6 > 3 ? _len6 - 3 : 0), _key8 = 3; _key8 < _len6; _key8++) {
    args[_key8 - 3] = arguments[_key8];
  }

  if (el.addEventListener) {
    // 所有主流浏览器，除了 IE 8 及更早 IE版本
    el.addEventListener.apply(el, [name, handler].concat(args));
  } else if (el.attachEvent) {
    // IE 8 及更早 IE 版本
    el.attachEvent.apply(el, ["on".concat(name), handler].concat(args));
  }
}

function offDOM(el, name, handler) {
  for (var _len7 = arguments.length, args = new Array(_len7 > 3 ? _len7 - 3 : 0), _key9 = 3; _key9 < _len7; _key9++) {
    args[_key9 - 3] = arguments[_key9];
  }

  if (el.removeEventListener) {
    // 所有主流浏览器，除了 IE 8 及更早 IE版本
    el.removeEventListener.apply(el, [name, handler].concat(args));
  } else if (el.detachEvent) {
    // IE 8 及更早 IE 版本
    el.detachEvent.apply(el, ["on".concat(name), handler].concat(args));
  }
}

var _marked =
/*#__PURE__*/
regeneratorRuntime.mark(iterateObjectWithoutDollarDash);
/**
 * [updatablePropsEvenUnbound description]
 * @param  {[type]} props [un-circular object or getter]
 * @return {[type]}       [description]
 * props eg: {
    value: {localName: 'current'},
  }
   default localName is `localProps_${name}`
 */

function updatablePropsEvenUnbound(props) {
  if (isFunction(props)) {
    props = props();
  } else if (isArray(props)) {
    props = props.slice();
  } else {
    // object
    props = Object.assign({}, props);
  }

  var component = {
    props: props,
    computed: {},
    watch: {}
  };
  var propNames;
  var localNames = {};

  if (isArray(props)) {
    propNames = props;
  } else {
    propNames = [];

    for (var key in props) {
      propNames.push(key);

      if (props[key].localName) {
        localNames[key] = props[key].localName;
        delete props[key].localName;
      }
    }
  }

  component.data = function () {
    var t = {
      localValueOfUpdatableProps: {}
    };
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = propNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var name = _step.value;
        t.localValueOfUpdatableProps[name] = this[name];
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return t;
  };

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    var _loop = function _loop() {
      var name = _step2.value;

      component.watch[name] = function (value) {
        this.localValueOfUpdatableProps[name] = value;
      };

      var localName = localNames[name] || "localProps_".concat(name);
      component.computed[localName] = {
        get: function get() {
          return this.localValueOfUpdatableProps[name];
        },
        set: function set(value) {
          if (name === 'value') {
            this.$emit('input', value);
          } else {
            this.$emit("update:".concat(name), value);
          }

          this.localValueOfUpdatableProps[name] = value;
        }
      };
    };

    for (var _iterator2 = propNames[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return component;
}
function isPropTrue(value) {
  return value === '' || value;
} // the dependences in getter can't be auto resolved. must use exec to include dependences

function watchAsync(vm, getter, handler, opt) {
  var destroies = [];
  var value, oldValue;
  var count = -1; // updated count

  main();
  return destroy;

  function destroy() {
    destroies.forEach(function (f) {
      return f();
    });
    destroies = [];
  }

  function exec(getter, opt) {
    var value;
    var first = true;
    var unwatch = vm.$watch(function () {
      return getter.call(vm, exec);
    }, function (value2) {
      value = value2;

      if (first) {
        first = false;
      } else {
        main();
      }
    }, {
      immediate: true,
      deep: opt && opt.deep
    });
    destroies.push(unwatch);
    return value;
  }

  function main() {
    destroy();
    var result = getter.call(vm, exec);
    count++;
    var localCount = count;
    oldValue = value;

    var getterExecuted = function getterExecuted(value) {
      if (localCount !== count) {
        // expired
        return;
      }

      if (localCount === 0) {
        if (opt && opt.immediate) {
          handler.call(vm, value, oldValue);
        }
      } else {
        handler.call(vm, value, oldValue);
      }
    }; //


    if (isPromise(result)) {
      result.then(getterExecuted);
    } else {
      getterExecuted(result);
    }
  }
} // do handler first, handler return getter

function doWatch(vm, handler) {
  var oldValue, unwatch;

  var update = function update() {
    var getter = handler.call(vm, oldValue);
    unwatch = vm.$watch(getter, function (value) {
      unwatch();
      oldValue = value;
      update();
    });
  };

  update();
  return function () {
    return unwatch && unwatch();
  };
}
function iterateObjectWithoutDollarDash(obj) {
  var key, start;
  return regeneratorRuntime.wrap(function iterateObjectWithoutDollarDash$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.t0 = regeneratorRuntime.keys(obj);

        case 1:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 9;
            break;
          }

          key = _context.t1.value;
          start = key.substr(0, 1);

          if (!(start !== '$' && start !== '_')) {
            _context.next = 7;
            break;
          }

          _context.next = 7;
          return {
            key: key,
            value: obj[key]
          };

        case 7:
          _context.next = 1;
          break;

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
} // add reactive `windowSize`

var windowSize = {
  data: function data() {
    return {
      windowSize: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight
      }
    };
  },
  methods: {
    updateWindowSize: function updateWindowSize() {
      Object.assign(this.windowSize, {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight
      });
    }
  },
  created: function created() {
    var _this = this;

    this._windowSize_onresize = function () {
      _this.updateWindowSize();

      _this.$emit('window-resize');
    };

    onDOM(window, 'resize', this._windowSize_onresize);
  },
  beforeDestroy: function beforeDestroy() {
    offDOM(window, 'resize', this._windowSize_onresize);
  }
};
function registerPreventURLChange(Vue, router, msg) {
  var preventRouter = false;
  var msg0 = "It looks like you have been editing something.\nIf you leave before saving, your changes will be lost.";
  router.beforeEach(function (to, from, next) {
    if (preventRouter) {
      if (window.confirm(msg || msg0)) {
        Vue.allowURLChange();
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  });

  var beforeunload = function beforeunload(e) {
    var confirmationMessage = msg || msg0;
    e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+

    return confirmationMessage; // Gecko, WebKit, Chrome <34
  };

  Vue.preventURLChange = Vue.prototype.$preventURLChange = function (msg2) {
    if (msg2 != null) {
      msg = msg2;
    }

    if (!preventRouter) {
      preventRouter = true;
      window.addEventListener("beforeunload", beforeunload);
    }
  };

  Vue.allowURLChange = Vue.prototype.$allowURLChange = function () {
    preventRouter = false;
    window.removeEventListener("beforeunload", beforeunload);
  };
}

exports.doWatch = doWatch;
exports.isPropTrue = isPropTrue;
exports.iterateObjectWithoutDollarDash = iterateObjectWithoutDollarDash;
exports.registerPreventURLChange = registerPreventURLChange;
exports.updatablePropsEvenUnbound = updatablePropsEvenUnbound;
exports.watchAsync = watchAsync;
exports.windowSize = windowSize;
