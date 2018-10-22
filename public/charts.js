// variable globales
const host = "http://192.168.1.45:3000/";
const ApiUpdate = "ChartUpdate";
var chartData = "censo";
var Datadata = [];
var object = [];
var options = "";
var Datalabels = [];
var data = [];
var id = [];
Dataname = [];
var listData = ["line", "bar", "pie", "bubble", "rdar", "doughnut"]
// colores de los graficos
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

function LoadSave() {
  fetch("http://192.168.1.45:3000/getChartListData")
    .then(function (response) {
      return response.json();
    })
    .then(function (DataSave) {
      getChartlistData(DataSave);
    });
}

function getChartlistData(DataSave) {
  console.log(DataSave.chartList)
  object = [];
  for (const nameChart of DataSave.chartList) {
    object.push(nameChart.name);
  }
  getChartlist()
}

function getChartlist() {
  for (const NameSelect of object) {
    for (const name of listData) {
      document.getElementById(NameSelect + "_op").innerHTML += `
    <option   name= ${name} value= ${name} >${name}</option>
    `;
    }
  }
  LoadName();
}

function LoadName() {
  fetch("http://192.168.1.45:3000/Name")
    .then(function (response) {
      return response.json();
    })
    .then(function (names) {
      NamesChart(names);
    });
}

function NamesChart(names) {
  for (const NameSelect of object) {
    for (const name of names.chart) {
      document.getElementById(NameSelect + "_name").innerHTML += `
    <option   name= ${name} value= ${name} >${name}</option>
    `;
    }
  }
  Loadcharts();
}
// funcion Para el cambio de tipos de charts
function clickaction(obj, chartname) {
  document.getElementById(obj);
  let chartName = chartname;
  options = "";
  Vcharts = [];
  // console.log(chartname);
  chart(chartName, getCType(chartname + "_op"), getCType(chartname + "_name"));
} //fin de la funcion

var Vcharts = {};

// function para agregar la opcion   a los typos de graficos
function getCType(idNumber) {
  var e = document.getElementById(idNumber);
  var value = e.options[e.selectedIndex].value;
  return value;
}



// funcion que llama al charts y les pasa los valores octenidos

function Loadcharts() {
  chart("myChart1", getCType("myChart1_op"), getCType("myChart1_name"));
  chart("myChart2", getCType("myChart2_op"), getCType("myChart2_name"));
  chart("myChart3", getCType("myChart3_op"), getCType("myChart3_name"));
  chart("myChart4", getCType("myChart4_op"), getCType("myChart4_name"));
}

// // Api para octener los datos de mongodb NIvel y mes
function chart(idNumber, CType, chartData) {
  fetch("http://192.168.1.45:3000/Getchar?nombre=" + chartData)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      SetData(data, idNumber, CType);
    })
}
// funcion que carga los datos
function SetData(data, idNumber, CType) {
  // defino las variables
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
    id: document.getElementById(idNumber),
    labels: Datalabels,
    data: Datadata,
    type: CType,
    Chartname: Dataname
  };

  // llamo a la funcion load quien es la encargada que cargar las graficas
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

function Save(chartname) {

  let url = host + ApiUpdate;
  $.ajax({
    type: "POST",
    url: url,
    timeout: 2000,
    data: {
      data: getCType(chartname + "_name"),
      name: chartname,
      type: getCType(chartname + "_op")
    },
    success: function (data) {
      //show content
      alert('Success!')
    },
    error: function (jqXHR, textStatus, err) {
      //show error message
      alert('text status ' + textStatus + ', err ' + err)
    }
  });


}

// llamo ala funcion encargada  de llamar a   la funcion char cual es la encargada de llenar los datos
LoadSave()
// getChartlist()

// $.post(host + "Save_post", {
//     data: getCType(chartname + "_name"),
//     name: chartname,
//     type: getCType(chartname + "_op")
//   },
//   function (data, status) {
//     alert(data + "" + status);
//   });