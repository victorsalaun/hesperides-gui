(function () {
    'use strict';

    angular
        .module('hesperides.component')
        .directive('listOfItems', ListOfItemsDirective)
        .directive('listOfLinks', ListOfLinksDirective);

    ListOfItemsDirective.$inject = ['$parse', 'PlatformColorService'];

    /* @ngInject */
    function ListOfItemsDirective($parse, PlatformColorService) {
        var directive = {
            templateUrl: 'shared/list-of-items.html',
            link: link,
            restrict: 'E',
            scope: {
                items: '=',
                selectedItem: '=',
                selectable: '=',
                editable: '=',
                filter: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {
            scope.typeahead = attrs.typeaheadexpression;
            if (!_.isUndefined(scope.typeahead)) {
                scope.type = 'search';
            }
            scope.size = attrs.size;
            scope.input = {};
            scope.tooltip = attrs.tooltip;

            scope.cssClass = function (item) {
                var listClass = "";

                if (item === scope.selectedItem) {
                    listClass += " " + attrs.css;
                } else {
                    listClass += " md-clear";
                }

                if (scope.selectable === true) {
                    listClass += " md-raised";
                }

                return listClass;
            };

            scope.backgroundColor = function (item) {
                return PlatformColorService.calculateColor(item.name);
            };

            scope.selfLabel = function (item) {
                return $parse(attrs.label)(scope.$parent, {$item: item});
            };

            scope.sortOn = function (item) {
                return $parse(attrs.sorton)(scope.$parent, {$item: item});
            };

            scope.selfEdit = function (item) {
                if (scope.selectable) {
                    $parse(attrs.onedit)(scope.$parent, {$item: item});
                    scope.selectedItem = item;
                }
            };

            scope.selfDelete = function (item) {
                scope.selectedItem = undefined;
                $parse(attrs.ondelete)(scope.$parent, {$item: item});
            };

            scope.selfAdd = function (name) {
                if (name) {
                    $parse(attrs.createfunction)(scope.$parent, {$name: name});
                    scope.resetAndHideInput();
                }
            };

            scope.resetAndHideInput = function () {
                scope.show_input = false;
                scope.input.inputText = '';
            };

            scope.showInput = function () {
                scope.show_input = true;
                window.setTimeout(function () {
                    $('#nameInput').focus();
                }, 80);
            };
        }
    }

    ////////////////

    ListOfLinksDirective.$inject = ['$parse', 'PlatformColorService', '$window'];

    /* @ngInject */
    function ListOfLinksDirective($parse, PlatformColorService, $window) {
        var directive = {
            templateUrl: 'shared/list-of-links.html',
            link: link,
            restrict: 'E',
            scope: {
                items: '=',
                selectedItem: '=',
                filter: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {
            scope.typeahead = attrs.typeaheadexpression;
            if (!_.isUndefined(scope.typeahead)) {
                scope.type = 'search';
            }
            scope.size = attrs.size;
            scope.input = {};
            scope.tooltip = attrs.tooltip;

            scope.cssClass = function (item) {
                var listClass = "";

                if (item === scope.selectedItem) {
                    listClass += " " + attrs.css;
                } else {
                    listClass += " md-clear";
                }

                if (scope.selectable === true) {
                    listClass += " md-raised";
                }

                return listClass;
            };

            scope.backgroundColor = function (item) {
                return PlatformColorService.calculateColor(item.name);
            };

            scope.selfLabel = function (item) {
                return $parse(attrs.label)(scope.$parent, {$item: item});
            };

            scope.sortOn = function (item) {
                return $parse(attrs.sorton)(scope.$parent, {$item: item});
            };

            scope.openLink = function (item) {
                $window.open('/#' + $parse(attrs.href)(scope.$parent, {$item: item}), '_blank');
            };
        }
    }

})();

