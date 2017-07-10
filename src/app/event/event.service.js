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

