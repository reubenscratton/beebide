require.config({
    paths: {
        jquery: 'vendor/jquery/dist/jquery',
        underscore: 'vendor/underscore/underscore',
        goldenlayout: 'vendor/golden-layout/dist/goldenlayout',
        events: 'vendor/eventEmitter/EventEmitter',
        clipboard: 'vendor/clipboard/dist/clipboard',
        'raven-js': 'vendor/raven-js/dist/raven',
        promise: 'vendor/es6-promise/es6-promise',
        vs: 'vendor/monaco-editor/dev/vs',
        worker: 'vendor/requirejs-web-workers/src/worker',
        jstree: 'vendor/jstree/dist/jstree',
        jsbeeb: 'jsbeeb',
        jsunzip: 'jsbeeb/lib/jsunzip',
        'webgl-debug': 'jsbeeb/lib/webgl-debug'
    },
    shim: {
        underscore: {exports: '_'},
        bootstrap: ['jquery']
    }
});

var eventHub;

define(function (require) {
    "use strict";
    var _ = require('underscore');
    var GoldenLayout = require('goldenlayout');
    var $ = require('jquery');
    var Project = require('./project');
    var Console = require('./console');
    var Editor = require('./editor');
    var Emulator = require('./emulator');
    var Tree = require('./tree');
    var project = new Project('./starquake', 'starquake.asm', 'quake');

    var config = {
        settings: {hasHeaders: true, showPopoutIcon: false, showMaximiseIcon: false, showCloseIcon: false},
        content: [{
            type: 'column',
            content: [
               {
                type: 'row',
                height: 80, 
                content: [
                    {type: 'stack', hasHeaders: false, width: 15,  content: [
                        {type: 'component', width: 100, componentName: 'tree', componentState: {}},
                    ]},
                    {type: 'stack', id:'editorStack', width: 40, 
                        content: [
                            //{type: 'component', width: 100, componentName: 'editor', componentState: {}},
                            //{type: 'component', width: 100, componentName: 'editor', componentState: {}},
                        ]
                    },
                    {type: 'stack', hasHeaders: false, width: 45,  content: [
                        {type: 'component', width: 100, componentName: 'emulator', componentState: {}}
                    ]},
                ]},
                {type: 'stack', hasHeaders: false, height: 20,  content: [
                    {
                    type: 'component',
                    height: 100, 
                    componentName: 'console', componentState: {}
                    }
                ]},    
            ]
        }]
    };

    var root = $("#root");
    var layout = new GoldenLayout(config, root);
    eventHub = layout.eventHub;
    layout.registerComponent('tree', function (container, state) {
        return new Tree(container, state);
    });
    layout.registerComponent('editor', function (container, state) {
        return new Editor(container, state);
    });
    layout.registerComponent('emulator', function (container, state) {
        return new Emulator(container, state);
    });
    layout.registerComponent('console', function (container, state) {
        return new Console(container, state);
    });

    function onFileSelected(fileNode) {
        // Create a new item
        var stack = layout.root.getItemsById('editorStack');
        stack[0].addChild( {type: 'component', width: 100, componentName: 'editor', title: fileNode.text, componentState: {file: fileNode}} );
    }

    eventHub.on('fileSelected', onFileSelected, this);

    layout.init();

    eventHub.emit('projectChange', project);

    function sizeRoot() {
        var height = $(window).height() - root.position().top;
        root.height(height);
        layout.updateSize();
    }

    $(window).resize(sizeRoot);
    sizeRoot();
});
