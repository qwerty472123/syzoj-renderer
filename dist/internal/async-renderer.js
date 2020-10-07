"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _uuid = require("uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AsyncRenderer = /*#__PURE__*/function () {
  function AsyncRenderer(cache, callbackAddReplace) {
    _classCallCheck(this, AsyncRenderer);

    this.cache = cache;
    this.callbackAddReplace = callbackAddReplace;
    this.tasks = [];
  }

  _createClass(AsyncRenderer, [{
    key: "_generateUUID",
    value: function _generateUUID(uuidGenerator) {
      return uuidGenerator();
    }
  }, {
    key: "_addRenderTask",
    value: function _addRenderTask(task) {
      var uuid = this._generateUUID(_uuid.v4);

      this.tasks.push({
        uuid: uuid,
        task: task
      });
      return uuid;
    }
  }, {
    key: "doRender",
    value: function () {
      var _doRender = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee2(callbackCheckFiltered) {
        var _this = this;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return Promise.all(this.tasks.filter(function (task) {
                  return !callbackCheckFiltered(task.uuid);
                }).map( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee(task) {
                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.t0 = _this;
                            _context.t1 = task.uuid;
                            _context.next = 4;
                            return _this._doRender(task.task);

                          case 4:
                            _context.t2 = _context.sent;
                            return _context.abrupt("return", _context.t0.callbackAddReplace.call(_context.t0, _context.t1, _context.t2));

                          case 6:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x2) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function doRender(_x) {
        return _doRender.apply(this, arguments);
      }

      return doRender;
    }()
  }]);

  return AsyncRenderer;
}();

exports["default"] = AsyncRenderer;