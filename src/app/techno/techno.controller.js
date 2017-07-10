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
        .module('hesperides.techno')
        .controller('TechnoCtrl', TechnoController)
        .controller('TechnoSearchCtrl', TechnoSearchController);

    TechnoController.$inject = ['$location', '$mdDialog', '$routeParams', 'Techno', 'Page', 'TechnoService', 'HesperidesTemplateModal', 'Template', 'TemplateEntry', 'FileService', '$translate'];

    /* @ngInject */
    function TechnoController($location, $mdDialog, $routeParams, Techno, Page, TechnoService, HesperidesTemplateModal, Template, TemplateEntry, FileService, $translate) {
        var vm = this;
        Page.setTitle("Technos");

        vm.isWorkingCopy = $routeParams.type === "workingcopy";
        vm.isRelease = !vm.isWorkingCopy;
        vm.techno = new Techno($routeParams.name, $routeParams.version, ($routeParams.type === "workingcopy"));
        vm.templateEntries = [];

        // Label for rights
        vm.rights = [
            {label: '<default>', value: null},
            {label: 'O', value: true},
            {label: 'N', value: false}
        ];

        ////////////////

        vm.refreshModel = refreshModel;
        vm.add_template = add_template;
        vm.download_template = download_template;
        vm.download_all_template = download_all_template;
        vm.edit_template = edit_template;
        vm.save_template = save_template;
        vm.delete_template = delete_template;
        vm.create_release = create_release;
        vm.open_associated_properties_dialog = open_associated_properties_dialog;

        vm.refreshModel();

        ////////////////

        if (vm.techno.is_working_copy) {
            TechnoService.get_all_templates_from_workingcopy(vm.techno.name, vm.techno.version).then(function (templateEntries) {
                vm.templateEntries = templateEntries;
            });
        } else {
            TechnoService.get_all_templates_from_release(vm.techno.name, vm.techno.version).then(function (templateEntries) {
                vm.templateEntries = templateEntries;
            });
        }

        function refreshModel() {
            TechnoService.get_model(vm.techno.name, vm.techno.version, vm.techno.is_working_copy).then(function (model) {
                vm.model = model;
            });
        }


        function add_template() {
            HesperidesTemplateModal.edit_template({
                template: new Template(),
                isReadOnly: false,
                onSave: vm.save_template,
                add: true
            });
        }

        function download_template(template_entry) {
            download(template_entry.content, template_entry.filename, template_entry.mediaType);
        }

        function download_all_template(templateEntries) {
            // The JSZip Object
            var zip = new JSZip();
            // Adding files to zip
            templateEntries.map(function (template) {
                if (!template.on_error) {
                    zip.file(template.filename, template.content);
                }
            });
            // Generate and save the zip file
            var content = zip.generate({type: "blob"});
            saveAs(content, vm.techno.title + ".zip");
        }

        function edit_template(name) {
            if (vm.techno.is_working_copy) {
                TechnoService.get_template_from_workingcopy(vm.techno.name, vm.techno.version, name).then(function (template) {
                    HesperidesTemplateModal.edit_template({
                        template: template,
                        isReadOnly: false,
                        onSave: vm.save_template,
                        add: false
                    });
                    vm.refreshModel();
                });
            } else {
                TechnoService.get_template_from_release(vm.techno.name, vm.techno.version, name).then(function (template) {
                    HesperidesTemplateModal.edit_template({
                        template: template,
                        isReadOnly: true,
                        onSave: vm.save_template,
                        add: false
                    });
                    vm.refreshModel();
                });
            }
        }

        function save_template(template) {
            return TechnoService.save_template_in_workingcopy(vm.techno.name, vm.techno.version, template).then(function (savedTemplate) {
                //MAJ liste de templates
                var entry = _.find(vm.templateEntries, function (templateEntry) {
                    return (templateEntry.name === savedTemplate.name);
                });
                if (entry) { //It was an update
                    entry.name = savedTemplate.name;
                    entry.location = savedTemplate.location;
                    entry.filename = savedTemplate.filename;

                    entry.rights = FileService.files_rights_to_string(savedTemplate.rights);
                    if (entry.rights < 0)
                        $translate('template.rights.none').then(function (label) {
                            entry.rights = label;
                        });

                } else {
                    var right = FileService.files_rights_to_string(savedTemplate.rights);
                    var new_entry = new TemplateEntry({
                        name: savedTemplate.name,
                        content: savedTemplate.content,
                        location: savedTemplate.location,
                        filename: savedTemplate.filename,
                        rights: right
                    });
                    if (right < 0)
                        $translate('template.rights.none').then(function (label) {
                            new_entry.rights = label;
                        });
                    vm.templateEntries.push(new_entry);
                }
                vm.refreshModel();
                return savedTemplate;
            });
        }

        function delete_template(name) {
            TechnoService.delete_template_in_workingcopy(vm.techno.name, vm.techno.version, name).then(function () {
                vm.templateEntries = _.reject(vm.templateEntries, function (templateEntry) {
                    return (templateEntry.name === name); //MAJ de la liste de templates
                });
                vm.refreshModel();
            });
        }

        function create_release(r_name, r_version) {
            TechnoService.create_release(r_name, r_version).then(function () {
                $location.path('/techno/' + r_name + '/' + r_version).search({});
            });
        }

        /**
         * Affiche la liste des propriétés associées à un module.
         */
        function open_associated_properties_dialog(techno) {
            var modalScope = vm.$new(true);

            modalScope.$closeDialog = function () {
                $mdDialog.cancel();
            };

            modalScope.$save = function (release_version) {
                vm.create_release(module, release_version);
                $mdDialog.cancel();
            };

            $mdDialog.show({
                templateUrl: 'techno/techno-modal.html',
                controller: 'TechnoCtrl',
                clickOutsideToClose: true,
                scope: modalScope
            });
        }
    }

    ////////////////

    TechnoSearchController.$inject = ['$routeParams', 'TechnoService', 'Page'];

    /* @ngInject */
    function TechnoSearchController($location, $mdDialog, $routeParams, Techno, Page, TechnoService, HesperidesTemplateModal, Template, TemplateEntry, FileService, $translate) {
        var vm = this;

        Page.setTitle("Technos");

        ////////////////

        ////////////////

        /* Load technos list */
        TechnoService.all().then(function (technos) {
            vm.technos = technos;
        });
    }

})();

