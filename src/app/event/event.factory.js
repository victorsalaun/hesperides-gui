(function () {
    'use strict';

    angular
        .module('hesperides.event')
        .factory('EventEntry', EventEntryFactory);

    EventEntryFactory.$inject = ['$translate'];

    /* @ngInject */
    function EventEntryFactory($translate) {
        var EventEntry = function (data) {
            var me = this;

            this.type = data.type;
            this.data = data.data;
            this.timestamp = data.timestamp;
            this.user = data.user;
            this.isGlobal = false; // indicates if this event is about global properties

            // For internal use
            this.id = 0;
            this.isSelected = false;
            this.isSelectable = true;

            this.label = me.user + " "; // the event label : the displayable message. Used for filtering. Always starts by the user name

            // The simple type of the event
            var tab = data.type.split('.');
            this._type = tab[tab.length - 1];

            // Get the module name of the event if applicable
            if (!_.isUndefined(this.data.path)) {
                if (_.isEqual(this.data.path, '#')) {
                    if (_.isEqual(this._type, 'PropertiesSavedEvent')) {
                        this.isGlobal = true;
                    }
                } else {
                    var pathsItems = this.data.path.split('#');
                    if (!_.isUndefined(pathsItems [3])) {
                        me.moduleName = pathsItems [3];
                    }
                    if (!_.isUndefined(pathsItems [4])) {
                        me.moduleVersion = pathsItems [4];
                    }
                }
            }

            /**
             * This method is for building the event label
             * This makes use of javascript generic arguments
             */
            this.buildLabel = function () {
                var _args = arguments;

                var _labelCode = _args[0];

                _.remove(arguments, function (item) {
                    return item == _labelCode;
                });

                $translate(_labelCode).then(function (label) {

                    var _lbl = me.user + " " + label;

                    _(_args).each(function (arg) {
                        _lbl += " " + arg;
                    });

                    me.label = _lbl;
                });
            };
        };

        return EventEntry;
    }

})();

