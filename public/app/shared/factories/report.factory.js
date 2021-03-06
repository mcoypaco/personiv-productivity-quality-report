sharedModule
	.factory('Report', ['$http', function($http){
		var urlBase = 'report';

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
			paginate: function(page){
				return $http.get(urlBase + '-paginate?page=' + page);
			},
			paginateDetails: function(page){
				return $http.get(urlBase + '-paginate-details?page=' + page);
			},
			paginateDepartment: function(id, page){
				return $http.get(urlBase + '-paginate/' + id + '?page=' + page);
			},
			paginateDepartmentDetails: function(id, page){
				return $http.get(urlBase + '-paginate-details/' + id + '?page=' + page);
			},
			search: function(data){
				return $http.post(urlBase + '-search', data);
			},
			searchDepartment: function(id, data){
				return $http.post(urlBase + '-search-department/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			monthly: function(){
				return $http.get(urlBase + '-monthly');
			},
			searchMonthly: function(data){
				return $http.post(urlBase + '-search-monthly', data);
			},
			departmentMonthly: function(data){
				return $http.post(urlBase + '-department-monthly', data);
			},
			departmentMonthlyPosition: function(data){
				return $http.post(urlBase + '-department-monthly-position', data);
			},
		}
	}])