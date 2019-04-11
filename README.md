# mat-table-with-d3-sample
A sample to implement table-tree by mat-table and dynamic drawing charts with d3 

## foreword

Recently, I got my first formal frontend task to implement a tree-table by mat-table and to draw chart of detail row by d3.

The technologies involved included __Angular__, __Material__ table, __animation__ and __d3__, they were all new to me. 
I quickly picked up these skills with examples had been implemented by my colleagues.

But I still had doubts about some details, so I implemented this demo from zero and recorded the process in different branches.

## view different code on those branches
#### 1.step0:

create angular project, read data and initial page

key point:
 
  - use `Angular-Cli` to create project

  - get data asynchronously by HttpClient
    
    `this.http.get()` is synchronous, need work with `subscribe`

  - initial page with mat-card and mat-grid-list

    An `mat-grid-list` must specify a `cols` attribute which sets the number of columns in the grid.
    The height of the rows in a grid list can be set via the rowHeight attribute.