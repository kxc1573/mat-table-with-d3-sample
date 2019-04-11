import * as d3 from 'd3';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { element } from 'protractor';
import { PostService } from '../post.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class TableComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;

  courses = ['Chinese', 'Math', 'English'];
  parentData: any[] = [];
  childData: any[] = [];
  scores: Object = {};
  dataSource: any[] = [];
  dataHeader: any[] = [];
  headers: string[] = ['expand', 'name'];

  constructor(private post: PostService) {

    for (let i = 1; i < 13; i++) {
        this.dataHeader.push(i + "月");
    }
    this.headers.push(...this.dataHeader);
    console.log(this.headers);

    post.readData()
    .subscribe( resp => {
        console.log(resp);
        console.log(typeof(resp));
        let res = JSON.parse(JSON.stringify(resp));         // fix "Type 'Object' is not an array type or a string type."

        let position = 0;
        for (let r of res) {
            position += 1;
            let parentRow = {'expand': false, 'name': r['name'], 'position': position};
            for (let j = 0; j < this.dataHeader.length; j++) {
                parentRow[this.dataHeader[j]] = r['scores'][j]['total'];
            }
            this.parentData.push(parentRow);

            for (let c of this.courses) {
                position += 1;
                let childRow = {'parent': r['name'], 'expand': false, 'name': c, 'position': position};
                for (let j = 0; j < this.dataHeader.length; j++) {
                    childRow[this.dataHeader[j]] = r['scores'][j][c];
                }
                this.childData.push(childRow);
            }

            this.scores[r['name']] = r['scores']
        }
        this.dataSource = JSON.parse(JSON.stringify(this.parentData));      // deep copy
        console.log(this.dataSource);
        this.table.renderRows();
    })
  }

  ngOnInit() {
  }

  isParentRow = (index, item) => !item.hasOwnProperty('parent');
  isChildRow = (index, item) => item.hasOwnProperty('parent');

  updateChildExpand(i, item) {
    this.collapseGraphs();

    //let parents = [...this.parentData];                          // deep copy
    let parents = JSON.parse(JSON.stringify(this.parentData));                          // deep copy
    if (item['expand']) {
        let rows = this.childData.filter(r => r['parent'] == item['name']);
        let index;
        for (let k = 0; k < parents.length; k++) {
            if (parents[k]['name'] == item['name']) {
                parents[k]['expand'] = true;
                index = k;
            }
        }
        parents.splice(index + 1, 0, ...rows);                      // focus on the "splice"
    }

    this.dataSource = parents;

    this.table.renderRows();
  }

  collapseGraphs() {                  // collapse all child graphs
    for (let r of this.dataSource) {
      if (r['parent']) {
        r['expand'] = false;
        this.updateDetailGraph(r);
      }
    }
  }

  updateDetailGraph(item) {

    let selectorId = `.gia-chart-${item['position']}`;

    if (item['expand'] == true) {
        let graphData = JSON.parse(JSON.stringify(this.scores[item['parent']]));
        this.createChart(selectorId, graphData, item['name']);
    } else {
        this.deleteChart(selectorId);
    }

  }

  createChart(selectorId, graphData, course) {

    console.log(selectorId);

    var margin = { top: 40, right: 24, bottom: 40, left: 40 };

    var widther = d3.select(selectorId).node().clientWidth;

    var width = widther - margin.left - margin.right,
      height = 360 - margin.top - margin.bottom;

    //Parses date for hh:mm
    var parseDate = d3.timeParse("%Y%m");

    //Appends the svg to the chart-container div
    var svg = d3.select(selectorId).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //set xScale
    var xScale = d3.scaleTime()
      .range([0, width]);

    //Set yScale
    var yScale = d3.scaleLinear()
      .range([height, 0]);

    //Set the y axis styles
    var yAxis = d3.axisLeft(yScale)
      .tickSize([-width])
      .tickPadding([8])
      .ticks([15]);

    //Defines the x axis style
    var xAxis = d3.axisBottom(xScale)
      .tickPadding(8)
      .ticks(12)
      .tickFormat(d3.timeFormat("%Y%m"));

    //line graph functions
    var scoreline = d3.line()
      .x(function(d) {return d.TIME; })
      .y(function(d) {return d.SCORE; });

    // data format
    graphData.forEach(function(d) {
      d.SCORE = +d[course];
      d.TIME = parseDate(d.time);
    });

    //Find the max range of data
    //var maxY = d3.max(graphData, function(d) { return d.SCORE; });
    var maxY = 150;
    var maxX = d3.max(graphData, function(d) { return d.TIME; });
    //Areas
    var indexes = d3.range(graphData.length);

    var area = d3.area()
      .x(function(d) { return xScale(d.TIME); })
      .y0(function(d) { return yScale(0); })
      .y1(function(d) { return yScale(d.SCORE); });

    //Set the xScale max
    xScale.domain(d3.extent(graphData, function(d) { return d.TIME; }));

    //Set the yScale max
    yScale.domain([0, maxY]);

    //Append the y axis
    var yAxisGroup = svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .selectAll("g")
      .classed("g-baseline", function(d) { return d == 0 });

    //Append the x axis
    var xAxisGroup = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    //Append areas between lines
    var drawarea = svg.append("path")
      .datum(graphData)
      .attr("class", "area")
      .style('fill', '#00a9ff')
      .attr("d", area);

    //Append lines on graph
    var drawscoreline = svg.append("path")
      .datum(graphData)
      .attr("class", "scoreline")
      .style('fill', 'none')
      .attr("d", scoreline);
  }

  deleteChart(selectorId) {
    d3.select(selectorId).select('svg').remove();
  }

}

interface row {
    TIME: string;
    SCORE: number;
}