import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { element } from 'protractor';
import { PostService } from '../post.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;

  dataSource: any[] = [];
  dataHeader: any[] = [];
  headers: string[] = ['name'];

  constructor(private post: PostService) {

    for (let i = 1; i < 13; i++) {
        this.dataHeader.push(i + "月");
    }
    this.headers.push(...this.dataHeader);
    console.log(this.headers);

    post.readData()
    .subscribe( resp => {
        let res = JSON.parse(JSON.stringify(resp));         // fix "Type 'Object' is not an array type or a string type."
        for (let r of res) {
            let row = {'name': r['name']};
            for (let j = 0; j < this.dataHeader.length; j++) {
                row[this.dataHeader[j]] = r['scores'][j]['total'];
            }
            this.dataSource.push(row);
        }
        console.log(this.dataSource);
        this.table.renderRows();
    })
  }

  ngOnInit() {
  }

}
