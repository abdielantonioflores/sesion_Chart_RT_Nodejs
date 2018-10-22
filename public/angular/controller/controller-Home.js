app.controller("ctrlHome", function (Dataservice,$scope) {
  // variable globales
  const host = "http://localhost:3000/";
  const ApiUpdate = "ChartUpdate";
  const DeleteChart = "DeleteChart";
  const ValidName = "ValidName";
  var chartData = "";
  var Datadata = [];
  var options = "";
  var Datalabels = [];
  var data = [];
  var id = [];
  var dataId=[];
  var Dataname = [];
  var BG = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 159, 64, 0.2)"
  ];
  var BG2 = [
    "rgba(255,99,132,1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)"
  ];
// variables angular js 
  $scope.listData = [];
  $scope.NameData = [];
  $scope.object = [];
  $scope.IdNameChart = [];
  $scope.chartList = [];
  $scope.clickaction = "";
  $scope.Save = "";
  $scope.chartName = "";

  // funcion Para el cambio de tipos de charts
  $scope.clickaction = function (obj, nameChart) {
    nameChart = document.getElementById(obj.Chart.name);
    chartName = nameChart;
    options = "";
    Vcharts = [];
    chart(
      chartName.id,
      getCType(chartName.id + "_op"),
      getCType(chartName.id + "_name")
    );
  }; 

  // function para agregar la opcion   a los typos de graficos
  function getCType(chartName) {
    var e = document.getElementById(chartName);
    var value = e.options[e.selectedIndex].value;
    return value;
  }
  function Loadcharts() {
    for (const chartName of $scope.chartList) {
      chart(
        chartName.name,
        getCType(chartName.name + "_op"),
        getCType(chartName.name + "_name")
      );
    }
  }
 // Api para octener los datos para los chart 
  function chart(chartName, CType, chartData) {
    fetch(`${host}Getchar?nombre=${chartData}`)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        SetData(data, chartName, CType);
      });
  }
    function SetData(data, chartName, CType) {
    Datadata = [];
    Datalabels = [];
    Dataname = [];
    dataId=[];
    for (const datos of data.chart) {
      Datalabels.push(datos.level);
      Datadata.push(datos.value);
      Dataname.push(datos.name);
      dataId.push(datos._id)
    }
    Vcharts = {};
    // cargo el objeto con las variables, a las cuales le agregue el valor
    Vcharts = {
      _id:dataId,
      id: document.getElementById(chartName),
      labels: Datalabels,
      data: Datadata,
      type: CType,
      Chartname: Dataname
    };

    load();
  }

  function load() {
    // para  destruir el objeto
    if (window.myChart != undefined) {
      var oldcanvasid = window.myChart.chart.ctx.canvas.id;
      if (Vcharts.id.id == oldcanvasid) {
        window.myChart.destroy();
      }
    }

    // console.log(oldcanvasid)
    // creo mi mediante este objeto las graficas y le paso los valores octenido  anteriormente
    window.myChart = new Chart(Vcharts.id, {
      type: Vcharts.type,
      data: {
        labels: Vcharts.data,
        datasets: [{
          label: Vcharts.Chartname[0],
          data: Vcharts.labels,
          backgroundColor: BG,
          borderColor: BG2,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  $scope.Save = function (chartName) {
    let url = host + ApiUpdate;
    $.ajax({
      type: "POST",
      url: url,
      timeout: 2000,
      data: {
        data: getCType(chartName + "_name"),
        name: chartName,
        type: getCType(chartName + "_op")
      },
      success: function (data) {
        //show content
        alert("Success!");

      },
      error: function ( textStatus, err) {
        //show error message
        alert("text status " + textStatus + ", err " + err);
      }
    });
  };


  $scope.Delete = function (chartName) {
    let url = host + DeleteChart + "/"+ chartName;
    $.ajax({
      type: "POST",
      url: url,
      timeout: 2000,
      data: {      
        name: chartName,
      },
      success: function (data) {
        //show content
        alert("Success!");
      },
      error: function ( textStatus, err) {
        //show error message
        alert("text status " + textStatus + ", err " + err);
      }
    });
  };
  $scope.update = function () {
   var name =  document.getElementById('name').value
   console.log(name)
    let url = host + ValidName;
    $.ajax({
      type: "POST",
      url: url,
      timeout: 2000,
      data: {
        name: name
      },
      success: function (data) {
        //show content
        // alert("Success!");
        $("#success").text('success, chart Done'+ data.name );
      },
      error: function ( textStatus, err) {
        //show error message
        $("#success").text( name  + "ya exixte " + err);
        // alert("text status " + textStatus + ", err " + err);
      }
    });
  };

  $scope.modal = (chartName) => {
    $("#Update").modal("show");
    $scope.name = chartName;
  }
  Dataservice.GetChartName().then(function(data){
    $scope.NameData = data.data.chart;
  });
  Dataservice.GetChartList().then(function(data){
    $scope.listData = data.data.CharType;
  });
  Dataservice.GetChartListType().then(function(data){
    $scope.chartList = data.data.chartList;
  });

  setTimeout(() => {
    Loadcharts();
  }, 1000);
});