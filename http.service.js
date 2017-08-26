angular.module('app').service('http.service', ['$http', '$q', 'env', 'baseUrl', '$sce', 
function ($http, $q, env, baseUrl, $sce) {
    this._env = env;
    this._baseUrl = baseUrl;
    this._q = $q;
    this._http = $http;

    this.getDeferred = function(){
        return this._q.defer();  
    };

    this.doJSONP = function (url, cache) {
        var trustedUrl = $sce.trustAsResourceUrl(url);
        var deferred = this.getDeferred(),
            promise;
        
        if (cache){
            promise = this._http.jsonp(trustedUrl, {
                cache: true,
                jsonpCallbackParam: 'callback'
            });
        } else {
            promise = this._http.jsonp(trustedUrl, {
                jsonpCallbackParam: 'callback'
            });
        }
        
        promise.then(function (result) {
                //can add processing here
                if (result.data){
                    result = result.data;
                }
                deferred.resolve(result);
            }, function(err){
                //can add processing here
                deferred.reject(err);
            });
        return deferred.promise;
    };

    this.doGet =  function (url, cache) {
        var deferred = this.getDeferred(),
            promise;
        
        if (cache){
            promise = this._http.get(this._baseUrl + url, {
                cache: true
            });
        } else {
            promise = this._http.get(this._baseUrl + url);
        }
        promise.then(function (result) {
                //can add processing here
                if (result.data){
                    result = result.data;
                }
                deferred.resolve(result);
            }, function(err){
                //can add processing here
                deferred.reject(err);
            });
        return deferred.promise;
    };

    this.doPost =  function (url, data) {
        var deferred = this.getDeferred();
        this._http.post(this._baseUrl + url, data)
            .then(function (result) {
                //can add processing here
                if (result.data){
                    result = result.data;
                }                
                deferred.resolve(result);
            }, function(err){
                //can add processing here
                deferred.reject(err);
            });
        return deferred.promise;
    };
    
    this.doGraphQL =  function (url, lang, action, parameter, response) {
        var deferred = this.getDeferred();
        this._http.post(this._baseUrl + url, {
            action: action,
            parameter: JSON.stringify(parameter),
            response: response,
            lang: lang
        })
            .then(function (result) {
                //can add processing here
                if (result.data){
                    result = result.data;
                }                
                deferred.resolve(result);
            }, function(err){
                //can add processing here
                deferred.reject(err);
            });
        return deferred.promise;
    };

    this.doDelete =  function (url) {
        var deferred = this.getDeferred();
        this._http.delete(this._baseUrl + url)
            .then(function (data) {
                if (data.data){
                    data = data.data;
                }                                
                //can add processing here
                deferred.resolve(data);
            }, function(err){
                //can add processing here
                deferred.reject(err);
            });
        return deferred.promise;
    };

    this.doPut =  function (url, data) {
        var deferred = this.getDeferred();
        var put = this._http.put(this._baseUrl + url, data);
        if (!data){
            put = this._http.put(url, {});
        }
        put.then(function (result) {
            //can add processing here
            if (result.data){
                result = result.data;
            }            
            deferred.resolve(result);
        }, function(err){
            //can add processing here
            deferred.reject(err);
        });
        return deferred.promise;
    };

    this.buildQuery =  function (obj) {
        var parts = [];
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (obj[i] === 0){
                    parts.push(encodeURIComponent(i) + '=' + 0);
                } else if (obj[i] === '' || obj[i] === undefined || obj[i] === null){
                    parts.push(encodeURIComponent(i) + '=');    
                } else {
                    parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));    
                }
            }
        }
        return parts.join('&');
    };
    return this;    
}]);
