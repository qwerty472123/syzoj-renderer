import util from 'util';
import AsyncRenderer from './async-renderer';
import MathJaxNodePage from 'mathjax-node-page';
import EscapeHTML from 'escape-html';

function formatErrorMessage(message) {
  let htmlContext = EscapeHTML(message.trim('\n')).split('\n').join('<br>');
  return '<span class="math-rendering-error-message">'
        + htmlContext
        + '</span>';
}

// This class is previously intented to call KaTeX and MathJax in _doRender
// to render asynchronously, but then I moved to render all maths within
// a single call to MathJax, so now this class overrides doRender and handle
// all tasks in a single function. And cache is NOT used.
export default class MathRenderer extends AsyncRenderer {
  constructor(cache, callbackAddReplace) {
    // Don't cache it since a page must be rendered in the same time.
    super(null, callbackAddReplace);
  }

  addRenderTask(texCode, displayMode) {
    return this._addRenderTask({
      texCode: texCode,
      displayMode: displayMode
    });
  }

  async doRender(callbackCheckFiltered) {
    const jsdom = new MathJaxNodePage.JSDOM(), document = jsdom.window.document;

    const tasks = this.tasks.filter(task => !callbackCheckFiltered(task.uuid));
    for (const task of tasks) {
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
      this.callbackAddReplace(task.uuid, result);
    }
  }
}
