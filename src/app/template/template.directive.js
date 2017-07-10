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
        .module('hesperides.template')
        .directive('hesperidesTemplateList', HesperidesTemplateListDirective)
        .directive('fileRights', FileRightsDirective);

    HesperidesTemplateListDirective.$inject = [];

    /* @ngInject */
    function HesperidesTemplateListDirective() {
        var directive = {
            templateUrl: "template/template-list.html",
            link: link,
            restrict: 'E',
            scope: {
                templateEntries: '=',
                add: '&',
                downloadAll: '&',
                download: '&',
                delete: '&',
                edit: '&',
                isReadOnly: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {
            scope.add_template = function () {
                scope.add()();
            };

            scope.download_all_template = function (templateEntries) {
                scope.downloadAll()(templateEntries);
            };

            scope.download_template = function (template_entry) {
                scope.download()(template_entry);
            };

            scope.delete_template = function (name) {
                scope.delete()(name);
            };

            scope.edit_template = function (name) {
                scope.edit()(name);
            };
        }
    }

    ////////////////

    FileRightsDirective.$inject = [];

    /* @ngInject */
    function FileRightsDirective() {
        var directive = {
            bindToController: true,
            controller: FileRightsDirectiveDirective,
            controllerAs: 'vm',
            template: '{{label}} <md-button id="template_right-button-{{item.text}}-{{label}}" ng-repeat="item in fileRightsOption" class="md-xxs" ng-class="{\'md-raised\': getValue(item) !== null, \'md-warn\': getValue(item) === true, \'md-strike\': getValue(item) === false}" ng-click="doClick(item)">' +
            '{{item.text}}' +
            '<md-tooltip>{{getHelp(item)}}</md-tooltip>' +
            '</md-button>',
            link: link,
            restrict: 'E',
            scope: {
                model: '=',
                label: '@'
            }
        };
        return directive;

        function link(scope, element, attrs) {
            scope.add_template = function () {
                scope.add()();
            };

            scope.download_all_template = function (templateEntries) {
                scope.downloadAll()(templateEntries);
            };

            scope.download_template = function (template_entry) {
                scope.download()(template_entry);
            };

            scope.delete_template = function (name) {
                scope.delete()(name);
            };

            scope.edit_template = function (name) {
                scope.edit()(name);
            };
        }
    }

    FileRightsDirectiveController.$inject = ['$scope', '$translate'];

    /* @ngInject */
    function FileRightsDirectiveController($scope, $translate) {
        $scope.defaultRightStr = "";
        $scope.appliedRightStr = "";
        $scope.removedRightStr = "";

        $translate('template.rights.default').then(function (label) {
            $scope.defaultRightStr = label;
        });
        $translate('template.rights.applied').then(function (label) {
            $scope.appliedRightStr = label;
        });
        $translate('template.rights.removed').then(function (label) {
            $scope.removedRightStr = label;
        });

        var setValue = function (item, value) {
            if (_.isUndefined($scope.model)) {
                $scope.model = {};
            }

            $scope.model[item.attr] = value;
        };

        var getValue = function (item) {
            return !_.isUndefined($scope.model) && !_.isUndefined($scope.model[item.attr]) ? $scope.model[item.attr] : null;
        };

        $scope.fileRightsOption = [
            {text: "R", attr: 'read'},
            {text: "W", attr: 'write'},
            {text: "X", attr: 'execute'}];

        $scope.getValue = getValue;

        $scope.getHelp = function (item) {
            var str;
            var value = getValue(item);

            if (_.isNull(value)) {
                return $scope.defaultRightStr;
            } else if (value === true) {
                return $scope.appliedRightStr;
            } else {
                return $scope.removedRightStr;
            }
        };

        $scope.doClick = function (item) {
            var value = getValue(item);

            if (_.isNull(value)) {
                setValue(item, true);
            } else if (value === true) {
                setValue(item, false);
            } else {
                setValue(item, null);
            }
        };
    }

})();

