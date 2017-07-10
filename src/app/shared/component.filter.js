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

