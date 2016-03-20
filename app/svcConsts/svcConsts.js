System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SvcConsts;
    return {
        setters:[],
        execute: function() {
            SvcConsts = (function () {
                function SvcConsts() {
                }
                SvcConsts.CLIENT_ID = "1e9bcdbd-640e-43af-b115-65d1285c28e7";
                SvcConsts.TENTANT_ID = "crunchdemo.onmicrosoft.com";
                SvcConsts.GRAPH_RESOURCE = "https://graph.microsoft.com";
                SvcConsts.REDIRECT_URL = "http://localhost:8000";
                return SvcConsts;
            }());
            exports_1("SvcConsts", SvcConsts);
        }
    }
});
//# sourceMappingURL=svcConsts.js.map