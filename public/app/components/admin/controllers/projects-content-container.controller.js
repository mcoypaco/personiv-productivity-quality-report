adminModule
	.controller('projectsContentContainerController', ['$scope', '$state', '$stateParams', '$mdDialog', 'Department', 'Preloader', 'Project', function($scope, $state, $stateParams, $mdDialog, Department, Preloader, Project){
		/**
		 * Object for toolbar
		 *
		*/
		var department_id = $stateParams.departmentID;

		$scope.toolbar = {};
		$scope.toolbar.showBack = true;
		$scope.toolbar.back = function(){
			$state.go('main.department-settings');
		}
		
		Department.show(department_id)
			.success(function(data){
				$scope.toolbar.parentState = data.name;
			});

		$scope.toolbar.childState = 'Projects';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'projects';

		$scope.subheader.refresh = function(){
			Preloader.preload();
			$scope.init(true);
		}

		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-plus';
		$scope.fab.label = 'Project';
		
		$scope.fab.show = true;

		$scope.fab.action = function(){
			$mdDialog.show({
			    	controller: 'addProjectDialogController',
			      	templateUrl: '/app/components/admin/templates/dialogs/add-project.dialog.template.html',
			      	parent: angular.element(document.body),
			    })
			    .then(function(){
			    	$scope.subheader.refresh();
			    })
		};

		/**
		 * Status of search bar.
		 *
		*/
		$scope.searchBar = false;

		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.toolbar.searchText = '';
			$scope.searchBar = false;
		};
		
		
		$scope.searchUserInput = function(){
			$scope.project.show = false;
			Preloader.preload()
			Project.search($scope.toolbar)
				.success(function(data){
					$scope.project.results = data;
					Preloader.stop();
				})
				.error(function(data){
					Preloader.error();
				});
		};

		$scope.viewProject = function(id){
			$state.go('main.positions', {'departmentID':department_id, 'projectID':id});
		};

		$scope.viewTarget = function(id){
			Preloader.set(id);
			$mdDialog.show({
		    	controller: 'showTargetsDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/show-targets.dialog.template.html',
		      	parent: angular.element(document.body),
		      	clickOutsideToClose: true,
		    });
		};

		$scope.init = function(refresh){
			$scope.project = {};
			Project.department(department_id)
				.success(function(data){
					angular.forEach(data, function(item){
						item.first_letter = item.name.charAt(0).toUpperCase();
						item.created_at = new Date(item.created_at);
					});

					$scope.project.all = data;
					$scope.project.show = true;

					if(refresh){
						Preloader.stop();
						Preloader.stop();
					}
				})
				.error(function(){
					Preloader.error();
				});
		}

		$scope.init()
	}])