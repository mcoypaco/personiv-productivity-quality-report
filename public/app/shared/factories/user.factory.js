sharedModule
	.factory('User', ['$http', function($http){
		var urlBase = '/user';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' + id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			teamLeader: function(){
				return $http.get(urlBase + '-team-leader');
			},
		};
	}])