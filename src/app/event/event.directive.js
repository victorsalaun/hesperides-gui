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
        .directive('platformCreated', PlatformCreatedDirective)
        .directive('platformCreatedFromExisting', PlatformCreatedFromExistingDirective)
        .directive('platformUpdated', PlatformUpdatedDirective)
        .directive('platformDeleted', PlatformDeletedDirective)
        .directive('moduleCreated', ModuleCreatedDirective)
        .directive('moduleUpdated', ModuleUpdatedDirective)
        .directive('moduleWorkingCopyUpdated', ModuleWorkingCopyUpdatedDirective)
        .directive('moduleTemplateCreated', ModuleTemplateCreatedDirective)
        .directive('moduleTemplateUpdated', ModuleTemplateUpdatedDirective)
        .directive('moduleTemplateDeleted', ModuleTemplateDeletedDirective)
        .directive('propertiesSaved', PropertiesSavedDirective)
        .directive('templateCreated', TemplateCreatedDirective)
        .directive('templateUpdated', TemplateUpdatedDirective)
        .directive('templateDeleted', TemplateDeletedDirective)
        .directive('templatePackageDeleted', TemplatePackageDeletedDirective)
        .directive('eventTime', EventTimeDirective);

    PlatformCreatedDirective.$inject = [];

    /* @ngInject */
    function PlatformCreatedDirective() {
        var directive = {
            bindToController: true,
            controller: PlatformCreatedDirectiveController,
            controllerAs: 'vm',
            templateUrl: 'event/directives/platform/platform-created.html',
            link: link,
            restrict: 'E',
            scope: {
                event: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

    PlatformCreatedDirectiveController.$inject = ['$scope'];

    /* @ngInject */
    function PlatformCreatedDirectiveController($scope) {
        var _event = $scope.event;

        $scope.parseData = function () {
            _event.buildLabel('platform.event.createdByUser');
        };

        $scope.parseData();
    }

    ////////////////

    PlatformCreatedFromExistingDirective.$inject = [];

    /* @ngInject */
    function PlatformCreatedFromExistingDirective() {
        var directive = {
            bindToController: true,
            controller: PlatformCreatedFromExistingDirectiveController,
            controllerAs: 'vm',
            templateUrl: 'event/directives/platform/platform-created-from-existing.html',
            link: link,
            restrict: 'E',
            scope: {
                event: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

    PlatformCreatedFromExistingDirectiveController.$inject = ['$scope'];

    /* @ngInject */
    function PlatformCreatedFromExistingDirectiveController($scope) {
        var _event = $scope.event;

        $scope.parseData = function () {
            $scope.from = _event.data.originPlatform.key.entityName;
            _event.buildLabel('platform.event.createdFromExisting', $scope.from);
        };

        $scope.parseData();
    }

    ////////////////

    PlatformUpdatedDirective.$inject = [];

    /* @ngInject */
    function PlatformUpdatedDirective() {
        var directive = {
            bindToController: true,
            controller: PlatformUpdatedDirectiveController,
            controllerAs: 'vm',
            templateUrl: 'event/directives/platform/platform-updated.html',
            link: link,
            restrict: 'E',
            scope: {
                event: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

    PlatformUpdatedDirectiveController.$inject = ['$scope'];

    /* @ngInject */
    function PlatformUpdatedDirectiveController($scope) {
        var _event = $scope.event;

        $scope.parseData = function () {
            _event.buildLabel('platform.event.updatedByUser');
        };

        $scope.parseData();
    }

    ////////////////

    PlatformDeletedDirective.$inject = [];

    /* @ngInject */
    function PlatformDeletedDirective() {
        var directive = {
            bindToController: true,
            controller: PlatformDeletedDirectiveController,
            controllerAs: 'vm',
            templateUrl: 'event/directives/platform/platform-deleted.html',
            link: link,
            restrict: 'E',
            scope: {
                event: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

    PlatformDeletedDirectiveController.$inject = ['$scope'];

    /* @ngInject */
    function PlatformDeletedDirectiveController($scope) {
        var _event = $scope.event;

        $scope.parseData = function () {
            _event.buildLabel('platform.event.deletedByUser');
        };

        $scope.parseData();
    }

    ////////////////

    ModuleCreatedDirective.$inject = [];

    /* @ngInject */
    function ModuleCreatedDirective() {
        var directive = {
            bindToController: true,
            controller: ModuleCreatedDirectiveController,
            controllerAs: 'vm',
            templateUrl: 'event/directives/module/module-created.html',
            link: link,
            restrict: 'E',
            scope: {
                event: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

    ModuleCreatedDirectiveController.$inject = ['$scope'];

    /* @ngInject */
    function ModuleCreatedDirectiveController($scope) {
        var _event = $scope.event;

        $scope.parseData = function () {
            _event.buildLabel('module.event.created');
        };

        $scope.parseData();
    }

    ////////////////

    ModuleUpdatedDirective.$inject = [];

    /* @ngInject */
    function ModuleUpdatedDirective() {
        var directive = {
            bindToController: true,
            controller: ModuleUpdatedDirectiveController,
            controllerAs: 'vm',
            templateUrl: 'event/directives/module/module-updated.html',
            link: link,
            restrict: 'E',
            scope: {
                event: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

    ModuleUpdatedDirectiveController.$inject = ['$scope'];

    /* @ngInject */
    function ModuleUpdatedDirectiveController($scope) {
        var _event = $scope.event;

        $scope.parseData = function () {
            _event.buildLabel('module.event.updatedByUser');
        };

        $scope.parseData();
    }

    ////////////////

    ModuleWorkingCopyUpdatedDirective.$inject = [];

    /* @ngInject */
    function ModuleWorkingCopyUpdatedDirective() {
        var directive = {
            bindToController: true,
            controller: ModuleWorkingCopyUpdatedDirectiveController,
            controllerAs: 'vm',
            templateUrl: 'event/directives/module-working-copy/module-working-copy-updated.html',
            link: link,
            restrict: 'E',
            scope: {
                event: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

    ModuleWorkingCopyUpdatedDirectiveController.$inject = ['$scope'];

    /* @ngInject */
    function ModuleWorkingCopyUpdatedDirectiveController($scope) {
        var _event = $scope.event;

        $scope.parseData = function () {
            _event.buildLabel('module.workingCopy.event.updatedByUser');
        };

        $scope.parseData();
    }

    ////////////////

    ModuleTemplateCreatedDirective.$inject = [];

    /* @ngInject */
    function ModuleTemplateCreatedDirective() {
        var directive = {
            bindToController: true,
            controller: ModuleTemplateCreatedDirectiveController,
            controllerAs: 'vm',
            templateUrl: 'event/directives/module-template/module-template-created.html',
            link: link,
            restrict: 'E',
            scope: {
                event: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

    ModuleTemplateCreatedDirectiveController.$inject = ['$scope'];

    /* @ngInject */
    function ModuleTemplateCreatedDirectiveController($scope) {
        var _event = $scope.event;

        $scope.parseData = function () {
            _event.buildLabel('module.template.event.createdByUser');
        };

        $scope.parseData();
    }

    ////////////////

    ModuleTemplateUpdatedDirective.$inject = [];

    /* @ngInject */
    function ModuleTemplateUpdatedDirective() {
        var directive = {
            bindToController: true,
            controller: ModuleTemplateUpdatedDirectiveController,
            controllerAs: 'vm',
            templateUrl: 'event/directives/module-template/module-template-updated.html',
            link: link,
            restrict: 'E',
            scope: {
                event: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

    ModuleTemplateUpdatedDirectiveController.$inject = ['$scope'];

    /* @ngInject */
    function ModuleTemplateUpdatedDirectiveController($scope) {
        var _event = $scope.event;

        $scope.parseData = function () {
            _event.buildLabel('module.template.event.updatedByUser');
        };

        $scope.parseData();
    }

    ////////////////

    ModuleTemplateDeletedDirective.$inject = [];

    /* @ngInject */
    function ModuleTemplateDeletedDirective() {
        var directive = {
            bindToController: true,
            controller: ModuleTemplateDeletedDirectiveController,
            controllerAs: 'vm',
            templateUrl: 'event/directives/module-template/module-template-deleted.html',
            link: link,
            restrict: 'E',
            scope: {
                event: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

    ModuleTemplateDeletedDirectiveController.$inject = ['$scope'];

    /* @ngInject */
    function ModuleTemplateDeletedDirectiveController($scope) {
        var _event = $scope.event;

        $scope.parseData = function () {
            _event.buildLabel('module.template.event.deletedByUser');
        };

        $scope.parseData();
    }

    ////////////////

    PropertiesSavedDirective.$inject = [];

    /* @ngInject */
    function PropertiesSavedDirective() {
        var directive = {
            bindToController: true,
            controller: PropertiesSavedDirectiveController,
            controllerAs: 'vm',
            templateUrl: 'event/directives/properties/properties-saved.html',
            link: link,
            restrict: 'E',
            scope: {
                event: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

    PropertiesSavedDirectiveController.$inject = ['$scope'];

    /* @ngInject */
    function PropertiesSavedDirectiveController($scope) {
        var _event = $scope.event;

        // Get the scope of the modal
        var modalScope = $scope.$parent.$parent.$parent;

        /**
         * Selectes or unselects the current events for diff.
         */
        $scope.selectOrUnselect = function () {
            if (_event.isSelected) {
                modalScope.selectedEvents.push(_event);
            } else {
                _.remove(modalScope.selectedEvents, function (item) {
                    return item.id === _event.id;
                });
            }
            modalScope.checkSelectStatus();
        };

        $scope.parseData = function () {
            $scope.moduleName = _event.moduleName;
            $scope.moduleVersion = _event.moduleVersion;

            // get the event message for filtering

            if ($scope.event.isGlobal) {
                $scope.event.buildLabel('properties.event.savedGlobalByUser');
            } else {
                $scope.event.buildLabel('properties.event.savedByUser', _event.moduleName, _event.moduleVersion);
            }
        };

        // Parsing data for this king of events
        $scope.parseData();
    }

    ////////////////

    TemplateCreatedDirective.$inject = [];

    /* @ngInject */
    function TemplateCreatedDirective() {
        var directive = {
            bindToController: true,
            controller: TemplateCreatedDirectiveController,
            controllerAs: 'vm',
            templateUrl: 'event/directives/template/template-created.html',
            link: link,
            restrict: 'E',
            scope: {
                event: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

    TemplateCreatedDirectiveController.$inject = ['$scope'];

    /* @ngInject */
    function TemplateCreatedDirectiveController($scope) {
        var _event = $scope.event;

        $scope.parseData = function () {
            _event.buildLabel('techno.event.createdByUser');
        };

        $scope.parseData();
    }

    ////////////////

    TemplateUpdatedDirective.$inject = [];

    /* @ngInject */
    function TemplateUpdatedDirective() {
        var directive = {
            bindToController: true,
            controller: TemplateUpdatedDirectiveController,
            controllerAs: 'vm',
            templateUrl: 'event/directives/template/template-updated.html',
            link: link,
            restrict: 'E',
            scope: {
                event: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

    TemplateUpdatedDirectiveController.$inject = ['$scope'];

    /* @ngInject */
    function TemplateUpdatedDirectiveController($scope) {
        var _event = $scope.event;

        $scope.parseData = function () {
            _event.buildLabel('techno.event.updatedByUser');
        };

        $scope.parseData();
    }

    ////////////////

    TemplateDeletedDirective.$inject = [];

    /* @ngInject */
    function TemplateDeletedDirective() {
        var directive = {
            bindToController: true,
            controller: TemplateDeletedDirectiveController,
            controllerAs: 'vm',
            templateUrl: 'event/directives/template/template-deleted.html',
            link: link,
            restrict: 'E',
            scope: {
                event: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

    TemplateDeletedDirectiveController.$inject = ['$scope'];

    /* @ngInject */
    function TemplateDeletedDirectiveController($scope) {
        var _event = $scope.event;

        $scope.parseData = function () {
            _event.buildLabel('techno.event.deletedByUser');
        };

        $scope.parseData();
    }

    ////////////////

    TemplatePackageDeletedDirective.$inject = [];

    /* @ngInject */
    function TemplatePackageDeletedDirective() {
        var directive = {
            bindToController: true,
            controller: TemplatePackageDeletedDirectiveController,
            controllerAs: 'vm',
            templateUrl: 'event/directives/template-package/template-package-deleted.html',
            link: link,
            restrict: 'E',
            scope: {
                event: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

    TemplatePackageDeletedDirectiveController.$inject = ['$scope'];

    /* @ngInject */
    function TemplatePackageDeletedDirectiveController($scope) {
        var _event = $scope.event;

        $scope.parseData = function () {
            _event.buildLabel('techno.package.event.deletedByUser');
        };

        $scope.parseData();
    }

    ////////////////

    EventTimeDirective.$inject = [];

    /* @ngInject */
    function EventTimeDirective() {
        var directive = {
            templateUrl: 'event/directives/event-time.html',
            link: link,
            restrict: 'E',
            scope: {
                timestamp: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

})();

