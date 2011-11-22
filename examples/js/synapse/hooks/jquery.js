var __slice = Array.prototype.slice;

define(['synapse/core', 'jquery'], function(core, $) {
  var domEvents, elementBindAttributes, elementInterfaces, interfaces;
  interfaces = (function() {
    return {
      registry: {},
      register: function(config) {
        return this.registry[config.name] = config;
      },
      unregister: function(name) {
        return delete this.registry[name];
      },
      get: function() {
        var args, interface, key, name, object, _ref;
        object = arguments[0], name = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        _ref = name.split('.'), name = _ref[0], key = _ref[1];
        if (key != null) args = [key].concat(args);
        if ((interface = this.registry[name])) {
          return interface.get.apply(object, args);
        }
      },
      set: function() {
        var args, interface, key, name, object, _ref;
        object = arguments[0], name = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        _ref = name.split('.'), name = _ref[0], key = _ref[1];
        if (key != null) args = [key].concat(args);
        if ((interface = this.registry[name])) {
          return interface.set.apply(object, args);
        }
      }
    };
  })();
  (function() {
    var getAttribute, getProperty, getStyle, setAttribute, setProperty, setStyle;
    getProperty = function(key) {
      if (this.prop != null) return this.prop(key);
      return getAttribute.call(this, key);
    };
    setProperty = function(key, value) {
      if (this.prop != null) {
        if (typeof key === 'object') return this.prop(key);
        return this.prop(key, value);
      }
      return setAttribute.call(this, key, value);
    };
    getAttribute = function(key) {
      return this.attr(key);
    };
    setAttribute = function(key, value) {
      if (_.isObject(key)) {
        return this.attr(key);
      } else {
        return this.attr(key, value);
      }
    };
    getStyle = function(key) {
      return this.css(key);
    };
    setStyle = function(key, value) {
      if (_.isObject(key)) {
        return this.css(key);
      } else {
        return this.css(key, value);
      }
    };
    interfaces.register({
      name: 'text',
      get: function() {
        return this.text();
      },
      set: function(value) {
        return this.text((value || (value = '')).toString());
      }
    });
    interfaces.register({
      name: 'html',
      get: function() {
        return this.html();
      },
      set: function(value) {
        return this.html((value || (value = '')).toString());
      }
    });
    interfaces.register({
      name: 'value',
      get: function() {
        return this.val();
      },
      set: function(value) {
        return this.val(value || (value = ''));
      }
    });
    interfaces.register({
      name: 'enabled',
      get: function() {
        return !getProperty.call(this, 'disabled');
      },
      set: function(value) {
        if (_.isArray(value) && value.length === 0) value = false;
        return setProperty.call(this, 'disabled', !Boolean(value));
      }
    });
    interfaces.register({
      name: 'disabled',
      get: function() {
        return getProperty.call(this, 'disabled');
      },
      set: function(value) {
        if (_.isArray(value) && value.length === 0) value = false;
        return setProperty.call(this, 'disabled', Boolean(value));
      }
    });
    interfaces.register({
      name: 'checked',
      get: function() {
        return getProperty.call(this, 'checked');
      },
      set: function(value) {
        if (_.isArray(value) && value.length === 0) value = false;
        return setProperty.call(this, 'checked', Boolean(value));
      }
    });
    interfaces.register({
      name: 'visible',
      get: function() {
        return getStyle.call(this, 'display') === !'none';
      },
      set: function(value) {
        if (_.isArray(value) && value.length === 0) value = false;
        if (Boolean(value)) {
          return this.show();
        } else {
          return this.hide();
        }
      }
    });
    interfaces.register({
      name: 'hidden',
      get: function() {
        return getStyle.call(this, 'display') === 'none';
      },
      set: function(value) {
        if (_.isArray(value) && value.length === 0) value = false;
        if (Boolean(value)) {
          return this.hide();
        } else {
          return this.show();
        }
      }
    });
    interfaces.register({
      name: 'prop',
      get: function(key) {
        return getProperty.call(this, key);
      },
      set: function(key, value) {
        return setProperty.call(this, key, value);
      }
    });
    interfaces.register({
      name: 'attr',
      get: function(key) {
        return getAttribute.call(this, key);
      },
      set: function(key, value) {
        return setAttribute.call(this, key, value);
      }
    });
    interfaces.register({
      name: 'style',
      get: function(key) {
        return getStyle.call(this, key);
      },
      set: function(key, value) {
        return setStyle.call(this, key, value);
      }
    });
    interfaces.register({
      name: 'css',
      get: function(key) {
        return this.hasClass(key);
      },
      set: function(key, value) {
        if (_.isArray(value) && value.length === 0) value = false;
        if (Boolean(value)) {
          return this.addClass(key);
        } else {
          return this.removeClass(key);
        }
      }
    });
    return interfaces.register({
      name: 'data',
      get: function(key) {
        return this.data(key);
      },
      set: function(key, value) {
        return this.data(key, value);
      }
    });
  })();
  domEvents = [['a,:button,:reset', 'click'], ['select,:checkbox,:radio,textarea', 'change'], [':submit', 'submit'], [':input', 'keyup']];
  elementInterfaces = [[':checkbox,:radio', 'checked'], [':input', 'value']];
  elementBindAttributes = ['name', 'role', 'data-bind'];
  return {
    typeName: 'jQuery',
    domEvents: domEvents,
    elementBindAttributes: elementBindAttributes,
    elementInterfaces: elementInterfaces,
    interfaces: interfaces,
    checkObjectType: function(object) {
      return object instanceof $ || object.nodeType === 1 || core.toString.call(object) === '[object String]';
    },
    coerceObject: function(object) {
      return $(object);
    },
    getHandler: function(object, key) {
      var value;
      value = interfaces.get(object, key);
      if (value && object.is('input[type=number]')) {
        if (value.indexOf('.') > -1) {
          return parseFloat(value);
        } else {
          return parseInt(value);
        }
      }
      return value;
    },
    setHandler: function(object, key, value) {
      return interfaces.set(object, key, value);
    },
    onEventHandler: function(object, event, handler) {
      return object.bind(event, handler);
    },
    offEventHandler: function(object, event, handler) {
      return object.unbind(event, handler);
    },
    triggerEventHandler: function(object, event) {
      return object.trigger(event);
    },
    detectEvent: function(object) {
      var event, item, selector, _i, _len;
      for (_i = 0, _len = domEvents.length; _i < _len; _i++) {
        item = domEvents[_i];
        selector = item[0], event = item[1];
        if (object.is(selector)) return event;
      }
    },
    detectInterface: function(object) {
      var interface, item, selector, _i, _len;
      for (_i = 0, _len = elementInterfaces.length; _i < _len; _i++) {
        item = elementInterfaces[_i];
        selector = item[0], interface = item[1];
        if (object.is(selector)) return interface;
      }
      return 'text';
    },
    detectOtherInterface: function(object) {
      var attr, value, _i, _len;
      for (_i = 0, _len = elementBindAttributes.length; _i < _len; _i++) {
        attr = elementBindAttributes[_i];
        if ((value = object.attr(attr))) return value;
      }
    }
  };
});
