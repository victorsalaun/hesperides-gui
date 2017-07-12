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
        .service('TechnoService', TechnoService);

    TechnoService.$inject = ['$hesperidesHttp', '$q', 'Techno', 'Template', 'TemplateEntry', 'Properties', 'FileService', '$translate'];

    /* @ngInject */
    function TechnoService($http, $q, Techno, Template, TemplateEntry, Properties, FileService, $translate) {
        var service = {
            get_model: get_model,
            get_template_from_workingcopy: get_template_from_workingcopy,
            get_template_from_release: get_template_from_release,
            get_all_templates_from_workingcopy: get_all_templates_from_workingcopy,
            get_all_templates_from_release: get_all_templates_from_release,
            save_template_in_workingcopy: save_template_in_workingcopy,
            delete_template_in_workingcopy: delete_template_in_workingcopy,
            create_workingcopy: create_workingcopy,
            with_name_like: with_name_like
        };
        return service;

        ////////////////

        function get_model(name, version, isWorkingCopy) {
            return $http.get('rest/templates/packages/' + encodeURIComponent(name) + '/' + encodeURIComponent(version) + '/' + (isWorkingCopy ? "workingcopy" : "release") + '/model').then(function (response) {
                return new Properties(response.data);
            }, function () {
                return new Properties({});
            });
        }

        function get_template_from_workingcopy(wc_name, wc_version, template_name) {
            return $http.get('rest/templates/packages/' + encodeURIComponent(wc_name) + '/' + encodeURIComponent(wc_version) + '/workingcopy/templates/' + encodeURIComponent(template_name)).then(function (response) {
                return new Template(response.data);
            }, function (error) {
                $.notify(error.data.message, "error");
                throw error;
            });
        }

        function get_template_from_release(wc_name, wc_version, template_name) {
            return $http.get('rest/templates/packages/' + encodeURIComponent(wc_name) + '/' + encodeURIComponent(wc_version) + '/release/templates/' + encodeURIComponent(template_name)).then(function (response) {
                return new Template(response.data);
            }, function (error) {
                $.notify(error.data.message, "error");
                throw error;
            });
        }

        function get_all_templates_from_workingcopy(wc_name, wc_version) {
            var baseUrl = 'rest/templates/packages/' + encodeURIComponent(wc_name) + '/' + encodeURIComponent(wc_version) + '/workingcopy/templates';

            return $http.get(baseUrl).then(function (response) {
                return response.data.map(function (data) {
                    var entry = new TemplateEntry(data);
                    var url = baseUrl + '/' + encodeURIComponent(entry.name);

                    entry.getTemplate(url).then(function (template) {
                        entry.rights = FileService.files_rights_to_string(template.rights);
                        if (entry.rights < 0)
                            $translate('template.rights.none').then(function (label) {
                                entry.rights = label;
                            });
                        entry.content = template.content;
                        entry.filename = template.filename;
                    });
                    entry.setMediaType();
                    return entry;
                }, function (error) {
                    if (error.status !== 404) {
                        $.notify(error.data.message, "error");
                        throw error;
                    } else {
                        return [];
                    }
                });
            });
        }

        function get_all_templates_from_release(r_name, r_version) {
            return $http.get('rest/templates/packages/' + encodeURIComponent(r_name) + '/' + encodeURIComponent(r_version) + '/release/templates').then(function (response) {
                return response.data.map(function (data) {
                    var entry = new TemplateEntry(data);
                    var url = 'rest/templates/packages/' + encodeURIComponent(r_name) + '/' + encodeURIComponent(r_version) + '/release/templates/' + encodeURIComponent(entry.name);
                    entry.getTemplate(url).then(function (template) {
                        entry.rights = FileService.files_rights_to_string(template.rights);
                        if (entry.rights < 0)
                            $translate('template.rights.none').then(function (label) {
                                entry.rights = label;
                            });
                        entry.content = template.content;
                        entry.filename = template.filename;
                    });
                    return entry;
                }, function (error) {
                    if (error.status !== 404) {
                        $.notify(error.data.message, "error");
                        throw error;
                    } else {
                        return [];
                    }
                });
            });
        }

        function save_template_in_workingcopy(wc_name, wc_version, template) {
            template = template.toHesperidesEntity();
            if (template.version_id < 0) {
                return $http.post('rest/templates/packages/' + encodeURIComponent(wc_name) + '/' + encodeURIComponent(wc_version) + '/workingcopy/templates', template).then(function (response) {
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
                    throw error;
                });
            } else {
                return $http.put('rest/templates/packages/' + encodeURIComponent(wc_name) + '/' + encodeURIComponent(wc_version) + '/workingcopy/templates', template).then(function (response) {
                    $translate('template.event.updated').then(function (label) {
                        $.notify(label, "success");
                    });
                    return new Template(response.data);
                }, function (error) {
                    $.notify(error.data.message, "error");
                    throw error;
                });
            }
        }

        function delete_template_in_workingcopy(wc_name, wc_version, template_name) {
            return $http.delete('rest/templates/packages/' + encodeURIComponent(wc_name) + '/' + encodeURIComponent(wc_version) + '/workingcopy/templates/' + encodeURIComponent(template_name)).then(function (response) {
                $translate('template.event.deleted').then(function (label) {
                    $.notify(label, "success");
                });
                return response;
            }, function (error) {
                $.notify(error.data.message, "error");
                throw error;
            });
        }

        function create_release(r_name, r_version) {
            return $http.post('rest/templates/packages/create_release?package_name=' + encodeURIComponent(r_name) + '&package_version=' + encodeURIComponent(r_version)).then(function (response) {
                if (response.status === 201) {
                    $translate('release.event.created', {name: r_name, version: r_version}).then(function (label) {
                        $.notify(label, "success");
                    })
                } else {
                    $.notify(response.data, "warning");
                }
            }, function (error) {
                $.notify(error.data.message, "error");
                throw error;
            });
        }

        function create_workingcopy(wc_name, wc_version, from_name, from_version, is_from_workingcopy) {
            return $http.post('rest/templates/packages?from_package_name=' + encodeURIComponent(from_name) + '&from_package_version=' + encodeURIComponent(from_version) + '&from_is_working_copy=' + is_from_workingcopy, {
                name: encodeURIComponent(wc_name),
                version: encodeURIComponent(wc_version),
                working_copy: true
            }).then(function (response) {
                if (response.status === 201) {
                    $translate('workingCopy.event.created').then(function (label) {
                        $.notify(label, "success");
                    })
                } else {
                    $.notify(response.data, "warning");
                }
            }, function (error) {
                $.notify(error.data.message, "error");
                throw error;
            });
        }

        function with_name_like(name) {
            if (!_.isUndefined(name)) {
                if (name.length > 2) { //prevent search with too few characters
                    return $http.post('rest/templates/packages/perform_search?terms=' + encodeURIComponent(name.replace(' ', '#').replace('-', '#'))).then(function (response) {
                        return _.map(response.data, function (techno) {
                            return new Techno(techno.name, techno.version, techno.working_copy);
                        });
                    });
                } else {
                    var deferred = $q.defer();
                    deferred.resolve([]);
                    return deferred.promise;
                }
            }
        }
    }

})();

