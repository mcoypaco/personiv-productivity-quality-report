var teamLeaderModule = angular.module('teamLeaderModule', [
	/* Shared Module */
	'sharedModule'
]); 
teamLeaderModule
	.config(['$stateProvider', function($stateProvider){
		$stateProvider
			.state('main', {
				url:'/',
				views: {
					'': {
						templateUrl: '/app/shared/views/main.view.html',
						controller: 'mainViewController',
					},
					'toolbar@main': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'left-sidenav@main': {
						templateUrl: '/app/components/team-leader/templates/sidenavs/main-left.sidenav.html',
						controller: 'leftSidenavController',
					},
					'content-container@main': {
						templateUrl: '/app/components/team-leader/views/content-container.view.html',
						controller: 'mainMonthlyContentContainerController',
					},
					'content@main': {
						templateUrl: '/app/components/team-leader/templates/content/main-monthly.content.template.html',
					},
					'right-sidenav@main': {
						templateUrl: '/app/components/team-leader/templates/sidenavs/main-monthly-right.sidenav.html',
					}
				}
			})
			.state('main.weekly-report',{
				url:'weekly-report',
				views: {
					'content-container': {
						templateUrl: '/app/components/team-leader/views/content-container.view.html',
						controller: 'mainContentContainerController',
					},
					'toolbar@main.weekly-report': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.weekly-report': {
						templateUrl: '/app/shared/templates/main.content.template.html',
					},
					'right-sidenav@main.weekly-report': {
						templateUrl: '/app/components/team-leader/templates/sidenavs/main-right.sidenav.html',
					}
				},
			})
			.state('main.members', {
				url:'members',
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'membersContentContainerController',
					},
					'toolbar@main.members': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.members':{
						templateUrl: '/app/components/team-leader/templates/content/members.content.template.html',
					},
				}
			})
			.state('main.report', {
				url:'report',
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'reportContentContainerController',
					},
					'toolbar@main.report': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.report':{
						templateUrl: '/app/components/team-leader/templates/content/report.content.template.html',
					},
				},
				onEnter: ['$state', 'User', function($state, User){
					User.index()
						.success(function(data){
							if(data.role == 'manager'){
								$state.go('page-not-found');
							}
						});
				}],
			})
			.state('main.edit-report',{
				url:'edit-report/{reportID}',
				params: {'reportID':null},
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'editReportContentContainerController',
					},
					'toolbar@main.edit-report': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.edit-report':{
						templateUrl: '/app/shared/templates/content/edit-report.content.template.html',
					},
				},
				onEnter: ['$state', 'User', function($state, User){
					User.index()
						.success(function(data){
							if(data.role == 'manager'){
								$state.go('page-not-found');
							}
						});
				}],
			})
			.state('main.approvals',{
				url:'approvals',
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'approvalsContentContainerController',
					},
					'toolbar@main.approvals': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.approvals':{
						templateUrl: '/app/shared/templates/content/approval.content.template.html',
					},
				},
				onEnter: ['$state', 'User', function($state, User){
					User.index()
						.success(function(data){
							if(data.role == 'manager'){
								$state.go('page-not-found');
							}
						});
				}],
			})

	}]);
teamLeaderModule
	.controller('approvalsContentContainerController', ['$scope', '$mdDialog', 'PerformanceApproval', 'Approval', 'Preloader', 'User',  function($scope, $mdDialog, PerformanceApproval, Approval, Preloader, User){
		User.index()
			.success(function(data){
				$user = data;

				$scope.pending = {};
				$scope.approved = {};
				$scope.declined = {};

				$scope.pending.page = 2;
				$scope.approved.page = 2;
				$scope.declined.page = 2;


				/* Pending */
				Approval.pendingUser($user.id)
					.success(function(data){
						$scope.pending.details = data;
						$scope.pending.paginated = data.data;
						$scope.pending.show = true;
						$scope.pending.busy = false;
						$scope.pending.paginateLoad = function(){
							// kills the function if ajax is busy or pagination reaches last page
							if($scope.pending.busy || ($scope.pending.page > $scope.pending.details.last_page)){
								return;
							}
							/**
							 * Executes pagination call
							 *
							*/
							// sets to true to disable pagination call if still busy.
							$scope.pending.busy = true;

							// Calls the next page of pagination.
							Approval.pendingUser($user.id, $scope.pending.page)
								.success(function(data){
									// increment the page to set up next page for next AJAX Call
									$scope.pending.page++;
									// iterate over each data then splice it to the data array
									angular.forEach(data, function(item, key){
										$scope.pending.paginated.push(item);
									});
									// Enables again the pagination call for next call.
									$scope.pending.busy = false;
								})
								error(function(){
									Preloader.error();
								});
						}
					})
					.error(function(){
						Preloader.error();
					});

				/* Approved */
				PerformanceApproval.approvedUser($user.id)
					.success(function(data){
						$scope.approved.details = data;
						$scope.approved.paginated = data.data;
						$scope.approved.show = true;
						$scope.approved.busy = false;
						$scope.approved.paginateLoad = function(){
							// kills the function if ajax is busy or pagination reaches last page
							if($scope.approved.busy || ($scope.approved.page > $scope.approved.details.last_page)){
								return;
							}
							/**
							 * Executes pagination call
							 *
							*/
							// sets to true to disable pagination call if still busy.
							$scope.approved.busy = true;

							// Calls the next page of pagination.
							PerformanceApproval.approvedUser($user.id, $scope.approved.page)
								.success(function(data){
									// increment the page to set up next page for next AJAX Call
									$scope.approved.page++;
									// iterate over each data then splice it to the data array
									angular.forEach(data, function(item, key){
										$scope.approved.paginated.push(item);
									});
									// Enables again the pagination call for next call.
									$scope.approved.busy = false;
								})
								error(function(){
									Preloader.error();
								});
						}
					})
					.error(function(){
						Preloader.error();
					});

				/* Declined */
				PerformanceApproval.declinedUser($user.id)
					.success(function(data){
						$scope.declined.details = data;
						$scope.declined.paginated = data.data;
						$scope.declined.show = true;
						$scope.declined.busy = false;
						$scope.declined.paginateLoad = function(){
							// kills the function if ajax is busy or pagination reaches last page
							if($scope.declined.busy || ($scope.declined.page > $scope.declined.details.last_page)){
								return;
							}
							/**
							 * Executes pagination call
							 *
							*/
							// sets to true to disable pagination call if still busy.
							$scope.declined.busy = true;

							// Calls the next page of pagination.
							PerformanceApproval.declinedUser($user.id, $scope.declined.page)
								.success(function(data){
									// increment the page to set up next page for next AJAX Call
									$scope.declined.page++;
									// iterate over each data then splice it to the data array
									angular.forEach(data, function(item, key){
										$scope.declined.paginated.push(item);
									});
									// Enables again the pagination call for next call.
									$scope.declined.busy = false;
								})
								error(function(){
									Preloader.error();
								});
						}
					})
					.error(function(){
						Preloader.error();
					});
			});
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.childState = 'Approvals';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'approvals';
		
		$scope.subheader.refresh = function(){
			Preloader.preload();
			$scope.pending.show = false;
			$scope.approved.show = false;
			$scope.declined.show = false;
			$scope.pending.page = 2;
			$scope.approved.page = 2;
			$scope.declined.page = 2;

			Approval.pendingUser($user.id)
				.success(function(data){
					$scope.pending.details = data;
					$scope.pending.paginated = data.data;
					
				
				PerformanceApproval.approvedUser($user.id)
					.success(function(data){
						$scope.approved.details = data;
						$scope.approved.paginated = data.data;
						

						PerformanceApproval.declinedUser($user.id)
							.success(function(data){
								$scope.declined.details = data;
								$scope.declined.paginated = data.data;

								$scope.pending.show = true;
								$scope.declined.show = true;
								$scope.approved.show = true;

								Preloader.stop();
							})
					})
				})

		}

		$scope.showPending = function(id){
			Preloader.set(id);
			$mdDialog.show({
		      controller: 'approvalsDialogController',
		      templateUrl: '/app/components/team-leader/templates/dialogs/approval.dialog.template.html',
		      parent: angular.element(document.body),
		    })
		    .then(function(){
		    	// $scope.subheader.refresh();
		    	$state.go($state.current, {}, {reload:true});
		    });
		}

		$scope.showApprovedDetails = function(id){
			Preloader.set(id);
			$mdDialog.show({
		      controller: 'approvedApprovalsDetailsDialogController',
		      templateUrl: '/app/components/admin/templates/dialogs/approved-approval-details.dialog.template.html',
		      parent: angular.element(document.body),
		      clickOutsideToClose:true,
		    });
		}

		$scope.showDeclinedDetails = function(id){
			Preloader.set(id);
			$mdDialog.show({
		      controller: 'declinedApprovalsDetailsDialogController',
		      templateUrl: '/app/components/admin/templates/dialogs/declined-approval-details.dialog.template.html',
		      parent: angular.element(document.body),
		      clickOutsideToClose:true,
		    });
		}

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
		
		
		$scope.searchUserInput = function(){
			$scope.report.show = false;
		};

		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		// $scope.fab.icon = 'mdi-plus';
		// $scope.fab.label = 'Add';
		
		$scope.fab.show = false;


	}]);
teamLeaderModule
	.controller('editReportContentContainerController', ['$scope', '$mdDialog', '$state', '$mdToast', '$stateParams', 'Preloader', 'Performance', 'Position', 'Project', 'Approval', function($scope, $mdDialog, $state, $mdToast, $stateParams, Preloader, Performance, Position, Project, Approval){
		var reportID = $stateParams.reportID;
		var busy = false;
		$scope.form = {};

		$scope.hours = [
			{'value': 8.3},
			{'value': 9.1},
		];

		$scope.details = {};

		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.childState = 'Edit Report';
		$scope.toolbar.showBack = true;
		$scope.toolbar.back = function(){
			$state.go('main');
		}
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'report';

		Performance.report(reportID)
			.success(function(data){
				$scope.performances = data;
				
				$scope.details.date_start = new Date(data[0].date_start);
				$scope.details.date_end = new Date(data[0].date_end);
				$scope.details.project_name = data[0].project_name;
				$scope.details.daily_work_hours = data[0].daily_work_hours;
				$scope.details.first_letter = data[0].first_letter;

				Position.project(data[0].project_id)
					.success(function(data){
						$scope.positions = data;
					});

				Project.department(data[0].department_id)
					.success(function(data){
						$scope.projects = data;
					});
			});

		$scope.showPositions = function(id){
			Position.project(id)
				.success(function(data){
					$scope.positions = data;
				});
		};

		$scope.checkLimit = function(idx){
			// gets the number of days worked in a day then multiply it to the daily work hours to get weekly limit
			$scope.details.weekly_hours = (($scope.details.date_end - $scope.details.date_start) / (1000*60*60*24) + 1) * $scope.details.daily_work_hours;
			Performance.checkLimitEdit($scope.performances[idx].member_id, $scope.details)
				.success(function(data){
					$scope.performances[idx].limit = data;
				})
				.error(function(){
					$scope.performances[idx].limit = $scope.details.weekly_hours;
				});
		};

		$scope.resetMembers = function(){
			angular.forEach($scope.performances, function(item, key){
				item.hours_worked = null;
				$scope.checkLimit(key);
			});
		}

		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-check';
		$scope.fab.label = 'Submit';
		
		$scope.fab.show = true;

		$scope.fab.action = function(){
			$scope.showErrors = true;
			if($scope.form.editReportForm.$invalid){
				angular.forEach($scope.form.editReportForm.$error, function(field){
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
				Preloader.preload();

				if(!busy){
					busy = true;
					angular.forEach($scope.performances, function(item){
						item.date_start = $scope.details.date_start;
						item.date_end = $scope.details.date_end;
						item.daily_work_hours = $scope.details.daily_work_hours;
					});

					Approval.performanceEdit(reportID, $scope.performances)
						.success(function(){
							$mdToast.show(
						      	$mdToast.simple()
							        .content('Edit report has been submitted for approval.')
							        .position('bottom right')
							        .hideDelay(3000)
						    );
							$state.go('main');
							Preloader.stop();
							busy = false;
						})
						.error(function(){
							Preloader.error();
							busy = false;
						})
				}
			}
		};

	}]);
teamLeaderModule
	.controller('leftSidenavController', ['$scope', '$mdSidenav', 'User', function($scope, $mdSidenav, User){
		$scope.menu = {};
		User.index()
			.success(function(data){
				var user = data;
				
				if(user.role=='team-leader')
				{
					$scope.menu.section = [
						{
							'name':'Dashboard',
							'state':'main',
							'icon':'mdi-view-dashboard',
							'tip': 'Dashboard: tracks your team\'s monthly performance.',
						},
						{
							'name':'Weekly Report',
							'state':'main.weekly-report',
							'icon':'mdi-view-carousel',
							'tip': 'Dashboard: tracks your team\'s weekly performance, targets, and top performers.',
						},
						{
							'name':'Approvals',
							'state':'main.approvals',
							'icon':'mdi-file-document-box',
							'tip': 'Approvals: shows pending request for report changes.',
						},
						{
							'name':'Members',
							'state': 'main.members',
							'icon':'mdi-account-multiple',
							'tip': 'Members: manage people in your team.',
						},
						{
							'name':'Report',
							'state': 'main.report',
							'icon':'mdi-file-document',
							'tip': 'Report: submit team\'s weekly reports',
						},
					];
				}
				else if(user.role=='manager')
				{
					$scope.menu.section = [
						{
							'name':'Dashboard',
							'state':'main',
							'icon':'mdi-view-dashboard',
							'tip': 'Dashboard: tracks your team\'s monthly performance.',
						},
						{
							'name':'Weekly Report',
							'state':'main.weekly-report',
							'icon':'mdi-view-carousel',
							'tip': 'Dashboard: tracks your team\'s weekly performance, targets, and top performers.',
						},
						{
							'name':'Members',
							'state': 'main.members',
							'icon':'mdi-account-multiple',
							'tip': 'Members: manage people in your team.',
						},
					];
				}
				else{
					$scope.menu.section = [
						{
							'name':'Dashboard',
							'state':'main',
							'icon':'mdi-view-dashboard',
							'tip': 'Dashboard: tracks your team\'s weekly performance, targets, and top performers.',
						},
						{
							'name':'Approvals',
							'state':'main.approvals',
							'icon':'mdi-file-document-box',
							'tip': 'Approvals: shows pending request for report changes.',
						},
						{
							'name':'Members',
							'state': 'main.members',
							'icon':'mdi-account-multiple',
							'tip': 'Members: manage people in your team.',
						},
					];
				}
			});

		// set section as active
		$scope.setActive = function(index){
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').toggleClass('active'));
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').siblings().removeClass('active'));
		};
	}]);
teamLeaderModule
	.controller('mainContentContainerController', ['$scope', '$filter', '$state', '$mdToast', '$mdDialog', 'Approval', 'Preloader', 'Member', 'Position', 'Report', 'Performance', 'Target', 'User', 'WalkThrough', 'Project', function($scope, $filter, $state, $mdToast, $mdDialog, Approval, Preloader, Member, Position, Report, Performance, Target, User, WalkThrough, Project){
		var user = null;
		$scope.tour = {};
		$scope.tour.search = 'Need to find something? I\'ll help you find what you\'re looking for.';
		$scope.tour.notification = 'You don\'t have to wait for the confirmation of your request. I\'ll notify you when something needs your attention.';
		$scope.tour.refresh = 'Refreshes the current displayed data.'
		$scope.subheaderTour = function(){
			$scope.subheaderTour = 0;
		}
		$scope.stopTours = function(){
			WalkThrough.show(user.id)
				.success(function(data){
					if(!data){			
						WalkThrough.store(user)
							.error(function(){
								Preloader.error();
							});
					}
				})
		}

		$scope.filterDate = {};
		$scope.filterData = {};
		$scope.filterDate.type = 'Weekly';

		$scope.rightSidenav = {};
		$scope.rightSidenav.show = true;
		$scope.rightSidenav.items = [];
		$scope.rightSidenav.queryMember = function(query){
			var results = query ? $filter('filter')($scope.rightSidenav.items, query) : $scope.rightSidenav.items;
			return results;
		}

		Member.index()
			.success(function(data){
				angular.forEach(data, function(item){
					var member = {};
					member.full_name = item.full_name;
					$scope.rightSidenav.items.push(member);
				});
			})

		Position.index()
			.success(function(data){
				$scope.positions = data;
			});

		$scope.months = [
			{'value': '01', 'month': 'January'},
			{'value': '02', 'month': 'February'},
			{'value': '03', 'month': 'March'},
			{'value': '04', 'month': 'April'},
			{'value': '05', 'month': 'May'},
			{'value': '06', 'month': 'June'},
			{'value': '07', 'month': 'July'},
			{'value': '08', 'month': 'August'},
			{'value': '09', 'month': 'September'},
			{'value': '10', 'month': 'October'},
			{'value': '11', 'month': 'November'},
			{'value': '12', 'month': 'December'},
		];

		$scope.months_array = [
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

		$scope.filterDate.date_start_month = $scope.months_array[new Date().getMonth()];
		$scope.filterDate.date_start_year = $scope.years[0];
		
		$scope.getMondays = function(){
			$scope.filterDate.date_end = null;
			$scope.filterDate.date_start = null;
			$scope.filterDate.weekend = [];
			Performance.getMondays($scope.filterDate)
				.success(function(data){
					$scope.mondays = data;
				})
				.error(function(){
					Preloader.error();
				});
		};

		$scope.getWeekends = function(){	
			$scope.filterDate.date_end = null;	
			$scope.filterDate.weekend = [];
			Performance.getWeekends($scope.filterDate)
				.success(function(data){
					$scope.weekends = data;
				})
				.error(function(){
					Preloader.error();
				});
		};

		$scope.getPositions = function(){
			Position.project($scope.projects[$scope.filterData.project].id)
				.success(function(data){
					$scope.positions = data;
				})
		}

		$scope.clearFilter = function(){
			$scope.positions = [];
			$scope.filterData.project = '';
			$scope.filterData.position = '';
			$scope.filterDate.date_start = '';
			$scope.filterDate.date_end = ''
		}
		/**
		 * Object for charts
		 *
		*/
		// $scope.charts = {};
		// $scope.charts.result = {};
		// $scope.charts.data = [];
		// $scope.charts.result.data = [];
		// $scope.charts.series = [];
		// $scope.charts.result.series = [];
		// $scope.charts.labels = ['Productivity', 'Quality'];

		$scope.charts = {};
		$scope.charts.productivity = {};
		$scope.charts.productivity.data = [];
		$scope.charts.productivity.series = ['Productivity'];
		$scope.charts.productivity.labels = [];

		$scope.charts.quality = {};
		$scope.charts.quality.data = [];
		$scope.charts.quality.series = ['Productivity'];
		$scope.charts.quality.labels = [];

		$scope.charts.result = {};
		$scope.charts.result.productivity = {};
		$scope.charts.result.productivity.data = [];
		$scope.charts.result.productivity.series = ['Productivity'];
		$scope.charts.result.productivity.labels = [];

		$scope.charts.result.quality = {};
		$scope.charts.result.quality.data = [];
		$scope.charts.result.quality.series = ['Productivity'];
		$scope.charts.result.quality.labels = [];


		/**
		 * Object for report
		 *
		*/
		$scope.report = {};
		$scope.report.paginated = [];
		$scope.report.targets = [];
		$scope.report.topPerformers = [];
		// 2 is default so the next page to be loaded will be page 2 
		$scope.report.page = 2;

		
		User.index()
			.success(function(data){
				user = data;
				Project.department(user.department_id)
					.success(function(data){
						$scope.projects = data;
					});
				// fetch the details of the pagination 
				Report.paginateDepartmentDetails(user.department_id)
					.success(function(data){
						$scope.report.details = data;
						$scope.report.busy = true;
						angular.forEach(data.data, function(item, key){
							// fetch the targets
							Target.project(item.id)
								.success(function(data){
									$scope.report.targets.splice(key, 0, data)
								});
							Performance.topPerformers(item.id)
								.success(function(data){
									$scope.report.topPerformers.splice(key, 0, data)
								});
						});
						// fetch the custom paginated data
						Report.paginateDepartment(user.department_id)
							.success(function(data){
								$scope.report.paginated = data;
								$scope.report.show = true;
								$scope.report.busy = false;
								// set up the charts
								// reports cycle
								angular.forEach($scope.report.paginated, function(parentItem, parentKey){
									parentItem.chartType = 'bar';
									// performance cycle 
									// $scope.charts.data.push([]);
									// $scope.charts.series.push([]);
									$scope.charts.productivity.data.push([]);
									$scope.charts.productivity.labels.push([]);
									$scope.charts.productivity.data[parentKey].push([]);
									
									$scope.charts.quality.data.push([]);
									$scope.charts.quality.labels.push([]);
									$scope.charts.quality.data[parentKey].push([]);
									angular.forEach(parentItem, function(item, key){
										// push every productivity and quality of per employee
										// $scope.charts.data[parentKey].push([item.productivity, item.quality]);
										$scope.charts.productivity.data[parentKey][0].push(item.productivity);
										$scope.charts.quality.data[parentKey][0].push(item.quality);
										$scope.charts.productivity.labels[parentKey].push(item.full_name);
										$scope.charts.quality.labels[parentKey].push(item.full_name);
									});
								});
								$scope.report.paginateLoad = function(){
									// kills the function if ajax is busy or pagination reaches last page
									if($scope.report.busy || ($scope.report.page > $scope.report.details.last_page)){
										return;
									}
									/**
									 * Executes pagination call
									 *
									*/
									// sets to true to disable pagination call if still busy.
									$scope.report.busy = true;
									Report.paginateDepartmentDetails(user.department_id, $scope.report.page)
										.success(function(data){
											// iterate over each data then splice it to the data array
											angular.forEach(data.data, function(item, key){
												$scope.report.details.data.push(item);
												// fetch the targets
												Target.project(item.id)
													.success(function(data){
														$scope.report.targets.splice(key, 0, data)
													});
												Performance.topPerformers(item.id)
													.success(function(data){
														$scope.report.topPerformers.splice(key, 0, data)
													});
											});
										});

									// Calls the next page of pagination.
									Report.paginateDepartment(user.department_id, $scope.report.page)
										.success(function(data){
											// increment the page to set up next page for next AJAX Call
											$scope.report.page++;

											// iterate over each data then splice it to the data array
											angular.forEach(data, function(item, key){
												$scope.report.paginated.push(item);
											});
											// set up the charts
											// reports cycle
											angular.forEach(data, function(parentItem, parentKey){
												// performance cycle 
												// $scope.charts.data.push([]);
												// $scope.charts.series.push([]);

												$scope.charts.productivity.data.push([]);
												$scope.charts.productivity.labels.push([]);
												$scope.charts.productivity.data[$scope.charts.productivity.data.length -1].push([]);
												
												$scope.charts.quality.data.push([]);
												$scope.charts.quality.labels.push([]);
												$scope.charts.quality.data[$scope.charts.quality.data.length -1].push([]);

												angular.forEach(parentItem, function(item, key){
													// push every productivity and quality of per employee
													// $scope.charts.data[$scope.charts.data.length -1].push([item.productivity, item.quality]);
													// $scope.charts.series[$scope.charts.series.length -1].push(item.full_name);
													$scope.charts.productivity.data[$scope.charts.productivity.data.length -1][0].push(item.productivity);
													$scope.charts.quality.data[$scope.charts.quality.data.length -1][0].push(item.quality);
													$scope.charts.productivity.labels[$scope.charts.productivity.data.length -1].push(item.full_name);
													$scope.charts.quality.labels[$scope.charts.quality.data.length -1].push(item.full_name);
												});
											});
											// Enables again the pagination call for next call.
											$scope.report.busy = false;
										});
								}
							})
							.error(function(){
								Preloader.error();
							});
					})
					.error(function(data){
						Preloader.error();
					});
			});
		
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.childState = 'Weekly Report';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'dashboard';

		/* Refreshes the list */
		$scope.subheader.refresh = function(){
			$scope.report.show = false;
			// start preloader
			Preloader.preload();
			// clear report
			$scope.report.paginated = [];
			$scope.report.targets = [];
			$scope.report.topPerformers = [];
			$scope.report.page = 2;
			// $scope.charts.data = [];
			// $scope.charts.series = [];

			$scope.charts = {};
			$scope.charts.productivity = {};
			$scope.charts.productivity.data = [];
			$scope.charts.productivity.series = ['Productivity'];
			$scope.charts.productivity.labels = [];

			$scope.charts.quality = {};
			$scope.charts.quality.data = [];
			$scope.charts.quality.series = ['Productivity'];
			$scope.charts.quality.labels = [];

			$scope.report.busy = true;
			Report.paginateDepartmentDetails(user.department_id)
				.success(function(data){
					data.chartType = 'bar';
					$scope.report.details = data;
					angular.forEach(data.data, function(item, key){
						// fetch the targets
						Target.project(item.id)
							.success(function(data){
								$scope.report.targets.splice(key, 0, data)
							});
						Performance.topPerformers(item.id)
							.success(function(data){
								$scope.report.topPerformers.splice(key, 0, data)
							});
					});
					// fetch the custom paginated data
					Report.paginateDepartment(user.department_id)
						.success(function(data){
							$scope.report.paginated = data;
							$scope.report.show = true;

							// set up the charts
							// reports cycle
							angular.forEach($scope.report.paginated, function(parentItem, parentKey){
								parentItem.chartType = 'bar';
								// performance cycle 
								// $scope.charts.data.push([]);
								// $scope.charts.series.push([]);
								$scope.charts.productivity.data.push([]);
								$scope.charts.productivity.labels.push([]);
								$scope.charts.productivity.data[parentKey].push([]);
								
								$scope.charts.quality.data.push([]);
								$scope.charts.quality.labels.push([]);
								$scope.charts.quality.data[parentKey].push([]);

								angular.forEach(parentItem, function(item, key){
									// push every productivity and quality of per employee
									// $scope.charts.data[parentKey].push([item.productivity, item.quality]);
									// $scope.charts.series[parentKey].push(item.full_name);

									$scope.charts.productivity.data[parentKey][0].push(item.productivity);
									$scope.charts.quality.data[parentKey][0].push(item.quality);
									$scope.charts.productivity.labels[parentKey].push(item.full_name);
									$scope.charts.quality.labels[parentKey].push(item.full_name);
								});
							})
							$scope.report.busy = false;
							Preloader.stop();
						})
						.error(function(){
							Preloader.error();
						});
				})
				.error(function(){
					Preloader.error();
				});
		};

		$scope.subheader.download = function(){
			$mdDialog.show({
		    	controller: 'downloadReportDialogController',
		      	templateUrl: '/app/components/team-leader/templates/dialogs/download-report-dialog.template.html',
		      	parent: angular.element(document.body),
		    });
		}

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
		
		
		$scope.searchUserInput = function(){
			$scope.report.show = false;
			$scope.report.targets = [];
			$scope.report.topPerformers = [];
			// $scope.charts.result.data = [];
			// $scope.charts.result.series = [];
			Preloader.preload();
			Report.searchDepartment(user.department_id, $scope.toolbar)
				.success(function(data){
					$scope.report.results = data;
					console.log(data);
					angular.forEach(data, function(item, key){
						
						Target.project(item[0].id)
							.success(function(data){
								$scope.report.targets.splice(key, 0, data)
							});
						Performance.topPerformers(item[0].report_id)
							.success(function(data){
								$scope.report.topPerformers.splice(key, 0, data)
							});
					});
					angular.forEach($scope.report.results, function(parentItem, parentKey){
						// performance cycle 
						// $scope.charts.result.data.push([]);
						// $scope.charts.result.series.push([]);
						parentItem.chartType = 'bar';
						$scope.charts.productivity.data.push([]);
						$scope.charts.productivity.labels.push([]);
						$scope.charts.productivity.data[parentKey].push([]);
						
						$scope.charts.quality.data.push([]);
						$scope.charts.quality.labels.push([]);
						$scope.charts.quality.data[parentKey].push([]);

						angular.forEach(parentItem, function(item, key){
							// push every productivity and quality of per employee
							// $scope.charts.result.data[parentKey].push([item.productivity, item.quality]);
							// $scope.charts.result.series[parentKey].push(item.full_name);

							$scope.charts.productivity.data[parentKey][0].push(item.productivity);
							$scope.charts.quality.data[parentKey][0].push(item.quality);
							$scope.charts.productivity.labels[parentKey].push(item.full_name);
							$scope.charts.quality.labels[parentKey].push(item.full_name);
						});
					})
					Preloader.stop();
				})
				.error(function(data){
					Preloader.error();
				});
		};

		// $scope.show = function(id){
		// 	$state.go('main.units', {'assetID': $stateParams.assetID, 'unitID':id});
		// };
		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		// $scope.fab.icon = 'mdi-plus';
		// $scope.fab.label = 'Add';
		
		$scope.fab.show = false;

		// $scope.fab.action = function(){
		// 	return;
		// };

		$scope.editReport = function(id){
			$state.go('main.edit-report', {'reportID':id});
		};

		$scope.deleteReport = function(id){
			var confirm = $mdDialog.confirm()
		        .title('Delete Report')
		        .content('Are you sure you want to delete this report?')
		        .ok('Delete')
		        .cancel('Cancel');
		    $mdDialog.show(confirm)
		    	.then(function() {
		    		Preloader.preload();
			    	Approval.reportDelete(id)
			    		.success(function(){
			    			Preloader.stop();
			    			$mdToast.show(
						    	$mdToast.simple()
							        .content('Request has been submitted for approval.')
							        .position('bottom right')
							        .hideDelay(3000)
						    );
			    		})
			    }, function() {
			    	return;
			    });
		}
	}]);
teamLeaderModule
	.controller('mainMonthlyContentContainerController', ['$scope', '$filter', '$mdDialog', 'Preloader', 'Report', 'Programme', 'Member', function($scope, $filter, $mdDialog, Preloader, Report, Programme, Member){
		$scope.report = {};
		$scope.form = {};

		$scope.months_array = [
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

		/**
		 * Object for right sidenav
		 *
		*/
		$scope.rightSidenav = {};
		$scope.rightSidenav.show = true;
		$scope.rightSidenav.month = $scope.months_array[new Date().getMonth()];
		$scope.rightSidenav.year = new Date().getFullYear();
		$scope.rightSidenav.items = [];
		$scope.rightSidenav.queryMember = function(query){
			var results = query ? $filter('filter')($scope.rightSidenav.items, query) : $scope.rightSidenav.items;
			return results;
		}

		Member.index()
			.success(function(data){
				angular.forEach(data, function(item){
					var member = {};
					member.full_name = item.full_name;
					$scope.rightSidenav.items.push(member);
				});
			})

		Programme.index()
			.success(function(data){
				$scope.hours = data;
			})

		$scope.clearFilter = function(){
			$scope.rightSidenav.searchText = '';
			$scope.rightSidenav.month = $scope.months_array[new Date().getMonth()];
			$scope.rightSidenav.year = new Date().getFullYear();
			$scope.rightSidenav.daily_work_hours = '';
		}

		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.childState = 'Dashboard';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'dashboard';
		$scope.subheader.refresh = function(){
			$scope.report = {};
			Preloader.preload();
			$scope.init(true);
		}

		$scope.subheader.download = function(){
			$mdDialog.show({
		    	controller: 'downloadReportDialogController',
		      	templateUrl: '/app/components/team-leader/templates/dialogs/download-report-dialog.template.html',
		      	parent: angular.element(document.body),
		    });
		}

		$scope.searchFilter = function(){
			if($scope.form.filterSearchForm.$invalid){
				angular.forEach($scope.form.filterSearchForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else{
				Preloader.preload();
				$scope.init(true, $scope.rightSidenav);
			}
		}

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

		$scope.init = function(refresh, query){
			/**
			 *
			 * Object for charts
			*/
			$scope.charts = {};
			$scope.charts.productivity = {};
			$scope.charts.productivity.data = [];
			$scope.charts.productivity.series = ['Productivity'];
			$scope.charts.productivity.labels = [];

			$scope.charts.quality = {};
			$scope.charts.quality.data = [];
			$scope.charts.quality.series = ['Productivity'];
			$scope.charts.quality.labels = [];

			Report.departmentMonthly(query)
				.success(function(data){
					if(query){
						$scope.haveResults = data ? true: false;
						$scope.report.results = data;
						$scope.report.showCurrent = false;
					}
					else{
						$scope.haveCurrent = data ? true: false;
						$scope.report.current = data;
						$scope.report.showCurrent = true;
						angular.forEach(data, function(project, projectKey){
							project.chartType = 'bar';
							$scope.charts.productivity.data.push([]);
							$scope.charts.productivity.labels.push([]);
							$scope.charts.productivity.data[projectKey].push([]);
							
							$scope.charts.quality.data.push([]);
							$scope.charts.quality.labels.push([]);
							$scope.charts.quality.data[projectKey].push([]);

							
							angular.forEach(project.members, function(member, memberKey){
								$scope.charts.productivity.labels[projectKey].push(member.full_name);
								$scope.charts.quality.labels[projectKey].push(member.full_name);
								angular.forEach(member.performances, function(performance){
									$scope.charts.productivity.data[projectKey][0].push(performance.result.productivity);
									$scope.charts.quality.data[projectKey][0].push(performance.result.quality);
								});
							});
						});
						// console.log($scope.charts);
					}

					if(refresh)
					{
						Preloader.stop();
					}
				})
				.error(function(){
					Preloader.error();
				});
		}

		$scope.view = function(data){
			Preloader.set(data);
			$mdDialog.show({
		    	controller: 'performanceMonthlyViewDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/performance-monthly-view.dialog.template.html',
		      	parent: angular.element(document.body),
		      	clickOutsideToClose:true,
		    });

		}

		$scope.init();


	}]);
teamLeaderModule
	.controller('membersContentContainerController', ['$scope', '$mdDialog', 'Preloader', 'Member', 'User', function($scope, $mdDialog, Preloader, Member, User){
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.childState = 'Members';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'members';

		/* Refreshes the list */
		$scope.subheader.refresh = function(){
			// start preloader
			Preloader.preload();
			// clear member
			$scope.member.all = {};
			$scope.member.page = 2;
			Member.teamLeader($scope.toolbar.team_leader_id)
				.success(function(data){
					$scope.member.all = data;
					$scope.member.all.show = true;
					Preloader.stop();
				})
				.error(function(){
					Preloader.stop();
				});
		};
		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-plus';
		$scope.fab.label = 'Member';

		$scope.fab.action = function(){
			$mdDialog.show({
	    		controller: 'addMemberDialogController',
		      	templateUrl: '/app/components/team-leader/templates/dialogs/add-member.dialog.template.html',
		      	parent: angular.element(document.body),
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    })
		};
		/**
		 * Object for member
		 *
		*/
		$scope.user = Preloader.getUser();
		$scope.member = {};
		if(!$scope.user){
			// console.log('new')
			User.index()
				.success(function(data){
					$scope.toolbar.team_leader_id = data.id
					$scope.user = data;
					if(data.role=='team-leader')
					{
						Member.teamLeader(data.id)
							.success(function(data){
								$scope.member.all = data;
								$scope.member.all.show = true;
								$scope.option = true;
							});
					}
					else{
						Member.department(data.department_id)
							.success(function(data){
								$scope.member.all = data;
								$scope.member.all.show = true;
								$scope.option = false;
							});
					}
					$scope.fab.show = $scope.user.role == 'team-leader' ? true : false;
				});
		}
		else{
			// console.log('old');
			$scope.toolbar.team_leader_id = $scope.user.id
			$scope.fab.show = $scope.user.role == 'team-leader' ? true : false;
			if($scope.user.role=='team-leader')
			{
				Member.teamLeader($scope.user.id)
					.success(function(data){
						$scope.member.all = data;
						$scope.member.all.show = true;
						$scope.option = true;
					});
			}
			else{
				Member.department($scope.user.department_id)
					.success(function(data){
						$scope.member.all = data;
						$scope.member.all.show = true;
						$scope.option = false;
					});
			}
		}

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
		
		
		$scope.searchUserInput = function(){
			$scope.member.all.show = false;
			Preloader.preload()
			Member.search($scope.toolbar)
				.success(function(data){
					$scope.member.results = data;
					Preloader.stop();
				})
				.error(function(data){
					Preloader.error();
				});
		};

		$scope.editMember = function(id){
			Preloader.set(id);
			$mdDialog.show({
	    		controller: 'editMemberDialogController',
		      	templateUrl: '/app/components/team-leader/templates/dialogs/edit-member.dialog.template.html',
		      	parent: angular.element(document.body),
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    })
		}

		$scope.deleteMember = function(id){
			var confirm = $mdDialog.confirm()
		        .title('Delete Member')
		        .content('This member will not be included to your report anymore.')
		        .ariaLabel('Delete Member')
		        .ok('Delete')
		        .cancel('Cancel');
		    $mdDialog.show(confirm).then(function() {
		      Member.delete(id)
				.success(function(){
					$scope.subheader.refresh();
				});
		    }, function() {
		      return;
		    });			
		};
	}]);
teamLeaderModule
	.controller('notificationToastController', ['$scope', '$state', 'Preloader', function($scope, $state, Preloader){
		$scope.notification = Preloader.getNotification();

		$scope.viewNotification = function(){
			$state.go($scope.notification.state);
		};
	}]);
teamLeaderModule
	.controller('reportContentContainerController', ['$scope', '$state', '$mdDialog', '$mdToast', 'Preloader', 'Member', 'Project', 'Position', 'Performance', 'User', 'Programme', function($scope, $state, $mdDialog, $mdToast, Preloader, Member, Project, Position, Performance, User, Programme){		
		var user = Preloader.getUser();
		var departmentID = null;
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

		if(!user){
			User.index()
				.success(function(data){
					$scope.user = data;
					departmentID = data.department_id;
					Member.updateTenure(data.id)
						.success(function(){					
							Member.teamLeader(data.id)
								.success(function(data){
									$scope.members = data;
								});
						})
					Project.department(departmentID)
						.success(function(data){
							$scope.projects = data;
						})
				});
		}
		else{		
			departmentID = user.department_id;
			Member.teamLeader(user.id)
				.success(function(data){
					$scope.members = data;
				});
			Project.department(user.department_id)
				.success(function(data){
					$scope.projects = data;
				})
		}

		$scope.showPositions = function(id){
			Position.project(id)
				.success(function(data){
					$scope.positions = data;
				});
		};

		Programme.index()
			.success(function(data){
				$scope.work_hours = data;
			})

		// $scope.hours = [
		// 	{'value': 7.5},
		// 	{'value': 8.3},
		// 	{'value': 9.1},
		// ];
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
						item.department_id = departmentID;
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

		$scope.checkLimit = function(idx){
			// gets the number of days worked in a day then multiply it to the daily work hours to get weekly limit
			$scope.details.weekly_hours = ((new Date($scope.details.date_end) - new Date($scope.details.date_start)) / (1000*60*60*24) + 1) * $scope.details.daily_work_hours;
			Performance.checkLimit($scope.members[idx].id, $scope.details)
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
				$scope.checkLimit(key);
			});
		}
	}]);
teamLeaderModule
	.controller('addMemberDialogController', ['$scope', '$mdDialog', 'Preloader', 'User', 'Member', function($scope, $mdDialog, Preloader, User, Member){
		var user = Preloader.getUser();
		var busy = false;
		if(!user){
			User.index()
				.success(function(data){
					user = data;
				});
		};

		$scope.cancel = function(){
			$mdDialog.cancel();
		};

		$scope.member = {};
		$scope.member.team_leader_id = user.id;

		$scope.submit = function(){
			$scope.showErrors = true;
			if($scope.addMemberForm.$invalid){
				angular.forEach($scope.addMemberForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else{
				/* Starts Preloader */
				Preloader.preload();
				/**
				 * Stores Single Record
				*/
				console.log(busy);
				if(!busy){
					busy = true;
					Member.store($scope.member)
						.then(function(){
							// Stops Preloader 
							Preloader.stop();
							busy = false;
						}, function(){
							Preloader.error();
							busy = false;
						});
				}
			}
		}
	}]);
teamLeaderModule
	.controller('approvalsDialogController', ['$scope', '$mdDialog', 'Approval', 'PerformanceApproval', 'Preloader', function($scope, $mdDialog, Approval, PerformanceApproval, Preloader){
		var approvalID = Preloader.get();
		$scope.user = Preloader.getUser();

		Approval.details(approvalID)
			.success(function(data){
				$scope.details = data;
			});
			
		$scope.markAll = function(){
			if($scope.checkAll)
			{
				$scope.checkAll = true;
			}
			else{
				$scope.checkAll = false;
			}
			angular.forEach($scope.details.request, function(item, key){
				item.include = !$scope.checkAll;
			});
		}
		
		$scope.cancel = function(){
			$mdDialog.cancel();
		}
		$scope.cancelRequest = function(){
			Preloader.preload();
			Approval.delete(approvalID)
				.success(function(){
					// Stops Preloader 
					Preloader.stop();
				})
				.error(function(){
					Preloader.error();
				});
		}
	}]);
teamLeaderModule
	.controller('approvedApprovalsDetailsDialogController', ['$scope', '$mdDialog', 'Approval', 'PerformanceApproval', 'Preloader', function($scope, $mdDialog, Approval, PerformanceApproval, Preloader){
		var performanceApprovalID = Preloader.get();

		PerformanceApproval.approvedDetails(performanceApprovalID)
			.success(function(data){
				$scope.details = data;
			});
		
		$scope.cancel = function(){
			$mdDialog.cancel();
		}
	}]);
teamLeaderModule
	.controller('declinedApprovalsDetailsDialogController', ['$scope', '$mdDialog', 'Approval', 'PerformanceApproval', 'Preloader', function($scope, $mdDialog, Approval, PerformanceApproval, Preloader){
		var performanceApprovalID = Preloader.get();

		PerformanceApproval.declinedDetails(performanceApprovalID)
			.success(function(data){
				$scope.details = data;
			});
		
		$scope.cancel = function(){
			$mdDialog.cancel();
		}
	}]);
teamLeaderModule
	.controller('downloadReportDialogController', ['$scope', '$mdDialog', '$filter', 'Preloader', 'Report', 'Performance', 'Programme', function($scope, $mdDialog, $filter, Preloader, Report, Performance, Programme){
		$scope.details = {};
		$scope.details.type = 'Weekly';

		var user = Preloader.getUser();

		if(!user)
		{
			User.index()
				.success(function(data){
					user = data;
				})
				.error(function(){
					Preloader.error();
				});
		}

		Programme.index()
			.success(function(data){
				$scope.work_hours = data;
			})

		// $scope.hours = [7.5, 8.3, 9.1];

		$scope.months = [
			{'value': '01', 'month': 'January'},
			{'value': '02', 'month': 'February'},
			{'value': '03', 'month': 'March'},
			{'value': '04', 'month': 'April'},
			{'value': '05', 'month': 'May'},
			{'value': '06', 'month': 'June'},
			{'value': '07', 'month': 'July'},
			{'value': '08', 'month': 'August'},
			{'value': '09', 'month': 'September'},
			{'value': '10', 'month': 'October'},
			{'value': '11', 'month': 'November'},
			{'value': '12', 'month': 'December'},
		];

		$scope.months_array = [
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

		$scope.details.date_start_month = $scope.months_array[new Date().getMonth()];
		$scope.details.date_start_year = $scope.years[0];
		
		$scope.getMondays = function(){
			$scope.details.date_end = null;
			$scope.details.date_start = null;
			$scope.details.weekend = [];
			Performance.getMondays($scope.details)
				.success(function(data){
					$scope.mondays = data;
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

		$scope.cancel = function(){
			$mdDialog.cancel();
		};

		$scope.submit = function(){
			if($scope.downloadReportForm.$invalid){
				$scope.showErrors = true;
				angular.forEach($scope.downloadReportForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else{
				if($scope.details.type=='Weekly')
				{
					var win = window.open('/report-download-weekly-department/' + user.department_id + '/date_start/' + $filter('date')($scope.details.date_start, 'yyyy-MM-dd') + '/to/' + $filter('date')($scope.details.date_end, 'yyyy-MM-dd') + '/daily-work-hours/' + $scope.details.daily_work_hours , '_blank');
					win.focus();
				}
				else if($scope.details.type=='Monthly'){
					var win = window.open('/report-download-monthly-department/' + user.department_id + '/month/' + $scope.details.month + '/year/' + $scope.details.year + '/daily-work-hours/' + $scope.details.daily_work_hours, '_blank');
					win.focus();	
				}

				$mdDialog.hide();
			}
		}
	}]);
teamLeaderModule
	.controller('editMemberDialogController', ['$scope', '$mdDialog', 'Preloader', 'Member', function($scope, $mdDialog, Preloader, Member){
		var member_id = Preloader.get();
		var busy = false;

		$scope.cancel = function(){
			$mdDialog.cancel();
		};

		Member.show(member_id)
			.success(function(data){
				$scope.member = data;
			});

		$scope.submit = function(){
			$scope.showErrors = true;
			if($scope.editMemberForm.$invalid){
				angular.forEach($scope.editMemberForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else{
				/* Starts Preloader */
				Preloader.preload();
				/**
				 * Stores Single Record
				*/
				if(!busy){
					busy = true;
					Member.update(member_id, $scope.member)
						.then(function(){
							// Stops Preloader 
							Preloader.stop();
							busy = false; 
						}, function(){
							Preloader.error();
							busy = false; 
						});
				}
			}
		}
	}]);
teamLeaderModule
	.controller('performanceMonthlyViewDialogController', ['$scope', '$mdDialog', 'Performance', 'Preloader', function($scope, $mdDialog, Performance, Preloader){		
		$scope.member = Preloader.get();

		Performance.monthly($scope.member.performances[0])
			.success(function(data){
				$scope.performances = data;
			})
			.error(function(){
				Preloader.error();
			});

		$scope.cancel = function(){
			$mdDialog.cancel();
		}
	}]);
//# sourceMappingURL=team-leader.js.map
