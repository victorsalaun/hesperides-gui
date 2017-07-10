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
        .factory('Techno', TechnoFactory);

    TechnoFactory.$inject = [];

    /* @ngInject */
    function TechnoFactory() {
        var Techno = function (name, version, is_working_copy) {
            this.name = name;
            this.version = version;
            this.is_working_copy = is_working_copy;
            this.title = this.name + ", " + this.version + (this.is_working_copy ? " (working copy)" : "");

            this.to_rest_entity = function () {
                return {
                    name: this.name,
                    version: this.version,
                    working_copy: this.is_working_copy
                };
            };

        };

        return Techno;
    }

})();

