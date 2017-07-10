/*
 * This file is part of the Hesperides distribution.
 * (https://github.com/voyages-sncf-technologies/hesperides)
 * Copyright (c) 2016 VSCT.
 *
 * Hesperides is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, version 3.
 *
 * Hesperides is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
(function () {
    'use strict';

    angular
        .module('hesperides.template')
        .factory('HesperidesTemplateModal', HesperidesTemplateModalFactory)
        .factory('Template', TemplateFactory);

    HesperidesTemplateModalFactory.$inject = ['$mdDialog', '$timeout', '$mdConstant', '$rootScope'];

    /* @ngInject */
    function HesperidesTemplateModalFactory($mdDialog, $timeout, $mdConstant, $rootScope) {
        var hesperidesOverlay = {
            startState: function () {
                return {
                    inMustache: false
                }
            },
            token: function (stream, state) {
                var ch;
                if (stream.match("{{")) { //We found an hesperides token
                    state.inMustache = true; //Remember what we do
                    state.inMustacheInner = true;
                    return "hesperides";
                }
                if (state.inMustache) {
                    while ((ch = stream.next()) !== null) { //Read characters through the token
                        if (ch === "}" && stream.next() === "}") { //End of hesperides token
                            if (state.inMustacheInner) {
                                stream.backUp(2);
                                state.inMustacheInner = false;
                                return "hesperides-token"; //Color for the inner token
                            } else {
                                stream.eat("}");
                                state.inMustache = false; //Remember to update state
                                state.inMustacheInner = false;
                                return "hesperides"; //Color for the }}
                            }
                        }
                        if (ch === "|") { //Found an inner item limit
                            if (state.inMustacheInner) {
                                stream.backUp(1);
                                state.inMustacheInner = false;
                                return "hesperides-token"; //Color for the inner token
                            } else {
                                state.inMustacheInner = true;
                                return "hesperides"; //Color for the | character
                            }
                        }
                    }
                    return "hesperides-token"; //return the style for syntax highlight even if we reached end of line
                }
                while (stream.next() !== null && !stream.match("{{", false)) {
                } //Skip everything unless we find an hesperides token or reach the end of line
                return null;
            }
        };

        /* Thisis for the initialization, to make sure we have at least the simple Mustache mode selected */
        CodeMirror.defineMode("hesperides", function (config, parserConfig) {
            return CodeMirror.overlayMode(
                CodeMirror.getMode(config, parserConfig.backdrop || ""),
                hesperidesOverlay
            );
        });

        var defaultScope = {
            codemirrorFullscreenStatus: false,
            codemirrorModes: [
                {name: "Simple Hesperides", mimetype: ""},
                {name: "Properties File", mimetype: "text/x-properties"}
            ],
            codeMirrorOptions: {
                mode: 'hesperides',
                lineNumbers: false, // there is a bug on line numbers, so keep it h
                lineWrapping: true,
                extraKeys: {
                    'F11': function (cm) {
                        $('body').append($('#templateContent')); //Change the parent of codemirror because if not, fullscreen is restricted to the modal
                        $('#templateContent').children().css("z-index", 100000);
                        cm.setOption('fullScreen', true);
                        cm.focus();
                        defaultScope.codemirrorFullscreenStatus = true;
                    },
                    'Esc': function (cm) {
                        $('#templateContentParent').append($('#templateContent'));
                        if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false);
                        cm.focus();
                    }
                },
                onLoad: function (_editor) {
                    defaultScope.editor = _editor;
                    //This is some trick to avoid a bug. If not refresh, then we have to click on code mirror to see its content
                    $timeout(function () {
                        defaultScope.editor.refresh();
                    }, 500);
                }
            },
            changeCodeMirrorMode: function (new_mode) {
                var mode_name = "hesperides+" + new_mode;
                CodeMirror.defineMode(mode_name, function (config, parserConfig) {
                    return CodeMirror.overlayMode(
                        CodeMirror.getMode(config, parserConfig.backdrop || new_mode),
                        hesperidesOverlay
                    );
                });
                defaultScope.editor.setOption("mode", mode_name);
            }
        };

        return {
            edit_template: function (options) {

                var modalScope = $rootScope.$new(true);

                modalScope.template = options.template;

                modalScope.add = options.add;

                modalScope.save = options.onSave;

                modalScope.isReadOnly = options.isReadOnly;

                modalScope.$closeDialog = function () {
                    $mdDialog.cancel();
                };

                modalScope.$checkIfCodeMirrorInFullScreen = function ($event) {
                    if ($event.keyCode === $mdConstant.KEY_CODE.ESCAPE && defaultScope.codemirrorFullscreenStatus) {
                        $event.stopPropagation();
                        defaultScope.codemirrorFullscreenStatus = false;
                    }
                };

                defaultScope.codeMirrorOptions.readOnly = !!options.isReadOnly;

                angular.extend(modalScope, defaultScope);

                $mdDialog.show({
                    templateUrl: 'template/template-modal.html',
                    clickOutsideToClose: true,
                    preserveScope: true, // requiered for not freez menu see https://github.com/angular/material/issues/5041
                    scope: modalScope
                });

                modalScope.$close = function (template) {
                    modalScope.save(template).then(function (savedTemplate) {
                        modalScope.template = savedTemplate;
                        $mdDialog.cancel();
                    }).catch(function () {
                        // Do not close window if error
                    });
                };

                modalScope.$save = function (template) {
                    modalScope.save(template).then(function (savedTemplate) {
                        modalScope.template = savedTemplate;
                    });
                };
            }
        };
    }

    ////////////////

    TemplateFactory.$inject = [];

    /* @ngInject */
    function TemplateFactory() {
        var Template = function (data) {

            angular.extend(this, {
                name: "",
                filename: "",
                location: "",
                content: "",
                rights: {
                    user: {},
                    group: {}
                },
                version_id: -1
            }, data);

            this.toHesperidesEntity = function () {
                return {
                    name: this.name,
                    filename: this.filename,
                    location: this.location,
                    content: this.content,
                    version_id: this.version_id,
                    rights: this.rights
                }
            };

        };

        return Template;
    }

    ////////////////

    TemplateEntryFactory.$inject = ['$hesperidesHttp', 'Template'];

    /* @ngInject */
    function TemplateEntryFactory($http, Template) {
        var TemplateEntry = function (data) {
            angular.extend(this, {
                name: "",
                namespace: "",
                filename: "",
                location: "",
                url: "",
                content: "",
                mediaType: ""
            }, data);

            this.getTemplate = function (url) {
                return $http.get(url).then(function (response) {
                    return (new Template(response.data)).toHesperidesEntity();
                });
            };

            // methods
            this.getContent = function () {
                return $http.get(this.url).then(function (response) {
                    return response.data.content;
                }, function (error) {

                    // Errors in here, are syntax error or something like that !
                    // This is processed on the get_files_entries method.
                    return error;
                });
            };

            this.setMediaType = function () {
                switch (this.filename.substr(this.filename.lastIndexOf('.') + 1)) {
                    case 'json':
                        this.mediaType = "application/json";
                        break;
                    case 'xml':
                        this.mediaType = "application/xml";
                        break;
                    default:
                        this.mediaType = "text/plain";
                }
            };
        };

        return TemplateEntry;
    }

})();

