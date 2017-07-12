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
        .module('hesperides.event')
        .service('EventService', EventService);

    EventService.$inject = ['$hesperidesHttp', 'EventEntry', 'hesperidesGlobals'];

    /* @ngInject */
    function EventService($http, EventEntry, hesperidesGlobals) {
        this.get = get;

        ////////////////

        function get(stream, page) {
            var url = "rest/events/" + encodeURIComponent(stream) + "?page=" + encodeURIComponent(page) + "&size=" + encodeURIComponent(hesperidesGlobals.eventPaginationSize);
            return $http.get(url).then(function (response) {
                return response.data.map(function (item) {
                    var event = new EventEntry(item);
                    return event;
                });
            }, function (error) {
                $.notify(error.data.message, "error");
                throw error;
            });
        }
    }

})();

