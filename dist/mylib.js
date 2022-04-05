(function(global2, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(require("@vue/composition-api"), require("vue")) : typeof define === "function" && define.amd ? define(["@vue/composition-api", "vue"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.VueCompositionAPI, global2.Vue));
})(this, function(compositionApi, Vue) {
  "use strict";
  function _interopDefaultLegacy(e) {
    return e && typeof e === "object" && "default" in e ? e : { "default": e };
  }
  var Vue__default = /* @__PURE__ */ _interopDefaultLegacy(Vue);
  /*! *****************************************************************************
      Copyright (c) Microsoft Corporation.
  
      Permission to use, copy, modify, and/or distribute this software for any
      purpose with or without fee is hereby granted.
  
      THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
      REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
      AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
      INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
      LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
      OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
      PERFORMANCE OF THIS SOFTWARE.
      ***************************************************************************** */
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var __assign = function() {
    __assign = Object.assign || function __assign2(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m)
      return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function() {
          if (o && i >= o.length)
            o = void 0;
          return { value: o && o[i++], done: !o };
        }
      };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  }
  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  }
  var activeEffectScope;
  var effectScopeStack = [];
  var EffectScopeImpl = function() {
    function EffectScopeImpl2(vm) {
      this.active = true;
      this.effects = [];
      this.cleanups = [];
      this.vm = vm;
    }
    EffectScopeImpl2.prototype.run = function(fn) {
      if (this.active) {
        try {
          this.on();
          return fn();
        } finally {
          this.off();
        }
      }
      return;
    };
    EffectScopeImpl2.prototype.on = function() {
      if (this.active) {
        effectScopeStack.push(this);
        activeEffectScope = this;
      }
    };
    EffectScopeImpl2.prototype.off = function() {
      if (this.active) {
        effectScopeStack.pop();
        activeEffectScope = effectScopeStack[effectScopeStack.length - 1];
      }
    };
    EffectScopeImpl2.prototype.stop = function() {
      if (this.active) {
        this.vm.$destroy();
        this.effects.forEach(function(e) {
          return e.stop();
        });
        this.cleanups.forEach(function(cleanup) {
          return cleanup();
        });
        this.active = false;
      }
    };
    return EffectScopeImpl2;
  }();
  (function(_super) {
    __extends(EffectScope, _super);
    function EffectScope(detached) {
      if (detached === void 0) {
        detached = false;
      }
      var _this = this;
      var vm = void 0;
      withCurrentInstanceTrackingDisabled(function() {
        vm = defineComponentInstance(getVueConstructor());
      });
      _this = _super.call(this, vm) || this;
      if (!detached) {
        recordEffectScope(_this);
      }
      return _this;
    }
    return EffectScope;
  })(EffectScopeImpl);
  function recordEffectScope(effect, scope) {
    var _a2;
    scope = scope || activeEffectScope;
    if (scope && scope.active) {
      scope.effects.push(effect);
      return;
    }
    var vm = (_a2 = getCurrentInstance()) === null || _a2 === void 0 ? void 0 : _a2.proxy;
    vm && vm.$on("hook:destroyed", function() {
      return effect.stop();
    });
  }
  function getCurrentScope() {
    return activeEffectScope;
  }
  function onScopeDispose(fn) {
    if (activeEffectScope) {
      activeEffectScope.cleanups.push(fn);
    }
  }
  function getCurrentScopeVM() {
    var _a2, _b2;
    return ((_a2 = getCurrentScope()) === null || _a2 === void 0 ? void 0 : _a2.vm) || ((_b2 = getCurrentInstance()) === null || _b2 === void 0 ? void 0 : _b2.proxy);
  }
  function bindCurrentScopeToVM(vm) {
    if (!vm.scope) {
      var scope_1 = new EffectScopeImpl(vm.proxy);
      vm.scope = scope_1;
      vm.proxy.$on("hook:destroyed", function() {
        return scope_1.stop();
      });
    }
    return vm.scope;
  }
  var vueDependency = void 0;
  try {
    var requiredVue = require("vue");
    if (requiredVue && isVue(requiredVue)) {
      vueDependency = requiredVue;
    } else if (requiredVue && "default" in requiredVue && isVue(requiredVue.default)) {
      vueDependency = requiredVue.default;
    }
  } catch (_a2) {
  }
  var vueConstructor = null;
  var currentInstance = null;
  var currentInstanceTracking = true;
  var PluginInstalledFlag = "__composition_api_installed__";
  function isVue(obj) {
    return obj && isFunction(obj) && obj.name === "Vue";
  }
  function isVueRegistered(Vue2) {
    return vueConstructor && hasOwn(Vue2, PluginInstalledFlag);
  }
  function getVueConstructor() {
    return vueConstructor;
  }
  function getRegisteredVueOrDefault() {
    var constructor = vueConstructor || vueDependency;
    return constructor;
  }
  function setVueConstructor(Vue2) {
    vueConstructor = Vue2;
    Object.defineProperty(Vue2, PluginInstalledFlag, {
      configurable: true,
      writable: true,
      value: true
    });
  }
  function withCurrentInstanceTrackingDisabled(fn) {
    var prev = currentInstanceTracking;
    currentInstanceTracking = false;
    try {
      fn();
    } finally {
      currentInstanceTracking = prev;
    }
  }
  function setCurrentInstance(instance) {
    if (!currentInstanceTracking)
      return;
    var prev = currentInstance;
    prev === null || prev === void 0 ? void 0 : prev.scope.off();
    currentInstance = instance;
    currentInstance === null || currentInstance === void 0 ? void 0 : currentInstance.scope.on();
  }
  function getCurrentInstance() {
    return currentInstance;
  }
  var instanceMapCache = /* @__PURE__ */ new WeakMap();
  function toVue3ComponentInstance(vm) {
    if (instanceMapCache.has(vm)) {
      return instanceMapCache.get(vm);
    }
    var instance = {
      proxy: vm,
      update: vm.$forceUpdate,
      type: vm.$options,
      uid: vm._uid,
      emit: vm.$emit.bind(vm),
      parent: null,
      root: null
    };
    bindCurrentScopeToVM(instance);
    var instanceProps = [
      "data",
      "props",
      "attrs",
      "refs",
      "vnode",
      "slots"
    ];
    instanceProps.forEach(function(prop) {
      proxy(instance, prop, {
        get: function() {
          return vm["$".concat(prop)];
        }
      });
    });
    proxy(instance, "isMounted", {
      get: function() {
        return vm._isMounted;
      }
    });
    proxy(instance, "isUnmounted", {
      get: function() {
        return vm._isDestroyed;
      }
    });
    proxy(instance, "isDeactivated", {
      get: function() {
        return vm._inactive;
      }
    });
    proxy(instance, "emitted", {
      get: function() {
        return vm._events;
      }
    });
    instanceMapCache.set(vm, instance);
    if (vm.$parent) {
      instance.parent = toVue3ComponentInstance(vm.$parent);
    }
    if (vm.$root) {
      instance.root = toVue3ComponentInstance(vm.$root);
    }
    return instance;
  }
  var toString = function(x) {
    return Object.prototype.toString.call(x);
  };
  function isNative(Ctor) {
    return typeof Ctor === "function" && /native code/.test(Ctor.toString());
  }
  var hasSymbol = typeof Symbol !== "undefined" && isNative(Symbol) && typeof Reflect !== "undefined" && isNative(Reflect.ownKeys);
  var noopFn = function(_) {
    return _;
  };
  function proxy(target, key, _a2) {
    var get2 = _a2.get, set2 = _a2.set;
    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: true,
      get: get2 || noopFn,
      set: set2 || noopFn
    });
  }
  function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }
  function hasOwn(obj, key) {
    return Object.hasOwnProperty.call(obj, key);
  }
  function assert(condition, msg) {
    if (!condition) {
      throw new Error("[vue-composition-api] ".concat(msg));
    }
  }
  function isArray(x) {
    return Array.isArray(x);
  }
  var objectToString = Object.prototype.toString;
  var toTypeString = function(value) {
    return objectToString.call(value);
  };
  var isMap = function(val) {
    return toTypeString(val) === "[object Map]";
  };
  var isSet = function(val) {
    return toTypeString(val) === "[object Set]";
  };
  var MAX_VALID_ARRAY_LENGTH = 4294967295;
  function isValidArrayIndex(val) {
    var n = parseFloat(String(val));
    return n >= 0 && Math.floor(n) === n && isFinite(val) && n <= MAX_VALID_ARRAY_LENGTH;
  }
  function isObject(val) {
    return val !== null && typeof val === "object";
  }
  function isPlainObject(x) {
    return toString(x) === "[object Object]";
  }
  function isFunction(x) {
    return typeof x === "function";
  }
  function logError(err, vm, info) {
    if (typeof window !== "undefined" && typeof console !== "undefined") {
      console.error(err);
    } else {
      throw err;
    }
  }
  function isSame(value1, value2) {
    if (value1 === value2) {
      return value1 !== 0 || 1 / value1 === 1 / value2;
    } else {
      return value1 !== value1 && value2 !== value2;
    }
  }
  function defineComponentInstance(Ctor, options) {
    if (options === void 0) {
      options = {};
    }
    var silent = Ctor.config.silent;
    Ctor.config.silent = true;
    var vm = new Ctor(options);
    Ctor.config.silent = silent;
    return vm;
  }
  function isComponentInstance(obj) {
    var Vue2 = getVueConstructor();
    return Vue2 && obj instanceof Vue2;
  }
  function createSlotProxy(vm, slotName) {
    return function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      if (!vm.$scopedSlots[slotName]) {
        return;
      }
      return vm.$scopedSlots[slotName].apply(vm, args);
    };
  }
  function resolveSlots(slots, normalSlots) {
    var res;
    if (!slots) {
      res = {};
    } else if (slots._normalized) {
      return slots._normalized;
    } else {
      res = {};
      for (var key in slots) {
        if (slots[key] && key[0] !== "$") {
          res[key] = true;
        }
      }
    }
    for (var key in normalSlots) {
      if (!(key in res)) {
        res[key] = true;
      }
    }
    return res;
  }
  var vueInternalClasses;
  var getVueInternalClasses = function() {
    if (!vueInternalClasses) {
      var vm = defineComponentInstance(getVueConstructor(), {
        computed: {
          value: function() {
            return 0;
          }
        }
      });
      var Watcher = vm._computedWatchers.value.constructor;
      var Dep = vm._data.__ob__.dep.constructor;
      vueInternalClasses = {
        Watcher,
        Dep
      };
      vm.$destroy();
    }
    return vueInternalClasses;
  };
  function createSymbol(name) {
    return hasSymbol ? Symbol.for(name) : name;
  }
  var WatcherPreFlushQueueKey = createSymbol("composition-api.preFlushQueue");
  var WatcherPostFlushQueueKey = createSymbol("composition-api.postFlushQueue");
  var RefKey = "composition-api.refKey";
  var accessModifiedSet = /* @__PURE__ */ new WeakMap();
  var rawSet = /* @__PURE__ */ new WeakMap();
  var readonlySet = /* @__PURE__ */ new WeakMap();
  function set$1(target, key, val) {
    var Vue2 = getVueConstructor();
    var _a2 = Vue2.util;
    _a2.warn;
    var defineReactive = _a2.defineReactive;
    var ob = target.__ob__;
    function ssrMockReactivity() {
      if (ob && isObject(val) && !hasOwn(val, "__ob__")) {
        mockReactivityDeep(val);
      }
    }
    if (isArray(target)) {
      if (isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key);
        target.splice(key, 1, val);
        ssrMockReactivity();
        return val;
      } else if (key === "length" && val !== target.length) {
        target.length = val;
        ob === null || ob === void 0 ? void 0 : ob.dep.notify();
        return val;
      }
    }
    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      ssrMockReactivity();
      return val;
    }
    if (target._isVue || ob && ob.vmCount) {
      return val;
    }
    if (!ob) {
      target[key] = val;
      return val;
    }
    defineReactive(ob.value, key, val);
    defineAccessControl(target, key, val);
    ssrMockReactivity();
    ob.dep.notify();
    return val;
  }
  var RefImpl = function() {
    function RefImpl2(_a2) {
      var get2 = _a2.get, set2 = _a2.set;
      proxy(this, "value", {
        get: get2,
        set: set2
      });
    }
    return RefImpl2;
  }();
  function createRef(options, isReadonly, isComputed) {
    if (isReadonly === void 0) {
      isReadonly = false;
    }
    if (isComputed === void 0) {
      isComputed = false;
    }
    var r = new RefImpl(options);
    if (isComputed)
      r.effect = true;
    var sealed = Object.seal(r);
    if (isReadonly)
      readonlySet.set(sealed, true);
    return sealed;
  }
  function ref(raw) {
    var _a2;
    if (isRef(raw)) {
      return raw;
    }
    var value = reactive((_a2 = {}, _a2[RefKey] = raw, _a2));
    return createRef({
      get: function() {
        return value[RefKey];
      },
      set: function(v) {
        return value[RefKey] = v;
      }
    });
  }
  function isRef(value) {
    return value instanceof RefImpl;
  }
  function unref(ref2) {
    return isRef(ref2) ? ref2.value : ref2;
  }
  function toRefs(obj) {
    if (!isPlainObject(obj))
      return obj;
    var ret = {};
    for (var key in obj) {
      ret[key] = toRef(obj, key);
    }
    return ret;
  }
  function toRef(object, key) {
    if (!(key in object))
      set$1(object, key, void 0);
    var v = object[key];
    if (isRef(v))
      return v;
    return createRef({
      get: function() {
        return object[key];
      },
      set: function(v2) {
        return object[key] = v2;
      }
    });
  }
  function shallowRef(raw) {
    var _a2;
    if (isRef(raw)) {
      return raw;
    }
    var value = shallowReactive((_a2 = {}, _a2[RefKey] = raw, _a2));
    return createRef({
      get: function() {
        return value[RefKey];
      },
      set: function(v) {
        return value[RefKey] = v;
      }
    });
  }
  function isRaw(obj) {
    var _a2;
    return Boolean(obj && hasOwn(obj, "__ob__") && typeof obj.__ob__ === "object" && ((_a2 = obj.__ob__) === null || _a2 === void 0 ? void 0 : _a2.__raw__));
  }
  function isReactive(obj) {
    var _a2;
    return Boolean(obj && hasOwn(obj, "__ob__") && typeof obj.__ob__ === "object" && !((_a2 = obj.__ob__) === null || _a2 === void 0 ? void 0 : _a2.__raw__));
  }
  function setupAccessControl(target) {
    if (!isPlainObject(target) || isRaw(target) || isArray(target) || isRef(target) || isComponentInstance(target) || accessModifiedSet.has(target))
      return;
    accessModifiedSet.set(target, true);
    var keys = Object.keys(target);
    for (var i = 0; i < keys.length; i++) {
      defineAccessControl(target, keys[i]);
    }
  }
  function defineAccessControl(target, key, val) {
    if (key === "__ob__")
      return;
    if (isRaw(target[key]))
      return;
    var getter;
    var setter;
    var property = Object.getOwnPropertyDescriptor(target, key);
    if (property) {
      if (property.configurable === false) {
        return;
      }
      getter = property.get;
      setter = property.set;
      if ((!getter || setter) && arguments.length === 2) {
        val = target[key];
      }
    }
    setupAccessControl(val);
    proxy(target, key, {
      get: function getterHandler() {
        var value = getter ? getter.call(target) : val;
        if (key !== RefKey && isRef(value)) {
          return value.value;
        } else {
          return value;
        }
      },
      set: function setterHandler(newVal) {
        if (getter && !setter)
          return;
        if (key !== RefKey && isRef(val) && !isRef(newVal)) {
          val.value = newVal;
        } else if (setter) {
          setter.call(target, newVal);
          val = newVal;
        } else {
          val = newVal;
        }
        setupAccessControl(newVal);
      }
    });
  }
  function observe(obj) {
    var Vue2 = getRegisteredVueOrDefault();
    var observed;
    if (Vue2.observable) {
      observed = Vue2.observable(obj);
    } else {
      var vm = defineComponentInstance(Vue2, {
        data: {
          $$state: obj
        }
      });
      observed = vm._data.$$state;
    }
    if (!hasOwn(observed, "__ob__")) {
      mockReactivityDeep(observed);
    }
    return observed;
  }
  function mockReactivityDeep(obj, seen) {
    var e_1, _a2;
    if (seen === void 0) {
      seen = /* @__PURE__ */ new Set();
    }
    if (seen.has(obj) || hasOwn(obj, "__ob__") || !Object.isExtensible(obj))
      return;
    def(obj, "__ob__", mockObserver(obj));
    seen.add(obj);
    try {
      for (var _b2 = __values(Object.keys(obj)), _c = _b2.next(); !_c.done; _c = _b2.next()) {
        var key = _c.value;
        var value = obj[key];
        if (!(isPlainObject(value) || isArray(value)) || isRaw(value) || !Object.isExtensible(value)) {
          continue;
        }
        mockReactivityDeep(value, seen);
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a2 = _b2.return))
          _a2.call(_b2);
      } finally {
        if (e_1)
          throw e_1.error;
      }
    }
  }
  function mockObserver(value) {
    if (value === void 0) {
      value = {};
    }
    return {
      value,
      dep: {
        notify: noopFn,
        depend: noopFn,
        addSub: noopFn,
        removeSub: noopFn
      }
    };
  }
  function createObserver() {
    return observe({}).__ob__;
  }
  function shallowReactive(obj) {
    var e_2, _a2;
    if (!isObject(obj)) {
      return obj;
    }
    if (!(isPlainObject(obj) || isArray(obj)) || isRaw(obj) || !Object.isExtensible(obj)) {
      return obj;
    }
    var observed = observe(isArray(obj) ? [] : {});
    var ob = observed.__ob__;
    var _loop_1 = function(key2) {
      var val = obj[key2];
      var getter;
      var setter;
      var property = Object.getOwnPropertyDescriptor(obj, key2);
      if (property) {
        if (property.configurable === false) {
          return "continue";
        }
        getter = property.get;
        setter = property.set;
      }
      proxy(observed, key2, {
        get: function getterHandler() {
          var _a3;
          var value = getter ? getter.call(obj) : val;
          (_a3 = ob.dep) === null || _a3 === void 0 ? void 0 : _a3.depend();
          return value;
        },
        set: function setterHandler(newVal) {
          var _a3;
          if (getter && !setter)
            return;
          var value = getter ? getter.call(obj) : val;
          if (value === newVal)
            return;
          if (setter) {
            setter.call(obj, newVal);
          } else {
            val = newVal;
          }
          (_a3 = ob.dep) === null || _a3 === void 0 ? void 0 : _a3.notify();
        }
      });
    };
    try {
      for (var _b2 = __values(Object.keys(obj)), _c = _b2.next(); !_c.done; _c = _b2.next()) {
        var key = _c.value;
        _loop_1(key);
      }
    } catch (e_2_1) {
      e_2 = { error: e_2_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a2 = _b2.return))
          _a2.call(_b2);
      } finally {
        if (e_2)
          throw e_2.error;
      }
    }
    return observed;
  }
  function reactive(obj) {
    if (!isObject(obj)) {
      return obj;
    }
    if (!(isPlainObject(obj) || isArray(obj)) || isRaw(obj) || !Object.isExtensible(obj)) {
      return obj;
    }
    var observed = observe(obj);
    setupAccessControl(observed);
    return observed;
  }
  var fallbackVM;
  function flushPreQueue() {
    flushQueue(this, WatcherPreFlushQueueKey);
  }
  function flushPostQueue() {
    flushQueue(this, WatcherPostFlushQueueKey);
  }
  function hasWatchEnv(vm) {
    return vm[WatcherPreFlushQueueKey] !== void 0;
  }
  function installWatchEnv(vm) {
    vm[WatcherPreFlushQueueKey] = [];
    vm[WatcherPostFlushQueueKey] = [];
    vm.$on("hook:beforeUpdate", flushPreQueue);
    vm.$on("hook:updated", flushPostQueue);
  }
  function getWatcherOption(options) {
    return __assign({
      immediate: false,
      deep: false,
      flush: "pre"
    }, options);
  }
  function getWatcherVM() {
    var vm = getCurrentScopeVM();
    if (!vm) {
      if (!fallbackVM) {
        fallbackVM = defineComponentInstance(getVueConstructor());
      }
      vm = fallbackVM;
    } else if (!hasWatchEnv(vm)) {
      installWatchEnv(vm);
    }
    return vm;
  }
  function flushQueue(vm, key) {
    var queue = vm[key];
    for (var index = 0; index < queue.length; index++) {
      queue[index]();
    }
    queue.length = 0;
  }
  function queueFlushJob(vm, fn, mode) {
    var fallbackFlush = function() {
      vm.$nextTick(function() {
        if (vm[WatcherPreFlushQueueKey].length) {
          flushQueue(vm, WatcherPreFlushQueueKey);
        }
        if (vm[WatcherPostFlushQueueKey].length) {
          flushQueue(vm, WatcherPostFlushQueueKey);
        }
      });
    };
    switch (mode) {
      case "pre":
        fallbackFlush();
        vm[WatcherPreFlushQueueKey].push(fn);
        break;
      case "post":
        fallbackFlush();
        vm[WatcherPostFlushQueueKey].push(fn);
        break;
      default:
        assert(false, 'flush must be one of ["post", "pre", "sync"], but got '.concat(mode));
        break;
    }
  }
  function createVueWatcher(vm, getter, callback, options) {
    var index = vm._watchers.length;
    vm.$watch(getter, callback, {
      immediate: options.immediateInvokeCallback,
      deep: options.deep,
      lazy: options.noRun,
      sync: options.sync,
      before: options.before
    });
    return vm._watchers[index];
  }
  function patchWatcherTeardown(watcher, runCleanup) {
    var _teardown = watcher.teardown;
    watcher.teardown = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      _teardown.apply(watcher, args);
      runCleanup();
    };
  }
  function createWatcher(vm, source, cb, options) {
    var _a2;
    var flushMode = options.flush;
    var isSync = flushMode === "sync";
    var cleanup;
    var registerCleanup = function(fn) {
      cleanup = function() {
        try {
          fn();
        } catch (error) {
          logError(error);
        }
      };
    };
    var runCleanup = function() {
      if (cleanup) {
        cleanup();
        cleanup = null;
      }
    };
    var createScheduler = function(fn) {
      if (isSync || vm === fallbackVM) {
        return fn;
      }
      return function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return queueFlushJob(vm, function() {
          fn.apply(void 0, __spreadArray([], __read(args), false));
        }, flushMode);
      };
    };
    if (cb === null) {
      var running_1 = false;
      var getter_1 = function() {
        if (running_1) {
          return;
        }
        try {
          running_1 = true;
          source(registerCleanup);
        } finally {
          running_1 = false;
        }
      };
      var watcher_1 = createVueWatcher(vm, getter_1, noopFn, {
        deep: options.deep || false,
        sync: isSync,
        before: runCleanup
      });
      patchWatcherTeardown(watcher_1, runCleanup);
      watcher_1.lazy = false;
      var originGet = watcher_1.get.bind(watcher_1);
      watcher_1.get = createScheduler(originGet);
      return function() {
        watcher_1.teardown();
      };
    }
    var deep = options.deep;
    var isMultiSource = false;
    var getter;
    if (isRef(source)) {
      getter = function() {
        return source.value;
      };
    } else if (isReactive(source)) {
      getter = function() {
        return source;
      };
      deep = true;
    } else if (isArray(source)) {
      isMultiSource = true;
      getter = function() {
        return source.map(function(s) {
          if (isRef(s)) {
            return s.value;
          } else if (isReactive(s)) {
            return traverse(s);
          } else if (isFunction(s)) {
            return s();
          } else {
            return noopFn;
          }
        });
      };
    } else if (isFunction(source)) {
      getter = source;
    } else {
      getter = noopFn;
    }
    if (deep) {
      var baseGetter_1 = getter;
      getter = function() {
        return traverse(baseGetter_1());
      };
    }
    var applyCb = function(n, o) {
      if (!deep && isMultiSource && n.every(function(v, i) {
        return isSame(v, o[i]);
      }))
        return;
      runCleanup();
      return cb(n, o, registerCleanup);
    };
    var callback = createScheduler(applyCb);
    if (options.immediate) {
      var originalCallback_1 = callback;
      var shiftCallback_1 = function(n, o) {
        shiftCallback_1 = originalCallback_1;
        return applyCb(n, isArray(n) ? [] : o);
      };
      callback = function(n, o) {
        return shiftCallback_1(n, o);
      };
    }
    var stop = vm.$watch(getter, callback, {
      immediate: options.immediate,
      deep,
      sync: isSync
    });
    var watcher = vm._watchers[vm._watchers.length - 1];
    if (isReactive(watcher.value) && ((_a2 = watcher.value.__ob__) === null || _a2 === void 0 ? void 0 : _a2.dep) && deep) {
      watcher.value.__ob__.dep.addSub({
        update: function() {
          watcher.run();
        }
      });
    }
    patchWatcherTeardown(watcher, runCleanup);
    return function() {
      stop();
    };
  }
  function watch(source, cb, options) {
    var callback = null;
    if (isFunction(cb)) {
      callback = cb;
    } else {
      options = cb;
      callback = null;
    }
    var opts = getWatcherOption(options);
    var vm = getWatcherVM();
    return createWatcher(vm, source, callback, opts);
  }
  function traverse(value, seen) {
    if (seen === void 0) {
      seen = /* @__PURE__ */ new Set();
    }
    if (!isObject(value) || seen.has(value) || rawSet.has(value)) {
      return value;
    }
    seen.add(value);
    if (isRef(value)) {
      traverse(value.value, seen);
    } else if (isArray(value)) {
      for (var i = 0; i < value.length; i++) {
        traverse(value[i], seen);
      }
    } else if (isSet(value) || isMap(value)) {
      value.forEach(function(v) {
        traverse(v, seen);
      });
    } else if (isPlainObject(value)) {
      for (var key in value) {
        traverse(value[key], seen);
      }
    }
    return value;
  }
  function computed(getterOrOptions) {
    var vm = getCurrentScopeVM();
    var getter;
    var setter;
    if (isFunction(getterOrOptions)) {
      getter = getterOrOptions;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    var computedSetter;
    var computedGetter;
    if (vm && !vm.$isServer) {
      var _a2 = getVueInternalClasses(), Watcher_1 = _a2.Watcher, Dep_1 = _a2.Dep;
      var watcher_1;
      computedGetter = function() {
        if (!watcher_1) {
          watcher_1 = new Watcher_1(vm, getter, noopFn, { lazy: true });
        }
        if (watcher_1.dirty) {
          watcher_1.evaluate();
        }
        if (Dep_1.target) {
          watcher_1.depend();
        }
        return watcher_1.value;
      };
      computedSetter = function(v) {
        if (setter) {
          setter(v);
        }
      };
    } else {
      var computedHost_1 = defineComponentInstance(getVueConstructor(), {
        computed: {
          $$state: {
            get: getter,
            set: setter
          }
        }
      });
      vm && vm.$on("hook:destroyed", function() {
        return computedHost_1.$destroy();
      });
      computedGetter = function() {
        return computedHost_1.$$state;
      };
      computedSetter = function(v) {
        computedHost_1.$$state = v;
      };
    }
    return createRef({
      get: computedGetter,
      set: computedSetter
    }, !setter, true);
  }
  function set(vm, key, value) {
    var state = vm.__composition_api_state__ = vm.__composition_api_state__ || {};
    state[key] = value;
  }
  function get(vm, key) {
    return (vm.__composition_api_state__ || {})[key];
  }
  var vmStateManager = {
    set,
    get
  };
  function asVmProperty(vm, propName, propValue) {
    var props = vm.$options.props;
    if (!(propName in vm) && !(props && hasOwn(props, propName))) {
      if (isRef(propValue)) {
        proxy(vm, propName, {
          get: function() {
            return propValue.value;
          },
          set: function(val) {
            propValue.value = val;
          }
        });
      } else {
        proxy(vm, propName, {
          get: function() {
            if (isReactive(propValue)) {
              propValue.__ob__.dep.depend();
            }
            return propValue;
          },
          set: function(val) {
            propValue = val;
          }
        });
      }
    }
  }
  function updateTemplateRef(vm) {
    var rawBindings = vmStateManager.get(vm, "rawBindings") || {};
    if (!rawBindings || !Object.keys(rawBindings).length)
      return;
    var refs = vm.$refs;
    var oldRefKeys = vmStateManager.get(vm, "refs") || [];
    for (var index = 0; index < oldRefKeys.length; index++) {
      var key = oldRefKeys[index];
      var setupValue = rawBindings[key];
      if (!refs[key] && setupValue && isRef(setupValue)) {
        setupValue.value = null;
      }
    }
    var newKeys = Object.keys(refs);
    var validNewKeys = [];
    for (var index = 0; index < newKeys.length; index++) {
      var key = newKeys[index];
      var setupValue = rawBindings[key];
      if (refs[key] && setupValue && isRef(setupValue)) {
        setupValue.value = refs[key];
        validNewKeys.push(key);
      }
    }
    vmStateManager.set(vm, "refs", validNewKeys);
  }
  function afterRender(vm) {
    var stack = [vm._vnode];
    while (stack.length) {
      var vnode = stack.pop();
      if (vnode.context)
        updateTemplateRef(vnode.context);
      if (vnode.children) {
        for (var i = 0; i < vnode.children.length; ++i) {
          stack.push(vnode.children[i]);
        }
      }
    }
  }
  function updateVmAttrs(vm, ctx) {
    var e_1, _a2;
    if (!vm) {
      return;
    }
    var attrBindings = vmStateManager.get(vm, "attrBindings");
    if (!attrBindings && !ctx) {
      return;
    }
    if (!attrBindings) {
      var observedData = reactive({});
      attrBindings = { ctx, data: observedData };
      vmStateManager.set(vm, "attrBindings", attrBindings);
      proxy(ctx, "attrs", {
        get: function() {
          return attrBindings === null || attrBindings === void 0 ? void 0 : attrBindings.data;
        },
        set: function() {
        }
      });
    }
    var source = vm.$attrs;
    var _loop_1 = function(attr2) {
      if (!hasOwn(attrBindings.data, attr2)) {
        proxy(attrBindings.data, attr2, {
          get: function() {
            return vm.$attrs[attr2];
          }
        });
      }
    };
    try {
      for (var _b2 = __values(Object.keys(source)), _c = _b2.next(); !_c.done; _c = _b2.next()) {
        var attr = _c.value;
        _loop_1(attr);
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a2 = _b2.return))
          _a2.call(_b2);
      } finally {
        if (e_1)
          throw e_1.error;
      }
    }
  }
  function resolveScopedSlots(vm, slotsProxy) {
    var parentVNode = vm.$options._parentVnode;
    if (!parentVNode)
      return;
    var prevSlots = vmStateManager.get(vm, "slots") || [];
    var curSlots = resolveSlots(parentVNode.data.scopedSlots, vm.$slots);
    for (var index = 0; index < prevSlots.length; index++) {
      var key = prevSlots[index];
      if (!curSlots[key]) {
        delete slotsProxy[key];
      }
    }
    var slotNames = Object.keys(curSlots);
    for (var index = 0; index < slotNames.length; index++) {
      var key = slotNames[index];
      if (!slotsProxy[key]) {
        slotsProxy[key] = createSlotProxy(vm, key);
      }
    }
    vmStateManager.set(vm, "slots", slotNames);
  }
  function activateCurrentInstance(instance, fn, onError) {
    var preVm = getCurrentInstance();
    setCurrentInstance(instance);
    try {
      return fn(instance);
    } catch (err) {
      if (onError) {
        onError(err);
      } else {
        throw err;
      }
    } finally {
      setCurrentInstance(preVm);
    }
  }
  function mixin(Vue2) {
    Vue2.mixin({
      beforeCreate: functionApiInit,
      mounted: function() {
        afterRender(this);
      },
      beforeUpdate: function() {
        updateVmAttrs(this);
      },
      updated: function() {
        afterRender(this);
      }
    });
    function functionApiInit() {
      var vm = this;
      var $options = vm.$options;
      var setup = $options.setup, render2 = $options.render;
      if (render2) {
        $options.render = function() {
          var _this = this;
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          return activateCurrentInstance(toVue3ComponentInstance(vm), function() {
            return render2.apply(_this, args);
          });
        };
      }
      if (!setup) {
        return;
      }
      if (!isFunction(setup)) {
        return;
      }
      var data = $options.data;
      $options.data = function wrappedData() {
        initSetup(vm, vm.$props);
        return isFunction(data) ? data.call(vm, vm) : data || {};
      };
    }
    function initSetup(vm, props) {
      if (props === void 0) {
        props = {};
      }
      var setup = vm.$options.setup;
      var ctx = createSetupContext(vm);
      var instance = toVue3ComponentInstance(vm);
      instance.setupContext = ctx;
      def(props, "__ob__", createObserver());
      resolveScopedSlots(vm, ctx.slots);
      var binding;
      activateCurrentInstance(instance, function() {
        binding = setup(props, ctx);
      });
      if (!binding)
        return;
      if (isFunction(binding)) {
        var bindingFunc_1 = binding;
        vm.$options.render = function() {
          resolveScopedSlots(vm, ctx.slots);
          return activateCurrentInstance(instance, function() {
            return bindingFunc_1();
          });
        };
        return;
      } else if (isObject(binding)) {
        if (isReactive(binding)) {
          binding = toRefs(binding);
        }
        vmStateManager.set(vm, "rawBindings", binding);
        var bindingObj_1 = binding;
        Object.keys(bindingObj_1).forEach(function(name) {
          var bindingValue = bindingObj_1[name];
          if (!isRef(bindingValue)) {
            if (!isReactive(bindingValue)) {
              if (isFunction(bindingValue)) {
                var copy_1 = bindingValue;
                bindingValue = bindingValue.bind(vm);
                Object.keys(copy_1).forEach(function(ele) {
                  bindingValue[ele] = copy_1[ele];
                });
              } else if (!isObject(bindingValue)) {
                bindingValue = ref(bindingValue);
              } else if (hasReactiveArrayChild(bindingValue)) {
                customReactive(bindingValue);
              }
            } else if (isArray(bindingValue)) {
              bindingValue = ref(bindingValue);
            }
          }
          asVmProperty(vm, name, bindingValue);
        });
        return;
      }
    }
    function customReactive(target, seen) {
      if (seen === void 0) {
        seen = /* @__PURE__ */ new Set();
      }
      if (seen.has(target))
        return;
      if (!isPlainObject(target) || isRef(target) || isReactive(target) || isRaw(target))
        return;
      var Vue3 = getVueConstructor();
      var defineReactive = Vue3.util.defineReactive;
      Object.keys(target).forEach(function(k) {
        var val = target[k];
        defineReactive(target, k, val);
        if (val) {
          seen.add(val);
          customReactive(val, seen);
        }
        return;
      });
    }
    function hasReactiveArrayChild(target, visited) {
      if (visited === void 0) {
        visited = /* @__PURE__ */ new Map();
      }
      if (visited.has(target)) {
        return visited.get(target);
      }
      visited.set(target, false);
      if (isArray(target) && isReactive(target)) {
        visited.set(target, true);
        return true;
      }
      if (!isPlainObject(target) || isRaw(target) || isRef(target)) {
        return false;
      }
      return Object.keys(target).some(function(x) {
        return hasReactiveArrayChild(target[x], visited);
      });
    }
    function createSetupContext(vm) {
      var ctx = { slots: {} };
      var propsPlain = [
        "root",
        "parent",
        "refs",
        "listeners",
        "isServer",
        "ssrContext"
      ];
      var methodReturnVoid = ["emit"];
      propsPlain.forEach(function(key) {
        var srcKey = "$".concat(key);
        proxy(ctx, key, {
          get: function() {
            return vm[srcKey];
          },
          set: function() {
          }
        });
      });
      updateVmAttrs(vm, ctx);
      methodReturnVoid.forEach(function(key) {
        var srcKey = "$".concat(key);
        proxy(ctx, key, {
          get: function() {
            return function() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
              }
              var fn = vm[srcKey];
              fn.apply(vm, args);
            };
          }
        });
      });
      return ctx;
    }
  }
  function mergeData(from, to) {
    if (!from)
      return to;
    if (!to)
      return from;
    var key;
    var toVal;
    var fromVal;
    var keys = hasSymbol ? Reflect.ownKeys(from) : Object.keys(from);
    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      if (key === "__ob__")
        continue;
      toVal = to[key];
      fromVal = from[key];
      if (!hasOwn(to, key)) {
        to[key] = fromVal;
      } else if (toVal !== fromVal && isPlainObject(toVal) && !isRef(toVal) && isPlainObject(fromVal) && !isRef(fromVal)) {
        mergeData(fromVal, toVal);
      }
    }
    return to;
  }
  function install$1(Vue2) {
    if (isVueRegistered(Vue2)) {
      return;
    }
    Vue2.config.optionMergeStrategies.setup = function(parent, child) {
      return function mergedSetupFn(props, context) {
        return mergeData(isFunction(parent) ? parent(props, context) || {} : void 0, isFunction(child) ? child(props, context) || {} : void 0);
      };
    };
    setVueConstructor(Vue2);
    mixin(Vue2);
  }
  var Plugin = {
    install: function(Vue2) {
      return install$1(Vue2);
    }
  };
  if (typeof window !== "undefined" && window.Vue) {
    window.Vue.use(Plugin);
  }
  function install(_vue) {
    _vue = _vue || Vue__default["default"];
    if (_vue && !_vue["__composition_api_installed__"])
      Vue__default["default"].use(Plugin);
  }
  install(Vue__default["default"]);
  Vue__default["default"].version;
  function tryOnScopeDispose(fn) {
    if (getCurrentScope()) {
      onScopeDispose(fn);
      return true;
    }
    return false;
  }
  const isClient = typeof window !== "undefined";
  function unrefElement(elRef) {
    var _a2;
    const plain = unref(elRef);
    return (_a2 = plain == null ? void 0 : plain.$el) != null ? _a2 : plain;
  }
  const defaultWindow = isClient ? window : void 0;
  isClient ? window.document : void 0;
  isClient ? window.navigator : void 0;
  isClient ? window.location : void 0;
  const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  const globalKey = "__vueuse_ssr_handlers__";
  _global[globalKey] = _global[globalKey] || {};
  _global[globalKey];
  var __getOwnPropSymbols$c = Object.getOwnPropertySymbols;
  var __hasOwnProp$c = Object.prototype.hasOwnProperty;
  var __propIsEnum$c = Object.prototype.propertyIsEnumerable;
  var __objRest$2 = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$c.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$c)
      for (var prop of __getOwnPropSymbols$c(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$c.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  function useResizeObserver(target, callback, options = {}) {
    const _a2 = options, { window: window2 = defaultWindow } = _a2, observerOptions = __objRest$2(_a2, ["window"]);
    let observer;
    const isSupported = window2 && "ResizeObserver" in window2;
    const cleanup = () => {
      if (observer) {
        observer.disconnect();
        observer = void 0;
      }
    };
    const stopWatch = watch(() => unrefElement(target), (el) => {
      cleanup();
      if (isSupported && window2 && el) {
        observer = new ResizeObserver(callback);
        observer.observe(el, observerOptions);
      }
    }, { immediate: true, flush: "post" });
    const stop = () => {
      cleanup();
      stopWatch();
    };
    tryOnScopeDispose(stop);
    return {
      isSupported,
      stop
    };
  }
  function useElementSize(target, initialSize = { width: 0, height: 0 }, options = {}) {
    const width = ref(initialSize.width);
    const height = ref(initialSize.height);
    useResizeObserver(target, ([entry]) => {
      width.value = entry.contentRect.width;
      height.value = entry.contentRect.height;
    }, options);
    watch(() => unrefElement(target), (ele) => {
      width.value = ele ? initialSize.width : 0;
      height.value = ele ? initialSize.height : 0;
    });
    return {
      width,
      height
    };
  }
  var _a, _b;
  isClient && (window == null ? void 0 : window.navigator) && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.platform) && /iP(ad|hone|od)/.test((_b = window == null ? void 0 : window.navigator) == null ? void 0 : _b.platform);
  function useVirtualList(list, options) {
    const containerRef = ref();
    const size = useElementSize(containerRef);
    const currentList = ref([]);
    const source = shallowRef(list);
    const state = ref({ start: 0, end: 10 });
    const { itemHeight, overscan = 5 } = options;
    const getViewCapacity = (containerHeight) => {
      if (typeof itemHeight === "number")
        return Math.ceil(containerHeight / itemHeight);
      const { start = 0 } = state.value;
      let sum = 0;
      let capacity = 0;
      for (let i = start; i < source.value.length; i++) {
        const height = itemHeight(i);
        sum += height;
        if (sum >= containerHeight) {
          capacity = i;
          break;
        }
      }
      return capacity - start;
    };
    const getOffset = (scrollTop) => {
      if (typeof itemHeight === "number")
        return Math.floor(scrollTop / itemHeight) + 1;
      let sum = 0;
      let offset = 0;
      for (let i = 0; i < source.value.length; i++) {
        const height = itemHeight(i);
        sum += height;
        if (sum >= scrollTop) {
          offset = i;
          break;
        }
      }
      return offset + 1;
    };
    const calculateRange = () => {
      const element = containerRef.value;
      if (element) {
        const offset = getOffset(element.scrollTop);
        const viewCapacity = getViewCapacity(element.clientHeight);
        const from = offset - overscan;
        const to = offset + viewCapacity + overscan;
        state.value = {
          start: from < 0 ? 0 : from,
          end: to > source.value.length ? source.value.length : to
        };
        currentList.value = source.value.slice(state.value.start, state.value.end).map((ele, index) => ({
          data: ele,
          index: index + state.value.start
        }));
      }
    };
    watch([size.width, size.height, list], () => {
      calculateRange();
    });
    const totalHeight = computed(() => {
      if (typeof itemHeight === "number")
        return source.value.length * itemHeight;
      return source.value.reduce((sum, _, index) => sum + itemHeight(index), 0);
    });
    const getDistanceTop = (index) => {
      if (typeof itemHeight === "number") {
        const height2 = index * itemHeight;
        return height2;
      }
      const height = source.value.slice(0, index).reduce((sum, _, i) => sum + itemHeight(i), 0);
      return height;
    };
    const scrollTo = (index) => {
      if (containerRef.value) {
        containerRef.value.scrollTop = getDistanceTop(index);
        calculateRange();
      }
    };
    const offsetTop = computed(() => getDistanceTop(state.value.start));
    const wrapperProps = computed(() => {
      return {
        style: {
          width: "100%",
          height: `${totalHeight.value - offsetTop.value}px`,
          marginTop: `${offsetTop.value}px`
        }
      };
    });
    const containerStyle = { overflowY: "auto" };
    return {
      list: currentList,
      scrollTo,
      containerProps: {
        ref: containerRef,
        onScroll: () => {
          calculateRange();
        },
        style: containerStyle
      },
      wrapperProps
    };
  }
  var __vue2_script = compositionApi.defineComponent({
    setup() {
      const data = [{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }, { key: 5 }];
      const { list, containerProps, wrapperProps } = useVirtualList(data, {
        itemHeight: 30
      });
      return {
        list,
        containerProps,
        containerRef: containerProps.ref,
        wrapperProps
      };
    }
  });
  var render = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [_c("div", _vm._b({ ref: "containerRef", on: { "scroll": _vm.containerProps.onScroll } }, "div", _vm.containerProps, false), [_c("div", _vm._b({}, "div", _vm.wrapperProps, false), _vm._l(_vm.list, function(item) {
      return _c("div", { key: item.index }, [_vm._v(" " + _vm._s(item.data) + " ")]);
    }), 0)])]);
  };
  var staticRenderFns = [];
  function normalizeComponent(scriptExports, render2, staticRenderFns2, functionalTemplate, injectStyles, scopeId, moduleIdentifier, shadowMode) {
    var options = typeof scriptExports === "function" ? scriptExports.options : scriptExports;
    if (render2) {
      options.render = render2;
      options.staticRenderFns = staticRenderFns2;
      options._compiled = true;
    }
    if (functionalTemplate) {
      options.functional = true;
    }
    if (scopeId) {
      options._scopeId = "data-v-" + scopeId;
    }
    var hook;
    if (moduleIdentifier) {
      hook = function(context) {
        context = context || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext;
        if (!context && typeof __VUE_SSR_CONTEXT__ !== "undefined") {
          context = __VUE_SSR_CONTEXT__;
        }
        if (injectStyles) {
          injectStyles.call(this, context);
        }
        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      };
      options._ssrRegister = hook;
    } else if (injectStyles) {
      hook = shadowMode ? function() {
        injectStyles.call(this, (options.functional ? this.parent : this).$root.$options.shadowRoot);
      } : injectStyles;
    }
    if (hook) {
      if (options.functional) {
        options._injectStyles = hook;
        var originalRender = options.render;
        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
    return {
      exports: scriptExports,
      options
    };
  }
  const __cssModules = {};
  var __component__ = /* @__PURE__ */ normalizeComponent(__vue2_script, render, staticRenderFns, false, __vue2_injectStyles, null, null, null);
  function __vue2_injectStyles(context) {
    for (let o in __cssModules) {
      this[o] = __cssModules[o];
    }
  }
  var VirtualList = /* @__PURE__ */ function() {
    return __component__.exports;
  }();
  new Vue__default["default"]({
    render: (h) => h(VirtualList)
  }).$mount("#app");
});
