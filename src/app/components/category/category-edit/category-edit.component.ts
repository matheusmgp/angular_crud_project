import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CrudService } from '../crud.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css'],
})
export class CategoryEditComponent implements OnInit {
  @Output() submitClicked = new EventEmitter<any>();
  public form: UntypedFormGroup;
  resource: string = 'categorias';
  constructor(
    @Inject(MAT_DIALOG_DATA) public dataId: any,
    public dialogRef: MatDialogRef<CategoryEditComponent>,
    private fb: UntypedFormBuilder,
    private readonly crudService: CrudService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.dataId, Validators.required],
      nome: [
        '',
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.minLength(5),
        ],
      ],
      status: [true, [Validators.required]],
    });
    this.getCategoria();
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  };
  getCategoria() {
    try {
      this.crudService.getById(this.dataId, this.resource).subscribe({
        next: (retorno: any) => this.preencherFormGroup(retorno.data),
        error: (err) => console.error(err),
      });
    } catch (err) {
      console.error(err);
    }
  }
  private preencherFormGroup(obj: any) {
    this.form.setValue({
      id: obj.id,
      nome: obj.nome,
      status: obj.status,
    });
  }

  update() {
    if (this.form.valid) {
      try {
        this.crudService
          .update(this.dataId, this.form.value, this.resource)
          .subscribe({
            next: (retorno: any) => {
              this.submitClicked.emit(retorno);
              this.dialogRef.close();
              this.crudService.showMessage(
                `Categoria Atualizada com SUCESSO!!!`,
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
}
