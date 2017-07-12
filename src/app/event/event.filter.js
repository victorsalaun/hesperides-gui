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

