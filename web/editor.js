define(function (require) {
    var $ = require('jquery');
    require('vs/editor/editor.main');
    var _ = require('underscore');
    var v6502 = require('6502');
    var beebasm = require('beebasm-cli');
    var projfiles = require('./starquake');


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
        this.editor.getModel().setValue(state.file.data);

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
        }, this);

        this.container.on('destroy', function () {
            this.editor.dispose();
        }, this);

        this.hub.on('projectChange', this.onProjectChange, this);

        //this.hub.on('fileSelected', this.onFileSelected, this);
    }

    Editor.prototype.compile = function () {
        //this.project.files.update('starquake/starquake.asm', this.editor.getValue());
        beebasm(this.project);
                //console.log("compiled:", e);
/*                this.hub.emit('compiled', e);
                if (e.status === 0) {
                    this.hub.emit('start', e);
                } else {
                    var lineNum = parseInt(e.stderr[0].match(/(?<=:)\d+(?=:)/)[0]);
                    monaco.editor.setModelMarkers(this.editor.getModel(), 'test', [{
                        startLineNumber: lineNum,
                        startColumn: 1,
                        endLineNumber: lineNum,
                        endColumn: 1000,
                        message: e.stderr[3],
                        severity: monaco.MarkerSeverity.Error
                    }]);
                }
            }, this)).catch(function (e) {
                console.log("error", e);
                this.hub.emit('compiled', e);
            });*/
    };

    Editor.prototype.onProjectChange = function (project) {
        this.project = project;
        this.editor.getModel().setValue(project.getMainFile());
        this.compile();
    };

    return Editor;
});