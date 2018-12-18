'use strict'
app.factory("Dataservice", function ($http) {
  const host = "http://192.168.1.45:3000/";
  // const host = "http://localhost:3000/";

  var Dataservice = {

    GetChartName: function () {
      return $http.get(host + "Name").then(function (data) {
        return data;
      });
    },
    GetChartList: function () {
      return $http.get(host + "getTypeChart").then(function (data) {
        return data;
      });
    },
    GetChartListType: function () {
      return $http.get(host + "getChartListData").then(function (data) {
        return data;
      })
    }




  }
  return Dataservice;
})