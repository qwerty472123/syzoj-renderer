const util = require('util');
const path = require('path');
const MathJaxNodePage = require('@4qwerty7/mathjax-node-page');
const EscapeHTML = require('escape-html');
const UUID = require('uuid').v4;
const katex = require('katex');
const RandomString = require('randomstring');
const ObjectHash = require('object-hash');

const AsyncRenderer = require('./async-renderer');

// Generate a random macro name for MathJax's reset macro.
const resetMacroName = 'resetMacro' + RandomString.generate({
  length: 16,
  charset: 'alphabetic'
});

function formatErrorMessage(message) {
  let htmlContext = EscapeHTML(message.trim('\n')).split('\n').join('<br>');
  return '<span class="math-rendering-error-message">'
        + htmlContext
        + '</span>';
}

Array.prototype.filterAsync = async function(callback) {
  let bools = await Promise.all(this.map(callback));
  let res = [];
  for (let i = 0; i < this.length; i++) if (bools[i]) res.push(this[i]);
  return res;
};
Promise.prototype.filterAsync = async function(callback) {
  let result = await this;
  if (result.filterAsync) return result.filterAsync(callback);
  throw new Error('No filter async');
};

// This class is intented to call KaTeX and MathJax in _doRender
// to render asynchronously, so now this class overrides doRender and handle
// all tasks in a single function.
module.exports = class MathRenderer extends AsyncRenderer {
  constructor(cache, callbackAddReplace) {
    super(cache, callbackAddReplace);
  }

  addRenderTask(texCode, displayMode) {
    return this._addRenderTask({
      texCode: texCode,
      displayMode: displayMode
    });
  }

  async doRender(callbackCheckFiltered) {
    const jsdom = new MathJaxNodePage.JSDOM(), document = jsdom.window.document;

    const tasks = await this.tasks.filter(task => !callbackCheckFiltered(task.uuid))
    .filterAsync(async task => {
      if (this.cache) {
        task.hash = ObjectHash({
          type: "TeX",
          task: task.task
        });
        const result = await this.cache.get(task.hash);
        if (result) {
          this.callbackAddReplace(task.uuid, result);
          return false;
        }
      }
      return true;
    })
    .filterAsync(async task => {
// add back katex
      try {
        let res = katex.renderToString(task.task.texCode, { displayMode: task.task.displayMode });
        res = '<span style="zoom: 1.01; ">' + res + '</span>';
        if (this.cache) {
          await this.cache.set(task.hash, res);
        }
        this.callbackAddReplace(task.uuid, res);
        return false;
      } catch (e) {
        return true;
      }
    }),
          // Add a reset macro to the beginning of the document, to let MathJax reset
          // previous user-defined macros first.
          tasksAndReset = [{
            uuid: UUID(),
            task: {
              texCode: '\\' + resetMacroName,
              displayMode: false
            }
          }, ...tasks];
    for (const task of tasksAndReset) {
      const { uuid, task: math } = task;

      const scriptTag = document.createElement('script');
      scriptTag.type = 'math/tex';
      if (math.displayMode) scriptTag.type += '; mode=display';
      scriptTag.text = math.texCode;

      const divTag = document.createElement('div');
      divTag.id = uuid;
      divTag.appendChild(scriptTag);

      document.body.appendChild(divTag);
    }

    await new Promise((resolve, reject) => {
      MathJaxNodePage.mjpage(jsdom, {
        output: 'svg',
        cssInline: false,
        errorHandler: (id, wrapperNode, sourceFormula, sourceFormat, errors) => {
          wrapperNode.innerHTML = formatErrorMessage(errors.join('\n'));
        },
        extensions: '[syzoj-renderer-mathjax]/reset.js,TeX/begingroup.js,TeX/newcommand.js,Safe.js',
        paths: {
          'syzoj-renderer-mathjax': path.join(__dirname, 'mathjax/')
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

    for (const task of tasks) {
      let result = null;
      try {
        result = document.getElementById(task.uuid).innerHTML;
      } catch (e) {
        let errorMessage = `Failed to render ${task.task.displayMode ? 'display' : 'inline'} math: `
                         + util.inspect(task.task.texCode) + '\n'
                         + e.toString();
        result = formatErrorMessage(errorMessage);
      }

      if (task.task.displayMode) result = `<p style="text-align: center; ">${result}</p>`
      if (this.cache) {
        await this.cache.set(task.hash, result);
      }
      this.callbackAddReplace(task.uuid, result);
    }
  }
}
