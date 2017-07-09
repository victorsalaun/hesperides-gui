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
        .factory('Application', ApplicationFactory)
        .factory('Platform', PlatformFactory)
        .factory('ApplicationModule', ApplicationModuleFactory)
        .factory('InstanceModel', InstanceModelFactory)
        .factory('Instance', InstanceFactory);

    ApplicationFactory.$inject = ['Platform'];

    /* @ngInject */
    function ApplicationFactory(Platform) {
        var Application = function (data) {

            var me = this;

            angular.extend(this, {
                name: "",
                platforms: []
            }, data);

            //Object casting when application is created
            this.platforms = _.map(this.platforms, function (data) {
                return new Platform(data);
            });

        };

        return Application;
    }

    ////////////////

    PlatformFactory.$inject = ['Properties'];

    /* @ngInject */
    function PlatformFactory(Properties) {
        var _prettify_path = function (path) {
            // Remove the first '#' if present
            if (path.charAt(0) === '#') {
                path = path.substring(1, path.length);
            }

            if (path.length === 0) {
                return "";
            }

            var splitted_path = path.split('#');

            var last_pos = splitted_path.length - 1;

            var prettify_module = splitted_path[last_pos - 2] + ', ' + splitted_path[last_pos - 1] +
                (splitted_path[last_pos] === 'WORKINGCOPY' ? ' (working copy) ' : '');

            splitted_path = splitted_path.slice(0, splitted_path.length - 3);

            path = splitted_path.join(' > ') + ' > ' + prettify_module;

            return path;
        };

        var Platform = function (data) {

            var me = this;

            angular.extend(this, {
                name: "",
                application_name: "",
                application_version: "",
                modules: [],
                global_properties: new Properties(),
                global_properties_usage: null,
                production: false,
                version_id: -1
            }, data);

            if (!_.isUndefined(this.platform_name)) {//When it comes from rest entity
                this.name = this.platform_name;
            }

            //Object casting when application is created
            this.modules = _.map(this.modules, function (data) {
                return new Module(data);
            });

            //Volontarly do not turn platform global properties to rest. Those are handled via the API Rest for properties
            this.to_rest_entity = function () {
                return {
                    platform_name: this.name,
                    application_name: this.application_name,
                    application_version: this.application_version,
                    production: this.production,
                    modules: _.map(this.modules, function (module) {
                        return module.to_rest_entity();
                    }),
                    version_id: this.version_id
                };
            };

            this.prettify_path = _prettify_path;
        };

        Platform.prettify_path = _prettify_path;

        return Platform;
    }

    ////////////////

    ApplicationModuleFactory.$inject = ['Instance'];

    /* @ngInject */
    function ApplicationModuleFactory(Platform) {
        var ApplicationModule = function (data) {
            angular.extend(this, {
                id: 0,
                name: "",
                version: "",
                is_working_copy: true,
                opened: false,
                instances: []
            }, data);

            if (!_.isUndefined(data.working_copy)) { //When it is created through a rest entity
                this.is_working_copy = data.working_copy;
            }

            /* Object casting when instance is created */
            this.instances = _.map(this.instances, function (data) {
                return new Instance(data);
            });

            this.title = this.name + ', ' + this.version + (this.is_working_copy ? ' (working copy)' : '');

            this.create_new_instance = function (name) {
                if (!_.find(this.instances, function (instance) {
                        return instance.name === name;
                    })) {
                    this.instances.push(new Instance({name: name}));
                }
            };

            this.delete_instance = function (instance) {
                this.instances = _.without(this.instances, instance);
            };

            this.delete_instances = function () {
                this.instances = [];
            };

            this.to_rest_entity = function () {
                return {
                    id: this.id,
                    name: this.name,
                    version: this.version,
                    working_copy: this.is_working_copy,
                    deployment_group: this.deployment_group,
                    path: this.path,
                    instances: _.map(this.instances, function (instance) {
                        return instance.to_rest_entity();
                    })
                };
            };

        };

        return ApplicationModule;
    }

    ////////////////

    InstanceModelFactory.$inject = [];

    /* @ngInject */
    function InstanceModelFactory() {
        var InstanceModel = function (data) {

            angular.extend(this, {
                keys: []
            }, data);

            this.hasKey = function (name) {
                return this.keys.some(function (key) {
                    return key.name === name;
                });
            };

        };

        return InstanceModel;
    }

    ////////////////

    InstanceFactory.$inject = [];

    /* @ngInject */
    function InstanceFactory() {
        var Instance = function (data) {

            angular.extend(this, {
                name: "",
                key_values: []
            }, data);

            this.hasKey = function (name) {
                return _.some(this.key_values, function (key) {
                    return key.name === name;
                });
            };

            this.mergeWithModel = function (model) {
                var me = this;

                /* Mark key_values that are in the model */
                _.each(this.key_values, function (key_value) {
                    key_value.inModel = model.hasKey(key_value.name);
                });

                /* Add key_values that are only in the model */
                _(model.keys).filter(function (model_key_value) {
                    return !me.hasKey(model_key_value.name);
                }).each(function (model_key_value) {
                    me.key_values.push({
                        name: model_key_value.name,
                        comment: model_key_value.comment,
                        value: "",
                        inModel: true
                    });
                });

                return this;
            };

            this.to_rest_entity = function () {
                return {
                    name: this.name,
                    key_values: _.map(this.key_values, function (kv) {
                        return {
                            name: kv.name,
                            comment: kv.comment,
                            value: kv.value
                        }
                    })
                }
            }

        };

        return Instance;
    }

})();

