 // const host = "http://localhost:3000/";
 // variables angular js
 const host = "http://192.168.1.45:3000/";
 const ApiUpdate = "ChartUpdate?name";
 const DeleteChart = "DeleteChart";
 const Save = "Save_post";
 const Create = "charts_post";
 const UpdateName = "ChartSave";
 const ValidName = "ValidName";
 const CreateNewChart = "CreateNewChart";
 var _id = "";
 var chartData = "";
 var DatosUpdateChart = {};
 var Datadata = [];
 var options = "";
 var Datalabels = [];
 var data = [];
 var id = [];
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

 function Messagedelete() {
   document.getElementById("success").innerHTML = "Han eliminado un Grafico ";
   $("#alertChart").modal("show");
 }

 function MessageUpdate() {
   $("#alertChart").modal("show");
   document.getElementById("success").innerHTML = " Un cliente  Realizo un cambio de nombre en el Chart ";
   $("#Update").modal("hide");
 }

 function Messagecreate() {
   $("#alertChart").modal("show");
   document.getElementById("success").innerHTML = "han Creado un nuevo Grafico";
   $("#Update").modal("hide");
 }
 // message   of alert  Chart
 function successMessage() {
   $("#modal").addClass("modal-content-alertChart-success");
   setTimeout(() => {
     $("#alertChart").modal("hide");
   }, 1000);
 }

 function errMessage() {
   $("#modal-err").addClass("modal-content-alertChart-err");
   setTimeout(() => {
     $("#alertChart-err").modal("hide");
   }, 1000);
 }