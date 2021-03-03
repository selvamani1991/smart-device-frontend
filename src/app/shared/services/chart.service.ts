import { Injectable } from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';



@Injectable()
export class ChartService {
  constructor() {
  }

  getPieChart(health) {
                     // Create chart instance
                     var chart = am4core.create(health, am4charts.PieChart);

                     // Add data
                     chart.data = [ {
                     'country': 'Lithuania',
                     'litres': 501.9
                     }, {
                     'country': 'Czechia',
                     'litres': 301.9
                     }, {
                     'country': 'Ireland',
                     'litres': 201.1
                     }, {
                     'country': 'Germany',
                     'litres': 165.8
                     }, {
                     'country': 'Australia',
                     'litres': 139.9
                     }, {
                     'country': 'Austria',
                     'litres': 128.3
                     }, {
                     'country': 'UK',
                     'litres': 99
                     }
                     ];

                     // Add and configure Series
                     var pieSeries = chart.series.push(new am4charts.PieSeries());
                     pieSeries.dataFields.value = 'litres';
                     pieSeries.dataFields.category = 'country';
                     pieSeries.slices.template.stroke = am4core.color('#fff');
                     pieSeries.slices.template.strokeOpacity = 1;

                     // This creates initial animation
                     pieSeries.hiddenState.properties.opacity = 1;
                     pieSeries.hiddenState.properties.endAngle = -90;
                     pieSeries.hiddenState.properties.startAngle = -90;

                     chart.hiddenState.properties.radius = am4core.percent(0);
             }

}
