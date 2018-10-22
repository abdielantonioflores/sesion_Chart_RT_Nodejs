app.controller('ctrl', function ($scope, $http) {

    $http.get('http://192.168.1.46:3000/usuario')
        .then(function (response) {
            $scope.res = response.data;
            $(document).ready(function () {
                $('#table_id').DataTable();
            });
        });

    $scope.modal = (_id, nombre, email) => {

        $("#options").modal("show");
        $scope._id = _id;
        $scope.nombre = nombre;
        $scope.email = email;     
    }


})