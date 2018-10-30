app.controller("ctrlHome", function(Dataservice, $scope) {
  // variable globales
  // const host = "http://192.168.1.45:3000/";
  const host = "http://localhost:3000/";
  const ApiUpdate = "ChartUpdate?name";
  const DeleteChart = "DeleteChart";
  const Save = "Save_post";
  const UpdateName = "ChartSave";
  const ValidName = "ValidName";
  // carga de nuevos datos
  nameC = [];
  type = [];
  data = [];
  ChartLoad = {};
  // variables de los chart
  const CreateNewChart = "CreateNewChart";
  var _id = "";
  var chartData = "";
  var Datadata = [];
  var options = "";
  var Datalabels = [];
  var data = [];
  var id = [];
  var dataId = [];
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
  $scope.createNewChart = true;
  $scope.ValidateChart = false;
  $scope.ValidateChart2 = true;
  $scope.listData = [];
  $scope.NameData = [];
  $scope.object = [];
  $scope.IdNameChart = [];
  $scope.chartList = [];
  $scope.clickaction = "";
  $scope.Save = "";
  $scope.chartName = "";

  // funcion Para el cambio de tipos de charts
  $scope.clickaction = function(obj, nameChart) {
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
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        SetData(data, chartName, CType);
      });
  }

  function SetData(data, chartName, CType) {
    Datadata = [];
    Datalabels = [];
    Dataname = [];
    dataId = [];
    for (const datos of data.chart) {
      Datalabels.push(datos.level);
      Datadata.push(datos.value);
      Dataname.push(datos.name);
      dataId.push(datos._id);
    }
    Vcharts = {};
    // cargo el objeto con las variables, a las cuales le agregue el valor
    Vcharts = {
      _id: dataId,
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
        datasets: [
          {
            label: Vcharts.Chartname[0],
            data: Vcharts.labels,
            backgroundColor: BG,
            borderColor: BG2,
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }

  $scope.Save = function(chartName) {
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
      success: function(data) {
        //show content
        alert(data + "Success!");
      },
      error: function(textStatus, err) {
        //show error message
        alert("text status " + textStatus + ", err " + err);
      }
    });
  };

  $scope.Delete = function(chartName) {
    let url = host + DeleteChart + "/" + chartName;
    $.ajax({
      type: "POST",
      url: url,
      timeout: 2000,
      data: {
        name: chartName
      },
      success: function(data) {
        //show content
        alert("Success!");
      },
      error: function(textStatus, err) {
        //show error message
        alert("text status " + textStatus + ", err " + err);
      }
    });
  };

  $scope.CheckChartExist = function(id, nameChart) {
    var id = document.getElementById(id);
    var name = document.getElementById("name").value;
    let url = host + ValidName + "/?name=" + name;
    $.ajax({
      type: "get",
      url: url,
      timeout: 2000,
      data: {
        name: name
      },
      success: function(data, err) {
        if (data.data == "") {
          var Id = $scope._id;
          var type = $scope.type;
          var data = $scope.nameData;
          let urlUp = host + UpdateName;
          $.ajax({
            type: "POST",
            url: urlUp,
            timeout: 2000,
            data: {
              _id: Id,
              name: name,
              type: type,
              data: data
            },
            success: function(data) {
              $("#success").text(
                name + " " + "el nombre esta disponible y sera Actualizado "
              );
              $("#success").addClass("alert alert-success mt-3");
              $("#success").show();
              $("#success_err").hide();

              for (const datosUP of $scope.chartList) {
                if (nameChart == datosUP.name) {
                  datosUP.name = name;
                  $scope.$digest();
                  //  window.location.reload();
                  // var inputNombre = document.getElementById(Id);
                  // inputNombre.value = name;
                  $("#Update").modal("hide");
                }
              }
              console.log($scope.chartList);
            },
            error: function(textStatus, err) {
              //show error message
              alert("text status " + textStatus + ", err " + err);
            }
          });
        } else {
          $("#success_err").text(
            data.data[0].name + " " + "el nombre No esta disponible"
          );
          $("#success_err").addClass("alert alert-danger mt-3");
          $("#success_err").show();
          $("#success").hide();
        }
      },
      error: function(textStatus, err) {
        //show error message
        $("#success_err").text(
          textStatus + "OCUURIO UN ERROR  INTENTE MAS TARDE  " + err
        );
        $("#success_err").addClass("alert alert-danger mt-3");
      }
    });
  };

  $scope.modal = (chartName, id, type, nameData) => {
    $("#Update").modal("show");
    $scope.name = chartName;
    $scope._id = id;
    $scope.type = type;
    $scope.nameData = nameData;
    // console.log($scope._id)
  };

  Dataservice.GetChartName().then(function(data) {
    $scope.NameData = data.data.chart;
  });
  Dataservice.GetChartList().then(function(data) {
    $scope.listData = data.data.CharType;
  });
  Dataservice.GetChartListType().then(function(data) {
    $scope.chartList = data.data.chartList;
  });

  setTimeout(() => {
    Loadcharts();
  }, 100);

  // $("#create").hide();
});
