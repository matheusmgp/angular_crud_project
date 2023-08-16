import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { CrudService } from '../crud.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css'],
})
export class CategoryCreateComponent implements OnInit {
  @Output() submitClicked = new EventEmitter<any>();
  public form: UntypedFormGroup;
  resource: string = 'categorias';
  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<CategoryCreateComponent>,
    private readonly crudService: CrudService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(30),
        ],
      ],
      status: [true],
    });
  }
  criar() {
    if (this.form.valid) {
      try {
        this.crudService.create(this.form.value, this.resource).subscribe({
          next: (retorno: any) => {
            this.submitClicked.emit(retorno);
            this.dialogRef.close();
            this.crudService.showMessage(
              `Categoria Criada com SUCESSO!!!`,
              false
            );
          },
          error: (err) => console.error('An error occurred :', err),
        });
      } catch (err: unknown) {
        this.crudService.showMessage(`Error ${err}`, true);
        this.router.navigate(['/categorias']);
      }
    }
  }

  public cancel(): void {
    window.history.back();
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  };
}
