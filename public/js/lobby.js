(function () {

    'use strict';
    document.getElementById("buttonCollapseSideBar").addEventListener("click", function () {
        var sideMenu = $('#sideMenu');
        var mainArea = $('#mainArea');
        if (sideMenu.hasClass("hiddenSidebar") === true) {
            mainArea.toggleClass('col-md-7');
            mainArea.toggleClass('col-sm-7');
            sideMenu.toggleClass('hiddenSidebar');
            $('#buttonCollapseSideBar button img').attr("src", "img/menuClose.png");
            sideMenu.toggle("slow");
        } else {
            sideMenu.toggleClass('hiddenSidebar');
            $('#buttonCollapseSideBar button img').attr("src", "img/menuOpen.png");
            sideMenu.toggle("slow");
            mainArea.toggleClass('col-md-7');
            mainArea.toggleClass('col-sm-7');
        }
    });
    /*
     CHECK THIS:
     https://jqueryui.com/tabs/#default */
    $('.nav-tabs a').click(function () {
        $(this).tab('show');
    });


    function gameLobbyController($scope, $log, $http , $interval, ngDialog) {

        $scope.linesSlider = {
            value: 2,
            options: {
                floor: 2,
                ceil: 10,
                showTicks: true,
                disabled: false
            }
        };
        $scope.columnSlider = {
            value: 2,
            options: {
                floor: 2,
                ceil: 10,
                showTicks: true,
                disabled: false
            }
        }

        $scope.listGames = function() {
            $interval(function () {
                var url = 'gameLobby/listGames';
                $http.get(url).then(function successCallback(response) {
                    console.log(response);
                    $scope.gamesWaiting = response.data.gamesWaiting;
                    $scope.gamesPlaying = response.data.gamesPlaying;
                }, function errorCallback(response) {
                    console.log('There was an error on startGame request');
                });
            },3000);
        }

        $scope.createGame = function () {
            if ($scope.check($scope.linesSlider.value, $scope.linesSlider.value)) {
                if (!($scope.nrPlayers <= ($scope.linesSlider.value * $scope.linesSlider.value / 2))) {
                    $scope.msgErrorPlayers = "Insert correct number of players";
                    return false;
                } else {
                    $scope.msgErrorPlayers = "";
                }
                if (!($scope.content != undefined)) {
                    $scope.msgErrorVis = "Select Game Visibility";
                    return false;
                } else {
                    $scope.msgErrorVis = "";
                }
                console.log($scope.bot)
                if ($scope.bot == true) {
                    console.log($scope.nrBots)
                    console.log($scope.nrPlayers)
                    if ($scope.nrBots == undefined || !($scope.nrBots <= $scope.nrPlayers)) {
                        $scope.msgErrorBot = "Insert number of bots";
                        return false;
                    } else {
                        $scope.msgErrorBot = ""
                    }
                } else {
                    $scope.msgErrorBot = ""
                }
            }
            return true;
        }

        $scope.createRoom = function() {
            if($scope.createGame == true) {
                $('#formCreateRoom').submit();
                console.log("asd");
                $scope.diag.close();
            }
        }

        $scope.resetErrorsDialog = function () {
            $scope.msgErrorLines = "";
            $scope.msgErrorCols = "";
            $scope.msgErrorPlayers = "";
            $scope.msgErrorVis = "";
            $scope.msgErrorBot = "";
            $scope.linesSlider.value = 2;
            $scope.columnSlider.value = 2;
        }

        $scope.createDialog = function () {
            $scope.diag =  ngDialog.open({
                template: 'createRoom.blade.php',
                showClose: false,
                closeByEscape: false,
                data: $scope,
                closeByDocument: false,
                preCloseCallback: function (value) {
                    if (value == "cancel") {
                        $scope.resetErrorsDialog();
                    }
                }
            });
            $scope.diag.closePromise.then(function closed(){
                console.log("adsasd");
            });
        }

        $scope.check = function (lines, columns) {
            var tilesCount = lines * columns;
            if ((tilesCount) > 80) {
                $scope.msgErrorLines = "Game cannot have more than 80 tiles. Change Lines or Columns";
                return false;
            }

            if ((tilesCount) % 2 != 0) {
                $scope.msgErrorLines = "Game cannot have an odd number of tiles";
                $scope.msgErrorCols = "Game cannot have an odd number of tiles"
                return false;
            }
            $scope.msgErrorLines = "";
            $scope.msgErrorCols = "";
            return true;
        }
    }
    angular.module('lobby', ['ngDialog', 'rzModule']);
    angular.module('lobby').controller('gameLobbyController', ['$scope', '$log','$http','$interval', 'ngDialog', gameLobbyController]);

})();
