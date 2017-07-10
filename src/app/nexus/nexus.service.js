(function () {
    'use strict';

    angular
        .module('hesperides.nexus')
        .service('NexusService', NexusService);

    NexusService.$inject = ['$hesperidesHttp', 'x2js', '$translate'];

    /* @ngInject */
    function NexusService($http, x2js, $translate) {
        var service = {
            getNdlVersions: getNdlVersions,
            getNdl: getNdl
        };
        return service;

        ////////////////
        /**
         * Récupère la liste des versions des notes de livraison dans Nexus.
         *
         * @param application_name nom de l'application
         * @returns la liste des versions des ndl
         */
        function getNdlVersions(application_name) {
            return $http.get('/nexus-api/service/local/lucene/search',
                {
                    "params": {
                        "g": "com.vsct." + application_name.toLowerCase(),
                        "a": "delivery-notes"
                    }
                })
                .then(function (response) {

                    if (!_.isUndefined(x2js.xml_str2json(response.data).searchNGResponse)) {
                        var artifacts = x2js.xml_str2json(response.data).searchNGResponse.data.artifact;

                        if (artifacts.constructor !== Array) {
                            artifacts = [artifacts];
                        }

                        return _.pluck(artifacts, 'version');
                    } else {
                        return [];
                    }

                }, function (error) {
                    // l'erreur n'est pas bloquante
                    return [];
                });
        }

        /**
         * Récupère la note de livraison dans Nexus.
         *
         * @param application_name nom de l'application
         * @param application_version version de l'application
         * @returns la ndl au format json
         */
        function getNdl(application_name, application_version) {
            return $http.get('/nexus-api/service/local/artifact/maven/content',
                {
                    "params": {
                        "r": "public",
                        "g": "com.vsct." + application_name.toLowerCase(),
                        "a": "delivery-notes",
                        "v": application_version,
                        "e": "json"
                    }
                })
                .then(function (response) {
                    return response.data;
                }, function (error) {
                    $translate('nexus.event.error', {error: error.statusText}).then(function (label) {
                        $.notify(label, "error");
                    });
                    throw error;
                });
        }
    }

})();

