"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = render;

var _markdownIt = _interopRequireDefault(require("markdown-it"));

var _markdownItMathLoose = _interopRequireDefault(require("markdown-it-math-loose"));

var _markdownItMergeCells = _interopRequireDefault(require("markdown-it-merge-cells"));

var _objectHash = _interopRequireDefault(require("object-hash"));

var _objectAssignDeep = _interopRequireDefault(require("object-assign-deep"));

var _mathRenderer = _interopRequireDefault(require("./internal/math-renderer"));

var _highlightRenderer = _interopRequireDefault(require("./internal/highlight-renderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function render(_x, _x2, _x3, _x4) {
  return _render.apply(this, arguments);
}

function _render() {
  _render = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(input, cache, callbackFilter, options) {
    var cacheKey, cachedResult, uuidReplaces, mathRenderer, highlightRenderer, renderer, htmlResult, replacedHtmlResult, uuid;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!cache) {
              _context.next = 7;
              break;
            }

            cacheKey = (0, _objectHash["default"])({
              type: "Markdown",
              task: input,
              options: options
            });
            _context.next = 4;
            return cache.get(cacheKey);

          case 4:
            cachedResult = _context.sent;

            if (!cachedResult) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", cachedResult);

          case 7:
            // Merge options with default values and normalize non-object input for options.
            options = Object.assign({
              markdownItMergeCells: true
            }, options); // Maths and highlights are rendered asynchronously, so a UUID placeholder is
            // returned to markdown-it during markdown rendering process. After markdown
            // and these finish rendering, replace the placeholder with rendered content
            // in markdown rendering result.

            uuidReplaces = {};
            mathRenderer = new _mathRenderer["default"](cache, function (uuid, result) {
              uuidReplaces[uuid] = result;
            });
            highlightRenderer = new _highlightRenderer["default"](cache, function (uuid, result) {
              uuidReplaces[uuid] = result;
            }, options.highlight);
            renderer = new _markdownIt["default"]((0, _objectAssignDeep["default"])({
              html: true,
              breaks: false,
              linkify: true,
              typographer: false,
              highlight: function highlight(code, language) {
                return highlightRenderer.addRenderTask(code, language);
              }
            }, options.markdownIt));
            renderer.use(_markdownItMathLoose["default"], (0, _objectAssignDeep["default"])({
              inlineOpen: '$',
              inlineClose: '$',
              blockOpen: '$$',
              blockClose: '$$',
              inlineRenderer: function inlineRenderer(str) {
                return mathRenderer.addRenderTask(str, false);
              },
              blockRenderer: function blockRenderer(str) {
                return mathRenderer.addRenderTask(str, true);
              }
            }, options.markdownItMath)); // Inject merge table cell support.

            if (options.markdownItMergeCells) {
              renderer.use(_markdownItMergeCells["default"]);
            }

            htmlResult = renderer.render(input);

            if (callbackFilter) {
              // Useful for XSS filtering.
              htmlResult = callbackFilter(htmlResult);
            } // Do math and highlight rendering.


            _context.next = 18;
            return mathRenderer.doRender(function (uuid) {
              return htmlResult.indexOf(uuid) === -1;
            });

          case 18:
            _context.next = 20;
            return highlightRenderer.doRender(function (uuid) {
              return htmlResult.indexOf(uuid) === -1;
            });

          case 20:
            // Replace placeholders back.
            replacedHtmlResult = htmlResult;

            for (uuid in uuidReplaces) {
              replacedHtmlResult = replacedHtmlResult.replace(uuid, uuidReplaces[uuid]);
            } // Set cache.


            if (!cache) {
              _context.next = 25;
              break;
            }

            _context.next = 25;
            return cache.set(cacheKey, replacedHtmlResult);

          case 25:
            return _context.abrupt("return", replacedHtmlResult);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _render.apply(this, arguments);
}