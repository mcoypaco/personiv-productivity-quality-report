sharedModule
	.factory('Performance', ['$http', function($http){
		var urlBase = 'performance';

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
			checkLimit: function(id, data){
				return $http.post(urlBase + '-check-limit/' + id, data);
			},
			report: function(id){
				return $http.get(urlBase + '-report/' + id);
			},
			checkLimitEdit: function(id, data){
				return $http.post(urlBase + '-check-limit-edit/' + id, data);
			},
			topPerformers: function(id){
				return $http.get(urlBase + '-top-performers/' + id);
			},
		}
	}])