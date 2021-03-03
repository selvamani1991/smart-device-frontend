import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormsModule ,FormGroup,Validators } from '@angular/forms';
import { Title }     from '@angular/platform-browser';
import { AUTH_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { USER_VALIDATOR } from '../../../user/validator';
import { UserService } from '../../../user/services/user.service';
import { AlertService } from '../../../shared/services/alert.service';
import { DateService } from '../../../shared/services/date.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { AlertComponent } from '../../../shared/directives/alert/alert.component';
import { HttpResponseService } from '../../../shared/services/http-response.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'profile-edit.component.html'
})

export class EditProfileComponent implements OnInit {
    loading = false;
    currentUser = undefined;
    user:any={};
    users=[];
    userTypes: any= [];
    userObj:any=[];
    currentPage= 0;
    pageSize= 8;
    dateOfBirth:any;
    profileForm:FormGroup;
    USER_VALIDATOR=USER_VALIDATOR;
    AUTH_CONSTANTS=AUTH_CONSTANTS;
    APP_CONFIG=APP_CONFIG;
    ERROR_CODE=ERROR_CODE;
    setting = {
        entity: AUTH_CONSTANTS.LABEL.PROFILE_UPDATE,
        pageTitle: AUTH_CONSTANTS.LABEL.MY_PROFILE_LINK,
        pageDesc: AUTH_CONSTANTS.LABEL.MY_PROFILE_DESC
    };
    steps=[];
    buttonName= AUTH_CONSTANTS.LABEL.PROFILE_EDIT_LINK;
   // backUrl= AUTH_CONSTANTS.URL.PROFILE_LIST;
    alias:any={};
    formValidation= {
        duplicateErrorProfilename:false,
        duplicateErrorEmail: false
    };
    constructor(
                private route: ActivatedRoute,
                private router: Router,
                private userService: UserService,
                 private dateService: DateService,
                private alertService: AlertService,
                private _formBuilder: FormBuilder,
                private authenticationService:AuthenticationService,
                private httpResponseService: HttpResponseService,
                private breadCrumService: BreadCrumService,
                private sweetAlertService: SweetAlertService,
                private titleService: Title) {
        this.APP_CONFIG=APP_CONFIG;
        this.AUTH_CONSTANTS=AUTH_CONSTANTS;
        this.USER_VALIDATOR=USER_VALIDATOR;
        this.ERROR_CODE=ERROR_CODE;
        breadCrumService.pushStep(AUTH_CONSTANTS.LABEL.MY_PROFILE_LINK, AUTH_CONSTANTS.URL.MY_PROFILE, true);
        breadCrumService.pushStep(AUTH_CONSTANTS.LABEL.PROFILE_EDIT_LINK, AUTH_CONSTANTS.URL.EDIT_PROFILE, false);
        this.steps=breadCrumService.getSteps();
        this.titleService.setTitle( APP_CONFIG.APP_NAME+ " :: "+ this.AUTH_CONSTANTS.LABEL.MY_PROFILE_LINK);
        value => {
              this.currentUser= authenticationService.getCurrentUser();
              this.currentUser.dateOfBirthFormatted=this.dateService.getDateString(this.currentUser.dateOfBirth);
          };
        this.route.params.subscribe( params => {
            this.alias=params.alias;
            this.loadUser(this.alias);
        });
    }

    ngOnInit() {

        this.profileForm=this.createProfileForm();
        this.loadUser(this.alias);
    }

    createProfileForm(): FormGroup{
         return this.profileForm=this._formBuilder.group({
            firstName           : [this.user.firstName,[Validators.required,Validators.minLength(3)]],
            lastName            : [this.user.lastName,[Validators.required,Validators.minLength(3)]],
            gender              : [this.user.gender,[Validators.required]],
            email               : [this.user.email,[Validators.required,Validators.minLength(5)]],
            phoneNo             : [this.user.phoneNo,[Validators.required,Validators.minLength(10)]],
            designation           : [this.user.designation, [Validators.required, Validators.minLength(3)]],
            userType              : [this.user.userType, []]

         });
    }

    loadUser(alias){
        this.userService.getUser(alias)
        .subscribe(
        data => {
            this.user=data["data"][0];
            this.profileForm=this.createProfileForm();
        },
        error => {
            this.loading = false;
        }
        );
    }

    updateUser(form){
            var userObj=this.profileForm.value;
            $('body').addClass('loading');
            this.user.firstName = userObj.firstName;
            this.user.username = userObj.email;
            this.user.lastName = userObj.lastName;
            this.user.gender = userObj.gender;
            this.user.email = userObj.email;
            this.user.designation = userObj.designation;
            this.user.phoneNo = userObj.phoneNo;
            this.userService.updateUser(this.user)
            .subscribe(
            data => {
                $('body').removeClass('loading');
                if (data['hasError']) {
                    this.user = data['data'];
                    this.assignResponseError(data,form);
                } else {
                    this.sweetAlertService.updateConfirmation(this.setting.entity);
                    this.router.navigate([AUTH_CONSTANTS.URL.MY_PROFILE]);
                }
            this.loading = false;
            },
            error => {

                this.sweetAlertService.notSuccessful(error.message);
                this.router.navigate([AUTH_CONSTANTS.URL.MY_PROFILE]);
                this.loading = false;

            }
            );
    }

    assignResponseError(data,form){
         if(data.error.errorCode == ERROR_CODE.code_14){
             if(data.error.errorField == AUTH_CONSTANTS.FIELD.NAME){
                 form.form.controls[AUTH_CONSTANTS.FIELD.NAME_FIELD].setErrors({'duplicate': true});
             }

         }
    }

    loadUserTypes() {
        this.userService.getAllUserTypes(this.currentPage, this.pageSize)
        .subscribe(
        data => {
                if (!data['hasError']) {
                    this.userTypes = data['data'];
                }
                this.loading = false;
        },
            () => {
                this.loading = false;
            }
        );
    }

    list(){
        this.router.navigate([AUTH_CONSTANTS.URL.MY_PROFILE]);
    }
}