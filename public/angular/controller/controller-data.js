app.controller("ctrl_data", ["Dataservice", "$scope", "$http", function (Dataservice, $scope, $http) {

    $scope.Cdata = [];
    Cdata = $scope.Cdata;
    $scope.NameData = "";
    $scope.options = "dleteChart()";
    $scope.namecurrent = {
        name: ""
    };
    var Name = $scope.namecurrent.name;
    $scope.gridOptions = {
        enableHorizontalScrollbar: false,
        enableCellEditOnFocus: true,
        enableRowSelection: false,
        enableSelectAll: false,
        selectionRowHeaderWidth: 25,
        rowHeight: 35,
        showGridFooter: true
    };
    $scope.gridOptions.columnDefs = [{
            name: "level",
            enableCellEditOnFocus: true,
            displayName: "level"
        },
        {
            name: "value",
            displayName: "value"
        },
        {
            name: "Delete",
            displayName: " Delete",
            cellTemplate: '<div class="iconUigrid"> <span> <i class="fa fa-trash text-danger" ng-click="grid.appScope.remove(row.entity)"></i > </span></div>',
            width: "20%"
        }
    ];
    /*
      funcion para octener los datos que vamos a Eliminar 
    */
    $scope.remove = function (entity) {
        name = entity.name;
        level = entity.level;
        value = entity.value;
        _id = entity._id;
        var index = entity;
        $scope.gridOptions.data.splice(index, 1);
        $scope.deleteDataDB(_id, name, level, value, entity);
    };

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            name = rowEntity.name;
            level = rowEntity.level;
            value = rowEntity.value;
            _id = rowEntity._id;
            $scope.updatedataChart(_id, name, level, value);
        });

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            $scope.gridApi.grid.appScope.lastSelectedRow = row;
            var PropertyRow = row;
        });
    };
    /*
     funcion que trae la data de los diferentes datos selecionado 
    */
    $scope.selectDataDB = function () {
        $http.get(host + "Getchar?nombre=" + $scope.namecurrent.name)
            .then(function (data) {
                $scope.values = data.data.chart;
                $scope.gridOptions.data = data.data.chart;
            });
    };
    /*
      funcion para agregar datos nuevos 
    */
    $scope.Add = function () {
        if ($scope.namecurrent.name != "") {
            $scope.gridOptions.data.push({
                name: $scope.namecurrent.name,
                level: "",
                value: ""
            });
            $("#saveDataChart").prop("disabled", false);
        } else {
            $("#addErr").text("debe Elejir el tipo de datos para agregar la nueva fila ")
            setTimeout(() => {
                $("#addErr").text("")
            }, 3000);
        }
    };

    /*
     funcion para actualizar los datos enm el grid 
    */
    $scope.updatedataChart = function (_id, name, level, value) {
        var urlUp = host + "ChartdataUpdate?_id=" + _id;
        $.ajax({
            type: "POST",
            url: urlUp,
            timeout: 2000,
            data: {
                _id: _id,
                name: name,
                level: level,
                value: value
            },
            success: function (data) {},
            error: function (textStatus, err) {
                alert("text status " + textStatus + ", err " + err);
            }
        });
    };
    /*
     funcion para Eliminar   los datos enm el grid 
    */
    $scope.deleteDataDB = function (_id, name, level, value, entity) {
        var urlUp = host + "DeletedataChart?_id=" + _id;
        $.ajax({
            type: "POST",
            url: urlUp,
            timeout: 2000,
            data: {
                _id: _id,
                name: name,
                level: level,
                value: value
            },
            success: function (data) {
                Messagedelete();
            },
            error: function (textStatus, err) {
                alert("text status " + textStatus + ", err " + err);
            }
        });
    };
    /*
    
    */
    $scope.btnAddData = function () {
        NewdataRow = $scope.gridOptions.data;
        for (const dato of NewdataRow) {
            if (dato._id == null) {
                $scope.createNRow(dato);
            }
        }
    };
    $scope.btnNewChart = function () {
        name = document.getElementById("nameChart").value;
        level = document.getElementById("levelChart").value;
        value = document.getElementById("ValueChart").value;
        dato = {
            name: name,
            value: value,
            level: level
        };
        if (name != "" && level != "" && value != "") {
            $scope.createNChart(dato);
        } else {
            $("#MessageErr").text("no se pudo agregar Nuevos  datos Por favor buelva a Ingresar datos Validos ");
        }
    }

    $scope.createNChart = function (dato) {
        var urlUp = host + "charts_post";
        $.ajax({
            type: "POST",
            url: urlUp,
            timeout: 2000,
            data: dato,
            success: function (data) {
                alert("se guardo correctamente ")
                $('#Form_add')[0].reset();
                $("#saveDataChart").prop("disabled", true);
                $scope.Cdata.push({
                    name: data.chart.name
                });
                $scope.$digest();
                $scope.$apply();
            },
            error: function (textStatus, err) {
                alert("text status " + textStatus + ", err " + err);
            }
        });
    };

    $scope.createNRow = function (dato) {
        var urlUp = host + "charts_post";
        $.ajax({
            type: "POST",
            url: urlUp,
            timeout: 2000,
            data: dato,
            success: function (data) {
                $("#saveDataChart").prop("disabled", true);
            },
            error: function (textStatus, err) {
                alert("text status " + textStatus + ", err " + err);
            }
        });
    };

    Dataservice.GetChartName().then(function (data) {
        $scope.NameData = data.data.chart;
        for (item of data.data.chart) {
            $scope.Cdata.push({
                name: item
            });
        }
    });

    $scope.Options = function (id) {
        console.log(id)
    }
}]);

function alertFunction() {
    return "success delete ";
}