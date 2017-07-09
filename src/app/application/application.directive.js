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
        .module('hesperides.application')
        .directive('propertiesGlobalesBox', PropertiesGlobalesBoxDirective)
        .directive('propertiesGlobalesTree', PropertiesGlobalesTreeDirective)
        .directive('instanceProperties', InstancePropertiesDirective);

    PropertiesGlobalesBoxDirective.$inject = [];

    /* @ngInject */
    function PropertiesGlobalesBoxDirective() {
        var directive = {
            templateUrl: "application/properties/properties_globales.html",
            link: link,
            restrict: 'E',
            scope: {
                platform: "=",
                sortOrder: "="
            }
        };
        return directive;

        function link (scope) {
            scope.isBox = true;
            scope.globalPropertiesKeyFilter = "";
            scope.globalPropertiesValueFilter = "";
        }
    }

    ////////////////

    PropertiesGlobalesTreeDirective.$inject = [];

    /* @ngInject */
    function PropertiesGlobalesTreeDirective() {
        var directive = {
            templateUrl: "application/properties/properties_globales.html",
            link: link,
            restrict: 'E',
            scope: {
                platform: "=",
                sortOrder: "="
            }
        };
        return directive;

        function link (scope) {
            scope.isBox = false;
            scope.globalPropertiesKeyFilter = "";
            scope.globalPropertiesValueFilter = "";
        }
    }

    ////////////////

    InstancePropertiesDirective.$inject = [];

    /* @ngInject */
    function InstancePropertiesDirective() {
        var directive = {
            templateUrl: "application/properties/instance_properties.html",
            link: link,
            restrict: 'E',
            scope: {}
        };
        return directive;

        function link (scope) {
            scope.isBox = true;
        }
    }

})();

