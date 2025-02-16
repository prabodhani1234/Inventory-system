import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../Services/category.service';
import { CommonModule } from '@angular/common';
import { ButtonsComponent } from "../../../Component/buttons/buttons.component";
import { AlertService } from '../../../Services/alert.service';
import { ApiResponse } from '../../../Models/ApiResponse';
import { Category } from '../../../Models/Category';
import { AlertComponent } from "../../../Component/alert/alert.component";
import { UserMaster } from '../../../Models/UserMaster';
import { AuthService } from '../../../Services/auth.service';
import { ConformationService } from '../../../Services/conformation.service';
import { ConfirmationComponent } from '../../../Component/confirmation/confirmation.component';


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonsComponent, AlertComponent, ConfirmationComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  public categoryForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  currentUser: UserMaster | null = null;
  categories: Category[] = [];
  showCodeDropdown = false;
  showNameDropdown = false;
  activeDropdown: 'code' | 'name' | null = null;
  filteredCodes: Category[] = [];
  filteredNames: Category[] = [];

  // categories: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private alertService: AlertService,
    private authService: AuthService,
    private confirmationService: ConformationService
  ) {}

  ngOnInit(): void {

    this.authService.user$.subscribe(user => {
      this.currentUser = user;

      this.categoryForm = this.formBuilder.group({
        cat_Code: ['', [Validators.required]],
        cat_Name: ['', [Validators.required]],
        CreatedUser: [this.currentUser?.firstName]
      });
    });

    this.loadCategories();
    this.closeDropdown();
    this.AutoComplete();
    
  }

  AutoComplete(){
    this.categoryForm.get('cat_Code')?.valueChanges.subscribe(value => {
      this.filterCodes(value);
    });

    this.categoryForm.get('cat_Name')?.valueChanges.subscribe(value => {
      this.filterNames(value);
    });
  }


  loadCategories() {
    this.categoryService.getCategories(0, true).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.categories = response.data;
          this.filteredCodes = this.categories;
          this.filteredNames = this.categories;
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  filterCodes(value: string) {
    if (!value) {
      this.filteredCodes = this.categories;
    } else {
      this.filteredCodes = this.categories.filter(category => 
        category.cat_Code.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  filterNames(value: string) {
    if (!value) {
      this.filteredNames = this.categories;
    } else {
      this.filteredNames = this.categories.filter(category => 
        category.cat_Name.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  openDropdown(type: 'code' | 'name') {
    this.activeDropdown = type;
  }

  closeDropdown() {
    this.activeDropdown = null;
  }

  selectCode(category: Category) {
    this.categoryForm.patchValue({
      cat_Code: category.cat_Code,
      cat_Name: category.cat_Name
    });
    this.closeDropdown();
  }

  selectName(category: Category) {
    this.categoryForm.patchValue({
      cat_Code: category.cat_Code,
      cat_Name: category.cat_Name
    });
    this.closeDropdown();
  }


  // onClickOutside(event: MouseEvent) {
  //   if (!(event.target as HTMLElement).closest('.dropdown-container')) {
  //     this.closeDropdown();
  //   }
  // }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.categoryForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  postData(): void {

    if (this.categoryForm.invalid) return;
    
    if (this.categoryForm.valid) {
      const categoryData = {
        cat_Name: this.categoryForm.value.cat_Name.trim(),
        cat_Code: this.categoryForm.value.cat_Code.toUpperCase().trim(),
        CreatedUser:this.currentUser?.firstName || 'Unknown'
      };

debugger;
      this.categoryService.createCategory(categoryData).subscribe({
        next: (response: ApiResponse<any>) => {
          this.alertService.showAlert(response);
          if (response.isSuccess) {
            this.successMessage = response.message || 'Category created successfully!';
            this.categoryForm.reset();
            this.loadCategories();
            this.closeDropdown();
          } else {
            this.errorMessage = response.message || 'Failed to create category';
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          this.alertService.showAlert({
            isSuccess: false,
            message: error.error.message || 'Failed to create category',
            data: null
          });
        }
      });
    } else {
      console.error("Form is invalid");
    }
  }


  async onDeleteCategory() {
    const confirmed = await this.confirmationService.show({
      title: 'Delete Category',
      message: 'Are you sure you want to delete this category?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel'
    });
    
    const catCode = this.categoryForm.value.cat_Code?.toUpperCase().trim();
    debugger;
    if (confirmed) {
      this.categoryService.deleteCategories(catCode).subscribe({
        next: (response: ApiResponse<any>) => {
          this.alertService.showAlert(response);
          
          if (response.isSuccess) {
            this.successMessage = response.message || 'Category deleted successfully!';
            this.categoryForm.reset();
            this.loadCategories();
            this.closeDropdown();
          } else {
            this.errorMessage = response.message || 'Failed to delete category';
          }
        },
        error: (error) => {
          this.alertService.showAlert({
            isSuccess: false,
            message: error.error.message || 'Failed to Delete category',
            data: null
          });
        }
      }
        
      );
    }
  }

  clearForm() {
    this.categoryForm.reset();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdownElements = document.querySelectorAll('.dropdown-container');
    let isClickedInside = false;

    dropdownElements.forEach(element => {
      if (element.contains(target)) {
        isClickedInside = true;
      }
    });

    if (!isClickedInside && this.activeDropdown) {
      this.closeDropdown();
    }
  }
}
