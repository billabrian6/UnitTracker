'use strict';

/**
 * @ngdoc function
 * @name unitTrackerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the unitTrackerApp
 * Adding a comment for new branch test
 */

angular.module('unitTrackerApp')
  .controller('MainCtrl', function (myService, $scope, $filter, $http, $window, $location, Data) {
  $scope.sortType = 'id';
  $scope.sortReverse = true;
  $scope.searchUnit = '';
  var unitObj = [];

  $scope.logout = function () {
    console.log('Testing');
      Data.get('logout').then(function (results) {
          Data.toast(results);
          $location.path('login');
      });
  }

  function updateUnits() {
    myService.async().then(function () {
      var data = myService.data();
      processData(data, unitObj);
    });
  }

  updateUnits();

  $scope.conditionStatus = [
    { value: 0, text: 'NEW' },
    { value: 1, text: 'USED' }
  ];

  $scope.tradeStatus = [
    { value: 0, text: 'NO' },
    { value: 1, text: 'YES' }
  ];

  $scope.invoiceStatus = [
    { value: 0, text: 'NO' },
    { value: 1, text: 'YES' }
  ];

  $scope.makes = ['ATLAS', 'BAD BOY', 'BEST BILT', 'BIG TEX', 'BOBCAT', 'CASE', 'CAT', 'CEATTACH', 'DOOSAN', 'ESCO', 'FORD', 'GEITH', 'JD', 'KELLEY', 'KOBELCO',
    'KUBOTA', 'LMW', 'MAHINDRA', 'NEW HOLLAND', 'PRIEFERT', 'RHINO', 'SCAG', 'TIGER', 'USA ATTACH'];

  $scope.glNums = ['A13101 - USED AG TRACTORS', 'A13201 - USED EQUIP', 'A13301 - USED CONST EQUIP', 'A13901 USED ATV/MTV/NTV'];

  $scope.showTradeStatus = function (property) {
    var selected = [];
    if (property.trade) {
      selected = $filter('filter')($scope.tradeStatus, { value: property.trade });
    }
    return selected.length ? selected[0].text : 'NO';
  };

  $scope.showInvoiceStatus = function (property) {
    var selected = [];
    if (property.invoice_posted) {
      selected = $filter('filter')($scope.invoiceStatus, { value: property.invoice_posted });
    }
    return selected.length ? selected[0].text : 'NO';
  };

  $scope.showConditionStatus = function (property) {
    var selected = [];
    if (property.unitCondition) {
      selected = $filter('filter')($scope.conditionStatus, { value: property.unitCondition });
    }
    return selected.length ? selected[0].text : 'NEW';
  };


  function processData(data, unitObj) {
    angular.forEach(data, function (obj, index) {
      var stockNum;
      if (obj.consign_flag === '1') {
        stockNum = obj.unit_num += 'C';
      } else {
        stockNum = obj.unit_num;
      }
      unitObj[index] = {
        id: parseInt(obj.id),
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

  $scope.saveUnit = function (data, id) {
    var phpObj = data;
    phpObj['function'] = 'updateQuery';
    var unitNum = phpObj.unit_num + '';
    var len = unitNum.length - 1;

    if (unitNum.charAt(len) === 'C' || unitNum.charAt(len) === 'c') {
      phpObj.unit_num = unitNum.substring(0, unitNum.length - 1);
      phpObj.consign_flag = 1;
    } else {
      phpObj.consign_flag = 0;
    }

    $http({
      method: 'POST',
      //The path to php file must be added
      url: '../unit-tracking.php',
      data: phpObj
    }).success(function (ret) {
      console.log(ret);
    });

    angular.extend(data, { id: id });
    // return $http.post('/saveUser', data);
  };

  $scope.addUnit = function () {

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

  $scope.copyUnit = function (id) {
    angular.forEach($scope.units, function (k) {
      if (k.id === id) {
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

  function getNextID() {
    var id;
    angular.forEach($scope.units, function (k) {
      id = parseInt(k.id) + 1;
    });
    return id;
  }

  function getNextUnitNum() {
    var unitNum;
    var strTemp;
    angular.forEach($scope.units, function (k) {
      var str = k.unit_num + '';
      var len = str.length - 1;

      if (str.charAt(len) === 'C' || str.charAt(len) === 'c') {
        strTemp = k.unit_num;
        unitNum = strTemp.substring(0, strTemp.length - 1);
      }

      unitNum = parseInt(k.unit_num) + 1;
    });
    return unitNum;
  }


  $scope.removeUnit = function (event) {

    var confirmDelete = $window.confirm('Are you sure you want to delete this unit?');

    if (confirmDelete) {
      var index;
      var id = event.target.id;

      angular.forEach($scope.units, function (k) {
        if (k.id == id) {
          index = $scope.units.indexOf(k);
        }
      });

      $http({
        method: 'POST',
        //The path to php file must be added
        url: '../unit-tracking.php',
        data: { function: 'deleteFromDB', index: id }

      }).success(function (ret) {
        console.log(ret);
      });
      $scope.units.splice(index, 1);
    }
  };
});
