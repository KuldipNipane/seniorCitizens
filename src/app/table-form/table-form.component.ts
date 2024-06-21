import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CrudServiceService } from '../crud-service.service';


@Component({
  selector: 'app-table-form',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule, AsyncPipe,],
  templateUrl: './table-form.component.html',
  styleUrl: './table-form.component.css'
})
export class TableFormComponent implements OnInit {
 
  id:number=0;
  crudService = inject(CrudServiceService)
  router = inject(Router)
  route = inject(ActivatedRoute)
  currentInput: any;
  contactForm = new FormGroup({
    EventName: new FormControl<string>(''),
    Title: new FormControl<string>(''),
    FileName: new FormControl<string>(''),
    Type: new FormControl<string>(''),
    Description: new FormControl<string>(''),
    attachedFile: new FormControl<string>('')
  })


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      debugger
      if (params['userId']) {
        this.id = params['userId'];
        this.loadItem(this.id);
      }
    });
  }

  loadItem(id: number): void {
    this.crudService.getDataById(id).subscribe(
      (response: any) => {
        const value = JSON.parse(response.schoolCampContent)
        this.contactForm.patchValue({
          EventName: value.EventName,
          Title: value.Title,
          FileName: value.FileName,
          Type: value.Type,
          Description: value.Description,
          attachedFile: value.attachedFile,
        });
      },
      (error: any) => {
        console.error('Error loading item data', error);
      }
    );
  }
  onFormSubmit(): void {
    const addrequest = {
      EventName: this.contactForm.value.EventName,
      Title: this.contactForm.value.Title,
      FileName: this.contactForm.value.FileName,
      Type: this.contactForm.value.Type,
      Description: this.contactForm.value.Description,
      attachedFile: this.contactForm.value.attachedFile,
    };

    const frm = new FormData();
    frm.append('data', JSON.stringify(addrequest));
    if (this.currentInput) {
      frm.append('file', this.currentInput, this.currentInput.name);
    }

    this.crudService.postData(frm, this.id).subscribe(
      (res: any) => {
        console.log('Update API Response:', res);
        this.router.navigate(['/list']);
      },
      (error) => {
        console.error('Update API Error:', error);
      }
    );
  }

  onFileSelected(event: any) {
    console.log(event.target.files);
    this.currentInput = event.target.files[0];
  }
}
