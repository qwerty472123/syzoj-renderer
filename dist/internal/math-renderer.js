"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = _interopRequireDefault(require("util"));

var _path = _interopRequireDefault(require("path"));

var _mathjaxNodePage = _interopRequireDefault(require("mathjax-node-page"));

var _escapeHtml = _interopRequireDefault(require("escape-html"));

var _uuid = _interopRequireDefault(require("uuid"));

var _randomstring = _interopRequireDefault(require("randomstring"));

var _asyncRenderer = _interopRequireDefault(require("./async-renderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

// Generate a random macro name for MathJax's reset macro.
var resetMacroName = 'resetMacro' + _randomstring["default"].generate({
  length: 16,
  charset: 'alphabetic'
});

function formatErrorMessage(message) {
  var htmlContext = (0, _escapeHtml["default"])(message.trim('\n')).split('\n').join('<br>');
  return '<span class="math-rendering-error-message">' + htmlContext + '</span>';
} // This class is previously intented to call KaTeX and MathJax in _doRender
// to render asynchronously, but then I moved to render all maths within
// a single call to MathJax, so now this class overrides doRender and handle
// all tasks in a single function. And cache is NOT used.


var MathRenderer = /*#__PURE__*/function (_AsyncRenderer) {
  _inherits(MathRenderer, _AsyncRenderer);

  var _super = _createSuper(MathRenderer);

  function MathRenderer(cache, callbackAddReplace) {
    _classCallCheck(this, MathRenderer);

    // Don't cache it since a page must be rendered in the same time.
    return _super.call(this, null, callbackAddReplace);
  }

  _createClass(MathRenderer, [{
    key: "addRenderTask",
    value: function addRenderTask(texCode, displayMode) {
      return this._addRenderTask({
        texCode: texCode,
        displayMode: displayMode
      });
    }
  }, {
    key: "doRender",
    value: function () {
      var _doRender = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(callbackCheckFiltered) {
        var jsdom, document, tasks, tasksAndReset, _iterator, _step, task, uuid, math, scriptTag, divTag, _iterator2, _step2, _task, result, errorMessage;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                jsdom = new _mathjaxNodePage["default"].JSDOM(), document = jsdom.window.document;
                tasks = this.tasks.filter(function (task) {
                  return !callbackCheckFiltered(task.uuid);
                }), tasksAndReset = [{
                  uuid: (0, _uuid["default"])(),
                  task: {
                    texCode: '\\' + resetMacroName,
                    displayMode: false
                  }
                }].concat(_toConsumableArray(tasks));
                _iterator = _createForOfIteratorHelper(tasksAndReset);

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    task = _step.value;
                    uuid = task.uuid, math = task.task;
                    scriptTag = document.createElement('script');
                    scriptTag.type = 'math/tex';
                    if (math.displayMode) scriptTag.type += '; mode=display';
                    scriptTag.text = math.texCode;
                    divTag = document.createElement('div');
                    divTag.id = uuid;
                    divTag.appendChild(scriptTag);
                    document.body.appendChild(divTag);
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }

                _context.next = 6;
                return new Promise(function (resolve, reject) {
                  _mathjaxNodePage["default"].mjpage(jsdom, {
                    output: 'svg',
                    cssInline: false,
                    errorHandler: function errorHandler(id, wrapperNode, sourceFormula, sourceFormat, errors) {
                      wrapperNode.innerHTML = formatErrorMessage(errors.join('\n'));
                    },
                    extensions: '[syzoj-renderer-mathjax]/reset.js,TeX/begingroup.js,TeX/newcommand.js,Safe.js',
                    paths: {
                      'syzoj-renderer-mathjax': _path["default"].join(__dirname, 'mathjax/')
                    },
                    MathJax: {
                      Safe: {
                        allow: {
                          require: 'none'
                        }
                      },
                      Reset: {
                        resetMacroName: resetMacroName
                      }
                    }
                  }, {}, resolve);
                });

              case 6:
                _iterator2 = _createForOfIteratorHelper(tasks);

                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    _task = _step2.value;
                    result = null;

                    try {
                      result = document.getElementById(_task.uuid).innerHTML;
                    } catch (e) {
                      errorMessage = "Failed to render ".concat(_task.task.displayMode ? 'display' : 'inline', " math: ") + _util["default"].inspect(_task.task.texCode) + '\n' + e.toString();
                      result = formatErrorMessage(errorMessage);
                    }

                    if (_task.task.displayMode) result = "<p style=\"text-align: center; \">".concat(result, "</p>");
                    this.callbackAddReplace(_task.uuid, result);
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function doRender(_x) {
        return _doRender.apply(this, arguments);
      }

      return doRender;
    }()
  }]);

  return MathRenderer;
}(_asyncRenderer["default"]);

exports["default"] = MathRenderer;