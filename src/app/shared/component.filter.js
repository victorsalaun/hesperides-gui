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
        .module('hesperides.component')
        .filter('filterPlatform', filterPlatform);

    function filterPlatform() {
        return function (items, filter) {
            return _.filter(items, function (item) {
                if (_.isUndefined(filter) || _.isEmpty(filter)) {
                    return item;
                } else {
                    var regex_name = new RegExp(filter, 'i');
                    return regex_name.test(item.name) || regex_name.test(item.application_version) ? item : undefined;
                }
            });
        };
    }

})();

