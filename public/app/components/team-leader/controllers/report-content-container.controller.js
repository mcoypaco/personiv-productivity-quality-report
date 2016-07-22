teamLeaderModule
	.controller('reportContentContainerController', ['$scope', '$filter', '$state', '$mdDialog', '$mdToast', 'Preloader', 'Member', 'Project', 'Position', 'Performance', 'User', 'Programme', 'Experience', function($scope, $filter, $state, $mdDialog, $mdToast, Preloader, Member, Project, Position, Performance, User, Programme, Experience){		
		var user = Preloader.getUser();
		// var departmentID = null;
		var busy = false;
		$scope.form = {};

		$scope.months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];
		
		$scope.years = [];
		
		var dateCreated = 2016;

		// will generate the dates that will be used in drop down menu
		for (var i = new Date().getFullYear(); i >= dateCreated; i--) {
			$scope.years.push(i);
		};

		$scope.details = {};
		$scope.details.date_start_month = $scope.months[new Date().getMonth()];
		$scope.details.date_start_year = $scope.years[0];
		
		$scope.getMondays = function(){
			$scope.details.date_end = null;
			$scope.details.date_start = null;
			$scope.details.weekend = [];
			Performance.getMondays($scope.details)
				.success(function(data){
					$scope.mondays = data;
					$scope.show = true;
					return;
				})
				.error(function(){
					Preloader.error();
				});

		};

		$scope.getWeekends = function(){	
			$scope.details.date_end = null;	
			$scope.details.weekend = [];
			Performance.getWeekends($scope.details)
				.success(function(data){
					$scope.weekends = data;
				})
				.error(function(){
					Preloader.error();
				});
		};

		// if(!user){
		// 	User.index()
		// 		.success(function(data){
		// 			$scope.user = data;
		// 			departmentID = data.department_id;
		// 			Member.updateTenure(data.id)
		// 				.success(function(){					
		// 					Member.teamLeader(data.id)
		// 						.success(function(data){
		// 							$scope.members = data;
		// 						});
		// 				})
		// 			Project.department(departmentID)
		// 				.success(function(data){
		// 					$scope.projects = data;
		// 				})
		// 		});
		// }
		// else{		
		// 	departmentID = user.department_id;
		// 	Member.teamLeader(user.id)
		// 		.success(function(data){
		// 			$scope.members = data;
		// 		});
		// 	Project.department(user.department_id)
		// 		.success(function(data){
		// 			$scope.projects = data;
		// 		})
		// }

		$scope.showPositions = function(projectID){
			Position.project(projectID)
				.success(function(data){
					$scope.positions = data;
				});

			Experience.members(projectID)
				.success(function(data){
					angular.forEach(data, function(item){
						item.date_started = new Date(item.date_started);
						item.first_letter = item.member.full_name.charAt(0).toUpperCase();
					});

					$scope.members = data;
					$scope.resetMembers();
				});

			Project.show(projectID)
				.success(function(data){
					$scope.project = data;
				});
		};

		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.childState = 'Report';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'report';
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
			$scope.toolbar.userInput = '';
			$scope.searchBar = false;
		};
		/**
		 * Object for content view
		 *
		*/
		$scope.rightSidenav = {};
		$scope.rightSidenav.show = true;

		$scope.fab = {};

		$scope.fab.icon = 'mdi-check';
		$scope.fab.label = 'Submit';
		
		$scope.fab.show = true;

		$scope.fab.action = function(){
			$scope.showErrors = true;
			if($scope.form.createReportForm.$invalid){
				angular.forEach($scope.form.createReportForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				$mdDialog.show(
					$mdDialog.alert()
						.parent(angular.element(document.body))
						.clickOutsideToClose(true)
				        .title('Error')
				        .content('Please complete the forms or check the errors.')
				        .ariaLabel('Error')
				        .ok('Got it!')
				);
			}
			else{
				if(!busy){
					busy = true;
					var count = 0;
					angular.forEach($scope.members, function(item){
						// item.department_id = departmentID;
						item.date_start = $scope.details.date_start;
						item.date_end = $scope.details.date_end;
						item.project_id = $scope.details.project_id;
						item.daily_work_hours = $scope.details.daily_work_hours;
						count = item.include ? count + 1 : count;
					});

					if(count){
						Preloader.preload();
						Performance.store($scope.members)
							.success(function(){
								$mdToast.show(
							      	$mdToast.simple()
								        .content('Report Submitted.')
								        .position('bottom right')
								        .hideDelay(3000)
							    );
								Preloader.stop();
								$state.go('main');
								busy = false;
							})
							.error(function(){
								Preloader.error();
								busy = false;
							});
					}
					else{
						$mdDialog.show(
							$mdDialog.alert()
								.parent(angular.element(document.body))
								.clickOutsideToClose(true)
						        .title('Report not submitted.')
						        .content('Empty reports are not submitted.')
						        .ariaLabel('Empty Report')
						        .ok('Got it!')
						);
					}
				}
			}
		};

		$scope.checkLimit = function(data){
			console.log(data);
			var idx = $scope.members.indexOf(data);
			console.log(idx);
			// gets the number of days worked in a day then multiply it to the daily work hours to get weekly limit
			$scope.details.weekly_hours = ((new Date($scope.details.date_end) - new Date($scope.details.date_start)) / (1000*60*60*24) + 1) * $scope.details.daily_work_hours;
			Performance.checkLimit($scope.members[idx].member.id, $scope.details)
				.success(function(data){
					$scope.members[idx].limit = data;
				})
				.error(function(){
					$scope.members[idx].limit = $scope.details.weekly_hours;
				});
		};

		$scope.resetMembers = function(){
			// $scope.checkLimit();
			angular.forEach($scope.members, function(item, key){
				item.hours_worked = null;
				$scope.checkLimit(item);
			});
		}

		$scope.checkBalance = function(data){
			var index = $scope.members.indexOf(data);
			$scope.members[index].balance = $scope.members[index].limit - $scope.members[index].hours_worked;
			$scope.members[index].balance = $scope.members[index].balance ? $scope.members[index].balance.toFixed(2) : 0;
		}

		// $scope.checkProgramme = function(idx){
		// 	$scope.details.programme_id = $scope.work_hours[idx].id;
		// }

		$scope.init = function(){
			Member.updateTenure()
				.then(function(){
					return;					
				})
				// .then(function(){
				// 	Member.index()
				// 		.success(function(data){
				// 			$scope.members = data;
				// 			return;
				// 		})
				// 		.error(function(){
				// 			Preloader.error();
				// 		});
				// })
				.then(function(){
					Project.index()
						.success(function(data){
							$scope.projects = data;
							return;
						})
						.error(function(){
							Preloader.error();
						})
				})
				.then(function(){		
					Programme.index()
						.success(function(data){
							$scope.work_hours = data;
							return;
						})
				})
				.then(function(){
					$scope.getMondays();
				}, function(){
					Preloader.error();
				})
		}();
	}]);