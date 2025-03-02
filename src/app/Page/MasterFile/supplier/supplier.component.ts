import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserMaster } from '../../../Models/UserMaster';
import { Supplier } from '../../../Models/Supplier';
import { AuthService } from '../../../Services/auth.service';
import { AlertService } from '../../../Services/alert.service';
import { ConformationService } from '../../../Services/conformation.service';
import { CommonModule } from '@angular/common';
import { ButtonsComponent } from '../../../Component/buttons/buttons.component';
import { AlertComponent } from '../../../Component/alert/alert.component';
import { ConfirmationComponent } from '../../../Component/confirmation/confirmation.component';
import { SupplierService } from '../../../Services/supplier.service';
import { ApiResponse } from '../../../Models/ApiResponse';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonsComponent, AlertComponent, ConfirmationComponent],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css'
})
export class SupplierComponent implements OnInit {
  
  public supplierForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  currentUser: UserMaster | null = null;
  suppliers: Supplier[] = [];
  showCodeDropdown = false;
  showNameDropdown = false;
  activeDropdown: 'code' | 'name' | null = null;
  filteredCodes: Supplier[] = [];
  filteredNames: Supplier[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private supplierService: SupplierService,
    private confirmationService : ConformationService
  ){}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
          this.currentUser = user;
    
          this.supplierForm = this.formBuilder.group({
            supp_Code: ['', [Validators.required]],
            supp_Name:  ['', [Validators.required]],
            contact_No :  ['', [Validators.required]],
            contact_Name :  ['', [Validators.required]],
            country :  ['', [Validators.required]],
            address_1 :  ['', [Validators.required]],
            address_2 :  [''],
            address_3:  [''],
            phone_1 :  ['', [Validators.required]],
            phone_2 :  [''],
            phone_3 :  [''],
            email :  ['', [Validators.required]],
            fax :  [''],
            web_site:  [''],
            state:[1],
            CreatedUser: [this.currentUser?.firstName]
          });
        });

        
        
        this.loadSuppliers();
        this.AutoComplete();
        this.closeDropdown();
  }


  AutoComplete(){
    this.supplierForm.get('supp_Code')?.valueChanges.subscribe(value => {
      this.filterCodes(value);
    });

    this.supplierForm.get('supp_Name')?.valueChanges.subscribe(value => {
      this.filterNames(value);
    });
  }

  loadSuppliers() {
    this.supplierService.getSuppliers(0, true).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          debugger;
          this.suppliers = response.data;
          this.filteredCodes = this.suppliers
          this.filteredNames = this.suppliers;
          console.log(this.filteredCodes)
        }
      },
      error: (error) => {
        console.error('Error loading Locations:', error);
      }
    });
  }


  filterCodes(value: string) {
    if (!value) {
      this.filteredCodes = this.suppliers;
    } else {
      this.filteredCodes = this.suppliers.filter(suppliers => 
        suppliers.supp_Code.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  filterNames(value: string) {
    if (!value) {
      this.filteredNames = this.suppliers;
    } else {
      this.filteredNames = this.suppliers.filter(suppliers => 
        suppliers.supp_Name.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  openDropdown(type: 'code' | 'name') {
    this.activeDropdown = type;
  }

  closeDropdown() {
    this.activeDropdown = null;
  }

  selectCode(supplier: Supplier) {
    this.supplierForm.patchValue({
      supp_Code: supplier.supp_Code,
      supp_Name: supplier.supp_Name,
      contact_No : supplier.contact_No ,
      contact_Name : supplier.contact_Name ,
      country :  supplier.country,
      address_1 : supplier.address1,
      address_2 : supplier.address2 ,
      address_3: supplier.address3 ,
      phone_1 : supplier.phone1 ,
      phone_2 : supplier.phone2 ,
      phone_3 : supplier.phone3 ,
      email : supplier.email ,
      fax : supplier.fax ,
      web_site: supplier.web_site 

    });
    this.closeDropdown();
  }

  selectName(supplier: Supplier) {
    this.supplierForm.patchValue({
      supp_Code: supplier.supp_Code,
      supp_Name: supplier.supp_Name,
      contact_No : supplier.contact_No ,
      contact_Name : supplier.contact_Name ,
      country :  supplier.country,
      address_1 : supplier.address1,
      address_2 : supplier.address2 ,
      address_3: supplier.address3 ,
      phone_1 : supplier.phone1 ,
      phone_2 : supplier.phone2 ,
      phone_3 : supplier.phone3 ,
      email : supplier.email ,
      fax : supplier.fax ,
      web_site: supplier.web_site 
    });
    this.closeDropdown();
  }


  isFieldInvalid(fieldName: string): boolean {
    const field = this.supplierForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }


  postData(): void {
  
      if (this.supplierForm.invalid) return;
      
      if (this.supplierForm.valid) {
        const supplierData = {
          supp_Name: this.supplierForm.value.supp_Name.trim(),
          supp_Code: this.supplierForm.value.supp_Code.toUpperCase().trim(),
          contact_No: this.supplierForm.value.contact_No.trim(),
          contact_Name: this.supplierForm.value.contact_Name.trim(),
          country: this.supplierForm.value.country.trim(),
          address1: this.supplierForm.value.address_1.trim(),
          address2: this.supplierForm.value.address_2.trim(),
          address3: this.supplierForm.value.address_3.trim(),
          phone1: this.supplierForm.value.phone_1.trim(),
          phone2: this.supplierForm.value.phone_2.trim(),
          phone3: this.supplierForm.value.phone_3.trim(),
          email: this.supplierForm.value.email.trim(),
          fax: this.supplierForm.value.fax.trim(),
          web_site: this.supplierForm.value.web_site.trim(),
          State:this.supplierForm.value.state,      
           CreatedUser:this.currentUser?.firstName || 'Unknown'
        };
  
  debugger;
        this.supplierService.createSupplier(supplierData).subscribe({
          next: (response: ApiResponse<any>) => {
            this.alertService.showAlert(response);
            if (response.isSuccess) {
              this.successMessage = response.message || 'Location created successfully!';
              this.supplierForm.reset();
            } else {
              this.errorMessage = response.message || 'Failed to create Location';
            }
            this.isSubmitting = false;
          },
          error: (error) => {
            this.alertService.showAlert({
              isSuccess: false,
              message: error.error.message || 'Failed to create Location',
              data: null
            });
          }
        });
      } else {
        console.error("Form is invalid");
      }
    }


    async onDeleteLocation() {
      const confirmed = await this.confirmationService.show({
        title: 'Delete Location',
        message: 'Are you sure you want to delete this Location?',
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel'
      });
      
      const supp_code = this.supplierForm.value.supp_Code?.toUpperCase().trim();
      debugger;
      if (confirmed) {
        this.supplierService.deleteSuppliers(supp_code).subscribe({
          next: (response: ApiResponse<any>) => {
            this.alertService.showAlert(response);
            
            if (response.isSuccess) {
              this.successMessage = response.message || 'Location deleted successfully!';
              this.supplierForm.reset();
              // this.loadCategories();
              // this.closeDropdown();
            } else {
              this.errorMessage = response.message || 'Failed to delete Location';
            }
          },
          error: (error) => {
            this.alertService.showAlert({
              isSuccess: false,
              message: error.error.message || 'Failed to Delete Location',
              data: null
            });
          }
        }
          
        );
      }
    }

    clearForm() {
      this.supplierForm.reset();
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
