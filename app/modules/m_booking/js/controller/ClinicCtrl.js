app.controller('clinicCtrl',['$scope','$rootScope','dialog','ClinicService','$state','StorageConfig','$stateParams',function($scope,$rootScope,dialog,ClinicService,$state,StorageConfig,$stateParams){
	window.headerConfig={
		enableBack: true,
		title: '健康诊所',
		enableRefresh: false
	};

	$rootScope.$broadcast('setHeaderConfig', window.headerConfig);

	$scope.clinic=StorageConfig.BOOKING_STORAGE.getItem('clinicInfo')?StorageConfig.BOOKING_STORAGE.getItem('clinicInfo'):requestClinic();
	
	function requestClinic(){
		var spinner=dialog.showSpinner();
		var clinicId=$stateParams.id;
		var cityId=$stateParams.cityId;
		var urlOptions={
			city_id: cityId
		}
		ClinicService.getClinicByCity(urlOptions).then(function(res){
			dialog.closeSpinner(spinner.id);
			angular.forEach(res.results.clinics,function(clinic,index,array){
				if(clinicId==clinic.clinicId){
					$scope.clinic=clinic;
				}
			});
		},function(res){
			dialog.closeSpinner(spinner.id);
			dialog.alert(res.errorMsg);
		});
	}

	$scope.selectId='';
	$scope.zhuanjia=1;
	$scope.clickService=function(obj){
		$scope.serviceName=obj.serviceName;
		$scope.selectId=obj.serviceId;
		$scope.zhuanjia=obj.zhuanjia;
	}
	$scope.goBooking=function(_type){
		StorageConfig.SERVICE_STORAGE.putItem('serviceName',$scope.serviceName);
		$state.go('layout.booking-booking',{
			type: _type,
			clinicId: $scope.clinic.clinicId,
			serviceId: $scope.selectId
		});
	}
	$scope.goSelectDoctor=function(_type){
		StorageConfig.SERVICE_STORAGE.putItem('serviceName',$scope.serviceName);
		$state.go('layout.booking-selectDoctor',{
			type: _type,
			clinicId: $scope.clinic.clinicId,
			serviceId: $scope.selectId
		})
	}
}]);