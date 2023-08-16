import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CrudService } from '../crud.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryCreateComponent } from '../category-create/category-create.component';
import { CategoryEditComponent } from '../category-edit/category-edit.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent implements OnInit {
  public dataSource = new MatTableDataSource<any>();
  displayedColumns = ['editar', 'nome', 'status'];
  categorias: any[] = [];
  resource: string = 'categorias';
  constructor(
    private readonly crudService: CrudService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCategorias();
  }
  openDialogCreate() {
    const dialogRef = this.dialog.open(CategoryCreateComponent, {});
    dialogRef.afterClosed().subscribe((result) => {});
    const dialogSubmitSubscription =
      dialogRef.componentInstance.submitClicked.subscribe(() => {
        this.getCategorias();
        dialogSubmitSubscription.unsubscribe();
      });
  }
  openDialogEdit(id: string) {
    const dialogRef = this.dialog.open(CategoryEditComponent, {
      data: id,
    });

    dialogRef.afterClosed().subscribe((result) => {});
    const dialogSubmitSubscription =
      dialogRef.componentInstance.submitClicked.subscribe(() => {
        this.getCategorias();
        dialogSubmitSubscription.unsubscribe();
      });
  }
  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCategorias() {
    try {
      this.crudService.getAll(this.resource).subscribe({
        next: (retorno: any) => {
          this.categorias = retorno.data;
          this.dataSource = new MatTableDataSource(this.categorias);
        },
        error: (err) => console.error(err),
      });
    } catch (err) {
      console.error(err);
    }
  }
}
