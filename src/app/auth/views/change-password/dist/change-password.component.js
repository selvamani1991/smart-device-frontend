"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ChangePasswordComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constants_1 = require("../../constants");
var validator_1 = require("../../../user/validator");
var constants_2 = require("../../../constants");
var constants_3 = require("../../../constants");
var ChangePasswordComponent = /** @class */ (function () {
    function ChangePasswordComponent(route, router, alertService, httpResponseService, breadCrumService, sweetAlertService, _formBuilder, authenticationService, userService, titleService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.alertService = alertService;
        this.httpResponseService = httpResponseService;
        this.breadCrumService = breadCrumService;
        this.sweetAlertService = sweetAlertService;
        this._formBuilder = _formBuilder;
        this.authenticationService = authenticationService;
        this.userService = userService;
        this.titleService = titleService;
        this.loading = false;
        this.currentUser = undefined;
        this.user = {};
        this.alias = {};
        this.userType = {};
        this.passwordUser = {};
        this.AUTH_CONSTANTS = constants_1.AUTH_CONSTANTS;
        this.USER_TYPES = constants_2.USER_TYPES;
        this.APP_CONFIG = constants_2.APP_CONFIG;
        this.ERROR_CODE = constants_3.ERROR_CODE;
        this.SUCCESS_CODE = constants_3.SUCCESS_CODE;
        this.USER_VALIDATOR = validator_1.USER_VALIDATOR;
        this.setting = {
            entity: constants_1.AUTH_CONSTANTS.LABEL.USER,
            pageTitle: constants_1.AUTH_CONSTANTS.LABEL.USER_CHANGE_PASSWORD,
            pageDesc: constants_1.AUTH_CONSTANTS.LABEL.USER_CHANGE_PASSWORD_DESC
        };
        this.steps = [];
        this.buttonName = constants_1.AUTH_CONSTANTS.LABEL.USER_ACTION_CREATE;
        this.backUrl = constants_1.AUTH_CONSTANTS.URL.DASHBOARD;
        this.formValidation = {
            duplicateErrorName: false,
            duplicateErrorEmail: false
        };
        this.APP_CONFIG = constants_2.APP_CONFIG;
        this.AUTH_CONSTANTS = constants_1.AUTH_CONSTANTS;
        this.USER_TYPES = constants_2.USER_TYPES;
        this.ERROR_CODE = constants_3.ERROR_CODE;
        this.SUCCESS_CODE = constants_3.SUCCESS_CODE;
        this.USER_VALIDATOR = validator_1.USER_VALIDATOR;
        breadCrumService.pushStep(constants_1.AUTH_CONSTANTS.LABEL.USER_LIST_LINK, constants_1.AUTH_CONSTANTS.URL.DASHBOARD, false);
        breadCrumService.pushStep(constants_1.AUTH_CONSTANTS.LABEL.USER_CHANGE_PASSWORD_LINK, constants_1.AUTH_CONSTANTS.URL.CHANGE_PASSWORD, true);
        this.steps = breadCrumService.getSteps();
        this.titleService.setTitle(constants_2.APP_CONFIG.APP_NAME + constants_2.APP_CONSTANTS.OTHER.DOUBLECOLON + this.AUTH_CONSTANTS.LABEL.USER);
        this.route.params.subscribe(function (params) {
            _this.alias = params.alias;
            _this.loadUser(_this.alias);
        });
        this.authenticationService.sessionChange$.subscribe(function (value) {
            _this.currentUser = authenticationService.getCurrentUser();
        });
    }
    ChangePasswordComponent.prototype.ngOnInit = function () {
        this.userForm = this.createUserForm();
        this.passwordUser = {};
    };
    ChangePasswordComponent.prototype.createUserForm = function () {
        return this.userForm = this._formBuilder.group({
            id: [this.user.id ? this.user.id : '', []],
            password: ['', [forms_1.Validators.required, forms_1.Validators.minLength(3)]],
            confirmPassword: ['', [forms_1.Validators.required, forms_1.Validators.minLength(3)]]
        });
    };
    ChangePasswordComponent.prototype.updateUser = function () {
        var _this = this;
        var userObj = this.userForm.value;
        userObj.username = this.user.username;
        this.authenticationService.updatePassword(this.user.alias, userObj)
            .subscribe(function (data) {
            if (data['hasError']) {
                _this.sweetAlertService.notSuccessful(data['error'].errorMessage);
            }
            else {
                _this.sweetAlertService.updateConfirmation(_this.setting.entity);
                _this.router.navigate([constants_1.AUTH_CONSTANTS.URL.DASHBOARD]);
                _this.passwordUser = {};
            }
            _this.loading = false;
        }, function (error) {
            _this.sweetAlertService.notSuccessful(error.message);
            _this.router.navigate([constants_1.AUTH_CONSTANTS.URL.DASHBOARD]);
            _this.loading = false;
        });
    };
    ChangePasswordComponent.prototype.validateForm = function () {
        var valid = true;
        if (this.userForm.get(constants_1.AUTH_CONSTANTS.FIELD.PASSWORD).value === this.userForm.get(constants_1.AUTH_CONSTANTS.FIELD.CONFIRM_PASSWORD).value) {
            this.userForm.get(constants_1.AUTH_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors(null);
        }
        else {
            this.userForm.get(constants_1.AUTH_CONSTANTS.FIELD.CONFIRM_PASSWORD).setErrors({ match: true });
            valid = false;
        }
        return valid;
    };
    ChangePasswordComponent.prototype.submitForm = function (user, form) {
        this.updateUser();
    };
    ChangePasswordComponent.prototype.list = function (user) {
        this.router.navigate([constants_1.AUTH_CONSTANTS.URL.DASHBOARD]);
    };
    ChangePasswordComponent.prototype.loadUser = function (alias) {
        var _this = this;
        this.userService.getUser(alias)
            .subscribe(function (data) {
            _this.user = data["data"][0];
            _this.userForm = _this.createUserForm();
        }, function (error) {
            _this.sweetAlertService.notSuccessful(error.message);
            _this.router.navigate([constants_1.AUTH_CONSTANTS.URL.DASHBOARD]);
            _this.loading = false;
        });
    };
    ChangePasswordComponent = __decorate([
        core_1.Component({
            moduleId: module.id.toString(),
            templateUrl: 'change-password.component.html'
        })
    ], ChangePasswordComponent);
    return ChangePasswordComponent;
}());
exports.ChangePasswordComponent = ChangePasswordComponent;
