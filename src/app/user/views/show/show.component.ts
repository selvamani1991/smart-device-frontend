import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { USER_CONSTANTS } from '../../constants';
import { APP_CONFIG } from '../../../constants';
import { ERROR_CODE } from '../../../constants';
import { SUCCESS_CODE } from '../../../constants';
import { UserService} from '../../services/user.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { AlertService } from '../../../shared/services/alert.service';
import { BreadCrumService } from '../../../shared/services/bread-crum.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';

@Component({
  moduleId: module.id.toString(),
  templateUrl: 'show.component.html'
})

export class ShowComponent implements OnInit {
      loading = false;
      formatError= false;
      user: any= {};
      users= [];
      files: any= [];
      currentUser= {};
      USER_CONSTANTS= USER_CONSTANTS;
      APP_CONFIG= APP_CONFIG;
      ERROR_CODE= ERROR_CODE;
      SUCCESS_CODE= SUCCESS_CODE;
      setting = {
            entity: USER_CONSTANTS.LABEL.USER_IMAGE,
            pageTitle: USER_CONSTANTS.LABEL.USER_SHOW,
            pageDesc: USER_CONSTANTS.LABEL.USER_SHOW_DESC
      };
      steps= [];
      backUrl= USER_CONSTANTS.URL.USER_LIST;
      alias: any= {};
      constructor(
                  private route: ActivatedRoute,
                  private router: Router,
                  private alertService: AlertService,
                  private userService: UserService,
                  breadCrumService: BreadCrumService,
                  private sweetAlertService: SweetAlertService,
                  authenticationService: AuthenticationService,
                  private titleService: Title) {
            this.APP_CONFIG = APP_CONFIG;
            this.USER_CONSTANTS = USER_CONSTANTS;
            this.ERROR_CODE = ERROR_CODE;
            this.SUCCESS_CODE = SUCCESS_CODE;
            breadCrumService.pushStep(USER_CONSTANTS.LABEL.USER_LIST_LINK, USER_CONSTANTS.URL.USER_LIST, true);
            breadCrumService.pushStep(USER_CONSTANTS.LABEL.USER_SHOW_LINK, USER_CONSTANTS.URL.USER_SHOW, false);
            this.steps = breadCrumService.getSteps();
            this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.USER_CONSTANTS.LABEL.USER);
            this.route.params.subscribe( params => {
                this.alias = params.alias;
                this.loadUser(this.alias);
            });
            this.currentUser = authenticationService.getCurrentUser();
      }

      ngOnInit() {
      }

      loadUser(alias) {
           $('body').addClass('loading');
           this.userService.getUser(alias)
           .subscribe(
           data => {
               $('body').removeClass('loading');
               this.user = data['data'][0];
           },
           error => {
               $('body').removeClass('loading');
               this.sweetAlertService.notSuccessful(error.message);
               this.router.navigate([USER_CONSTANTS.URL.USER_LIST]);
               this.loading = false;
           });
      }

      processFile() {
          this.userService.uploadImage(this.files, this.user.id)
          .subscribe(
          data => {
              this.user = data['data'][0];
              this.sweetAlertService.uploadSuccessfully(this.setting.entity);
          },
          error => {
              $('body').removeClass('loading');
              this.assignResponseError(error);
           });
      }

      assignResponseError(error){
          if (error.error.error.errorCode == ERROR_CODE.code_25) {
                this.sweetAlertService.notSuccessful(error.error.error.errorMessage);
          }

      }

      onFileChange(event) {
          this.files = event.target.files[0];
          var pattern = /image-*/;
          if (!this.files.type.match(pattern)) {
              this.formatError = true;
              return;
          }else {
              this.formatError = false;
          }
          this.processFile();
      }

      markDeleted(user) {
          this.sweetAlertService.deleteCheck(this, user);
      }

      remove(user) {
          user.avatar=null;
          delete user.dateOfBirth;
          this.userService.deleteProfilePicture(user)
          .subscribe(
          data => {
              if (!data['hasError']) {
                 this.sweetAlertService.deleteImage(this.setting.entity);
              }
          },
          error => {
             this.alertService.error(error.message);
             this.loading = false;
          });
      }

}
