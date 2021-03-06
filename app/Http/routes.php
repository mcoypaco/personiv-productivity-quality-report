<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

// Route::get('/', function () {
// 	if (Auth::check()) {
// 		return redirect('/home');
//     }
//     return view('auth.login');
// });

Route::get('/', 'HomeController@home');

// Authentication routes...
Route::get('auth/login', 'Auth\AuthController@getLogin');
Route::post('auth/login', 'Auth\AuthController@postLogin');
Route::get('auth/logout', 'Auth\AuthController@getLogout');

// Registration routes...
// Route::get('auth/register', 'Auth\AuthController@getRegister');
// Route::post('auth/register', 'Auth\AuthController@postRegister');

// Shell Page
Route::get('home', 'HomeController@role');
// Route resource
Route::group(['middleware' => 'auth'], function () {
	Route::resource('department', 'DepartmentController');
	Route::resource('programme', 'ProgrammeController');
	Route::resource('member', 'MemberController');
	Route::resource('notification', 'NotificationController');
	Route::resource('position', 'PositionController');
	Route::resource('project', 'ProjectController');
	Route::resource('performance', 'PerformanceController');
	Route::resource('result', 'ResultController');
	Route::resource('target', 'TargetController');
	Route::resource('user', 'UserController');
	Route::resource('report', 'ReportController');
	Route::resource('approval', 'ApprovalController');
	Route::resource('performance-approval', 'PerformanceApprovalController');
	Route::resource('performance-history', 'PerformanceHistoryController');
	Route::resource('walk-through', 'WalkThroughController');
	Route::resource('experience', 'ExperienceController');
	Route::resource('activity', 'ActivityController');

	// Route resource paginate
	Route::get('member-paginate/{teamLeaderID}', 'MemberController@paginateTeamLeader');
	Route::get('notification-paginate', 'NotificationController@paginate');
	Route::get('report-paginate', 'ReportController@paginate');
	Route::get('report-paginate-details', 'ReportController@paginateDetails');
	// Route::get('report-paginate', 'ReportController@paginateDepartment');
	Route::get('report-paginate-details/{departmentID}', 'ReportController@paginateDepartmentDetails');
	Route::post('approval-pending', 'ApprovalController@pending');
	Route::post('approval-pending-user', 'ApprovalController@pendingUser');
	Route::post('performance-approval-approved', 'PerformanceApprovalController@approved');
	Route::post('performance-approval-declined', 'PerformanceApprovalController@declined');
	Route::post('performance-approval-approved-user', 'PerformanceApprovalController@approvedUser');
	Route::post('performance-approval-declined-user', 'PerformanceApprovalController@declinedUser');

	// Route resource search
	Route::post('department-search', 'DepartmentController@search');
	Route::post('programme-search', 'ProgrammeController@search');
	Route::post('project-search', 'ProjectController@search');
	Route::post('position-search', 'PositionController@search');
	Route::post('member-search', 'MemberController@search');
	Route::post('report-search', 'ReportController@search');
	Route::post('report-search-department/{departmentID}', 'ReportController@searchDepartment');
	// Route::post('result-search', 'ResultController@search');
	// Route::post('target-search', 'TargetController@search');
	Route::post('user-check-email', 'UserController@checkEmail');
	Route::post('department-check-duplicate', 'DepartmentController@checkDuplicate');
	Route::post('project-check-duplicate', 'ProjectController@checkDuplicate');
	Route::post('position-check-duplicate', 'PositionController@checkDuplicate');

	// Other Routes
	Route::get('experience-relation/{projectID}/member/{memberID}', 'ExperienceController@relation');
	Route::get('position-project/{projectID}', 'PositionController@project');
	Route::get('user-team-leader', 'UserController@teamLeader');
	Route::get('member-team-leader/{teamLeaderID}', 'MemberController@teamLeader');
	Route::get('target-position/{positionID}', 'TargetController@position');
	Route::get('target-department/{departmentID}', 'TargetController@department');
	Route::get('project-department/{departmentID}', 'ProjectController@department');
	Route::get('notification-unseen', 'NotificationController@unseen');
	Route::put('notification-seen/{notificationID}', 'NotificationController@seen');
	Route::get('target-productivity/{positionID}', 'TargetController@productivity');
	Route::get('target-quality/{positionID}', 'TargetController@quality');
	Route::put('member-update-tenure', 'MemberController@updateTenure');
	Route::post('performance-check-limit/{memberID}', 'PerformanceController@checkLimit');
	Route::post('performance-check-limit-edit/{memberID}', 'PerformanceController@checkLimitEdit');
	Route::get('performance-report/{reportID}', 'PerformanceController@report');
	Route::get('report-download/{reportID}', 'ReportController@download');
	Route::get('report-download-summary/{date_start}/to/{date_end}/daily-work-hours/{daily_work_hours}', 'ReportController@downloadSummary');
	Route::get('report-download-weekly-department/{departmentID}/date_start/{date_start}/to/{date_end}/daily-work-hours/{daily_work_hours}', 'ReportController@downloadWeeklyDepartment');
	Route::get('report-download-monthly-summary/{month}/year/{year}/daily-work-hours/{daily_work_hours}', 'ReportController@downloadMonthlySummary');
	Route::get('report-download-monthly-department/{departmentID}/month/{month}/year/{year}/daily-work-hours/{daily_work_hours}', 'ReportController@downloadMonthlyDepartment');
	Route::post('report-department-monthly-position', 'ReportController@departmentMonthlyPosition');
	Route::post('performance-weekly', 'PerformanceController@weekly');
	Route::get('performance-evaluation/{date_start}/date_end/{date_end}/daily-work-hours/{daily_work_hours}/department/{departmentID}/project/{projectID}/position/{positionID}/member/{memberID}/download/{download}', 'PerformanceController@evaluation');
	Route::get('performance-evaluation-multiple/{date_start}/date_end/{date_end}/daily-work-hours/{daily_work_hours}/department/{departmentID}/position/{position}/member/{memberID}/download/{download}', 'PerformanceController@evaluationMultiple');
	Route::get('user-department/{departmentID}', 'UserController@department');

	Route::get('report-monthly', 'ReportController@monthly');
	Route::post('report-search-monthly', 'ReportController@searchMonthly');
	Route::get('target-project/{reportID}', 'TargetController@project');
	Route::get('performance-top-performers/{reportID}', 'PerformanceController@topPerformers');
	Route::post('performance-monthly', 'PerformanceController@monthly');
	Route::get('report-team-performance/{month}/year/{year}/daily-work-hours/{daily_work_hours}/download/{download}', 'ReportController@teamPerformance');
	Route::post('approval-performance-edit/{reportID}', 'ApprovalController@performanceEdit');
	Route::post('performance-get-mondays', 'PerformanceController@getMondays');
	Route::post('performance-get-weekends', 'PerformanceController@getWeekends');
	Route::get('approval-details/{approvalID}', 'ApprovalController@details');
	Route::get('performance-approval-approval', 'PerformanceApprovalController@approval');
	Route::post('approval-approve', 'ApprovalController@approve');
	Route::post('approval-decline', 'ApprovalController@decline');
	Route::get('performance-approval-declined-details/{performanceApprovalID}', 'PerformanceApprovalController@declinedDetails');
	Route::get('performance-approval-approved-details/{performanceApprovalID}', 'PerformanceApprovalController@approvedDetails');
	Route::post('user-check-password', 'UserController@checkPassword');
	Route::post('user-change-password', 'UserController@changePassword');
	Route::post('approval-report-delete/{id}', 'ApprovalController@reportDelete');
	Route::post('approval-approve-delete', 'ApprovalController@approveDelete');
	Route::post('approval-decline-delete', 'ApprovalController@declineDelete');
	Route::post('user-search', 'UserController@search');
	Route::get('member-department/{departmentID}', 'MemberController@department');
	Route::get('report-test', 'ReportController@test');
	Route::post('report-department-monthly', 'ReportController@departmentMonthly');
	Route::get('position-department/{departmentID}', 'PositionController@department');
	Route::post('member-check-duplicate', 'MemberController@checkDuplicate');
	Route::get('experience-members/{projectID}', 'ExperienceController@members');
	Route::get('position-unique/{departmentID}', 'PositionController@unique');
	Route::post('activity-report-submitted', 'ActivityController@reportSubmitted');
	Route::post('activity-report-updated', 'ActivityController@reportUpdated');
	Route::post('activity-report-deleted', 'ActivityController@reportDeleted');
	Route::post('performance-check-limit-all', 'PerformanceController@checkLimitAll');
	Route::post('performance-check-limit-edit-all', 'PerformanceController@checkLimitEditAll');
	Route::get('user-reset-password/{id}', 'UserController@resetPassword');
});