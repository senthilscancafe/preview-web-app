/*global define, console*/

define(['Augment',
    'Instance',
    'Path',
    'GlobalData',
    'views/index/MainView',
    'views/deeplink/DeepLink',
    'views/signin/SignInView',
    'views/signin/MobileSignUpView',
    'views/signin/EmailSignUpView',
    'views/signin/AccountSignUpView',
    'views/signin/PersonalizedAccountSignUpView',
    'views/signin/PersonalizedAccountLoginView',
    'views/signin/ForgotPasswordView',
    'views/signin/ChangePasswordView',
    'views/profile/ProfileView',
    'views/help/Help',
    'views/termofservices/TermOfServices',
    'views/termofservices/Privacy',
    'views/uploader/UploaderView',
    'views/install/InstallView',
    'views/print/PrintView',
    'views/print/PrintBooksView',
    'views/print/PrintPagesView',
    'views/print/PrintShippingView',
    'views/print/PrintShippingAddressView',
    'views/print/PrintBillingView',
    'views/print/PrintBillingAddressView',
    'views/print/PrintDeliveryOptionView',
    'views/print/PrintCardView',
    'views/print/PrintCardAddView',
    'views/print/PrintOrderView',
    'views/print/PrintOrderDetailsView',
    'views/print/PrintOrderSummaryView',
    'views/print/PrintOrderDiscountView',
    'views/print/PrintOrderFinishView',
    'views/print/PrintOrderFeedbackView',
    'hbs/underscore',
    'lockr',
], function (augment, instance, Path, GlobalData, MainView, DeepLink, SignInView, MobileSignInView, EmailSignInView, AccountSignUpView, PersonalizedAccountSignUpView, PersonalizedAccountLoginView, ForgotPasswordView, ChangePasswordView, ProfileView, Help, TermOfServices, Privacy, UploaderView, InstallView, PrintView, PrintBooksView, PrintPagesView, PrintShippingView, PrintShippingAddressView, PrintBillingView, PrintBillingAddressView, PrintDeliveryOptionView, PrintCardView, PrintCardAddView, PrintOrderView, PrintOrderDetailsView, PrintOrderSummaryView,PrintOrderDiscountView,PrintOrderFinishView, PrintOrderFeedbackView, _, Lockr) {
    'use strict';

    var Router = augment(instance, function () {


            this.mapRoutes = function () {
                this.mapIndex();
                this.mapLogin();
                this.mapDeepLink();
                this.mapEmailSignUp();
                this.mapMobileSignUp();
                this.mapAccountSignUp();
                this.mapPersonalizedAccountSignUpView();
                this.mapPersonalizedAccountLoginView();
                this.mapProfileView();
                this.mapForgotPasswordView();
                this.mapChangePasswordView();
                this.mapHelp();
                this.mapTermOfServices();
                this.mapPrivacy();
                this.mapUploader();
                this.mapInstall();
                this.mapPrintBooks();
                this.mapPrintPages();
                this.mapPrintShipping();
                this.mapPrintShippingAddress();
                this.mapPrintBilling();
                this.mapPrintBillingAddress();
                this.mapPrintDeliveryOption();
                this.mapPrintCard();
                this.mapPrintCardAdd();
                this.mapPrintOrder();
                this.mapPrintOrderDetails();
                this.mapPrintOrderSummary();
                this.mapPrintOrderDiscount();
                this.mapPrintOrderFinish();
                this.mapPrintOrderFeedback();
                Path.rescue(function () {
                    console.log("404: Route Not Found");
                });
                Path.root("#/login");
                Path.listen();
            };

            this.mapIndex = function () {
                Path.map("#/dashboard").to(function () {
                    GlobalData.ec.recordPageEvent("dashboard");
                    var mainView = MainView.create();
                    mainView.addToDiv();
                    //                 jQuery('.layout-fixed-header .main-content, .main-panel').css("background","#fff");
                });
            };
            this.mapUploader = function () {
                Path.map("#/uploader").to(function () {
                    GlobalData.ec.recordPageEvent("uploader");
                    var uploaderView = UploaderView.create();
                    uploaderView.addToDiv();
                    //                 jQuery('.layout-fixed-header .main-content, .main-panel').css("background","#fff");
                });
            };
            this.mapPrintBooks = function () {
                Path.map("#/print/books").to(function () {
                    GlobalData.ec.recordPageEvent("Print_Book_Size_Screen");
                    var printView = PrintView.create();
                    printView.addToDiv();
                    var printBooksView = PrintBooksView.create();
                    printBooksView.addToDiv();
                });
            };
            this.mapPrintPages = function () {
                Path.map("#/print/pages").to(function () {
                    GlobalData.ec.recordPageEvent("Print_Page_Selection_Screen");
                    var printView = PrintView.create();
                    printView.addToDiv();
                    var printPagesView = PrintPagesView.create();
                    printPagesView.addToDiv();
                });
            };
            this.mapPrintShipping = function () {
                Path.map("#/print/shipping").to(function () {
                    GlobalData.ec.recordPageEvent("Print_Shipping_Address_List_Screen");
                    var printView = PrintView.create();
                    printView.addToDiv();
                    var printShippingView = PrintShippingView.create();
                    printShippingView.addToDiv();
                });
            };
            this.mapPrintDeliveryOption = function () {
                Path.map("#/print/deliveryoption").to(function () {
                    GlobalData.ec.recordPageEvent("Print_Delivery_Options_Screen");
                    var printView = PrintView.create();
                    printView.addToDiv();
                    var printDeliveryOptionView = PrintDeliveryOptionView.create();
                    printDeliveryOptionView.addToDiv();
                });
            };
            this.mapPrintCard = function () {
                Path.map("#/print/card").to(function () {
                    GlobalData.ec.recordPageEvent("Print_Card_List_Screen");
                    var printView = PrintView.create();
                    printView.addToDiv();
                    var printCardView = PrintCardView.create();
                    printCardView.addToDiv();
                });
            };

            this.mapPrintCardAdd = function () {
                Path.map("#/print/card/add").to(function () {
                    GlobalData.ec.recordPageEvent("Print_Card_Add_Screen");
                    var printView = PrintView.create();
                    printView.addToDiv();
                    var printCardAddView = PrintCardAddView.create();
                    printCardAddView.addToDiv();
                });
            };

            this.mapPrintShippingAddress = function () {
                Path.map("#/print/shipping/address").to(function () {
                    /*if (_.isUndefined(GlobalData.printData)) {
                        GlobalData.printData = Lockr.get('printData');
                        if (_.isUndefined(GlobalData.printData)) {
                            console.log('TODO: need to handle');
                        }
                    }*/

                    if (_.isUndefined(GlobalData.printData)) {
                        if(_.isUndefined(Lockr.get('printData'))){
                            console.log('router area');
                            if(!_.isUndefined(Lockr.get('printDataBKP'))){
                                Lockr.set('printData', Lockr.get('printDataBKP'));
                                Lockr.set('storyData', Lockr.get('storyDataBKP'));
                                Lockr.rm('storyDataBKP');
                                Lockr.rm('printDataBKP');
                            }else{
                                console.log('TODO: router area need to handle');
                            }
                        }
                        GlobalData.printData = Lockr.get('printData');
                        GlobalData.storyData = Lockr.get('storyData');
                    }

                    if (GlobalData.printData.action === 'edit') {
                        GlobalData.ec.recordPageEvent("Print_Shipping_Address_Edit_Screen");
                    }else{
                        GlobalData.ec.recordPageEvent("Print_Shipping_Address_Add_Screen");
                    }

                    var printView = PrintView.create();
                    printView.addToDiv();
                    var printShippingAddressView = PrintShippingAddressView.create();
                    printShippingAddressView.addToDiv();
                });
            };
            this.mapPrintBilling = function () {
                //This route can be deleted, no need of this under print flow
                Path.map("#/print/billing").to(function () {
                    GlobalData.ec.recordPageEvent("print Billing select");
                    var printView = PrintView.create();
                    printView.addToDiv();
                    var printBillingView = PrintBillingView.create();
                    printBillingView.addToDiv();
                });
            };
            this.mapPrintBillingAddress = function () {
                Path.map("#/print/billing/address").to(function () {
                    /*if (_.isUndefined(GlobalData.printData)) {
                        GlobalData.printData = Lockr.get('printData');
                        if (_.isUndefined(GlobalData.printData)) {
                            console.log('TODO: need to handle');
                        }
                    }*/

                    if (_.isUndefined(GlobalData.printData)) {
                        if(_.isUndefined(Lockr.get('printData'))){
                            console.log('router area');
                            if(!_.isUndefined(Lockr.get('printDataBKP'))){
                                Lockr.set('printData', Lockr.get('printDataBKP'));
                                Lockr.set('storyData', Lockr.get('storyDataBKP'));
                                Lockr.rm('storyDataBKP');
                                Lockr.rm('printDataBKP');
                            }else{
                                console.log('TODO: router area need to handle');
                            }
                        }
                        GlobalData.printData = Lockr.get('printData');
                        GlobalData.storyData = Lockr.get('storyData');
                    }

                    if(GlobalData.printData.action === 'edit'){
                        GlobalData.ec.recordPageEvent("Print_Billing_Address_Edit_Screen");
                    }else{
                        GlobalData.ec.recordPageEvent("Print_Billing_Address_Add_Screen");
                    }

                    var printView = PrintView.create();
                    printView.addToDiv();
                    var printBillingAddressView = PrintBillingAddressView.create();
                    printBillingAddressView.addToDiv();
                });
            };
            this.mapPrintOrder = function () {
                Path.map("#/print/order").to(function () {
                    GlobalData.ec.recordPageEvent("Print_My_Orders_Screen");
                    var printView = PrintView.create();
                    printView.addToDiv();
                    var printOrderView = PrintOrderView.create();
                    printOrderView.addToDiv();
                });
            };
            this.mapPrintOrderDetails = function () {
                Path.map("#/print/order/details").to(function () {
                    GlobalData.ec.recordPageEvent("Print_Order_Details_Screen");
                    var printView = PrintView.create();
                    printView.addToDiv();
                    var printOrderDetailsView = PrintOrderDetailsView.create();
                    printOrderDetailsView.addToDiv();
                });
            };
            this.mapPrintOrderSummary = function () {
                Path.map("#/print/order/summary").to(function () {
                    GlobalData.ec.recordPageEvent("Print_Summary_Screen");
                    var printView = PrintView.create();
                    printView.addToDiv();
                    var printOrderSummaryView = PrintOrderSummaryView.create();
                    printOrderSummaryView.addToDiv();
                });
            };
            this.mapPrintOrderDiscount = function () {
                Path.map("#/print/order/discount").to(function () {
                    GlobalData.ec.recordPageEvent("Print_Discount_Screen");
                    var printView = PrintView.create();
                    printView.addToDiv();
                    var printOrderDiscountView = PrintOrderDiscountView.create();
                    printOrderDiscountView.addToDiv();
                });
            };
            this.mapPrintOrderFinish = function () {
                Path.map("#/print/order/finish").to(function () {
                    GlobalData.ec.recordPageEvent("Print_Thank_You_Screen");
                    var printView = PrintView.create();
                    printView.addToDiv();
                    var printOrderFinishView = PrintOrderFinishView.create();
                    printOrderFinishView.addToDiv();
                });
            };
            this.mapPrintOrderFeedback = function () {
                Path.map("#/print/order/feedback").to(function () {
                    GlobalData.ec.recordPageEvent("Print_Feedback_Screen");
                    var printView = PrintView.create();
                    printView.addToDiv();
                    var printOrderFeedbackView = PrintOrderFeedbackView.create();
                    printOrderFeedbackView.addToDiv();
                });
            };
            this.mapDeepLink = function () {
                if (location.href.indexOf("?_branch_match_id") !== -1 || document.URL.indexOf("?_branch_match_id") !== -1) {
                    DeepLink.create();
                }
                //            Path.map("#/deeplink").to(function () {
                //                console.log("deeplink path is called");
                //                
                //            });
            };
            this.mapHelp = function () {
                Path.map("#/help").to(function () {
                    GlobalData.ec.recordPageEvent("help");
                    var helpView = Help.create();
                    helpView.addToDiv();
                });
            };
            this.mapLogin = function () {
                Path.map("#/login").to(function () {
                    GlobalData.ec.recordPageEvent("login");
                    var signInView = SignInView.create();
                    signInView.addToDiv();
                });
            };
            this.mapInstall = function () {
                Path.map("#/install").to(function () {
                    GlobalData.ec.recordPageEvent("installAppPage");
                    var installView = InstallView.create();
                    installView.addToDiv();
                });
            };
            this.mapMobileSignUp = function () {
                Path.map("#/mobilesignup").to(function () {
                    var mobileSignInView = MobileSignInView.create();
                    mobileSignInView.addToDiv();
                });
            };
            this.mapEmailSignUp = function () {
                Path.map("#/emailsignup").to(function () {
                    var emailSignInView = EmailSignInView.create();
                    emailSignInView.addToDiv();
                });
            };

            this.mapAccountSignUp = function () {
                Path.map("#/accountsignup").to(function () {
                    GlobalData.ec.recordPageEvent("accountsignup");
                    var accountSignUpView = AccountSignUpView.create();
                    accountSignUpView.addToDiv();
                });
            };


            this.mapPersonalizedAccountSignUpView = function () {
                Path.map("#/personalizedaccountsignup").to(function () {
                    //GlobalData.ec.recordPageEvent("personalizedaccountsignup");
                    var personalizedAccountSignUpView = PersonalizedAccountSignUpView.create();
                    personalizedAccountSignUpView.addToDiv();
                });
            };
            this.mapPersonalizedAccountLoginView = function () {
                Path.map("#/personalizedaccountlogin").to(function () {
                    var personalizedAccountLoginView = PersonalizedAccountLoginView.create();
                    personalizedAccountLoginView.addToDiv();
                });
            };

            this.mapProfileView = function () {
                Path.map("#/profile").to(function () {
                    GlobalData.ec.recordPageEvent("profile");
                    var profileView = ProfileView.create();
                    profileView.addToDiv();
                    //                jQuery('.layout-fixed-header .main-content, .main-panel').css("background","#efeff4");
                });
            };
            this.mapForgotPasswordView = function () {
                Path.map("#/forgotpassword").to(function () {
                    GlobalData.ec.recordPageEvent("forgotpassword");
                    var forgotPasswordView = ForgotPasswordView.create();
                    forgotPasswordView.addToDiv();
                });
            };
            this.mapChangePasswordView = function () {
                Path.map("#/changepassword/:token").to(function () {
                    var tokenURL = {
                        'token': this.params.token
                    };
                    var changePasswordView = ChangePasswordView.create(tokenURL);
                    changePasswordView.addToDiv();
                });

            };
            this.mapTermOfServices = function () {
                Path.map("#/termofservices").to(function () {
                    var termOfServices = TermOfServices.create();
                    termOfServices.addToDiv();
                });
            };
            this.mapPrivacy = function () {
                Path.map("#/policy").to(function () {
                    var privacy = Privacy.create();
                    privacy.addToDiv();
                });
            };
        }),
        router = Router.create();

    return router;
});