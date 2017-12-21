/**
 * Auxiliary class that helps to connect Toolbar to multiple Editor instances.
 */
import _ from 'lodash';

export default class Connector {
  constructor() {
    this.editors = [];
    this.markdownMonitor = null;
    this.focusedEditor = null;
    this.previousEditor = null;
    this.toolbar = null;
    this.modified = false;
  }

  /**
   * Adds a new Editor instance.
   * @param {Editor} editor
   */
  addEditor(editor) {
    this.editors.push(editor);
  }

  setFocusedEditor(editor, newState) {
    this.previousEditor = this.focusedEditor;
    this.focusedEditor = editor;
    if (this.toolbar) this.toolbar.onFocusedEditorChanged(newState);
  }

  toggleInlineMarkdown(markdown) {
    this.editors.forEach(editor => editor.setState({ markdown }));
  }

  setMarkdownMonitor(monitor) {
    this.markdownMonitor = monitor;
  }

  /**
   * Sets the Toolbar.
   * @param {Toolbar} toolbar
   */
  setToolbar(toolbar) {
    this.toolbar = toolbar;
  }

  /**
   * Removes the editor.
   * @param {Editor} editor
   */
  removeEditor(editor) {
    _.pull(this.editor, editor);
  }
}
