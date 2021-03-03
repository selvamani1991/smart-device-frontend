import { Injectable } from '@angular/core';


@Injectable()
export class DateService {

    constructor() {

    }

    getDateTimestamp(date) {
        var formatedDate = new Date(date.year, date.month - 1, date.day);
        return formatedDate.getTime();
    }

    getDateObject(timestamp) {
        var offset= Math.abs((new Date().getTimezoneOffset()))* 60 * 1000;
        var date = new Date(timestamp+offset);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var dateObject = { day: day, month: month, year: year, hours: hours, minutes: minutes, seconds: seconds }
        //console.log(dateObject);
        return dateObject;
    }

     getDateObjectUTC(timestamp) {
            var date = new Date(timestamp);
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            var dateObject = { day: day, month: month, year: year, hours: hours, minutes: minutes, seconds: seconds }
            //console.log(dateObject);
            return dateObject;
    }

    getCalendarDateObject(timestamp) {
        var offset= Math.abs((new Date().getTimezoneOffset()))* 60 * 1000;
        var date = new Date(timestamp+offset);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        var event = new Date(timestamp);
        var time = event.toLocaleTimeString('en-US');
        var dateObject = { day: day, month: month, year: year, time: time}
        //console.log(dateObject);
        return dateObject;
    }

    getLongFromString(stringDate) {
        var dateArray = stringDate.split('/');
        var date = { day: dateArray[0], month: dateArray[1], year: dateArray[2] }
        return this.getDateTimestamp(date);
    }

    getDateString(timestamp) {
        //console.log(timestamp);
        var dateObj = this.getDateObject(timestamp);
        var dateString = dateObj.day < 10 ? '0' + dateObj.day : dateObj.day;
        dateString = dateString + '/' + (dateObj.month < 10 ? '0' + dateObj.month : dateObj.month);
        dateString = dateString + '/' + dateObj.year;
        //console.log(dateString);
        return dateString;
    }

    getCalendarDateString(timestamp) {
        var dateObj = this.getCalendarDateObject(timestamp);
        var dateString = dateObj.day < 10 ? '0' + dateObj.day : dateObj.day;
        dateString = dateString + '/' + (dateObj.month < 10 ? '0' + dateObj.month : dateObj.month);
        dateString = dateString + '/' + dateObj.year + ' ' + 'at' + ' ' + dateObj.time;
        return dateString;
    }

    getDateTimeString(timestamp) {
        var dateObj = this.getDateObject(timestamp);
        var dateString = dateObj.day < 10 ? '0' + dateObj.day : dateObj.day;
        dateString = dateString + '/' + (dateObj.month < 10 ? '0' + dateObj.month : dateObj.month);
        dateString = dateString + '/' + dateObj.year + ' ';
        dateString = dateString + (dateObj.hours < 10 ? '0' + dateObj.hours : dateObj.hours) + ':' ;
        dateString = dateString + (dateObj.minutes < 10 ? '0' + dateObj.minutes : dateObj.minutes) + ':' ;
        dateString = dateString + (dateObj.seconds < 10 ? '0' + dateObj.seconds : dateObj.seconds);
        return dateString;
    }

     getDateTimeStringUTC(timestamp) {
            var dateObj = this.getDateObjectUTC(timestamp);
            var dateString = dateObj.day < 10 ? '0' + dateObj.day : dateObj.day;
            dateString = dateString + '/' + (dateObj.month < 10 ? '0' + dateObj.month : dateObj.month);
            dateString = dateString + '/' + dateObj.year + ' ';
            dateString = dateString + (dateObj.hours < 10 ? '0' + dateObj.hours : dateObj.hours) + ':' ;
            dateString = dateString + (dateObj.minutes < 10 ? '0' + dateObj.minutes : dateObj.minutes) + ':' ;
            dateString = dateString + (dateObj.seconds < 10 ? '0' + dateObj.seconds : dateObj.seconds);
            return dateString;
    }
}
