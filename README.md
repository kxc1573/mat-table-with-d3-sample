# mat-table-with-d3-sample
A sample to implement table-tree by mat-table and dynamic drawing charts with d3 


##foreword
Recently, I got my first formal frontend task to implement a tree-table by mat-table and to draw chart of detail row by d3.
The technologies involved include __Angular__, __Material__ table, __animation__ and __d3__, they were all new to me. 
I quickly picked up these skills with examples that my colleagues have implemented and completed the task in time.
But I have doubts about some details, so I implemented my demo from zero and recorded the process by different branches.

## view different code on those branches
#### 1.step0:

initial angular and ready data

#### 2.step1:

simple mat-table implement

key point: 

  - "ng-container" define column
  - "tr" define row
  - asynchronously get data by HttpClient
  - "renderRows" refresh page
  
#### 3.step2:

expand child-row by animation
implement child-row by native table


#### 4.step3:

expand child-row by updating dataSource


#### 5.step4:

expand child-row and draw detail-chart by d3 and animation

- 1 bug: why the 'gia-chart-wrapper' don't exist?

    need add "multiTemplateDataRows" property to mat-table

- 2  "isChildRow" is needed for detail-graph-row

#### 6.step5

add datepicker and set "prebuilt-themes" in styles.scss
