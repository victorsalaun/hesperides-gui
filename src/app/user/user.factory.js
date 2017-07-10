(function () {
    'use strict';

    angular
        .module('hesperides.user')
        .factory('User', UserFactory);

    UserFactory.$inject = [];

    /* @ngInject */
    function UserFactory() {
        var User = function (data){
            var me = this;

            // The user name
            this.username = data.username;

            // Indicates if the user is an Ops or not.
            // Used for Ops dedicated actions.
            this.isProdUser = data.prodUser;

        };

        return User;
    }

})();

