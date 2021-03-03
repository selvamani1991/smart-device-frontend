import { Component, Input, OnInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { ProductTypeService } from '../../product-type/services/product-type.service';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { MenuService } from '../../shared/services/menu.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarComponent implements OnInit {
    @Input() featureCategories: any;
    @Input() features: any;
    newUrl;
    feature:any= [];
    @Input() client:any={};
    currentUser=undefined;
    loading=false;
    size= 'sm';
    initialized= false;
    constructor(private router: Router,
            private navRef : ElementRef,
            private productTypeService: ProductTypeService,
            private menuService: MenuService,
            private authenticationService: AuthenticationService,
            private translate: TranslateService) {
        var self = this;
        self.router.events.forEach((event: NavigationEvent) => {
            // Before Navigation
            if (event instanceof NavigationStart) {
            }
            // After Navigation
            if (event instanceof NavigationEnd) {
                this.newUrl = event.url;
            }
        });
        this.authenticationService.sessionChange$.subscribe(
            () => {
                this.currentUser = authenticationService.getCurrentUser();
            }
        );


    }
    ngAfterViewInit() {
        if (!this.initialized) {
            this.initialize();
        }
    }
    ngOnInit() {
        if (!this.initialized) {
            this.initialize();
        }
        if (!this.initialized) {
            this.initialize();
        }
    }

    ngOnChanges(changes: any) {
        var self = this;
        setTimeout(function(){
            if (!self.initialized) {
                self.initialize();
            }
        }, 200);

    }

    initialize() {
        var self = this;
        var menuTitle;
        var wrap = $('.app-aside');
        var space = 0;
        var ul: any = '';
        var $win = $(window);
        $(self.navRef.nativeElement).find('a').on('click', function(e){
            if ($(this).next().is('ul') && $(this).parent().toggleClass('in')) {
                $(this).parent().toggleClass('active');
                $(this).parent().siblings().children('.collapse').slideUp(200, function () {
                    $(this).parent().removeClass('open');
                    $(this).parent().removeClass('active');
                });

                $(this).next().slideToggle(200, function () {
                    // window.trigger('resize');
                });
                e.stopPropagation();
                e.preventDefault();
            }
        });
        $(self.navRef.nativeElement).find('li').on('mouseover', function(e){
            $(this).addClass('hover');
            menuTitle = $(this).find('.item-inner').clone();
            if ($(this).parent().hasClass('active')) {
                menuTitle.addClass('active');
            }

        });

        $(self.navRef.nativeElement).find('li a').on('mouseover', function(e){

            if (self.isSidebarClosed()) {
                menuTitle = $(this).find('.item-inner').clone();
                if (!$(this).closest('ul').hasClass('collapse')) {
                    wrap.trigger('mouseleave');
                }
                if ($(this).parent().hasClass('active')) {
                    menuTitle.addClass('active');
                }
                var offset = $('#sidebar > .sidebar-container > div').position().top + $('.nav-user-wrapper').outerHeight() + $('header').outerHeight();
                var itemTop = $(this).parent().position().top + offset + space;
                menuTitle.css({
                    position: 'absolute',
                    height: $(this).parent().outerHeight(),
                    top: itemTop,
                    borderBottomRightRadius: '10px',
                    lineHeight: $(this).parent().outerHeight() + 'px',
                    padding: 0
                }).appendTo(wrap);
                if ($(this).next().is('ul')) {
                    ul = $(this).next().clone(true);
                    menuTitle.css({
                        borderBottomRightRadius: 0
                    });
                    ul.appendTo(wrap).css({
                        top: itemTop + $(this).parent().outerHeight(),
                        position: 'absolute',
                    });
                    if ($(this).parent().position().top + $(this).outerHeight() + offset + ul.height() > $win.height()) {
                        ul.css('bottom', 0);
                    } else {
                        ul.css('bottom', 'auto');
                    }

                    wrap.find('.sidebar-container').scroll(function () {
                        wrap.trigger('mouseleave');
                    });

                    setTimeout(function () {
                        if (!wrap.is(':empty')) {
                            $(document).on('click tap', function(){
                                wrap.trigger('mouseleave');
                            });
                        }
                    }, 300);
                } else {
                    ul = '';
                    return;
                }
            }

        });

        wrap.on('mouseleave', function (e) {
            $('.hover', wrap).removeClass('hover');
            $('> .item-inner', wrap).remove();
            $('> ul', wrap).remove();
        });

        $(self.navRef.nativeElement).find('li').on('mouseout', function(e){
            $(this).removeClass('hover');
        });
        $(self.navRef.nativeElement).find('a').each(function (index, value){
            self.initialized = true;
            var link = $(this).attr('href');
            if (link === self.newUrl) {
                $(this).parent().addClass('active');
                if ($(this).closest('ul').hasClass('collapse')) {
                    var menu = $(this).closest('ul');
                    menu.parent().addClass('active').addClass('open');
                    menu.slideDown(200).parent().siblings().children('.collapse').slideUp(200, function () {
                        $(this).parent().removeClass('open');
                    });
                } else {
                    $('.collapse').slideUp(200, function () {
                        $(this).parent().removeClass('open');
                    });
                }

            }
        });
    }

    isSidebarClosed() {
        return $('.app-sidebar-closed').length;
    }

    validateUrl(name) {

        var url = this.router.url;
         //console.log(url)
        var urlToken= url.split("/");
         //console.log(urlToken[1])
        var test = url.indexOf(name) >= 0 || url.startsWith(name) || name.includes(urlToken[1]);
        return test;
    }
    validateSameUrl(name) {
        var url = this.router.url;
        var test = url == name;
        return test;
    }

    loadClient() {
        this.productTypeService.getClient(this.currentUser.ownerId)
        .subscribe(
        data => {
            this.client = data['data'][0];
        },
        () => {
          this.loading = false;
        });
    }
    replaceText(text){
        if(this.currentUser.userType!='SuperAdmin'){
            text= text.replace('ProductType', this.client.productTypeNickName?this.client.productTypeNickName:'ProductType');
            text= text.replace('Product', this.client.productNickName?this.client.productNickName:'Product');
            text= text.replace('Building', this.client.companyBuildingNickName?this.client.companyBuildingNickName:'CompanyBuilding');
            text= text.replace('Distributor', this.client.distributorNickName?this.client.distributorNickName:'Distributor');
            text= text.replace('Vendor', this.client.vendorNickName?this.client.vendorNickName:'Vendor');
            text= text.replace('Company', this.client.companyNickName?this.client.companyNickName:'Company');
            return text;
        }

    }

}
