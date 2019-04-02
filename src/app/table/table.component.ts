import { Component, OnInit } from '@angular/core';
import { MatTable } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { element } from 'protractor';
import { PostService } from '../post.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.sass']
})
export class TableComponent implements OnInit {

  private dataSource: any[] = [];
  private dataHeader: any[] = [];

  constructor(private post: PostService) {

    for (let i = 1; i < 13; i++) {
        this.dataHeader.push(i + "月");
    }

    post.readData()
    .subscribe( res => {
        console.log(res);
    })

  }

  ngOnInit() {
  }

}
