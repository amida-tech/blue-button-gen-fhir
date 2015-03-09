"use strict";

module.exports = [
    require('./v3ToCriticality'),
    require('./v3ProblemActStatusToSensitivityStatus'),
    require('./v3ToReactionSeverity'),
    require('./v3ResultStatusToObservationStatus'),
    require('./v3ToSensitivityStatus')
];
