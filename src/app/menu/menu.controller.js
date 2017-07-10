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
        .module('hesperides.menu')
        .controller('MenuTechnoCtrl', MenuTechnoController)
        .controller('MenuModuleCtrl', MenuModuleController)
        .controller('MenuPropertiesCtrl', MenuPropertiesController)
        .controller('MenuHelpCtrl', MenuHelpController);

    MenuTechnoController.$inject = ['$mdDialog', '$location', '$timeout', 'TechnoService'];

    /* @ngInject */
    function MenuTechnoController($mdDialog, $location, $timeout, TechnoService) {
        var vm = this;

        ////////////////

        vm.closeDialog = closeDialog;
        vm.find_technos_by_name = find_technos_by_name;
        vm.open_create_techno_dialog = open_create_techno_dialog;
        vm.open_create_techno_from_dialog = open_create_techno_from_dialog;
        vm.create_techno_from = create_techno_from;
        vm.open_techno_page = open_techno_page;

        ////////////////

        function closeDialog() {
            $mdDialog.cancel();
        }

        function find_technos_by_name(name) {
            return TechnoService.with_name_like(name);
        }

        function open_create_techno_dialog() {
            $mdDialog.show({
                templateUrl: 'techno/techno-menu-modal.html',
                controller: 'MenuTechnoCtrl',
                clickOutsideToClose: true,
                preserveScope: true, // required for not freeze menu see https://github.com/angular/material/issues/5041
                scope: vm
            });
        }

        function open_create_techno_from_dialog() {
            $mdDialog.show({
                templateUrl: 'techno/techno-menu-modal-from.html',
                controller: 'MenuTechnoCtrl',
                clickOutsideToClose: true,
                preserveScope: true // requiered for not freez menu
                // Remove scope cause else with autocomplete, window is closed
                //scope:$scope
            });
        }

        function create_techno_from(name, version, fromName, fromVersion, isFromWorkingCopy) {
            TechnoService.create_workingcopy(name, version, fromName, fromVersion, isFromWorkingCopy).then(function () {
                vm.open_techno_page(name, version, true);
            });
        }

        function open_techno_page(name, version, is_working_copy, fakeButton) {
            if (is_working_copy) {
                $location.path('/techno/' + name + '/' + version).search({type: "workingcopy"});
            } else {
                $location.path('/techno/' + name + '/' + version).search({});
            }
            vm.technoSearched = "";
            $mdDialog.cancel();

            // Very bad trick to close menu :-(
            if (fakeButton) {
                $timeout(function () {
                    $(fakeButton).click();
                }, 0);
            }
        }
    }

    ////////////////

    MenuModuleController.$inject = ['$mdDialog', '$location', '$timeout', 'ModuleService', 'Module'];

    /* @ngInject */
    function MenuModuleController($mdDialog, $location, $timeout, ModuleService, Module) {
        var vm = this;

        ////////////////

        vm.closeDialog = closeDialog;
        vm.selectedItemChange = selectedItemChange;
        vm.find_modules_by_name = find_modules_by_name;
        vm.create_module = create_module;
        vm.create_module_from = create_module_from;
        vm.open_create_module_dialog = open_create_module_dialog;
        vm.open_create_module_from_dialog = open_create_module_from_dialog;

        ////////////////

        function closeDialog() {
            $mdDialog.cancel();
        }

        function selectedItemChange(item) {
            $log.info('Item changed to ' + JSON.stringify(item));
        }

        function find_modules_by_name(name) {
            return ModuleService.with_name_like(name);
        }

        function create_module(name, version) {
            var module = new Module({name: name, version: version});
            ModuleService.save(module).then(function (module) {
                vm.open_module_page(module.name, module.version, module.is_working_copy);
            });
        }

        function create_module_from(name, version, moduleFrom) {
            ModuleService.create_workingcopy_from(name, version, moduleFrom).then(function () {
                vm.open_module_page(name, version, true);
                $mdDialog.cancel();
            });
        }

        function open_module_page(name, version, is_working_copy, fakeButton) {
            if (is_working_copy) {
                $location.path('/module/' + name + '/' + version).search({type: "workingcopy"});
            } else {
                $location.path('/module/' + name + '/' + version).search({});
            }
            vm.moduleSearched = "";
            $mdDialog.cancel();

            // Very bad trick to close menu :-(
            if (fakeButton) {
                $timeout(function () {
                    $(fakeButton).click();
                }, 0);
            }
        }

        function open_create_module_dialog() {
            $mdDialog.show({
                templateUrl: 'module/module-menu-modal.html',
                controller: 'MenuModuleCtrl',
                clickOutsideToClose: true,
                preserveScope: true, // requiered for not freez menu
                scope: vm
            });
        }

        function open_create_module_from_dialog() {
            $mdDialog.show({
                templateUrl: 'module/module-menu-modal-from.html',
                controller: 'MenuModuleCtrl',
                clickOutsideToClose: true,
                preserveScope: true // requiered for not freez menu
                // Remove scope cause else with autocomplete, window is closed
                //scope:$scope
            });
        }
    }

    ////////////////

    MenuPropertiesController.$inject = ['$hesperidesHttp', '$mdDialog', '$location', '$timeout', 'ApplicationService', 'Platform'];

    /* @ngInject */
    function MenuPropertiesController($http, $mdDialog, $location, $timeout, ApplicationService, Platform) {
        var vm = this;

        vm.new_platform_already_exist = false;
        vm.apps = null;
        vm.properties = null;

        ////////////////

        vm.closeDialog = closeDialog;
        vm.reload = reload;
        vm.find_applications_by_name = find_applications_by_name;
        vm.find_platforms_of_application = find_platforms_of_application;
        vm.open_properties_page = open_properties_page;
        vm.create_platform = create_platform;
        vm.create_platform_from = create_platform_from;
        vm.open_create_platform_dialog = open_create_platform_dialog;
        vm.open_create_platform_from_dialog = open_create_platform_from_dialog;
        vm.check_new_platform_already_exist = check_new_platform_already_exist;

        ////////////////

        function closeDialog() {
            $mdDialog.cancel();
        }

        /**
         * This set the current page by the created platform page.
         * Used for reloading page after platform creation.
         * This could be improved.
         */
        function reload(application, platform) {
            var path = '/properties/' + application;
            $location.url(path).search({platform: platform});
            location.reload();
        }

        ApplicationService.with_name_like("").then(function (response) {
            vm.apps = response.map(function (elem) {
                return elem.name
            })
        });

        function find_applications_by_name(name) {
            return ApplicationService.with_name_like(name);
        }

        function find_platforms_of_application(application_name, filter_env) {
            return ApplicationService.get_platform_name_of_application(application_name, filter_env.toLowerCase());
        }

        function open_properties_page(application_name, platform_name, fakeButton, secure) {

            if (secure || !secure && apps.indexOf(application_name) !== -1) {

                var path = '/properties/' + application_name;
                $location.url(path).search({platform: platform_name});
                vm.applicationSearched = "";
                $mdDialog.cancel();

                // Very bad trick to close menu :-(
                if (fakeButton) {
                    $timeout(function () {
                        $(fakeButton).click();
                    }, 0);
                }
            }
        }

        function create_platform(application_name, platform_name, production, application_version) {
            var platform = new Platform({
                name: platform_name,
                application_name: application_name,
                application_version: application_version,
                production: production
            });
            ApplicationService.save_platform(platform).then(function (platform) {
                vm.open_properties_page(platform.application_name, platform.platform_name);
            });

            reload(application_name, platform_name);
        }

        /**
         * Create a new platform from existing platform by copying all the characteristics.
         * This function presents two options to the user: copying the instances or not.
         * Modified by Sahar CHAILLOU on 25/01/2016.
         */
        function create_platform_from(application_name, platform_name, production, application_version, from_application, from_platform, copyInstances) {
            var platform;

            if (vm.new_platform_already_exist && vm.new_platform.override_existing) {
                ApplicationService.delete_platform(application_name, platform_name);
            }

            if (copyInstances) {
                // Clone the platform
                platform = new Platform({
                    name: platform_name,
                    application_name: application_name,
                    application_version: application_version,
                    production: production
                });
                ApplicationService.create_platform_from(platform, from_application, from_platform).then(function (platform) {
                    vm.open_properties_page(platform.application_name, platform.name);
                    reload(application_name, platform_name);
                }).catch(function (e) {
                });


            } else {
                //Get the existing platform
                $http.get('rest/applications/' + encodeURIComponent(from_application) + '/platforms/' + encodeURIComponent(from_platform)).then(function (response) {
                    // Create a new platform from the get's response and change the main properties with the target values
                    platform = new Platform(response.data);
                    platform.name = platform_name;
                    platform.application_name = application_name;
                    platform.production = production;
                    platform.application_version = application_version;
                    platform.version_id = -1;

                    //Empty the instances for each module (we don't want to copy the instances)
                    _.each(platform.modules, function (module) {
                        module.delete_instances();
                    });

                    // Saving the platform as a creation
                    ApplicationService.save_platform(platform, true);
                    platform.version_id = 0;

                    // Save the properties for each module
                    _.each(platform.modules, function (module) {
                        var module_type;

                        //Get the module's type
                        if (module.is_working_copy) {
                            module_type = 'WORKINGCOPY';
                        } else {
                            module_type = 'RELEASE';
                        }

                        // Instantiate the properties path
                        var path = module.path + '#' + module.name + '#' + module.version + '#' + module_type;

                        // Get the properties from the existing platform
                        ApplicationService.get_properties(from_application, from_platform, path).then(function (properties) {
                            properties = properties.to_rest_entity();
                            // Save the properties for the new platform
                            $http.post('rest/applications/' + encodeURIComponent(platform.application_name) + '/platforms/' + encodeURIComponent(platform.name) + '/properties?path=' + encodeURIComponent(path) + '&platform_vid=' + encodeURIComponent(platform.version_id), properties);
                        });

                    });

                    vm.open_properties_page(platform.application_name, platform.name);
                    reload(application_name, platform_name);
                }, function (error) {
                    $.notify(error.data.message, "error");
                    throw error;
                })
            }
        }

        function open_create_platform_dialog() {

            /**
             * This function will determine if the authenticated user
             * is a production user or not.
             * See user.js for more details about : HesperidesAuthenticator
             */
            vm.isProductionUser = function () {
                return !_.isUndefined(hesperidesUser) ? hesperidesUser.isProdUser : false;
            };

            $mdDialog.show({
                templateUrl: 'properties/platform-menu-modal.html',
                controller: 'MenuPropertiesCtrl',
                clickOutsideToClose: true,
                preserveScope: true, // requiered for not freez menu
                scope: vm
            });
        }

        function open_create_platform_from_dialog() {
            var modalScope = vm.$new(true);

            modalScope.applicationSearched = "";

            modalScope.isProductionUser = function () {
                return !_.isUndefined(hesperidesUser) ? hesperidesUser.isProdUser : false;
            };

            $mdDialog.show({
                templateUrl: 'properties/platform-menu-modal-from.html',
                controller: 'MenuPropertiesCtrl',
                clickOutsideToClose: true,
                preserveScope: true, // requiered for not freez menu
                scope: modalScope
            });
        }

        function check_new_platform_already_exist() {
            return ApplicationService.get_platform_name_of_application(vm.new_platform.application_name ? vm.new_platform.application_name.toLowerCase() : '',
                vm.new_platform.platform_name ? vm.new_platform.platform_name.toLowerCase() : '', false).then(function (response) {

                if (_.some(response, {"name": vm.new_platform.platform_name})) {
                    ApplicationService.get_platform(vm.new_platform.application_name, vm.new_platform.platform_name, undefined, true).then(function () {
                        vm.new_platform_already_exist = true;
                    }, function () {
                        vm.new_platform_already_exist = false;
                    });
                } else {
                    vm.new_platform_already_exist = false;
                }
            });
        }
    }

    ////////////////

    MenuHelpController.$inject = ['$mdDialog', '$hesperidesHttp', 'hesperidesGlobals', '$translate', 'PlatformColorService', '$parse', 'ApplicationService'];

    /* @ngInject */
    function MenuHelpController($mdDialog, $http, hesperidesGlobals, $translate, PlatformColorService, $parse, ApplicationService) {
        var vm = this;

        ////////////////

        vm.closeDialog = closeDialog;
        vm.change_language = change_language;
        vm.find_applications_by_name = find_applications_by_name;
        vm.display_hesperides_informations = display_hesperides_informations;
        vm.display_settings = display_settings;
        vm.display_swagger = display_swagger;

        ////////////////

        function closeDialog() {
            $mdDialog.cancel();
        }

        function change_language(langKey) {
            $translate.use(langKey);

            if (langKey === "en") {
                $.getScript("bower_components/angular-i18n/en-us.js");
            }
            else {
                $.getScript("bower_components/angular-i18n/fr-fr.js");
            }
            store.set('language', langKey);
        }

        //Refactoring TO DO
        function find_applications_by_name(name) {
            return ApplicationService.with_name_like(name).then(function (apps) {
                // Already loved apps shouldn't be displayed
                return _.filter(apps, function (item) {
                    return !_.some(vm.applications, function (love) {
                        return love === item.name
                    })
                });
            });
        }

        function display_hesperides_informations() {

            vm.front_version = '${project.version}';
            vm.release = hesperidesGlobals.versionName;

            //Get the backend versions
            $http.get('rest/versions').then(function (response) {
                vm.backend_version = response.data.backend_version;
                vm.api_version = response.data.api_version;
            }, function (error) {
                throw error;
            });

            $mdDialog.show({
                templateUrl: 'hesperides/help-menu-modal.html',
                controller: 'MenuHelpCtrl',
                clickOutsideToClose: true,
                preserveScope: true, // required for not freeze menu
                scope: vm
            });

        }

        /**
         * That is the user settings modal.
         * It's used to customize user relative settings on hesperides.
         *
         * Added by Sahar CHAILLOU
         */
        function display_settings() {
            vm.settings_instance = store.get('instance_properties');
            vm.settings_copy = store.get('copy_properties');
            vm.settings_color = store.get('color_active');
            vm.settings_display = store.get('display_mode');
            vm.settings_language = store.get('language');
            vm.items = [{name: 'USN1'}, {name: 'INT1'}, {name: 'REC1'}];
            if (!store.get('applications')) {
                vm.applications = [];
            } else {
                vm.applications = store.get('applications');
            }
            vm.color = {};
            if (!store.get('color_red')) {
                vm.color.red = 220;
            } else {
                vm.color.red = store.get('color_red');
            }
            if (!store.get('color_green')) {
                vm.color.green = 220;
            } else {
                vm.color.green = store.get('color_green');
            }
            if (!store.get('color_blue')) {
                vm.color.blue = 220;
            } else {
                vm.color.blue = store.get('color_blue');
            }

            vm.backgroundColor = function (item) {
                return PlatformColorService.calculateColor(item.name, vm.color);
            };

            vm.addApplication = function (application) {
                if (vm.applications.indexOf(application.name) === -1) {
                    vm.applications.push(application.name);
                }
            };

            vm.removeApplication = function () {
                var index = vm.applications.indexOf(vm.app);
                vm.applications.splice(index - 1, 1);
            };

            vm.saveSettings = function () {
                store.set('display_mode', vm.settings_display);
                store.set('language', vm.settings_language);
                store.set('instance_properties', vm.settings_instance);
                store.set('copy_properties', vm.settings_copy);
                store.set('color_active', vm.settings_color);
                store.set('color_red', vm.color.red);
                store.set('color_green', vm.color.green);
                store.set('color_blue', vm.color.blue);
                store.set('applications', vm.applications);
                location.reload();
                $mdDialog.cancel();
            };
            $mdDialog.show({
                templateUrl: 'hesperides/settings-modal.html',
                controller: 'MenuHelpCtrl',
                clickOutsideToClose: true,
                preserveScope: true, // requiered for not freez menu
                scope: $scope
            });

        }


        function display_swagger() {
            window.open('/swagger.html');
        }

    }

})();

