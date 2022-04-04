(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash/uniq'), require('lodash/uniqBy'), require('lodash/sortBy'), require('lodash/last'), require('lodash/isDate'), require('d3-time-format'), require('d3-scale'), require('d3-time')) :
  typeof define === 'function' && define.amd ? define(['exports', 'lodash/uniq', 'lodash/uniqBy', 'lodash/sortBy', 'lodash/last', 'lodash/isDate', 'd3-time-format', 'd3-scale', 'd3-time'], factory) :
  (global = global || self, factory(global.nivo = global.nivo || {}, global['lodash/uniq'], global['lodash/uniqBy'], global['lodash/sortBy'], global['lodash/last'], global['lodash/isDate'], global.d3, global.d3, global.d3));
}(this, (function (exports, uniq, uniqBy, sortBy, last, isDate, d3TimeFormat, d3Scale, d3Time) { 'use strict';

  uniq = uniq && Object.prototype.hasOwnProperty.call(uniq, 'default') ? uniq['default'] : uniq;
  uniqBy = uniqBy && Object.prototype.hasOwnProperty.call(uniqBy, 'default') ? uniqBy['default'] : uniqBy;
  sortBy = sortBy && Object.prototype.hasOwnProperty.call(sortBy, 'default') ? sortBy['default'] : sortBy;
  last = last && Object.prototype.hasOwnProperty.call(last, 'default') ? last['default'] : last;
  isDate = isDate && Object.prototype.hasOwnProperty.call(isDate, 'default') ? isDate['default'] : isDate;

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }

  var timePrecisions = ['millisecond', 'second', 'minute', 'hour', 'day', 'month', 'year'];
  var precisionCutOffs = [function (date) {
    return date.setMilliseconds(0);
  }, function (date) {
    return date.setSeconds(0);
  }, function (date) {
    return date.setMinutes(0);
  }, function (date) {
    return date.setHours(0);
  }, function (date) {
    return date.setDate(1);
  }, function (date) {
    return date.setMonth(0);
  }];
  var precisionCutOffsByType = {
    millisecond: [],
    second: precisionCutOffs.slice(0, 1),
    minute: precisionCutOffs.slice(0, 2),
    hour: precisionCutOffs.slice(0, 3),
    day: precisionCutOffs.slice(0, 4),
    month: precisionCutOffs.slice(0, 5),
    year: precisionCutOffs.slice(0, 6)
  };
  var createPrecisionMethod = function createPrecisionMethod(precision) {
    return function (date) {
      precisionCutOffsByType[precision].forEach(function (cutOff) {
        cutOff(date);
      });
      return date;
    };
  };
  var createDateNormalizer = function createDateNormalizer(_ref) {
    var _ref$format = _ref.format,
        format = _ref$format === void 0 ? 'native' : _ref$format,
        _ref$precision = _ref.precision,
        precision = _ref$precision === void 0 ? 'millisecond' : _ref$precision,
        _ref$useUTC = _ref.useUTC,
        useUTC = _ref$useUTC === void 0 ? true : _ref$useUTC;
    var precisionFn = createPrecisionMethod(precision);
    return function (value) {
      if (value === undefined) {
        return value;
      }

      if (format === 'native' || value instanceof Date) {
        return precisionFn(value);
      }

      var parseTime = useUTC ? d3TimeFormat.utcParse(format) : d3TimeFormat.timeParse(format);
      return precisionFn(parseTime(value));
    };
  };

  var createLinearScale = function createLinearScale(_ref, data, size, axis) {
    var _ref$min = _ref.min,
        min = _ref$min === void 0 ? 0 : _ref$min,
        _ref$max = _ref.max,
        max = _ref$max === void 0 ? 'auto' : _ref$max,
        _ref$stacked = _ref.stacked,
        stacked = _ref$stacked === void 0 ? false : _ref$stacked,
        _ref$reverse = _ref.reverse,
        reverse = _ref$reverse === void 0 ? false : _ref$reverse,
        _ref$clamp = _ref.clamp,
        clamp = _ref$clamp === void 0 ? false : _ref$clamp,
        _ref$nice = _ref.nice,
        nice = _ref$nice === void 0 ? false : _ref$nice;
    var minValue;

    if (min === 'auto') {
      var _data$minStacked;

      minValue = stacked === true ? (_data$minStacked = data.minStacked) !== null && _data$minStacked !== void 0 ? _data$minStacked : 0 : data.min;
    } else {
      minValue = min;
    }

    var maxValue;

    if (max === 'auto') {
      var _data$maxStacked;

      maxValue = stacked === true ? (_data$maxStacked = data.maxStacked) !== null && _data$maxStacked !== void 0 ? _data$maxStacked : 0 : data.max;
    } else {
      maxValue = max;
    }

    var scale = d3Scale.scaleLinear().rangeRound(axis === 'x' ? [0, size] : [size, 0]).domain(reverse ? [maxValue, minValue] : [minValue, maxValue]).clamp(clamp);
    if (nice === true) scale.nice();else if (typeof nice === 'number') scale.nice(nice);
    return castLinearScale(scale, stacked);
  };
  var castLinearScale = function castLinearScale(scale) {
    var stacked = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var typedScale = scale;
    typedScale.type = 'linear';
    typedScale.stacked = stacked;
    return typedScale;
  };

  var createPointScale = function createPointScale(_spec, data, size) {
    var scale = d3Scale.scalePoint().range([0, size]).domain(data.all);
    var typedScale = scale;
    typedScale.type = 'point';
    return typedScale;
  };

  var createBandScale = function createBandScale(_ref, data, size, axis) {
    var _ref$round = _ref.round,
        round = _ref$round === void 0 ? true : _ref$round;
    var scale = d3Scale.scaleBand().range(axis === 'x' ? [0, size] : [size, 0]).domain(data.all).round(round);
    return castBandScale(scale);
  };
  var castBandScale = function castBandScale(scale) {
    var typedScale = scale;
    typedScale.type = 'band';
    return typedScale;
  };

  var createTimeScale = function createTimeScale(_ref, data, size) {
    var _ref$format = _ref.format,
        format = _ref$format === void 0 ? 'native' : _ref$format,
        _ref$precision = _ref.precision,
        precision = _ref$precision === void 0 ? 'millisecond' : _ref$precision,
        _ref$min = _ref.min,
        min = _ref$min === void 0 ? 'auto' : _ref$min,
        _ref$max = _ref.max,
        max = _ref$max === void 0 ? 'auto' : _ref$max,
        _ref$useUTC = _ref.useUTC,
        useUTC = _ref$useUTC === void 0 ? true : _ref$useUTC,
        _ref$nice = _ref.nice,
        nice = _ref$nice === void 0 ? false : _ref$nice;
    var normalize = createDateNormalizer({
      format: format,
      precision: precision,
      useUTC: useUTC
    });
    var minValue;

    if (min === 'auto') {
      minValue = normalize(data.min);
    } else if (format !== 'native') {
      minValue = normalize(min);
    } else {
      minValue = min;
    }

    var maxValue;

    if (max === 'auto') {
      maxValue = normalize(data.max);
    } else if (format !== 'native') {
      maxValue = normalize(max);
    } else {
      maxValue = max;
    }

    var scale = useUTC ? d3Scale.scaleUtc() : d3Scale.scaleTime();
    scale.range([0, size]);
    if (minValue && maxValue) scale.domain([minValue, maxValue]);
    if (nice === true) scale.nice();else if (typeof nice === 'object' || typeof nice === 'number') scale.nice(nice);
    var typedScale = scale;
    typedScale.type = 'time';
    typedScale.useUTC = useUTC;
    return typedScale;
  };

  var createLogScale = function createLogScale(_ref, data, size, axis) {
    var _ref$base = _ref.base,
        base = _ref$base === void 0 ? 10 : _ref$base,
        _ref$min = _ref.min,
        min = _ref$min === void 0 ? 'auto' : _ref$min,
        _ref$max = _ref.max,
        max = _ref$max === void 0 ? 'auto' : _ref$max;
    var hasZero = data.all.some(function (v) {
      return v === 0;
    });

    if (hasZero) {
      throw new Error("a log scale domain must not include or cross zero");
    }

    var sign;
    var hasMixedSign = false;
    data.all.filter(function (v) {
      return v != null;
    }).forEach(function (v) {
      if (hasMixedSign) return;

      if (sign === undefined) {
        sign = Math.sign(v);
      } else if (Math.sign(v) !== sign) {
        hasMixedSign = true;
      }
    });

    if (hasMixedSign) {
      throw new Error("a log scale domain must be strictly-positive or strictly-negative");
    }

    var minValue;

    if (min === 'auto') {
      minValue = data.min;
    } else {
      minValue = min;
    }

    var maxValue;

    if (max === 'auto') {
      maxValue = data.max;
    } else {
      maxValue = max;
    }

    var scale = d3Scale.scaleLog().domain([minValue, maxValue]).rangeRound(axis === 'x' ? [0, size] : [size, 0]).base(base).nice();
    var typedScale = scale;
    typedScale.type = 'log';
    return scale;
  };

  var createSymlogScale = function createSymlogScale(_ref, data, size, axis) {
    var _ref$constant = _ref.constant,
        constant = _ref$constant === void 0 ? 1 : _ref$constant,
        _ref$min = _ref.min,
        min = _ref$min === void 0 ? 'auto' : _ref$min,
        _ref$max = _ref.max,
        max = _ref$max === void 0 ? 'auto' : _ref$max,
        _ref$reverse = _ref.reverse,
        reverse = _ref$reverse === void 0 ? false : _ref$reverse;
    var minValue;

    if (min === 'auto') {
      minValue = data.min;
    } else {
      minValue = min;
    }

    var maxValue;

    if (max === 'auto') {
      maxValue = data.max;
    } else {
      maxValue = max;
    }

    var scale = d3Scale.scaleSymlog().constant(constant).rangeRound(axis === 'x' ? [0, size] : [size, 0]).nice();
    if (reverse === true) scale.domain([maxValue, minValue]);else scale.domain([minValue, maxValue]);
    var typedScale = scale;
    typedScale.type = 'symlog';
    return typedScale;
  };

  var getOtherAxis = function getOtherAxis(axis) {
    return axis === 'x' ? 'y' : 'x';
  };
  var compareValues = function compareValues(a, b) {
    return a === b;
  };
  var compareDateValues = function compareDateValues(a, b) {
    return a.getTime() === b.getTime();
  };
  function computeScale(spec, data, size, axis) {
    switch (spec.type) {
      case 'linear':
        return createLinearScale(spec, data, size, axis);

      case 'point':
        return createPointScale(spec, data, size);

      case 'band':
        return createBandScale(spec, data, size, axis);

      case 'time':
        return createTimeScale(spec, data, size);

      case 'log':
        return createLogScale(spec, data, size, axis);

      case 'symlog':
        return createSymlogScale(spec, data, size, axis);

      default:
        throw new Error('invalid scale spec');
    }
  }

  var nestSerieData = function nestSerieData(serie) {
    return _objectSpread2(_objectSpread2({}, serie), {}, {
      data: serie.data.map(function (d) {
        return {
          data: _objectSpread2({}, d)
        };
      })
    });
  };

  var getDatumAxisPosition = function getDatumAxisPosition(datum, axis, scale) {
    var _scale;

    if ('stacked' in scale && scale.stacked) {
      var stackedValue = datum.data[axis === 'x' ? 'xStacked' : 'yStacked'];

      if (stackedValue === null || stackedValue === undefined) {
        return null;
      }

      return scale(stackedValue);
    }

    return (_scale = scale(datum.data[axis])) !== null && _scale !== void 0 ? _scale : null;
  };

  var computeXYScalesForSeries = function computeXYScalesForSeries(series, xScaleSpec, yScaleSpec, width, height) {
    var nestedSeries = series.map(function (serie) {
      return nestSerieData(serie);
    });
    var xy = generateSeriesXY(nestedSeries, xScaleSpec, yScaleSpec);

    if ('stacked' in xScaleSpec && xScaleSpec.stacked === true) {
      stackX(xy, nestedSeries);
    }

    if ('stacked' in yScaleSpec && yScaleSpec.stacked === true) {
      stackY(xy, nestedSeries);
    }

    var xScale = computeScale(xScaleSpec, xy.x, width, 'x');
    var yScale = computeScale(yScaleSpec, xy.y, height, 'y');
    var computedSeries = nestedSeries.map(function (serie) {
      return _objectSpread2(_objectSpread2({}, serie), {}, {
        data: serie.data.map(function (datum) {
          return _objectSpread2(_objectSpread2({}, datum), {}, {
            position: {
              x: getDatumAxisPosition(datum, 'x', xScale),
              y: getDatumAxisPosition(datum, 'y', yScale),
              y0: getDatumAxisPosition(datum, 'y0', yScale)
            }
          });
        })
      });
    });
    return _objectSpread2(_objectSpread2({}, xy), {}, {
      series: computedSeries,
      xScale: xScale,
      yScale: yScale
    });
  };
  var generateSeriesXY = function generateSeriesXY(series, xScaleSpec, yScaleSpec) {
    return {
      x: generateSeriesAxis(series, 'x', xScaleSpec),
      y: generateSeriesAxis(series, 'y', yScaleSpec),
      y0: generateSeriesAxis(series, 'y0', yScaleSpec)
    };
  };
  var generateSeriesAxis = function generateSeriesAxis(series, axis, scaleSpec) {
    var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
        _ref$getValue = _ref.getValue,
        getValue = _ref$getValue === void 0 ? function (d) {
      return d.data[axis];
    } : _ref$getValue,
        _ref$setValue = _ref.setValue,
        setValue = _ref$setValue === void 0 ? function (d, v) {
      d.data[axis] = v;
    } : _ref$setValue;

    if (scaleSpec.type === 'linear') {
      series.forEach(function (serie) {
        serie.data.forEach(function (d) {
          var value = getValue(d);

          if (value) {
            setValue(d, parseFloat(String(value)));
          }
        });
      });
    } else if (scaleSpec.type === 'time' && scaleSpec.format !== 'native') {
      var parseTime = createDateNormalizer(scaleSpec);
      series.forEach(function (serie) {
        serie.data.forEach(function (d) {
          var value = getValue(d);

          if (value) {
            setValue(d, parseTime(value));
          }
        });
      });
    }

    var values = [];
    series.forEach(function (serie) {
      serie.data.forEach(function (d) {
        values.push(getValue(d));
      });
    });

    switch (scaleSpec.type) {
      case 'linear':
        {
          var all = sortBy(uniq(values).filter(function (v) {
            return v !== null;
          }), function (v) {
            return v;
          });
          return {
            all: all,
            min: Math.min.apply(Math, _toConsumableArray(all)),
            max: Math.max.apply(Math, _toConsumableArray(all))
          };
        }

      case 'time':
        {
          var _all = uniqBy(values, function (v) {
            return v.getTime();
          }).slice(0).sort(function (a, b) {
            return b.getTime() - a.getTime();
          }).reverse();

          return {
            all: _all,
            min: _all[0],
            max: last(_all)
          };
        }

      default:
        {
          var _all2 = uniq(values);

          return {
            all: _all2,
            min: _all2[0],
            max: last(_all2)
          };
        }
    }
  };
  var stackAxis = function stackAxis(axis, xy, series) {
    var otherAxis = getOtherAxis(axis);
    var all = [];
    xy[otherAxis].all.forEach(function (v) {
      var compare = isDate(v) ? compareDateValues : compareValues;
      var stack = [];
      series.forEach(function (serie) {
        var datum = serie.data.find(function (d) {
          return compare(d.data[otherAxis], v);
        });
        var value = null;
        var stackValue = null;

        if (datum !== undefined) {
          value = datum.data[axis];

          if (value !== null) {
            var head = last(stack);

            if (head === undefined) {
              stackValue = value;
            } else if (head !== null) {
              stackValue = head + value;
            }
          }

          datum.data[axis === 'x' ? 'xStacked' : 'yStacked'] = stackValue;
        }

        stack.push(stackValue);

        if (stackValue !== null) {
          all.push(stackValue);
        }
      });
    });
    xy[axis].minStacked = Math.min.apply(Math, all);
    xy[axis].maxStacked = Math.max.apply(Math, all);
  };

  var stackX = function stackX(xy, series) {
    return stackAxis('x', xy, series);
  };

  var stackY = function stackY(xy, series) {
    return stackAxis('y', xy, series);
  };

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  var centerScale = function centerScale(scale) {
    var bandwidth = scale.bandwidth();
    if (bandwidth === 0) return scale;
    var offset = bandwidth / 2;

    if (scale.round()) {
      offset = Math.round(offset);
    }

    return function (d) {
      var _scale;

      return ((_scale = scale(d)) !== null && _scale !== void 0 ? _scale : 0) + offset;
    };
  };
  var timeDay = d3Time.timeInterval(function (date) {
    return date.setHours(0, 0, 0, 0);
  }, function (date, step) {
    return date.setDate(date.getDate() + step);
  }, function (start, end) {
    return (end.getTime() - start.getTime()) / 864e5;
  }, function (date) {
    return Math.floor(date.getTime() / 864e5);
  });
  var utcDay = d3Time.timeInterval(function (date) {
    return date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
    return date.setUTCDate(date.getUTCDate() + step);
  }, function (start, end) {
    return (end.getTime() - start.getTime()) / 864e5;
  }, function (date) {
    return Math.floor(date.getTime() / 864e5);
  });
  var timeByType = {
    millisecond: [d3Time.timeMillisecond, d3Time.utcMillisecond],
    second: [d3Time.timeSecond, d3Time.utcSecond],
    minute: [d3Time.timeMinute, d3Time.utcMinute],
    hour: [d3Time.timeHour, d3Time.utcHour],
    day: [timeDay, utcDay],
    week: [d3Time.timeWeek, d3Time.utcWeek],
    sunday: [d3Time.timeSunday, d3Time.utcSunday],
    monday: [d3Time.timeMonday, d3Time.utcMonday],
    tuesday: [d3Time.timeTuesday, d3Time.utcTuesday],
    wednesday: [d3Time.timeWednesday, d3Time.utcWednesday],
    thursday: [d3Time.timeThursday, d3Time.utcThursday],
    friday: [d3Time.timeFriday, d3Time.utcFriday],
    saturday: [d3Time.timeSaturday, d3Time.utcSaturday],
    month: [d3Time.timeMonth, d3Time.utcMonth],
    year: [d3Time.timeYear, d3Time.utcYear]
  };
  var timeTypes = Object.keys(timeByType);
  var timeIntervalRegexp = new RegExp("^every\\s*(\\d+)?\\s*(".concat(timeTypes.join('|'), ")s?$"), 'i');

  var isInteger = function isInteger(value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  };

  var getScaleTicks = function getScaleTicks(scale, spec) {
    if (Array.isArray(spec)) {
      return spec;
    }

    if (typeof spec === 'string' && 'useUTC' in scale) {
      var matches = spec.match(timeIntervalRegexp);

      if (matches) {
        var _matches = _slicedToArray(matches, 3),
            amount = _matches[1],
            type = _matches[2];

        var timeType = timeByType[type][scale.useUTC ? 1 : 0];

        if (type === 'day') {
          var _timeType$every$range, _timeType$every;

          var _scale$domain = scale.domain(),
              _scale$domain2 = _slicedToArray(_scale$domain, 2),
              start = _scale$domain2[0],
              originalStop = _scale$domain2[1];

          var stop = new Date(originalStop);
          stop.setDate(stop.getDate() + 1);
          return (_timeType$every$range = (_timeType$every = timeType.every(Number(amount !== null && amount !== void 0 ? amount : 1))) === null || _timeType$every === void 0 ? void 0 : _timeType$every.range(start, stop)) !== null && _timeType$every$range !== void 0 ? _timeType$every$range : [];
        }

        if (amount === undefined) {
          return scale.ticks(timeType);
        }

        var interval = timeType.every(Number(amount));

        if (interval) {
          return scale.ticks(interval);
        }
      }

      throw new Error("Invalid tickValues: ".concat(spec));
    }

    if ('ticks' in scale) {
      if (spec === undefined) {
        return scale.ticks();
      }

      if (isInteger(spec)) {
        return scale.ticks(spec);
      }
    }

    return scale.domain();
  };

  exports.castBandScale = castBandScale;
  exports.castLinearScale = castLinearScale;
  exports.centerScale = centerScale;
  exports.compareDateValues = compareDateValues;
  exports.compareValues = compareValues;
  exports.computeScale = computeScale;
  exports.computeXYScalesForSeries = computeXYScalesForSeries;
  exports.createBandScale = createBandScale;
  exports.createDateNormalizer = createDateNormalizer;
  exports.createLinearScale = createLinearScale;
  exports.createLogScale = createLogScale;
  exports.createPointScale = createPointScale;
  exports.createPrecisionMethod = createPrecisionMethod;
  exports.createSymlogScale = createSymlogScale;
  exports.createTimeScale = createTimeScale;
  exports.generateSeriesAxis = generateSeriesAxis;
  exports.generateSeriesXY = generateSeriesXY;
  exports.getOtherAxis = getOtherAxis;
  exports.getScaleTicks = getScaleTicks;
  exports.precisionCutOffs = precisionCutOffs;
  exports.precisionCutOffsByType = precisionCutOffsByType;
  exports.stackAxis = stackAxis;
  exports.timePrecisions = timePrecisions;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=nivo-scales.umd.js.map