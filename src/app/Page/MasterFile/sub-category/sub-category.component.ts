import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { UserMaster } from '../../../Models/UserMaster';
import { SubCategory } from '../../../Models/SubCategory';
import { Category } from '../../../Models/Category';
import { ButtonsComponent } from "../../../Component/buttons/buttons.component";
import { CategoryService } from '../../../Services/category.service';
import { ApiResponse } from '../../../Models/ApiResponse';
import { AlertService } from '../../../Services/alert.service';
import { AlertComponent } from "../../../Component/alert/alert.component";
import { SubCategoryService } from '../../../Services/sub-category.service';
import { ConformationService } from '../../../Services/conformation.service';
import { ConfirmationComponent } from "../../../Component/confirmation/confirmation.component";

@Component({
  selector: 'app-sub-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonsComponent, AlertComponent, ConfirmationComponent],
  templateUrl: './sub-category.component.html',
  styleUrl: './sub-category.component.css'
})
export class SubCategoryComponent implements OnInit {
  public subCategoryForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  currentUser: UserMaster | null = null;
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  showCodeDropdown = false;
  showNameDropdown = false;
  activeDropdown: 'code' | 'name' | 'sub_code'|'sub_name'| null = null;
  filteredCodes: Category[] = [];
  filteredNames: Category[] = [];
  filteredSubCatCodes: SubCategory[] = [];
  filteredSubCatNames: SubCategory[] = [];

  constructor(
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private categoryService: CategoryService,
      private subCategoryService: SubCategoryService,
      private alertService:AlertService,
      private confirmationService: ConformationService
    ) {}
    
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
          this.currentUser = user;
    
          this.subCategoryForm = this.formBuilder.group({
            cat_Code: ['', [Validators.required]],
            cat_Name: ['', [Validators.required]],
            subCat_Code: ['', [Validators.required]],
            subCat_Name: ['', [Validators.required]],
            CreatedUser: [this.currentUser?.firstName || '']
          });
        });

        this.loadCategories();
        this.closeDropdown();
        this.AutoComplete();
        this.AutoSubCatComplete();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.subCategoryForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }


  AutoComplete(){
    this.subCategoryForm.get('cat_Code')?.valueChanges.subscribe(value => {
      this.filterCodes(value);
    });

    this.subCategoryForm.get('cat_Name')?.valueChanges.subscribe(value => {
      this.filterNames(value);
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

  openDropdown(type: 'code' | 'name'| 'sub_code'|'sub_name') {
    this.activeDropdown = type;
  }

  closeDropdown() {
    this.activeDropdown = null;
  }

  selectCode(category: Category) {
    this.subCategoryForm.patchValue({
      cat_Code: category.cat_Code,
      cat_Name: category.cat_Name
    });

    this.loadSubCategories();
    this.closeDropdown();
  }

  selectName(category: Category) {
    this.subCategoryForm.patchValue({
      cat_Code: category.cat_Code,
      cat_Name: category.cat_Name
    });
    this.loadSubCategories();
    this.closeDropdown();
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


    // subCatrgory

    postData(): void {
    
        if (this.subCategoryForm.invalid) return;
        
        if (this.subCategoryForm.valid) {
          const categoryData = {
            cat_Name: this.subCategoryForm.value.cat_Name.trim(),
            cat_Code: this.subCategoryForm.value.cat_Code.toUpperCase().trim(),
            subCat_Code: this.subCategoryForm.value.subCat_Code.toUpperCase().trim(),
            subCat_Name: this.subCategoryForm.value.subCat_Name.trim(),
            CreatedUser:this.currentUser?.firstName || 'Unknown'
          };
    
    debugger;
          this.subCategoryService.createSubCategory(categoryData).subscribe({
            next: (response: ApiResponse<any>) => {
              this.alertService.showAlert(response);
              if (response.isSuccess) {
                this.successMessage = response.message || 'Category created successfully!';
                this.subCategoryForm.reset();
                this.loadSubCategories();
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

      loadSubCategories() {
        const catCode = this.subCategoryForm.value.cat_Code?.toUpperCase().trim();

        this.subCategoryService.getSubCategories(0, true, catCode).subscribe({
          next: (response: any) => {
            if (response && response.data) {
              debugger;
              this.subCategories = response.data;
              this.filteredSubCatCodes = this.subCategories;
              this.filteredSubCatNames = this.subCategories;
            }
          },
          error: (error) => {
            console.error('Error loading categories:', error);
          }
        });
      }
  
      selectSubCode(subCategory: SubCategory) {
        this.subCategoryForm.patchValue({
          subCat_Code: subCategory.subCat_Code,
          subCat_Name: subCategory.subCat_Name,
          cat_Code: subCategory.cat_Code,
          cat_Name: subCategory.cat_Name
        });
        this.closeDropdown();
      }
    
      selectSubName(subCategory: SubCategory) {
        this.subCategoryForm.patchValue({
          subCat_Code: subCategory.subCat_Code,
          subCat_Name: subCategory.subCat_Name,
          cat_Code: subCategory.cat_Code,
          cat_Name: subCategory.cat_Name
        });
        this.closeDropdown();
      }

      AutoSubCatComplete(){
        this.subCategoryForm.get('subCat_Code')?.valueChanges.subscribe(value => {
          this.filterCodes(value);
        });
    
        this.subCategoryForm.get('subCat_Name')?.valueChanges.subscribe(value => {
          this.filterNames(value);
        });
      }
    
      filterSubCatCodes(value: string) {
        if (!value) {
          debugger;
          this.filteredSubCatCodes = this.subCategories;
        } else {
          debugger;
          this.filteredSubCatCodes = this.subCategories.filter(suCategory => 
            suCategory.subCat_Code.toLowerCase().includes(value.toLowerCase())
          );
        }
      }
    
      filterSubCatNames(value: string) {
        if (!value) {
          this.filteredSubCatNames = this.subCategories;
        } else {
          this.filteredSubCatNames = this.subCategories.filter(suCategory => 
            suCategory.subCat_Name.toLowerCase().includes(value.toLowerCase())
          );
        }
      }

      clearForm() {
        this.subCategoryForm.reset();
      }

      async onDeleteCategory() {
        const confirmed = await this.confirmationService.show({
          title: 'Delete Category',
          message: 'Are you sure you want to delete this category?',
          confirmText: 'Yes, Delete',
          cancelText: 'Cancel'
        });
        
        const catCode = this.subCategoryForm.value.cat_Code?.toUpperCase().trim();
        const subCatCode = this.subCategoryForm.value.subCat_Code?.toUpperCase().trim();
        debugger;
        if (confirmed) {
          this.subCategoryService.deleteCategories(catCode,subCatCode).subscribe({
            next: (response: ApiResponse<any>) => {
              this.alertService.showAlert(response);
              
              if (response.isSuccess) {
                this.successMessage = response.message || 'Category deleted successfully!';
                this.subCategoryForm.reset();
                this.loadSubCategories();
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
}
