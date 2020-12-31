define(function (require) {
    var $ = require('jquery');
    require('vs/editor/editor.main');
    var _ = require('underscore');
    var v6502 = require('6502');


    monaco.languages.register({'id': '6502'});
    monaco.languages.setMonarchTokensProvider('6502', v6502);
    function Editor(container, state) {
        this.container = container;
        this.hub = container.layoutManager.eventHub;
        var root = container.getElement().html($('#editor').html());
        this.editor = monaco.editor.create(root.find(".editor")[0], {
            value: '',
            language: '6502',
            wordWrap: 'on',
            minimap: {
               enabled: false
           }
        });
        this.editor.getModel().setValue(project.getFileContents(state.file.id));

/*
        this.editor.addAction({
            id: 'compile',
            label: 'Compile',
            keybindings: [monaco.KeyCode.F5],
            run: _.bind(function () {
                this.compile();
                return monaco.Promise.wrap(true);
            }, this)
        });
*/
        this.container.on('resize', function () {
            this.editor.layout();
        }, this);

        this.container.on('shown', function () {
            this.editor.layout();
            this.onErrorsChanged();
        }, this);

        this.container.on('destroy', function () {
            this.editor.dispose();
        }, this);

        //this.hub.on('projectChange', this.onProjectChange, this);

        //this.hub.on('fileSelected', this.onFileSelected, this);

        this.hub.on('errorsChanged', this.onErrorsChanged, this);
    }

    Editor.prototype.onErrorsChanged = function() {
        var markers = [];
        for (var e of project.errors) {
            if (e.srcfile !== this.container._config.componentState.file.id.substring(1)) {
                continue;
            }
            markers.push({
                startLineNumber: e.lineNum,
                startColumn: 1,
                endLineNumber: e.lineNum,
                endColumn: 1000,
                message: e.message,
                severity: monaco.MarkerSeverity.Error
            });
        }
        monaco.editor.setModelMarkers(this.editor.getModel(), 'test', markers);

    }

    /*Editor.prototype.onProjectChange = function (project) {
        this.project = project;
        this.editor.getModel().setValue(project.getMainFile());
        this.compile();
    };*/

    return Editor;
});