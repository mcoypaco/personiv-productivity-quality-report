var sharedModule=angular.module("sharedModule",["ui.router","ngMaterial","ngMessages","infinite-scroll","chart.js","mgcrea.ngStrap","angular-tour","angularMoment"]);sharedModule.config(["$urlRouterProvider","$stateProvider","$mdThemingProvider",function(e,t,n){n.theme("default").primaryPalette("blue").accentPalette("purple"),n.theme("dark","default").primaryPalette("deep-purple").accentPalette("pink").dark(),e.otherwise("/page-not-found").when("","/"),t.state("page-not-found",{url:"/page-not-found",templateUrl:"/app/shared/views/page-not-found.view.html"})}]),sharedModule.controller("changePasswordDialogController",["$scope","$mdDialog","User","Preloader",function(e,t,n,r){e.password={},e.cancel=function(){t.cancel()},e.checkPassword=function(){n.checkPassword(e.password).success(function(t){e.match=t,e.show=!0})},e.submit=function(){if(e.showErrors=!0,e.changePasswordForm.$invalid)angular.forEach(e.changePasswordForm.$error,function(e){angular.forEach(e,function(e){e.$setTouched()})});else{if(e.password.old==e.password["new"]||e.password["new"]!=e.password.confirm)return;r.preload(),n.changePassword(e.password).success(function(){r.stop()}).error(function(){r.error()})}}}]),sharedModule.controller("homePageController",["$scope","Department",function(e,t){e.show=function(){angular.element($(".main-view").removeClass("hidden-custom"))},t.index().success(function(t){e.departments=t})}]),sharedModule.controller("mainViewController",["$scope","$state","$mdSidenav","$mdToast","$mdDialog","User","Preloader","Notification","WalkThrough",function(e,t,n,r,o,u,a,i,c){e.changePassword=function(){o.show({controller:"changePasswordDialogController",templateUrl:"/app/shared/templates/dialogs/change-password-dialog.template.html",parent:angular.element(document.body)}).then(function(){r.show(r.simple().content("Password changed.").position("bottom right").hideDelay(3e3))})},u.index().success(function(t){e.user=t,a.setUser(t);var n=new Pusher("95c0378bb7677e168674",{encrypted:!0});if("admin"==e.user.role){var o=n.subscribe("notifications");o.bind("App\\Events\\ReportSubmittedBroadCast",function(t){a.setNotification(t.data),r.show({controller:"notificationToastController",templateUrl:"/app/components/admin/templates/toasts/notification.toast.html",parent:angular.element($("body")),hideDelay:6e3,position:"bottom right"}),i.unseen().success(function(t){e.notifications=t})})}}),i.unseen().success(function(t){e.notifications=t}),e.viewNotification=function(n){i.seen(e.notifications[n].id).success(function(){"main.weekly-report"==e.notifications[n].state?t.go("main.weekly-report",{departmentID:e.notifications[n].department_id}):t.go("main.approvals"),e.notifications.splice(n,1)}).error(function(){a.error()})},e.lock=!0,e.sidenavLock=function(){e.lock=!e.lock},e.toggleSidenav=function(e){n(e).toggle()}}]),sharedModule.controller("otherPerformanceDialogController",["$scope","$mdDialog","Preloader","Performance",function(e,t,n,r){e.performance=n.get(),e.member=e.performance.member,e.member.total_hours_worked=0,e.cancel=function(){t.cancel()},r.weekly(e.performance).success(function(t){t.total_hours_worked=0,angular.forEach(t.positions,function(e){e.total_hours_worked&&(t.total_hours_worked+=e.total_hours_worked),angular.forEach(e.performances,function(e){e.date_start=new Date(e.date_start),e.date_end=new Date(e.date_end)})}),e.member=t,e.positions=t.positions})}]),sharedModule.controller("performanceEvaluationDialogController",["$scope","$mdDialog","Preloader",function(e,t,n){e.evaluation=n.get(),e.cancel=function(){t.cancel()}}]),sharedModule.controller("performanceHistoryDialogController",["$scope","$filter","$mdDialog","Preloader","PerformanceHistory",function(e,t,n,r,o){var u=r.get();e.cancel=function(){n.cancel()},o.show(u).success(function(n){n[0].activity.created_at=new Date(n[0].activity.created_at),n[0].first_letter=n[0].project.name.charAt(0),n[0].date_start=new Date(n[0].date_start),n[0].date_end=new Date(n[0].date_end),angular.forEach(n,function(e){angular.forEach(e.performances,function(e){var n=t("filter")(e.member.experiences,{project_id:e.project_id});e.experience=n[0].experience,e.date_start=new Date(e.date_start),e.date_end=new Date(e.date_end)})}),e.history=n})}]),sharedModule.controller("reportDialogController",["$scope","$filter","$mdDialog","Preloader","Report",function(e,t,n,r,o){var u=r.get();e.cancel=function(){n.cancel()},o.show(u).success(function(n){n.date_start=new Date(n.date_start),n.date_end=new Date(n.date_end),angular.forEach(n.performances,function(e){var n=t("filter")(e.member.experiences,{project_id:e.project_id});e.experience=n[0].experience,e.date_start=new Date(e.date_start),e.date_end=new Date(e.date_end)}),e.report=n})}]),sharedModule.factory("Activity",["$http",function(e){var t="/activity";return{index:function(){return e.get(t)},show:function(n){return e.get(t+"/"+n)},store:function(n){return e.post(t,n)},update:function(n,r){return e.put(t+"/"+n,r)},"delete":function(n){return e["delete"](t+"/"+n)},reportSubmitted:function(n){return e.post(t+"-report-submitted",n)},reportUpdated:function(n){return e.post(t+"-report-updated",n)},reportDeleted:function(n){return e.post(t+"-report-deleted",n)}}}]),sharedModule.factory("Approval",["$http",function(e){var t="approval";return{index:function(){return e.get(t)},show:function(n){return e.get(t+"/"+n)},store:function(n){return e.post(t,n)},update:function(n,r){return e.put(t+"/"+n,r)},"delete":function(n){return e["delete"](t+"/"+n)},performanceEdit:function(n,r){return e.post(t+"-performance-edit/"+n,r)},pending:function(n){return e.post(t+"-pending",n)},pendingUser:function(n){return e.post(t+"-pending-user",n)},details:function(n){return e.get(t+"-details/"+n)},approve:function(n){return e.post(t+"-approve",n)},decline:function(n){return e.post(t+"-decline",n)},reportDelete:function(n){return e.post(t+"-report-delete/"+n)},approveDelete:function(n){return e.post(t+"-approve-delete",n)},declineDelete:function(n){return e.post(t+"-decline-delete",n)}}}]),sharedModule.factory("Department",["$http",function(e){var t="/department";return{search:function(n){return e.post(t+"-search",n)},index:function(){return e.get(t)},show:function(n){return e.get(t+"/"+n)},store:function(n){return e.post(t,n)},update:function(n,r){return e.put(t+"/"+n,r)},"delete":function(n){return e["delete"](t+"/"+n)},checkDuplicate:function(n){return e.post(t+"-check-duplicate",n)}}}]),sharedModule.factory("Experience",["$http",function(e){var t="/experience";return{index:function(){return e.get(t)},show:function(n){return e.get(t+"/"+n)},store:function(n){return e.post(t,n)},update:function(n,r){return e.put(t+"/"+n,r)},"delete":function(n){return e["delete"](t+"/"+n)},members:function(n){return e.get(t+"-members/"+n)},relation:function(n,r){return e.get(t+"-relation/"+n+"/member/"+r)}}}]),sharedModule.factory("Member",["$http",function(e){var t="member";return{index:function(){return e.get(t)},show:function(n){return e.get(t+"/"+n)},store:function(n){return e.post(t,n)},update:function(n,r){return e.put(t+"/"+n,r)},"delete":function(n){return e["delete"](t+"/"+n)},teamLeader:function(n){return e.get(t+"-team-leader/"+n)},search:function(n){return e.post(t+"-search",n)},updateTenure:function(){return e.put(t+"-update-tenure")},department:function(n){return e.get(t+"-department/"+n)},checkDuplicate:function(n){return e.post(t+"-check-duplicate",n)},project:function(n){return e.get(t+"-project/"+n)}}}]),sharedModule.factory("Notification",["$http",function(e){var t="notification";return{index:function(){return e.get(t)},show:function(n){return e.get(t+"/"+n)},unseen:function(){return e.get(t+"-unseen")},seen:function(n){return e.put(t+"-seen/"+n)}}}]),sharedModule.factory("PerformanceApproval",["$http",function(e){var t="performance-approval";return{index:function(){return e.get(t)},show:function(n){return e.get(t+"/"+n)},store:function(n){return e.post(t,n)},update:function(n,r){return e.put(t+"/"+n,r)},"delete":function(n){return e["delete"](t+"/"+n)},approved:function(n){return e.post(t+"-approved",n)},declined:function(n){return e.post(t+"-declined",n)},approvedUser:function(n){return e.post(t+"-approved-user",n)},declinedUser:function(n,r){return e.post(t+"-declined-user",r)},declinedDetails:function(n){return e.get(t+"-declined-details/"+n)},approvedDetails:function(n){return e.get(t+"-approved-details/"+n)}}}]),sharedModule.factory("PerformanceHistory",["$http",function(e){var t="/performance-history";return{index:function(){return e.get(t)},show:function(n){return e.get(t+"/"+n)},store:function(n){return e.post(t,n)},update:function(n,r){return e.put(t+"/"+n,r)},"delete":function(n){return e["delete"](t+"/"+n)}}}]),sharedModule.factory("Performance",["$http",function(e){var t="performance";return{index:function(){return e.get(t)},show:function(n){return e.get(t+"/"+n)},store:function(n){return e.post(t,n)},update:function(n,r){return e.put(t+"/"+n,r)},"delete":function(n){return e["delete"](t+"/"+n)},checkLimit:function(n,r){return e.post(t+"-check-limit/"+n,r)},report:function(n){return e.get(t+"-report/"+n)},checkLimitEdit:function(n,r){return e.post(t+"-check-limit-edit/"+n,r)},topPerformers:function(n){return e.get(t+"-top-performers/"+n)},monthly:function(n){return e.post(t+"-monthly",n)},getMondays:function(n){return e.post(t+"-get-mondays",n)},getWeekends:function(n){return e.post(t+"-get-weekends",n)},weekly:function(n){return e.post(t+"-weekly",n)},evaluation:function(n,r,o,u,a,i,c){return e.get(t+"-evaluation/"+n+"/date_end/"+r+"/daily-work-hours/"+o+"/department/"+u+"/project/"+a+"/position/"+i+"/member/"+c+"/download/0")},evaluationMultiple:function(n,r,o,u,a,i){return e.get(t+"-evaluation-multiple/"+n+"/date_end/"+r+"/daily-work-hours/"+o+"/department/"+u+"/position/"+a+"/member/"+i+"/download/0")},checkLimitAll:function(n){return e.post(t+"-check-limit-all",n)},checkLimitEditAll:function(n){return e.post(t+"-check-limit-edit-all",n)}}}]),sharedModule.factory("Position",["$http",function(e){var t="position";return{index:function(){return e.get(t)},show:function(n){return e.get(t+"/"+n)},store:function(n){return e.post(t,n)},update:function(n,r){return e.put(t+"/"+n,r)},"delete":function(n){return e["delete"](t+"/"+n)},project:function(n){return e.get(t+"-project/"+n)},department:function(n){return e.get(t+"-department/"+n)},unique:function(n){return e.get(t+"-unique/"+n)},checkDuplicate:function(n){return e.post(t+"-check-duplicate",n)}}}]),sharedModule.factory("Programme",["$http",function(e){var t="/programme";return{index:function(){return e.get(t)},show:function(n){return e.get(t+"/"+n)},store:function(n){return e.post(t,n)},update:function(n,r){return e.put(t+"/"+n,r)},"delete":function(n){return e["delete"](t+"/"+n)}}}]),sharedModule.factory("Project",["$http",function(e){var t="project";return{index:function(){return e.get(t)},show:function(n){return e.get(t+"/"+n)},store:function(n){return e.post(t,n)},update:function(n,r){return e.put(t+"/"+n,r)},"delete":function(n){return e["delete"](t+"/"+n)},department:function(n){return e.get(t+"-department/"+n)},search:function(n){return e.post(t+"-search",n)},checkDuplicate:function(n){return e.post(t+"-check-duplicate",n)}}}]),sharedModule.factory("Report",["$http",function(e){var t="report";return{index:function(){return e.get(t)},show:function(n){return e.get(t+"/"+n)},store:function(n){return e.post(t,n)},update:function(n,r){return e.put(t+"/"+n,r)},paginate:function(n){return e.get(t+"-paginate?page="+n)},paginateDetails:function(n){return e.get(t+"-paginate-details?page="+n)},paginateDepartment:function(n,r){return e.get(t+"-paginate/"+n+"?page="+r)},paginateDepartmentDetails:function(n,r){return e.get(t+"-paginate-details/"+n+"?page="+r)},search:function(n){return e.post(t+"-search",n)},searchDepartment:function(n,r){return e.post(t+"-search-department/"+n,r)},"delete":function(n){return e["delete"](t+"/"+n)},monthly:function(){return e.get(t+"-monthly")},searchMonthly:function(n){return e.post(t+"-search-monthly",n)},departmentMonthly:function(n){return e.post(t+"-department-monthly",n)},departmentMonthlyPosition:function(n){return e.post(t+"-department-monthly-position",n)}}}]),sharedModule.factory("Result",["$http",function(e){var t="result";return{index:function(){return e.get(t)},show:function(n){return e.get(t+"/"+n)},store:function(n){return e.post(t,n)},update:function(n,r){return e.put(t+"/"+n,r)},"delete":function(n){return e["delete"](t+"/"+n)}}}]),sharedModule.factory("Target",["$http",function(e){var t="target";return{index:function(){return e.get(t)},show:function(n){return e.get(t+"/"+n)},store:function(n){return e.post(t,n)},update:function(n,r){return e.put(t+"/"+n,r)},"delete":function(n){return e["delete"](t+"/"+n)},position:function(n){return e.get(t+"-position/"+n)},department:function(n){return e.get(t+"-department/"+n)},productivity:function(n){return e.get(t+"-productivity/"+n)},quality:function(n){return e.get(t+"-quality/"+n)},project:function(n){return e.get(t+"-project/"+n)}}}]),sharedModule.factory("User",["$http",function(e){var t="/user";return{index:function(){return e.get(t)},show:function(n){return e.get(t+"/"+n)},store:function(n){return e.post(t,n)},update:function(n,r){return e.put(t+"/"+n,r)},"delete":function(n){return e["delete"](t+"/"+n)},teamLeader:function(){return e.get(t+"-team-leader")},checkPassword:function(n){return e.post(t+"-check-password",n)},changePassword:function(n){return e.post(t+"-change-password",n)},search:function(n){return e.post(t+"-search",n)},checkEmail:function(n){return e.post(t+"-check-email",n)},department:function(n){return e.get(t+"-department/"+n)},resetPassword:function(n){return e.get(t+"-reset-password/"+n)}}}]),sharedModule.factory("WalkThrough",["$http",function(e){var t="/walk-through";return{index:function(){return e.get(t)},show:function(n){return e.get(t+"/"+n)},store:function(n){return e.post(t,n)},update:function(n,r){return e.put(t+"/"+n,r)},"delete":function(n){return e["delete"](t+"/"+n)}}}]),sharedModule.service("Preloader",["$mdDialog",function(e){var t=null,n=null,r=null,o={};return{preload:function(){return e.show({templateUrl:"/app/shared/templates/preloader.html",parent:angular.element(document.body)})},stop:function(t){e.hide(t)},error:function(){return e.show(e.alert().parent(angular.element($("body"))).clickOutsideToClose(!0).title("Oops! Something went wrong!").content("An error occured. Please contact administrator for assistance.").ariaLabel("Error Message").ok("Got it!"))},set:function(e){t=e},get:function(){return t},setUser:function(e){n=e},getUser:function(){return n},setDepartment:function(e){r=e},getDepartment:function(){return r},setNotification:function(e){o=e},getNotification:function(){return o}}}]);