/**
 * Created by admin on 2018/1/19.
 */
angular.module('starter.homeCtrl', [])
    .controller('homeCtrl', function ($scope, $state, $errorPopupFactory, $util, $activityDiscount, $rootScope) {
        var imgClass = ['./img/completeInfoSucceed.png', './img/completeInf.png'];
        $scope.pl3Num = 31;
        $scope.pl3Bg = './img/85.png';//排列三入口背景
        $scope.pl5Bg = './img/85.png'; //排列五入口背景
        $scope.pl5Num = 40;
        var userInfo = $util.getUserInfo();
        var userId = $rootScope.userId;
        console.log(userId);
        console.log(userInfo.token);
        var data = {
            data: {},
            params: {}
        };
        $activityDiscount.activityDiscount(data, userInfo.token)
            .then(function (response) {
                console.log("image", response);
                return {
                    activityDiscount: response.data.activityDiscount,
                    activityPicture: response.data.activityPicture
                }
            })
            .then(function (res) {
                $activityDiscount.footBall('', userInfo.token, '')
                    .then(function (response) {
                        var footOneData = $scope.footOneData = response.data;
                        // console.log("sdsdsdsdsd",$scope.footOneData)
                        // console.log(footOneData);
                        $scope.activityPicture = res.activityPicture;
                        //出现
                        if(footOneData !== undefined){
                            if ($scope.footOneData[1].length < $scope.footOneData[0].length) {
                                $scope.footOneData.reverse();  //单关排第一个
                            }
                            if ($scope.footOneData[0].length === 2) { //length为1 ==> 单关
                                $scope.pl3Num = 11;
                                $scope.pl3Bg = $scope.activityPicture[8].img;
                            } else if ($scope.footOneData[0].length === 3) { //length为2 ==> 2串1
                                $scope.pl3Num = 27;
                                $scope.pl3Bg = $scope.activityPicture[9].img;
                            }

                            if ($scope.footOneData[1].length === 2) {
                                $scope.pl5Num = 11;
                                $scope.pl5Bg = $scope.activityPicture[8].img;
                            } else if ($scope.footOneData[1].length === 3) {
                                $scope.pl5Num = 27;
                                $scope.pl5Bg = $scope.activityPicture[9].img;
                            }
                        }

                        $scope.clickPlFn = function (num, data) {
                            if (num === 2) {
                                $state.go('superLotto', {
                                    resdata: res.activityDiscount[2],
                                    resimg: $scope.activityPicture[6].img,
                                    userId: userId
                                });
                            }
                            else if (num === 31) {
                                if (!footOneData) {
                                    $scope.successOrFaild = '球队正在休息,请等待';
                                    $scope.imgagesUrl = imgClass[1];
                                    $errorPopupFactory.errorInfo($scope, $state, 'home');
                                }else {
                                    $state.go('arrangeThree', {
                                        resdata: res.activityDiscount[0],
                                        resimg: $scope.activityPicture[4].img,
                                        userId: userId
                                    });
                                }

                            }
                            else if (num === 40) {
                                if (!footOneData) {
                                    $scope.successOrFaild = '球队正在休息,请等待';
                                    $scope.imgagesUrl = imgClass[1];
                                    $errorPopupFactory.errorInfo($scope, $state, 'home');
                                }else {
                                    $state.go('arrangeFive', {
                                        resdata: res.activityDiscount[1],
                                        resimg: $scope.activityPicture[5].img,
                                        userId: userId
                                    });
                                }
                            }
                            else if(num ===5){
                                $state.go('arrangeFive', {
                                    resdata: res.activityDiscount[1],
                                    resimg: $scope.activityPicture[5].img,
                                    userId: userId
                                });
                            }
                            else if (num === 11) {
                                $state.go('lotteryFootball', {
                                    plandata: data,
                                    resdata: res.activityDiscount[3],
                                });
                            }
                            else if (num === 27) {
                                $state.go('twoLotteryFootball', {
                                    plandata: data,
                                    resdata: res.activityDiscount[3],
                                });
                            }
                            else if (num === 1) {
                                $state.go('mine.myBonus', {
                                    resdata: res.activityDiscount[3],
                                    resimg: $scope.activityPicture[7].img
                                });
                            }
                            else {
                                $scope.successOrFaild = '暂未开放';
                                $scope.imgagesUrl = imgClass[1];
                                $errorPopupFactory.errorInfo($scope, $state, null);
                            }
                        };
                    });
            })
    });
