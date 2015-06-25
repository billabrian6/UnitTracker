'use strict';

/**
 * @ngdoc function
 * @name unitTrackerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the unitTrackerApp
 */
app.run(function (editableOptions) {
  editableOptions.theme = 'bs3';
});
 
angular.module('unitTrackerApp')
  .controller('MainCtrl', function (myService, $scope, $filter, $http, $window) {
    $scope.sortType = 'id';
    $scope.sortReverse = true;
    $scope.searchUnit = '';
    var unitObj = new Array();
    updateUnits();
    
   function updateUnits(){
     myService.async().then(function(){
      var data = myService.data();
      processData(data, unitObj);
    });
   } 
    
    $scope.conditionStatus = [
      {value: 0, text: 'NEW'},
      {value: 1, text: 'USED'}
    ];
    
    $scope.tradeStatus = [
      {value: 0, text: 'NO'},
      {value: 1, text: 'YES'}
    ];
    
    $scope.invoiceStatus = [
      {value: 0, text: 'NO'},
      {value: 1, text: 'YES'}
    ];
    
    $scope.makes = ['ATLAS', 'BAD BOY', 'BEST BILT', 'BIG TEX', 'BOBCAT', 'CASE', 'CAT', 'CEATTACH', 'DOOSAN', 'ESCO', 'FORD', 'GEITH', 'JD', 'KELLEY', 'KOBELCO',
                    'KUBOTA', 'LMW', 'MAHINDRA', 'NEW HOLLAND', 'PRIEFERT', 'RHINO', 'SCAG', 'TIGER', 'USA ATTACH'];
    
    $scope.glNums = ['A13101 - USED AG TRACTORS', 'A13201 - USED EQUIP', 'A13301 - USED CONST EQUIP', 'A13901 USED ATV/MTV/NTV'];
    
     // var data = [{"id":"1","date":"2015-06-21","condition":"0","make":"New Holland","model":"T5000","unit_num":"24194","consign_flag":"0","serial_num":"D987DFSF","description":"Tractor","gl_num":"A12401","trade":"0","invoice_posted":"1","notes":"Testing"},
      //            {"id":"2","date":"2015-06-22","condition":"1","make":"Mahindra","model":"M104","unit_num":"24500","consign_flag":"1","serial_num":"FDEFFSF","description":"Tractors","gl_num":"B12321","trade":"1","invoice_posted":"0","notes":"Test"}];

    //console.log(data);
    
    
    $scope.showTradeStatus = function(property){
      var selected = [];
      if(property.trade){
        selected = $filter('filter')($scope.tradeStatus, {value: property.trade});
      }
      return selected.length ? selected[0].text : 'NO';
    };
    
    $scope.showInvoiceStatus = function(property){
      var selected = [];
      if(property.invoice_posted){
        selected = $filter('filter')($scope.invoiceStatus, {value: property.invoice_posted});
      }
      return selected.length ? selected[0].text : 'NO';
    };
    
    $scope.showConditionStatus = function(property){
      var selected = [];
      if(property.unitCondition){
        selected = $filter('filter')($scope.conditionStatus, {value: property.unitCondition});
      }
      return selected.length ? selected[0].text : 'NEW';
    };
    
    
    function processData(data, unitObj) {
      angular.forEach(data, function(obj, index) {
          var stockNum;
          if (obj.consign_flag === '1') {
              stockNum = obj.unit_num += 'C';
          } else {
              stockNum = obj.unit_num;
          }
          unitObj[index] = {
              id: parseInt(obj.id),
              // dateAdded: new Date(obj.dateAdded),
              dateAdded: obj.dateAdded,
              unitCondition: obj.unitCondition,
              make: obj.make,
              model: obj.model,
              unit_num: stockNum,
              consign_flag: obj.consign_flag,
              serial_num: obj.serial_num,
              description: obj.description,
              gl_num: obj.gl_num,
              trade: obj.trade,
              invoice_posted: obj.invoice_posted,
              notes: obj.notes
          };
      }, unitObj);
  
      $scope.units = unitObj;
    }
    
    $scope.saveUnit = function(data, id) {
      var phpObj = data;
      phpObj['function'] = "updateQuery";
      //var unitNum = phpObj['unit_num'].toUpperCase() + "";
      var unitNum = phpObj['unit_num'] + "";
      var len = unitNum.length -1 ;
      
      if(unitNum.charAt(len) === 'C' || unitNum.charAt(len) === 'c'){
        phpObj['unit_num'] = unitNum.substring(0, unitNum.length - 1);
        phpObj['consign_flag'] = 1;
      }else{
        phpObj['consign_flag'] = 0;
      }
      
      $http({
        method: 'POST',
        //The path to php file must be added
        url: 'path_to_php',
        data: phpObj
        // data: {function : "updateQuery"}
      }).success(function(ret){
        console.log(ret);
      });
      
      //$scope.user not updated yet
      angular.extend(data, {id: id});
      // return $http.post('/saveUser', data);
    };
    
    $scope.checkName = function(data, id) {
    };
    
    $scope.addUnit = function(){
      
        $scope.inserted = {
        id: getNextID(),
        date: null,
        unitCondition: null, 
        make: null, 
        model: null, 
        unit_num: getNextUnitNum(), 
        serial_num: null, 
        description: null,
        gl_num: null,
        trade: null,
        invoice_posted: null,
        notes: null
      };
      $scope.units.push($scope.inserted);

    };
    
    $scope.copyUnit = function(id){
      angular.forEach($scope.units, function (k, v) {
        if(k.id == id){
          $scope.inserted = {
            id: getNextID(),
            date: k.dateAdded,
            unitCondition: k.unitCondition, 
            make: k.make, 
            model: k.model, 
            unit_num: getNextUnitNum(), 
            serial_num: null, 
            description: k.description,
            gl_num: k.gl_num,
            trade: k.trade,
            invoice_posted: k.invoice_posted,
            notes: k.notes
          };
          $scope.units.push($scope.inserted);
        } 
      });
      
    };
    
    function getNextID(){
      var id;
      angular.forEach($scope.units, function(k, v){
        id = parseInt(k.id) + 1;
      });
      return id;
    };
    
    function getNextUnitNum(){
      var unitNum;
      var strTemp;
      angular.forEach($scope.units, function(k, v){
        var str = k.unit_num + "";
        var len = str.length - 1;
        
        if(str.charAt(len) === 'C' || str.charAt(len) === 'c'){
          strTemp = k.unit_num;
          unitNum = strTemp.substring(0, strTemp.length - 1);
        }
        
        unitNum = parseInt(k.unit_num) + 1;
      });
      return unitNum;
    };
    
    
    $scope.removeUnit = function (event) {

      var confirmDelete = $window.confirm('Are you sure you want to delete this unit?');

      if (confirmDelete) {
        var index;
        var id = event.target.id;

        angular.forEach($scope.units, function (k, v) {
          if (k.id == id) {
            index = $scope.units.indexOf(k);
          }
        });

        $http({
          method: 'POST',
          //The path to php file must be added
          url: 'path_to_php',
          data: { function: "deleteFromDB", index: id }

        }).success(function (ret) {
          console.log(ret);
        });
        $scope.units.splice(index, 1);
      }


    };  
  });
  
