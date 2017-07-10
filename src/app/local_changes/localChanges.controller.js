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
        .module('hesperides.localChanges')
        .controller('UnitedNationsController', UnitedNationsController);

    UnitedNationsController.$inject = ['Comments', 'ApplicationService', 'LocalChanges', 'LocalChangesUtils', 'ModuleService', '$mdDialog', '$translate'];

    /* @ngInject */
    function UnitedNationsController(Comments, ApplicationService, LocalChanges, LocalChangesUtils, ModuleService, $mdDialog, $translate) {
        var vm = this;

        vm.comments = new Comments();
        vm.localChanges = [];
        vm.raw_comment = raw_comment;

        ////////////////

        activate();
        vm.sync_search_text = sync_search_text;
        vm.save_properties = save_properties;
        vm.saveAllChanges = saveAllChanges;
        vm.smart_exit_united_nation_popup = smart_exit_united_nation_popup;
        vm.clear_localChanges_from_scope = clear_localChanges_from_scope;
        vm.has_differences = has_differences;
        vm.save_one = save_one;
        vm.loadLocalChanges = loadLocalChanges;
        vm.open = open;
        vm.getConflict = getConflict;

        ////////////////

        function sync_search_text(selected_comment, raw_comment) {
            vm.raw_comment = selected_comment && selected_comment.length > 0 ? selected_comment.comment : raw_comment;
        }

        function save_properties() {

            if (vm.properties_to_save.length > 0) {

                var properties = vm.properties_to_save.pop();

                _.forEach(properties.properties, function (property) {
                    property.value = property.applied_value !== undefined ? property.applied_value : property.value;
                });
                properties.model.key_value_properties = angular.copy(properties.properties);

                if (vm.has_differences(properties.model.key_value_properties)) {
                    ApplicationService.save_properties(vm.platform.application_name, vm.platform, properties.model, properties.module.properties_path, properties.comment).then(function (new_properties) {
                        // Removing local changes sinces they have been saved
                        LocalChanges.clearLocalChanges({
                            'application_name': vm.platform.application_name,
                            'platform': vm.platform.name,
                            'properties_path': properties.module.properties_path
                        });
                        vm.clear_localChanges_from_scope(properties.module.properties_path);
                        // Increase platform number
                        vm.platform.version_id = vm.platform.version_id + 1;
                        // Recursive call to empty 'vm.properties_to_save' stack
                        vm.save_properties();
                    }).catch(function () {
                        vm.save_properties();
                    });
                } else {
                    LocalChanges.clearLocalChanges({
                        'application_name': vm.platform.application_name,
                        'platform': vm.platform.name,
                        'properties_path': properties.module.properties_path
                    });
                    vm.clear_localChanges_from_scope(properties.module.properties_path);
                    $translate('properties-not-changed.message').then(function (label) {
                        $.notify(label + "\n-> " + properties.module.properties_path, "warn");
                    });
                    // Recursive call to empty 'vm.properties_to_save' stack
                    vm.save_properties();
                }
            } else {
                vm.smart_exit_united_nation_popup();
            }
        }

        function saveAllChanges() {

            _.forEach(vm.localChanges, function (localChange) {
                localChange.comment = vm.raw_comment;
            });

            vm.properties_to_save = angular.copy(vm.localChanges);

            vm.comments.addComment(vm.platform.application_name, vm.raw_comment);
            vm.raw_comment = '';

            vm.save_properties();
        }

        function smart_exit_united_nation_popup() {
            if (LocalChanges.platformLocalChanges(vm.platform).length === 0) {
                $mdDialog.hide(vm.modal);
            }
        }

        function clear_localChanges_from_scope(properties_path) {
            vm.localChanges = _.filter(vm.localChanges, function (localChange) {
                return localChange.module.properties_path !== properties_path
            });
        }

        function has_differences(key_value_properties) {
            return _.some(key_value_properties, function (property) {
                return (property.filtrable_value && property.value !== property.filtrable_value) || (!property.filtrable_value && property.value && property.value.length > 0)
            });
        }

        function save_one(properties) {
            _.forEach(properties.properties, function (property) {
                property.value = property.applied_value !== undefined ? property.applied_value : property.value;
            });
            properties.model.key_value_properties = angular.copy(properties.properties);

            if (vm.has_differences(properties.model.key_value_properties)) {
                ApplicationService.save_properties(vm.platform.application_name, vm.platform, properties.model, properties.module.properties_path, properties.raw_comment).then(function (new_properties) {
                    // Removing local changes sinces they have been saved
                    LocalChanges.clearLocalChanges({
                        'application_name': vm.platform.application_name,
                        'platform': vm.platform.name,
                        'properties_path': properties.module.properties_path
                    });
                    vm.clear_localChanges_from_scope(properties.module.properties_path);
                    // Increase platform number
                    vm.platform.version_id = vm.platform.version_id + 1;
                    vm.smart_exit_united_nation_popup(properties);
                });
                vm.comments.addComment(vm.platform.application_name, properties.raw_comment);
                properties.raw_comment = '';
            } else {
                // Removing local changes since they already are identical with the remote value
                LocalChanges.clearLocalChanges({
                    'application_name': vm.platform.application_name,
                    'platform': vm.platform.name,
                    'properties_path': properties.module.properties_path
                });
                vm.clear_localChanges_from_scope(properties.module.properties_path);
                $translate('properties-not-changed.message').then(function (label) {
                    $.notify(label + "\n-> " + properties.module.properties_path, "warn");
                });
                vm.smart_exit_united_nation_popup(properties);
            }
        }

        function loadLocalChanges(platform) {

            ApplicationService.get_platform(platform.application_name, platform.name).then(function (response) {
                platform.version_id = response.version_id;
            });
            _.forEach(LocalChanges.platformLocalChanges(platform), function (full_path) {

                var curApplicationName = LocalChangesUtils.extractApplicationName(full_path);
                var curPlatformName = LocalChangesUtils.extractPlatformName(full_path);
                var curPropertiesPath = LocalChangesUtils.extractPropertiesPath(full_path);

                ApplicationService.get_properties(curApplicationName, curPlatformName, curPropertiesPath).then(function (properties) {

                    var module = _.filter(platform.modules, function (module) {
                        return module.properties_path === curPropertiesPath;
                    })[0];

                    ModuleService.get_model(module).then(function (model) {
                        var tmpProperties = properties.mergeWithModel(model);

                        //Merge with global properties
                        tmpProperties = properties.mergeWithGlobalProperties(platform.global_properties);
                        model.iterable_properties = angular.copy(tmpProperties.iterable_properties);

                        if (LocalChanges.smartClearLocalChanges({
                                'application_name': vm.platform.application_name,
                                'platform': vm.platform.name,
                                'properties_path': module.properties_path
                            }, tmpProperties)) {
                            $translate('localChange.deleted.smart').then(function (label) {
                                $.notify(label + "\n-> " + module.properties_path, {
                                    "className": "warn",
                                    "autoHideDelay": 12000
                                });
                            });
                            vm.smart_exit_united_nation_popup();
                        }

                        if (LocalChanges.hasLocalChanges(curApplicationName, curPlatformName, curPropertiesPath)) {
                            tmpProperties = LocalChanges.mergeWithLocalProperties(curApplicationName, curPlatformName, curPropertiesPath, tmpProperties);
                            vm.localChanges.push({
                                'properties': tmpProperties.key_value_properties,
                                'model': model,
                                'module': module
                            })
                        }
                    });
                });
            });
        }

        function open(index) {
            if (index === vm.isOpen) {
                vm.isOpen = undefined;
            } else {
                vm.isOpen = index;
            }
        }

        function getConflict(properties) {
            return _.filter(properties, function (property) {
                return property.inLocal === true;
            });
        }

    }

})();
