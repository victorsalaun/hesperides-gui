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
        .module('hesperides.application')
        .service('ApplicationService', ApplicationService);

    ApplicationService.$inject = ['$hesperidesHttp', 'Application', 'Platform', 'Properties', 'InstanceModel', '$translate', '$location'];

    /* @ngInject */
    function ApplicationService($http, Application, Platform, Properties, InstanceModel, $translate, $location) {
        var service = {
            get: get,
            with_name_like: with_name_like,
            get_platform_name_of_application: get_platform_name_of_application,
            get_platform: get_platform,
            save_platform: save_platform,
            create_platform_from: create_platform_from,
            delete_platform: delete_platform,
            get_properties: get_properties,
            get_global_properties_usage: get_global_properties_usage,
            save_properties: save_properties,
            get_instance_model: get_instance_model,
            updatePlatformConfig: updatePlatformConfig
        };
        return service;

        ////////////////

        function get(name, unsecured) {
            var me = this;
            me.unsecured = unsecured;

            return $http.get('rest/applications/' + encodeURIComponent(name) + '?hide_platform=true').then(function (response) {
                var current_platform = _.find(response.data.platforms, {'platform_name': $location.search().platform});
                store.set('current_platform_versionID', current_platform !== undefined ? current_platform.version_id : '');
                return new Application(response.data);
            }, function (error) {
                if (!me.unsecured) {
                    $.notify(error.data.message, "error");
                }
                throw error;
            });
        }

        function with_name_like(name) {
            return $http.post('rest/applications/perform_search?name=' + encodeURIComponent(name)).then(function (response) {
                return response.data;
            }, function (error) {
                $.notify(error.data.message, "error");
                throw error;
            });
        }

        function get_platform_name_of_application(application_name, platform_name) {
            return $http.post('rest/applications/platforms/perform_search?applicationName=' + encodeURIComponent(application_name) +
                "&platformName=" + encodeURIComponent(platform_name)).then(function (response) {
                return response.data;
            }, function (error) {
                $.notify(error.data.message, "error");
                throw error;
            });
        }

        function get_platform(application_name, platform_name, timestamp, unsecured) {
            var me = this;
            me.unsecured = unsecured;
            if (_.isUndefined(timestamp)) {
                var url = 'rest/applications/' + encodeURIComponent(application_name) + '/platforms/' + encodeURIComponent(platform_name);
            } else {
                var url = 'rest/applications/' + encodeURIComponent(application_name) + '/platforms/' + encodeURIComponent(platform_name) + '?timestamp=' + timestamp;
            }
            return $http.get(url).then(function (response) {
                //Try to get the global properties
                var platform = new Platform(response.data);
                store.set('current_platform_versionID', platform.version_id);
                me.get_properties(application_name, platform_name, "#", timestamp).then(function (properties) {
                    platform.global_properties = properties;
                });
                return platform;
            }, function (error) {
                if (!me.unsecured) {
                    $.notify(error.data.message, "error");
                }
                throw error;
            });
        }

        function save_platform(platform, copyPropertiesOfUpdatedModules) {
            var me = this;
            if (_.isUndefined(copyPropertiesOfUpdatedModules)) {
                copyPropertiesOfUpdatedModules = false;
            }
            platform = platform.to_rest_entity();
            if (platform.version_id < 0) {
                return $http.post('rest/applications/' + encodeURIComponent(platform.application_name) + '/platforms', platform).then(function (response) {
                    $translate('platform.event.created').then(function (label) {
                        $.notify(label, "success");
                    });
                    //Try to get the global properties
                    var platform = new Platform(response.data);
                    me.get_properties(platform.application_name, platform.platform_name, "#").then(function (properties) {
                        platform.global_properties = properties;
                    });
                    return platform;
                }, function (error) {
                    $.notify(error.data.message, "error");
                    throw error;
                });
            } else {
                return $http.put('rest/applications/' + encodeURIComponent(platform.application_name) + '/platforms?copyPropertiesForUpgradedModules=' + copyPropertiesOfUpdatedModules, platform).then(function (response) {
                    $translate('platform.event.updated').then(function (label) {
                        $.notify(label, "success");
                    });
                    //Try to get the global properties
                    var platform = new Platform(response.data);
                    me.get_properties(platform.application_name, platform.platform_name, "#").then(function (properties) {
                        platform.global_properties = properties;
                    });
                    return platform;
                }, function (error) {
                    $.notify(error.data.message, "error");
                    throw error;
                });
            }
        }

        function create_platform_from(platform, from_application, from_platform) {
            var me = this;
            platform = platform.to_rest_entity();
            return $http.post('rest/applications/' + encodeURIComponent(platform.application_name) + '/platforms?from_application=' + encodeURIComponent(from_application) + '&from_platform=' + encodeURIComponent(from_platform), platform).then(function (response) {
                $translate('platform.event.created').then(function (label) {
                    $.notify(label, "success");
                });
                //Try to get the global properties
                var platform = new Platform(response.data);
                me.get_properties(platform.application_name, platform.platform_name, "#").then(function (properties) {
                    platform.global_properties = properties;
                });
                return platform;
            }, function (error) {
                $.notify(error.data.message, "error");
                throw error;
            });
        }

        function delete_platform(application_name, platform_name) {
            return $http.delete('rest/applications/' + encodeURIComponent(application_name) + '/platforms/' + encodeURIComponent(platform_name));
        }

        function get_properties(application_name, platform_name, path, timestamp) {
            if (_.isUndefined(timestamp)) {
                var url = 'rest/applications/' + encodeURIComponent(application_name) + '/platforms/' + encodeURIComponent(platform_name) + '/properties?path=' + encodeURIComponent(path);
            } else {
                var url = 'rest/applications/' + encodeURIComponent(application_name) + '/platforms/' + encodeURIComponent(platform_name) + '/properties?path=' + encodeURIComponent(path) + '&timestamp=' + timestamp;
            }
            return $http.get(url).then(function (response) {
                return new Properties(response.data);
            }, function (error) {
                $.notify(error.data.message, "error");
                throw error;
            });
        }

        function get_global_properties_usage(application_name, platform_name) {

            var url = 'rest/applications/' + encodeURIComponent(application_name) + '/platforms/' + encodeURIComponent(platform_name) + '/global_properties_usage';
            return $http.get(url).then(function (response) {
                return response.data;
            }, function (error) {
                $.notify(error.data.message, "error");
                throw error;
            });
        }

        function save_properties(application_name, platform, properties, path, comment) {
            properties = properties.to_rest_entity();

            return $http.post('rest/applications/' + encodeURIComponent(application_name) + '/platforms/' + encodeURIComponent(platform.name) + '/properties?path=' + encodeURIComponent(path) + '&platform_vid=' + encodeURIComponent(platform.version_id) + '&comment=' + encodeURIComponent(comment), properties).then(function (response) {
                $translate('properties.event.saved').then(function (label) {
                    $.notify(label, "success");
                });
                store.set('current_platform_versionID', platform.version_id + 1);
                return new Properties(response.data);
            }, function (error) {
                //$.notify(error.data.message, "error");
                $translate('properties.event.error').then(function (label) {
                    $.notify(label, "error");
                });
                throw error;
            });
        }

        function get_instance_model(application_name, platform, path) {
            return $http.get('rest/applications/' + encodeURIComponent(application_name) + '/platforms/' + encodeURIComponent(platform.name) + '/properties/instance_model?path=' + encodeURIComponent(path)).then(function (response) {
                return new InstanceModel(response.data);
            }, function (error) {
                return new InstanceModel({});
            });
        }

        /**a
         * Met à jour la configuration des modules d'une plateforme.
         * <p>
         * Attention, seule l'instance "locale" est modifiée. La modification n'est pas persistée.
         * </p>
         *
         * @param platform platforme à mettre à jour
         * @param newVersion nouvelle version de la plateforme
         * @param newModulesConfig nouvelle version des modules
         * @returns {Array} la liste des modules misà jour
         */
        function updatePlatformConfig(platform, newVersion, newModulesConfig) {
            var updatedModules = [];

            // mise à jour de la version de la plateforme
            platform.application_version = newVersion;

            // mise à jour de la version des modules
            platform.modules = _.map(platform.modules, function (platformModule) {

                var newModuleConfig = _.find(newModulesConfig, function (module) {
                    return module.hesperidesModule === platformModule.name;
                });

                if (newModuleConfig !== undefined) {
                    if (newModuleConfig.hesperidesVersion) {
                        platformModule.version = newModuleConfig.hesperidesVersion;
                    } else {
                        platformModule.version = newModuleConfig.version;
                    }
                    platformModule.is_working_copy = newVersion.indexOf('-SNAPSHOT') > -1;

                    updatedModules.push(platformModule);
                }

                return platformModule;
            });

            return updatedModules;
        }
    }

})();

