(function () {
    'use strict';

    angular
        .module('hesperides.user')
        .service('UserService', UserService);

    UserService.$inject = ['$http', 'User'];

    /* @ngInject */
    function UserService($http, User) {
        this.authenticate = authenticate;

        ////////////////

        function authenticate() {
            return $http.get('/rest/users/auth').then(function (response) {
                return new User(response.data);
            }, function (error) {
                throw error;
            })
        }
    }

})();

