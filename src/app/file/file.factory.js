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
        .module('hesperides.file')
        .factory('FileEntry', FileEntryFactory);

    FileEntryFactory.$inject = ['$hesperidesHttp', '$translate'];

    /* @ngInject */
    function FileEntryFactory($hesperidesHttp, $translate) {
        var FileEntry = function (data) {
            var me = this;

            this.location = data.location;
            this.url = data.url;
            this.rights = data.rights;
            this.name = "";                                 // the filename, to be displayed on the donwload link
            this.content = "";                              // the content of the file
            this.on_error = false;                          // indicates if there where an error or not !

            // The content loading message
            $translate('file.loading.message').then(function (message) {
                me.content = message;
            });

            // methods
            this.getContent = function (simulate) {
                return $http.get(me.url).then(function (response) {
                    return response;
                }, function (error) {

                    // Errors in here, are syntax error or something like that !
                    // This is processed on the get_files_entries method.
                    return error;
                });
            };
        };

        return FileEntry;
    }

})();


