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
        .service('LocalChanges', LocalChangesService)
        .service('LocalChangesUtils', LocalChangesUtilsService)
        .service('LocalChangesDAO', LocalChangesDAOService);

    LocalChangesService.$inject = ['LocalChangesDAO', 'LocalChangesUtils'];

    /* @ngInject */
    function LocalChangesService(LocalChangesDAO, LocalChangesUtils) {
        var service = {
            hasLocalChanges: hasLocalChanges,
            getLocalChanges: getLocalChanges,
            addLocalChange: addLocalChange,
            clearLocalChanges: clearLocalChanges,
            smartClearLocalChanges: smartClearLocalChanges,
            mergeWithLocalPropertiesImpl: mergeWithLocalPropertiesImpl,
            mergeWithLocalProperties: mergeWithLocalProperties,
            tagWithLocalProperties: tagWithLocalProperties,
            hasSyncedChanges: hasSyncedChanges,
            areFullySynced: areFullySynced,
            platformLocalChanges: platformLocalChanges,
            platformLocalChangesCount: platformLocalChangesCount
        };
        return service;

        var localChangesDAO = new LocalChangesDAO();

        ////////////////

        function hasLocalChanges(application_name, platform, properties_path) {
            return localChangesDAO.hasLocalChanges(application_name, platform, properties_path);
        }

        function getLocalChanges(application_name, platform, properties_path) {
            return localChangesDAO.getLocalChanges(LocalChangesUtils.buildFullPath(application_name, platform, properties_path));
        }

        function addLocalChange(application_name, platform, properties_path, properties_name, properties_value) {
            localChangesDAO.addLocalChange(application_name, platform, properties_path, properties_name, properties_value);
        }

        function clearLocalChanges(opts) {
            localChangesDAO.clearLocalChanges(opts);
        }

        function smartClearLocalChanges(opts, properties) {
            return localChangesDAO.smartClearLocalChanges(opts, properties.key_value_properties);
        }

        function mergeWithLocalPropertiesImpl(local_properties, properties, merge) {
            _.each(properties.key_value_properties, function (key_value) {
                if (merge && key_value.inLocal) {
                    key_value.value = key_value.filtrable_value;
                }
                key_value.inLocal = false;
                key_value.syncWithRemote = false;


                var existing_local_property = _.find(local_properties, function (kvp) {
                    return key_value.name === kvp.properties_name;
                });
                if (!_.isUndefined(existing_local_property)) {
                    key_value.inLocal = true;
                    if (key_value.filtrable_value === existing_local_property.properties_value) {
                        key_value.syncWithRemote = true;
                    }
                    if (merge) {
                        key_value.value = existing_local_property.properties_value;
                    }
                }
            });
            return properties;
        }

        function mergeWithLocalProperties(application_name, platform, properties_path, properties) {
            return this.mergeWithLocalPropertiesImpl(this.getLocalChanges(application_name, platform, properties_path), properties, true);
        }

        function tagWithLocalProperties(application_name, platform, properties_path, properties) {
            return this.mergeWithLocalPropertiesImpl(this.getLocalChanges(application_name, platform, properties_path), properties, false);
        }

        function hasSyncedChanges(properties) {
            if (properties === undefined || properties.key_value_properties === undefined)
                return false;
            return _.filter(properties.key_value_properties, {'syncWithRemote': true}).length > 0;
        }

        function areFullySynced(application_name, platform, properties_path, properties) {
            if (properties === undefined || properties.key_value_properties === undefined)
                return false;
            return this.getLocalChanges(application_name, platform, properties_path).length > 0 && this.getLocalChanges(application_name, platform, properties_path).length - _.filter(properties.key_value_properties, {'syncWithRemote': true}).length === 0;
        }

        function platformLocalChanges(platform) {
            var properties_paths = platform ? _.map(platform.modules, function (module) {
                return LocalChangesUtils.buildFullPath(platform.application_name, platform.name, module.properties_path);
            }) : [];
            return _.filter(properties_paths, function (properties_path) {
                return localChangesDAO.getLocalChanges(properties_path).length > 0;
            });
        }

        function platformLocalChangesCount(platform) {
            var count = 0;
            _.forEach(this.platformLocalChanges(platform), function (localChange) {
                count = count + localChangesDAO.getLocalChanges(localChange).length;
            });
            return count;
        }
    }

    ////////////////

    LocalChangesUtilsService.$inject = [];

    /* @ngInject */
    function LocalChangesUtilsService() {
        var service = {
            buildFullPath: buildFullPath,
            extractPropertiesPath: extractPropertiesPath,
            extractApplicationName: extractApplicationName,
            extractPlatformName: extractPlatformName,
        };
        return service;

        ////////////////

        function buildFullPath(application_name, platform, properties_path) {
            return '[' + application_name + '-' + platform + ']' + properties_path;
        }

        function extractPropertiesPath(full_path) {
            return full_path.split(']')[1];
        }

        function extractApplicationName(full_path) {
            return full_path.split('-')[0].replace('[', '');
        }

        function extractPlatformName(full_path) {
            return full_path.split(']')[0].split('-')[1];
        }
    }

    ////////////////

    LocalChangesDAOService.$inject = [];

    /* @ngInject */
    function LocalChangesDAOService() {
        var service = {
            get: get,
            save: save,
            getCurrentVersionID: getCurrentVersionID,
            getLocalChanges: getLocalChanges,
            localChangeExist: localChangeExist,
            addLocalChange: addLocalChange,
            hasLocalChanges: hasLocalChanges,
            clearLocalChanges: clearLocalChanges,
            smartClearLocalChanges: smartClearLocalChanges,
        };
        return service;

        var local_storage_key = 'local_changes';
        var local_changes;

        get();

        ////////////////

        function get() {
            local_changes = store.get(local_storage_key);
            if (local_changes === undefined) {
                local_changes = {};
            }

            var has_removed = false;
            for (var key in local_changes) {
                if (local_changes.hasOwnProperty(key)) {
                    _.remove(local_changes[key], function (elem) {
                        if (!has_removed && (getCurrentVersionID() - elem.version_id > hesperidesConfiguration.localChangesTTL)) {
                            has_removed = true;
                        }

                        return (getCurrentVersionID() - elem.version_id > hesperidesConfiguration.localChangesTTL);
                    });

                }
            }
            save();
        }

        function save() {
            store.set(local_storage_key, local_changes);
        }

        function getCurrentVersionID() {
            return store.get('current_platform_versionID');
        }

        function getLocalChanges(full_path) {
            get();
            if (local_changes[full_path] && local_changes[full_path].length) {
                return local_changes[full_path].map(function (elem) {
                    return new LocalChange(elem);
                });
            }
            return [];
        }

        function localChangeExist(full_path, properties_name) {
            return _.filter(this.getLocalChanges(full_path), function (c) {
                    return c.properties_name === properties_name
                }).length > 0;
        }

        function addLocalChange(application_name, platform, properties_path, properties_name, properties_value) {
            var full_path = LocalChangesUtils.buildFullPath(application_name, platform, properties_path);
            var local_changes_buffer = this.getLocalChanges(full_path);

            if (this.localChangeExist(full_path, properties_name) === false) {
                local_changes_buffer.push(new LocalChange({
                    "properties_name": properties_name,
                    "properties_value": properties_value,
                    "version_id": getCurrentVersionID()
                }));
            } else {
                _.map(local_changes_buffer, function (elem) {
                    if (elem.properties_name === properties_name && elem.properties_value !== properties_value) {
                        elem.properties_value = properties_value;
                        elem.version_id = getCurrentVersionID();
                    }
                });
            }

            local_changes[full_path] = local_changes_buffer;
            save();
        }

        function hasLocalChanges(application_name, platform, properties_path) {
            return this.getLocalChanges(LocalChangesUtils.buildFullPath(application_name, platform, properties_path)).length > 0;
        }

        function clearLocalChanges(opts) {
            if ('application_name' in opts && 'platform' in opts && 'properties_path' in opts) {
                local_changes[LocalChangesUtils.buildFullPath(opts['application_name'], opts['platform'], opts['properties_path'])] = [];
            } else {
                local_changes = {};
            }
            save();
        }

        function smartClearLocalChanges(opts, properties) {
            if ('application_name' in opts && 'platform' in opts && 'properties_path' in opts) {
                get();
                var full_path = LocalChangesUtils.buildFullPath(opts['application_name'], opts['platform'], opts['properties_path']);
                var length = local_changes[full_path].length;
                local_changes[full_path] = _.filter(local_changes[full_path], function (elem) {
                    return !_.some(properties, {
                        "name": elem.properties_name,
                        "filtrable_value": elem.properties_value
                    });
                });
                save();
                return !length === local_changes[full_path].length;
            }
            return false;
        }

    }

})();
