app.controller("ctrlHome", function (Dataservice, $scope) {
  $scope.socket = io();
  $scope.headerModal = "";
  $scope.nombre = "Chart List";
  $scope.listData = [];
  $scope.NameData = [];
  $scope.object = [];
  $scope.IdNameChart = [];
  $scope.chartList = [];
  $scope.clickaction = "";
  $scope.Save = "";
  $scope.chartName = "";

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
    for (const datos of data.chart) {
      Datalabels.push(datos.level);
      Datadata.push(datos.value);
      Dataname.push(datos.name);
    }
    Vcharts = {};
    // cargo el objeto con las variables, a las cuales le agregue el valor
    Vcharts = {
      id: document.getElementById(chartName),
      labels: Datalabels,
      data: Datadata,
      type: CType,
      Chartname: Dataname
    };
    load();
  }

  function load() {

    if (window.myChart != undefined) {
      var oldcanvasid = window.myChart.chart.ctx.canvas.id;
      if (Vcharts.id.id == oldcanvasid) {
        window.myChart.destroy();
      }
    }

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
    var DatosUpdateChart = {
      name: chartName,
      type: getCType(chartName + "_op"),
      data: getCType(chartName + "_name")
    };
    let url = host + ApiUpdate;
    $.ajax({
      type: "POST",
      url: url,
      timeout: 2000,
      data: DatosUpdateChart,
      success: function (data) {
        // chart(DatosUpdateChart.name, DatosUpdateChart.type, DatosUpdateChart.data)
        Updatedatachart(chartName, DatosUpdateChart);
      },
      error: function (err) {
        $("#alertChart").modal("show");
        document.getElementById("success").innerHTML =
          "ocurrio un error  " + err;
        errMessage();
      }
    });
  };

  $scope.Delete = function (chartName) {
    let url = host + DeleteChart + "/" + chartName;
    $.ajax({
      type: "POST",
      url: url,
      timeout: 2000,
      data: {
        name: chartName
      },
      success: function (data) {
        deleChartRt(chartName);
      },
      error: function (textStatus, err) {
        alert("text status " + textStatus + ", err " + err);
      }
    });
  };

  $scope.CheckChartExist = function (id, nameChart) {
    var name = document.querySelector(".namec").value;
    // var name = document.getElementById("nameFormChart").value;
    let url = host + ValidName + "/?name=" + name;
    $.ajax({
      type: "get",
      url: url,
      timeout: 2000,
      data: {
        name: name
      },
      success: function (data) {
        if (data.data == "") {
          if ($scope.isNew) {
            CreatenewChart(name);
          } else {
            ChangeNameform(name, nameChart);
          }
        } else {
          $("#alertChart-err").modal("show");
          document.getElementById("success-err").innerHTML =
            "  Nombre  No disponible";
          errMessage();
        }
      },
      error: function (textStatus, err) {
        //show error message
        $("#success_err").text(
          textStatus + "OCUURIO UN ERROR  INTENTE MAS TARDE  " + err
        );
        $("#success_err").addClass("alert alert-danger mt-3");
      }
    });
  };

  function ChangeNameform(name, nameChart) {
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
      success: function (data) {
        ChangeNameChart(name, nameChart);
      },
      error: function (textStatus, err) {
        alert("text status " + textStatus + ", err " + err);
      }
    });
  }

  function CreatenewChart(name) {
    let url = host + CreateNewChart;
    $.ajax({
      type: "POST",
      url: url,
      timeout: 2000,
      data: {
        name: name,
        data: "LLuvia",
        type: "line"
      },
      success: function (data) {
        datos = data.save;
        CreateNewChartClient(datos);
      },
      error: function (textStatus, err) {
        $("#success").text(textStatus + " no se pudo crear el chart " + err);
      }
    });
  }
  $scope.modal = (chartName, id, type, nameData, isNew) => {
    $("#Update").modal("show");
    $scope.headerModal =
      isNew == true ? "Create New Chart" : "Update Name " + chartName;
    $scope.name = chartName;
    $scope._id = id;
    $scope.type = type;
    $scope.nameData = nameData;
    $scope.isNew = isNew;
  };

  $scope.DataofForm = function () {
    var ChartList = $scope.chartList;

    var name = document.getElementById("name").value;
    var value = document.getElementById("value").value;
    var level = document.getElementById("level").value;
    CreateNewData(name, value, level, ChartList);
  };

  function Updatedatachart(chartName, DatosUpdateChart) {
    nameChart = chartName;
    datos = DatosUpdateChart;
    option = "save";
    ChartsChangesRT("", nameChart, option, datos);
  }

  function UpdateDataChartRt(nameChart, datos) {
    for (const ChartSave of $scope.chartList) {
      if (nameChart == ChartSave.name) {
        datos = datos;
        ChartSave.data = datos.data;
        ChartSave.type = datos.type;
        $scope.$digest();
        $scope.$apply();
        chart(
          nameChart,
          getCType(nameChart + "_op"),
          getCType(nameChart + "_name")
        );
        $("#alertChart").modal("show");
        document.getElementById("success").innerHTML =
          "un Ususario Realizo un cambio en el Chart " + nameChart;
        successMessage();
      }
    }
  }

  function ChangeNameChart(name, nameChart) {
    for (const datosUP of $scope.chartList) {
      if (nameChart == datosUP.name) {
        datosUP.name = name;
        console.log(datosUP);
        $scope.$digest();
        $scope.$apply();
        option = "update";
        datos = "";
        ChartsChangesRT(name, nameChart, option, datos);
      }
    }
  }

  function deleChartRt(chartName) {
    nameChart = chartName;
    DeleteChartfunction(chartName);
    option = "delete";
    datos = "";
    ChartsChangesRT(name, nameChart, option, datos);
  }

  function DeleteChartfunction(chartName) {
    for (var i = 0; i < $scope.chartList.length; i++) {
      if (chartName == $scope.chartList[i].name) {
        $scope.chartList.splice(i);
        $scope.$digest();
      }
    }
  }

  function CreateNewChartClient(datos) {
    option = "create";
    $scope.chartList.push(datos);
    $scope.$digest();
    chart(
      datos.name,
      getCType(datos.name + "_op"),
      getCType(datos.name + "_name")
    );
    ChartsChangesRT("", "", option, datos);
  }

  // socket
  function ChartsChangesRT(name, nameChart, option, datos) {
    let message = {
      nameChart: nameChart,
      name: name,
      option: option,
      datos: datos
    };
    messageEmit(message);
  }


  // function testControllerHome() {
  //   test()
  // }

  function messageEmit(message) {
    $scope.socket.emit("dataUsers", message);
  }

  $scope.socket.on("ChangeRT", function (data) {
    switch (data.message.option) {
      case "delete":
        Messagedelete();
        successMessage();
        DeleteChartfunction(data.message.nameChart);

        break;
      case "update":
        MessageUpdate();
        successMessage();
        ChangeNameChart(data.message.name, data.message.nameChart);
        // chart(data.message.datos.name, data.message.datos.type, data.message.datos.data);
        break;
      case "create":
        Messagecreate();
        successMessage();
        $scope.chartList.push(data.message.datos);
        $scope.$digest();
        chart(
          data.message.datos.name,
          data.message.datos.type,
          data.message.datos.data
        );
        break;
      case "save":
        nameChart = data.message.nameChart;
        datos = data.message.datos;
        $("#alertChart").modal("show");
        document.getElementById("success").innerHTML =
          "un Ususario Realizo un cambio en el Chart " + nameChart;
        successMessage();
        UpdateDataChartRt(nameChart, datos);

        break;
      default:
        alert("ocurrio un error ");
        break;
    }
  });

  // service of angular js
  Dataservice.GetChartName().then(function (data) {
    $scope.NameData = data.data.chart;
  });
  Dataservice.GetChartList().then(function (data) {
    $scope.listData = data.data.CharType;
  });
  Dataservice.GetChartListType().then(function (data) {
    $scope.chartList = data.data.chartList;
  });

  setTimeout(() => {
    Loadcharts();
  }, 1000);
});