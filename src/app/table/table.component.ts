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
        let res = JSON.parse(JSON.stringify(resp));         // fix "Type 'Object' is not an array type or a string type."
        console.log(res);
        for (let r of res) {
            let parentRow = {'expand': false, 'name': r['name']};
            for (let j = 0; j < this.dataHeader.length; j++) {
                parentRow[this.dataHeader[j]] = r['scores'][j]['total'];
            }
            this.dataSource.push(parentRow);

            for (let c of this.courses) {
                let childRow = {'parent': r['name'], 'expand': false, 'name': c};
                for (let j = 0; j < this.dataHeader.length; j++) {
                    childRow[this.dataHeader[j]] = r['scores'][j][c];
                }
                this.dataSource.push(childRow);
            }
        }
        console.log(this.dataSource);
        this.table.renderRows();
    })
  }

  ngOnInit() {
  }

  isParentRow = (index, item) => !item.hasOwnProperty('parent');
  isChildRow = (index, item) => item.hasOwnProperty('parent');

  updateChildRow(i, item) {
    for (let r of this.dataSource) {
        if (r['parent'] == item['name']) {
            r['expand'] = item['expand'];
        }
    }
    this.table.renderRows();
  }

}
