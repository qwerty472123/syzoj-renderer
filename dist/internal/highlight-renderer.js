"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.highlight = highlight;
exports["default"] = void 0;

var _pygmentsPromise = _interopRequireDefault(require("pygments-promise"));

var _escapeHtml = _interopRequireDefault(require("escape-html"));

var _objectHash = _interopRequireDefault(require("object-hash"));

var _objectAssignDeep = _interopRequireDefault(require("object-assign-deep"));

var _asyncRenderer = _interopRequireDefault(require("./async-renderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function highlight(_x, _x2, _x3, _x4) {
  return _highlight.apply(this, arguments);
}

function _highlight() {
  _highlight = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(code, language, cache, options) {
    var cacheKey, cachedResult, result, wrapper;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!cache) {
              _context2.next = 7;
              break;
            }

            cacheKey = (0, _objectHash["default"])({
              type: "Highlight",
              task: {
                code: code,
                language: language,
                options: options
              }
            });
            _context2.next = 4;
            return cache.get(cacheKey);

          case 4:
            cachedResult = _context2.sent;

            if (!cachedResult) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt("return", cachedResult);

          case 7:
            options = (0, _objectAssignDeep["default"])({
              pygments: {
                lexer: language,
                format: 'html',
                options: {
                  nowrap: true,
                  classprefix: 'pl-'
                }
              },
              wrapper: ['<pre><code>', '</code></pre>'],
              expandTab: null
            }, options);
            _context2.prev = 8;

            if (!(typeof options.highlighter === 'function')) {
              _context2.next = 15;
              break;
            }

            _context2.next = 12;
            return options.highlighter(code, language);

          case 12:
            result = _context2.sent;
            _context2.next = 18;
            break;

          case 15:
            _context2.next = 17;
            return _pygmentsPromise["default"].pygmentize(code, (0, _objectAssignDeep["default"])({
              lexer: language
            }, options.pygments));

          case 17:
            result = _context2.sent;

          case 18:
            _context2.next = 22;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2["catch"](8);

          case 22:
            // May error rendering.
            if (typeof result !== 'string' || result.length === 0) {
              result = (0, _escapeHtml["default"])(code);
            } // Add wrapper.


            wrapper = Array.isArray(options.wrapper) ? options.wrapper : [];
            if (typeof wrapper[0] === 'string') result = wrapper[0] + result;
            if (typeof wrapper[1] === 'string') result = result + wrapper[1]; // Expand tab.

            if (typeof options.expandTab === 'number' && options.expandTab > 0) {
              result = result.split('\t').join(' '.repeat(options.expandTab));
            }

            if (!cache) {
              _context2.next = 30;
              break;
            }

            _context2.next = 30;
            return cache.set(cacheKey, result);

          case 30:
            return _context2.abrupt("return", result);

          case 31:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[8, 20]]);
  }));
  return _highlight.apply(this, arguments);
}

var HighlightRenderer = /*#__PURE__*/function (_AsyncRenderer) {
  _inherits(HighlightRenderer, _AsyncRenderer);

  var _super = _createSuper(HighlightRenderer);

  function HighlightRenderer(cache, callbackAddReplace, options) {
    var _this;

    _classCallCheck(this, HighlightRenderer);

    _this = _super.call(this, cache, callbackAddReplace);
    _this.options = options;
    return _this;
  }

  _createClass(HighlightRenderer, [{
    key: "addRenderTask",
    value: function addRenderTask(code, language) {
      return this._addRenderTask({
        code: code,
        language: language,
        options: this.options
      });
    } // markdown-it will wrap the highlighted result if it's not started with '<pre'.
    // Wrap the uuid with a <pre> tag to make sure markdown-it's result is valid HTML
    // to prevent filter function from parse error.

  }, {
    key: "_generateUUID",
    value: function _generateUUID(uuidGenerator) {
      return '<pre>' + uuidGenerator() + '</pre>';
    } // Don't cache if language is plain -- it only need to be escaped, not highlighted.

  }, {
    key: "_shouldCache",
    value: function _shouldCache(task) {
      return task.language !== 'plain';
    }
  }, {
    key: "_doRender",
    value: function () {
      var _doRender2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(task) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return highlight(task.code, task.language, this.cache, this.options, this.highlighter);

              case 2:
                return _context.abrupt("return", _context.sent);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _doRender(_x5) {
        return _doRender2.apply(this, arguments);
      }

      return _doRender;
    }()
  }]);

  return HighlightRenderer;
}(_asyncRenderer["default"]);

exports["default"] = HighlightRenderer;