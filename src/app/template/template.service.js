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
        .service('TemplateService', TemplateService);

    TemplateService.$inject = ['$hesperidesHttp', 'Template', 'TemplateEntry', '$translate'];

    /* @ngInject */
    function TemplateService($http, Template, TemplateEntry, $translate) {
        var service = {
            get: get,
            save: save,
            delete: remove,
            all: all
        };
        return service;

        ////////////////

        function get(namespace, name) {
            return $http.get('rest/templates/' + encodeURIComponent(namespace) + '/' + encodeURIComponent(name)).then(function (response) {
                return new Template(response.data);
            }, function (error) {
                $.notify(error.data.message, "error");
            });
        }

        function save(template) {
            template = template.toHesperidesEntity();
            if (template.version_id < 0) {
                return $http.post('rest/templates/' + encodeURIComponent(template.namespace) + '/' + encodeURIComponent(template.name), template).then(function (response) {
                    $translate('template.event.created').then(function (label) {
                        $.notify(label, "success");
                    });
                    return new Template(response.data);
                }, function (error) {
                    if (error.status === 409) {
                        $translate('template.event.error').then(function (label) {
                            $.notify(label, "error");
                        })
                    } else {
                        $.notify(error.data.message, "error");
                    }
                });
            } else {
                return $http.put('rest/templates/' + encodeURIComponent(template.namespace) + '/' + encodeURIComponent(template.name), template).then(function (response) {
                    $translate('template.event.updated').then(function (label) {
                        $.notify(label, "success");
                    });
                    return new Template(response.data);
                }, function (error) {
                    $.notify(error.data.message, "error");
                });
            }
        }

        function remove(namespace, name) {
            return $http.delete('rest/templates/' + encodeURIComponent(namespace) + '/' + encodeURIComponent(name)).then(function (response) {
                $translate('template.event.deleted').then(function (label) {
                    $.notify(label, "success");
                });
                return response;
            }, function (error) {
                $.notify(error.data.message, "error");
            });
        }

        function all(namespace) {
            return $http.get('rest/templates/' + encodeURIComponent(namespace)).then(function (response) {
                return response.data.map(function (data) {
                    return new TemplateEntry(data);
                }, function (error) {
                    if (error.status !== 404) {
                        $.notify(error.data.message, "error");
                    } else {
                        return [];
                    }
                });
            });
        }
    }

})();

