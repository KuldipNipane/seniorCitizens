import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { CrudServiceService } from '../crud-service.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './list.component.html',
  providers: [CrudServiceService]
})
export class ListComponent implements OnInit {

  data: any[] = [];
  crudService = inject(CrudServiceService)
  router = inject(Router)

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.crudService.getData().subscribe(
      (response) => {
        this.data = response;
        this.data = response.map((main:any) => {
          const value = JSON.parse(main.schoolCampContent);
          main.schoolCampContent =null
          return { ...main, ...value };
        });
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }
  updateData(id:number):void{
    const params ={
      userId:id 
    }
    this.router.navigate(['/tableForm', params]);
  }
  onDelete(id: number): void {
    this.crudService.deleteData(id).subscribe(
      response => {
        console.log('Item deleted successfully:', response);
        this.fetchData()
      },
      error => {
        console.error('Error deleting item:', error);
      }
    );
  }

}
