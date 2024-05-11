import { Component } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { Constants } from 'src/contants/contstants';
import { catchError, of } from 'rxjs'

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent {
  readonly columnMap = Object.freeze({
    id: {
      label: 'ID',
      description: 'ID',
    },
    name: {
      label: 'Name',
      description: 'Name',
    },
    actions: {
      label: '',
      description: 'Actions',
    },
  });

  displayedColumns = Object.keys(this.columnMap);

  dataSource = [  ];

  constructor(
    private httpClient: HttpClient,
    private constants: Constants
  ) {

  }

  openColumnVisibilityModal() {
    // this._dialog
    //   .open({
    //     data: {
    //       columnMap: this.columnMap,
    //       displayedColumns: this.displayedColumns,
    //     },
    //   })
    //   .afterClosed()
    //   .subscribe((displayedColumns) => {
    //     if (displayedColumns) {
    //       this.displayedColumns = displayedColumns;
    //     }
    //   });
  }

  getProcesses(){
   const baseUrl = this.constants.baseUrl;

   return this.httpClient.get(`${baseUrl}/processes`).pipe(
    catchError((err) => {
      //TODO - handleError
      return of(err);
    })
   );
  }
}
