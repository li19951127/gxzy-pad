/**
 * Created by admin on 2018/2/26.
 */
angular.module('starter.CustomService', [])

    .factory('$BonusRecordFactory', function () {
        return {
            bonusRecord: function (listData) {
                var bonusInfoArr = [];
                for (var i = 0; i < listData.length; i++) {
                    var withdrawalInfoObj = {};
                    withdrawalInfoObj.money = listData[i].money;
                    withdrawalInfoObj.createDate = listData[i].createDate;

                    switch (listData[i].type) {// type 1中奖 2 投注 3出票失败退款
                        case 1:
                            withdrawalInfoObj.bonusRecordTitle = '彩票奖金';
                            withdrawalInfoObj.incomeOrExpend = '收入';
                            withdrawalInfoObj.plusOrMinus = '+';
                            break;
                        case 2:
                            withdrawalInfoObj.bonusRecordTitle = '奖金兑换';
                            withdrawalInfoObj.incomeOrExpend = '支出';
                            withdrawalInfoObj.plusOrMinus = '-';
                            break;
                        case 3:
                            withdrawalInfoObj.bonusRecordTitle = '出票失败退款';
                            withdrawalInfoObj.incomeOrExpend = '收入';
                            withdrawalInfoObj.plusOrMinus = '+';
                            break;
                    }
                    bonusInfoArr.push(withdrawalInfoObj);
                }
                return bonusInfoArr
            }
        };
    })

    //提现记录
    .factory('$WithdrawalRecordFactory', function () {
        return {
            withdrawalRecord: function (listData) {
                console.info('*****', listData);
                var withdrawalInfoArr = [];
                for (var i = 0; i < listData.length; i++) {
                    var withdrawalInfoObj = {};
                    withdrawalInfoObj.createDate = listData[i].createDate;
                    withdrawalInfoObj.money = listData[i].money;
                    switch (listData[i].status) {// status 0待处理 1审核通过 2 已完成 -1审核不通过
                        case 0:
                            withdrawalInfoObj.statusTxt = '待处理';
                            break;
                        case 1:
                            withdrawalInfoObj.statusTxt = '审核通过';
                            break;
                        case 2:
                            withdrawalInfoObj.statusTxt = '已完成';
                            break;
                        case -1:
                            withdrawalInfoObj.statusTxt = '审核不通过';
                            break;
                    }
                    withdrawalInfoArr.push(withdrawalInfoObj);
                }
                return withdrawalInfoArr
            }

        };
    })
    //全部订单
    .factory('$allOrdersFactory', function () {
        return {
            allOrders: function (listData, status) {   // 0 , 3 , 1 , 4
                console.info('*****', listData);
                var allOrdersInfoArr = [];
                for (var i = 0; i < listData.length; i++) {
                    var allOrdersInfoObj = {};
                    var investCodeListArr = [];

                    switch (Number(listData[i].lotteryID)) {
                        case 20201 :
                        case 20205 :
                        case 20206 :
                            allOrdersInfoObj.lotteryTxt = '竞彩足球';
                            allOrdersInfoObj.lotteryKind = 0;     //足彩特有字段
                            break;
                        case 2:
                            allOrdersInfoObj.lotteryTxt = '大乐透';
                            break;
                        case 31:
                            allOrdersInfoObj.lotteryTxt = '排列三';
                            break;
                        case 40:
                            allOrdersInfoObj.lotteryTxt = '排列五';
                            break;
                    }
                    if(allOrdersInfoObj.lotteryKind === 0) {  //足彩
                        var footBallMessage = (listData[i].lotteryList[0].investCode.split('^')).slice(0,-1);
                        if(footBallMessage.length === 1){
                            allOrdersInfoObj.betKind = "单关";
                        }else{
                            allOrdersInfoObj.betKind = "2串1";
                        }
                        allOrdersInfoObj.betNum = footBallMessage.length; //方案场次
                        allOrdersInfoObj.multiple = listData[i].lotteryList[0].multiple; //方案倍数
                        allOrdersInfoObj.footBallMessage = footBallMessage;
                        allOrdersInfoObj.ballPlanId = listData[i].planId;
                    }else {                                  //其他彩种
                        for (var j = 0; j < listData[i].lotteryList.length; j++) {

                            var investCodeList = {
                                red: [],
                                blue: []
                            };
                            if (listData[i].lotteryList[j].lotteryID !== '2') {
                                investCodeList.red = (listData[i].lotteryList[j].investCode.split('*'));
                            }
                            else {
                                var investCodeDlt = listData[i].lotteryList[j].investCode.split('*');
                                investCodeList.red = investCodeDlt[0].split(',');
                                investCodeList.blue = investCodeDlt[1].split(',');
                            }
                            investCodeListArr.push(investCodeList);

                        }
                    }

                    allOrdersInfoObj.lotteryList = investCodeListArr;
                    allOrdersInfoObj.money = listData[i].money;
                    allOrdersInfoObj.createDate = listData[i].createDate;
                    allOrdersInfoObj.orderNo = listData[i].orderNo;


                    switch (listData[i].status) {

                        case 0:
                        case 1:
                            allOrdersInfoObj.num = '1';
                            allOrdersInfoObj.statusTxt = '待出票';
                            allOrdersInfoObj.patternPayment = listData[i].dcurrencyAmount;
                            if( allOrdersInfoObj.lotteryKind === 0){
                                allOrdersInfoObj.differentTxt = "等待开奖";
                            }else {
                                allOrdersInfoObj.differentTxt = '开奖时间' + listData[i].drawTime;
                            }
                            break;
                        case 2:
                            allOrdersInfoObj.num = '2';
                            allOrdersInfoObj.statusTxt = '待开奖';
                            if( allOrdersInfoObj.lotteryKind === 0){
                                allOrdersInfoObj.differentTxt = "等待开奖";
                            }else {
                                allOrdersInfoObj.differentTxt = '开奖时间' + listData[i].drawTime;
                            }

                            // if (status === 2) {
                                // if(allOrdersInfoObj.lotteryKind === 0) {
                                    allOrdersInfoObj.patternPayment = listData[i].dcurrencyAmount
                                // }else {
                                //     allOrdersInfoObj.patternPayment = '￥'+ listData[i].money;
                                // }
                            // }
                            // else {
                                // if(allOrdersInfoObj.lotteryKind === 0){
                                //     allOrdersInfoObj.patternPayment = listData[i].dcurrencyAmount
                                // }else {
                                //     allOrdersInfoObj.patternPayment = listData[i].channelName;
                                // }
                            // }
                            break;
                        case 3:
                            allOrdersInfoObj.num = '3';
                            allOrdersInfoObj.statusTxt = '未中奖';
                            allOrdersInfoObj.differentTxt = '再接再厉哦~~';
                            // if (status === 0) {
                            //     allOrdersInfoObj.patternPayment = '￥' + listData[i].money;
                            // }
                            // else {
                                // if(allOrdersInfoObj.lotteryKind === 0){
                                    allOrdersInfoObj.patternPayment = listData[i].dcurrencyAmount;
                                // }else {
                                //     allOrdersInfoObj.patternPayment = '￥' + listData[i].money;
                                // }

                            // }
                            break;
                        case 4:
                            allOrdersInfoObj.num = '4';
                            allOrdersInfoObj.statusTxt = '已中奖';
                            allOrdersInfoObj.differentTxt = '￥' + listData[i].lotteryList[0].winamt;
                            // if(allOrdersInfoObj.lotteryKind === 0){
                                allOrdersInfoObj.patternPayment = listData[i].dcurrencyAmount;
                            // }else {
                            //     allOrdersInfoObj.patternPayment = listData[i].channelName;
                            // }
                            break;
                        case -1:
                            allOrdersInfoObj.num = '-1';
                            allOrdersInfoObj.statusTxt = '兑换超时';
                            allOrdersInfoObj.differentTxt = '';
                            // if(allOrdersInfoObj.lotteryKind === 0){
                                allOrdersInfoObj.patternPayment = listData[i].dcurrencyAmount;
                            // }else {
                            //     allOrdersInfoObj.patternPayment = listData[i].channelName;
                            // }
                            break;
                    }
                    // if(allOrdersInfoObj.lotteryKind === 0){
                        allOrdersInfoObj.patternPayment = listData[i].dcurrencyAmount;
                    // }
                    allOrdersInfoArr.push(allOrdersInfoObj);
                }
                console.log("allOrdersInfoArr",allOrdersInfoArr);
                return allOrdersInfoArr
            }

        };
    })
    //错误弹框
    .factory('$errorPopupFactory', function ($ionicModal) {
        return {
            errorInfo: function (obj, state, target, hideBtn, showBtn, hideText, showText) {
                $ionicModal.fromTemplateUrl('templates/getOneBetModal.html', {
                    scope: obj,
                    backdropClickToClose: true
                })
                    .then(function (modal) {
                        obj.integral = modal;
                        modal.show();
                    });

                if (hideBtn) {
                    obj.hideBtn = true;
                    obj.hideText = hideText;
                }
                else {
                    obj.hideBtn = false;
                    obj.hideText = '';
                }
                if (showBtn) {
                    obj.showBtn = true;
                    obj.showText = showText;
                }
                else {
                    obj.showBtn = false;
                    obj.showText = '';
                }
                obj.cancel = function () {//取消
                    obj.integral.hide();
                }
                obj.makeSure = function () {//確定
                    obj.integral.hide();
                    state.go(target);
                }
                obj.cancelPop = function () {
                    obj.integral.hide();
                    state.go(target);
                };
            }
        };
    })

    //活动数据获取
    .factory('$getActivityData', function () {
        return {
            ActivityData: function (obj, startTime, endTime, discount) {
                (function saleNumCount() {
                       if (Date.parse(new Date(startTime)) < Date.parse(new Date()) && Date.parse(new Date()) < Date.parse(new Date(endTime))) {
                           obj.saleNum = discount;
                       } else {
                           obj.saleNum = 1;
                       }
                   })();
               }

            }
    })
