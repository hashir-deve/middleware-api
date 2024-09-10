import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Constants } from 'src/contants/contstants';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-process-create',
  templateUrl: './process-create.component.html',
  styleUrls: ['./process-create.component.css']
})
export class ProcessCreateComponent {

  parentForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private httpClient: HttpClient,
    private constant: Constants
  ) {
    this.parentForm = this.fb.group({
      sourceUrl: new FormControl('', Validators.required),
      forms: this.fb.array([])
    });
  }

  get forms(): FormArray {
    return this.parentForm.get('forms') as FormArray;
  }

  addForm() {
    const newForm = this.fb.group({
      url: new FormControl('', Validators.required),
      values: this.fb.array([])
    });
    this.forms.push(newForm);
  }

  removeForm(index: number) {
    this.forms.removeAt(index);
  }

  addValue(formIndex: number) {
    const values = this.getValues(formIndex);
    const newValueGroup = this.fb.group({
      key: [''],
      value: [''],
      used: false
    });
    values.push(newValueGroup);
  }

  removeValue(formIndex: number, valueIndex: number) {
    const values = this.getValues(formIndex);
    values.removeAt(valueIndex);
  }

  getValues(formIndex: number): FormArray {
    return this.forms.at(formIndex).get('values') as FormArray;
  }

  getFormGroup(control: AbstractControl | null): FormGroup {
    if (control === null) {
      throw new Error('Control is null');
    }
    return control as FormGroup;
  }

  getFormArray(control: AbstractControl | null): FormArray {
    if (control === null) {
      throw new Error('Control is null');
    }
    return control as FormArray;
  }

  onSubmit() {
    const formValue = this.parentForm.value;
    console.log(formValue);
    const sourceUrl = formValue.form1?.url1;
    const reqBody = {
      name: "Test",
      sourceUrl: formValue.sourceUrl,
      processes: formValue.forms
    }
    console.log(reqBody);
    
    const baseUrl = this.constant.baseUrl;
    this.httpClient.post(baseUrl+'/process', reqBody).subscribe(
      (res) => {
        console.log(res);
        this.openSnackBar("Process Added Successfully!");
      },
      (err) => {
        console.log(err);
      }
    )
    console.log(this.parentForm.value);
  }






  // public formGroup = new FormGroup({
  //   form1: new FormGroup({
  //     url1: new FormControl('', Validators.required),
  //     value1: new FormGroup({
  //       key: new FormControl('', Validators.required),
  //       value: new FormControl('', Validators.required)
  //     }),
  //     value2: new FormGroup({
  //       key: new FormControl(''),
  //       value: new FormControl('')
  //     }),
  //     value3: new FormGroup({
  //       key: new FormControl(''),
  //       value: new FormControl('')
  //     }),
  //     isInEditMode: new FormControl<boolean>(false)
  //   }
  // ),
  //   form2: new FormGroup({
  //     url2: new FormControl('', Validators.required),
  //     value1: new FormGroup({
  //       key: new FormControl('', Validators.required),
  //       value: new FormControl('', Validators.required)
  //     }),
      
  //     value2: new FormGroup({
  //       key: new FormControl(''),
  //       value: new FormControl('')
  //     }),
  //     value3: new FormGroup({
  //       key: new FormControl(''),
  //       value: new FormControl('')
  //     }),
  //     isInEditMode: new FormControl<boolean>(false)
  //   })
  // });

  // public isInEditMode: boolean = false;

  // checkEditMode(grandParent: any){
  //   return grandParent.value.isInEditMode;
  // }

  // changeEditMode(grandParent: any){
  //   grandParent.value.isInEditMode = !grandParent.value.isInEditMode;
  // }

  // addNewFormGroup(grandParent: any){
  //   const formGroupName = grandParent.key;
  //   const valueNumber = parseInt(formGroupName[formGroupName.length - 1]) + 1;

  //   console.log((this.formGroup.controls as any)[formGroupName]);
  //   (this.formGroup.controls as any)[formGroupName].addControl(`value${valueNumber}`, 
  //   new FormGroup({
  //     key: new FormControl('', Validators.required),
  //     value: new FormControl('', Validators.required)
  //   }))
  //   console.log(grandParent);
  // }

  // saveProcessMapping(){
  //   const formValue = this.formGroup.value;
  //   console.log(formValue);
  //   const sourceUrl = formValue.form1?.url1;
  //   const reqBody = {
  //     name: "Test",
  //     sourceUrl: sourceUrl,
  //     processes: [
  //       formValue.form1,
  //       formValue.form2
  //     ]
  //   }
  //   console.log(reqBody);
    
  //   const baseUrl = this.constant.baseUrl;
  //   this.httpClient.post(baseUrl+'/process', reqBody).subscribe(
  //     (res) => {
  //       console.log(res);
  //       this.openSnackBar("Process Added Successfully!");
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   )
  // }

  openSnackBar(message: string) { 
    // this.snackbar.open(message, 'Ok',{
    //   duration: 30000
    // }) 
  }
}
