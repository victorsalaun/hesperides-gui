(function () {
    'use strict';

    angular
        .module('hesperides.event')
        .filter('myEventsFilter', MyEventsFilter)
        .filter('evensFilter', evensFilter);

    function MyEventsFilter() {
        return function (events, myevents) {

            if (myevents) {
                // reuse a above filter
                return $filter('evensFilter')(events, hesperidesUser.username);
            } else {
                return events;
            }
        };
    }

    ////////////////

    function evensFilter() {
        return function (events, inputs) {

            if (_.isUndefined(inputs) || _.isEmpty(inputs)) {
                return events;
            }

            // Format the filters to construct the regex
            var _inputs = '.*' + inputs.split(' ').join('.*');

            // Create the regex
            try {
                var regex = new RegExp(_inputs, 'i');

                return _.filter(events, function (item) {

                    var inputs = item.moduleName ? item.moduleName + " " : "";
                    inputs += item.moduleVersion ? item.moduleVersion : "";

                    return regex.test(inputs) || regex.test(item.user) || regex.test(item.label) || regex.test($filter('date')(item.timestamp, 'd MMMM yyyy HH:mm')) || regex.test(item.data.comment);

                });
            } catch (e) {
                return events;
            }
        };
    }

})();

