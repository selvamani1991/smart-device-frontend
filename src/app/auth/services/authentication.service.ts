import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { APP_CONFIG } from '../../constants';
import { AUTH_CONSTANTS } from '../constants';
import { UserFeatureService } from './user-features.service';
import { HttpClientService } from '../../shared/services/http-client.service';



@Injectable()
export class AuthenticationService {
    CONFIG= APP_CONFIG;
    AUTH_CONSTANTS= AUTH_CONSTANTS;
    sessionChange$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    currentUser= undefined;
    companyUser= {}
    featureCategories: any= {};
    features= [];
    constructor(private httpClientService: HttpClientService, private userFeatureService: UserFeatureService ) {
        this.CONFIG = APP_CONFIG;
        this.AUTH_CONSTANTS = AUTH_CONSTANTS;
        if (this.getCurrentUser()){
            this.sessionChange$.next(JSON.stringify(this.currentUser));
        }
    }

    register(registerUser){
        const registerUserCopy = JSON.parse(JSON.stringify(registerUser));
        delete registerUserCopy.confirmPassword;
        delete registerUserCopy.agree;
        return this.httpClientService.postRequest(this.AUTH_CONSTANTS.API.REGISTER, registerUserCopy);
    }

    forgot(forgotUser) {
        return this.httpClientService.postRequest(this.AUTH_CONSTANTS.API.FORGOT, forgotUser);
    }

    resetPassword(registerUser) {
        return this.httpClientService.postRequest(this.AUTH_CONSTANTS.API.RESET, registerUser);
    }

    login(username: string, password: string) {
        return this.httpClientService.postRequest(this.AUTH_CONSTANTS.API.AUTHENTICATE, { username: username, password: password });
    }

    forgotPasswordConfirmation(userObj) {
        return this.httpClientService.postRequest(this.AUTH_CONSTANTS.API.RESET, userObj);
    }

    logout() {
        return this.httpClientService.postRequest(this.AUTH_CONSTANTS.API.LOGOUT, {});
    }

    setCurrentUser(user){
        this.currentUser = user;
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.setFeatureCategories(this.currentUser.id);
        this.setFeatures(this.currentUser.id);
        this.sessionChange$.next(JSON.stringify(this.currentUser));
    }


    setCurrentUserNull(){
        this.currentUser = undefined;
        this.featureCategories = [];
        this.features = [];
        localStorage.removeItem('featureCategories');
        localStorage.removeItem('features');
        this.sessionChange$.next(undefined);
    }

    getCurrentUser(){
        if (this.currentUser){
            return this.currentUser;
        }else if (Boolean(localStorage.getItem('currentUser'))){
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
            return this.currentUser;
        }
        return undefined;
    }

    setFeatureCategories(userId){
        this.userFeatureService.loadDashboard(userId)
            .subscribe(
            data => {
                localStorage.setItem('featureCategories', JSON.stringify(data["data"][0]));
                this.sessionChange$.next(JSON.stringify(this.currentUser));
            },
            error => {
                //this.alertService.error(error.message);
            });
    }

    getFeatureCategories(){
        if (Boolean(localStorage.getItem('featureCategories'))){
            this.featureCategories = JSON.parse(localStorage.getItem('featureCategories'));
            return this.featureCategories;
        }
        return [];
    }

    getCompanyUser(){
        if (Boolean(localStorage.getItem('featureCategories'))){
            this.featureCategories = JSON.parse(localStorage.getItem('featureCategories'));
            return this.featureCategories.companyUser;
        }
    }

    setFeatures(userId){
        this.userFeatureService.loadFeatures(userId)
            .subscribe(
            data => {
                localStorage.setItem('features', JSON.stringify(data["data"]));
                this.sessionChange$.next(JSON.stringify(this.currentUser));
            },
            error => {
                //this.alertService.error(error.message);
            });
    }

    getFeatures(){
        if (Boolean(localStorage.getItem('features'))){
            this.features = JSON.parse(localStorage.getItem('features'));
            return this.features;
        }
        return [];
    }

    updatePassword(alias, user){
        return this.httpClientService.postRequest(this.AUTH_CONSTANTS.API.CHANGE_PASSWORD_ALIAS.replace(':alias', alias), user);
    }

    getAllSubscriptions(page, pageSize, query){
        var data = "?page=" + page + "&pageSize=" + pageSize + "&query=" + query;
        return this.httpClientService.getRequest(this.AUTH_CONSTANTS.API.SUBSCRIPTION + data, {});
    }


}
