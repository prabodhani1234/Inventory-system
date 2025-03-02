import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonsComponent } from '../../../Component/buttons/buttons.component';
import { AlertComponent } from '../../../Component/alert/alert.component';
import { ConfirmationComponent } from '../../../Component/confirmation/confirmation.component';
import { UserMaster } from '../../../Models/UserMaster';
import { Customer } from '../../../Models/Customer';
import { AuthService } from '../../../Services/auth.service';
import { AlertService } from '../../../Services/alert.service';
import { ConformationService } from '../../../Services/conformation.service';
import { CustomerService } from '../../../Services/customer.service';
import { ApiResponse } from '../../../Models/ApiResponse';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonsComponent,
    AlertComponent,
    ConfirmationComponent,
  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent implements OnInit {
  public customerForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  currentUser: UserMaster | null = null;
  customers: Customer[] = [];
  showCodeDropdown = false;
  showNameDropdown = false;
  activeDropdown: 'code' | 'name' | null = null;
  filteredCodes: Customer[] = [];
  filteredNames: Customer[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private customerService: CustomerService,
    private confirmationService: ConformationService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.currentUser = user;

      this.customerForm = this.formBuilder.group({
        cust_Code: ['', [Validators.required]],
        cust_Name: ['', [Validators.required]],
        contact_No: ['', [Validators.required]],
        contact_Name: ['', [Validators.required]],
        country: ['', [Validators.required]],
        region: ['', [Validators.required]],
        address_1: ['', [Validators.required]],
        address_2: [''],
        address_3: [''],
        phone_1: ['', [Validators.required]],
        phone_2: [''],
        phone_3: [''],
        email: ['', [Validators.required]],
        fax: [''],
        web_site: [''],
        creditLimit: ['', [Validators.required]],
        creditPeriod: ['', [Validators.required]],
        state: [1],
        CreatedUser: [this.currentUser?.firstName],
      });
    });

    this.loadCustomers();
    this.AutoComplete();
    this.closeDropdown();
  }

  AutoComplete() {
    this.customerForm.get('cust_Code')?.valueChanges.subscribe((value) => {
      this.filterCodes(value);
    });

    this.customerForm.get('cust_Name')?.valueChanges.subscribe((value) => {
      this.filterNames(value);
    });
  }

  loadCustomers() {
    this.customerService.getCustomers(0, true).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          debugger;
          this.customers = response.data;
          this.filteredCodes = this.customers;
          this.filteredNames = this.customers;
          console.log(this.filteredCodes);
        }
      },
      error: (error) => {
        console.error('Error loading Locations:', error);
      },
    });
  }

  filterCodes(value: string) {
    if (!value) {
      this.filteredCodes = this.customers;
    } else {
      this.filteredCodes = this.customers.filter((customers) =>
        customers.cust_Code.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  filterNames(value: string) {
    if (!value) {
      this.filteredNames = this.customers;
    } else {
      this.filteredNames = this.customers.filter((customers) =>
        customers.cust_Name.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  openDropdown(type: 'code' | 'name') {
    this.activeDropdown = type;
  }

  closeDropdown() {
    this.activeDropdown = null;
  }

  selectCode(customer: Customer) {
    this.customerForm.patchValue({
      cust_Code: customer.cust_Code,
      cust_Name: customer.cust_Name,
      contact_No: customer.contact_No,
      contact_Name: customer.contact_Name,
      country: customer.country,
      region: customer.region,
      address_1: customer.address1,
      address_2: customer.address2,
      address_3: customer.address3,
      phone_1: customer.phone1,
      phone_2: customer.phone2,
      phone_3: customer.phone3,
      email: customer.email,
      fax: customer.fax,
      web_site: customer.web_site,
      creditLimit: customer.creditLimit,
      creditPeriod: customer.creditPeriod,
    });
    this.closeDropdown();
  }

  selectName(customer: Customer) {
    this.customerForm.patchValue({
      cust_Code: customer.cust_Code,
      cust_Name: customer.cust_Name,
      contact_No: customer.contact_No,
      contact_Name: customer.contact_Name,
      country: customer.country,
      region: customer.region,
      address_1: customer.address1,
      address_2: customer.address2,
      address_3: customer.address3,
      phone_1: customer.phone1,
      phone_2: customer.phone2,
      phone_3: customer.phone3,
      email: customer.email,
      fax: customer.fax,
      web_site: customer.web_site,
      creditLimit: customer.creditLimit,
      creditPeriod: customer.creditPeriod,
    });
    this.closeDropdown();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  postData(): void {
    if (this.customerForm.invalid) return;

    if (this.customerForm.valid) {
      const customerData = {
        cust_Name: this.customerForm.value.cust_Name.trim(),
        cust_Code: this.customerForm.value.cust_Code.toUpperCase().trim(),
        contact_No: this.customerForm.value.contact_No.trim(),
        contact_Name: this.customerForm.value.contact_Name.trim(),
        country: this.customerForm.value.country.trim(),
        region: this.customerForm.value.region.trim(),
        address1: this.customerForm.value.address_1.trim(),
        address2: this.customerForm.value.address_2.trim(),
        address3: this.customerForm.value.address_3.trim(),
        phone1: this.customerForm.value.phone_1.trim(),
        phone2: this.customerForm.value.phone_2.trim(),
        phone3: this.customerForm.value.phone_3.trim(),
        email: this.customerForm.value.email.trim(),
        fax: this.customerForm.value.fax.trim(),
        web_site: this.customerForm.value.web_site.trim(),
        creditLimit: this.customerForm.value.creditLimit.trim(),
        creditPeriod: this.customerForm.value.creditPeriod.trim(),
        State: this.customerForm.value.state,
        CreatedUser: this.currentUser?.firstName || 'Unknown',
      };

      debugger;
      this.customerService.createCustomers(customerData).subscribe({
        next: (response: ApiResponse<any>) => {
          this.alertService.showAlert(response);
          if (response.isSuccess) {
            this.successMessage =
              response.message || 'Location created successfully!';
            this.customerForm.reset();
          } else {
            this.errorMessage = response.message || 'Failed to create Location';
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          this.alertService.showAlert({
            isSuccess: false,
            message: error.error.message || 'Failed to create Location',
            data: null,
          });
        },
      });
    } else {
      console.error('Form is invalid');
    }
  }

  async onDeleteLocation() {
    const confirmed = await this.confirmationService.show({
      title: 'Delete Location',
      message: 'Are you sure you want to delete this Location?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    });

    const supp_code = this.customerForm.value.supp_Code?.toUpperCase().trim();
    debugger;
    if (confirmed) {
      this.customerService.deleteCustomers(supp_code).subscribe({
        next: (response: ApiResponse<any>) => {
          this.alertService.showAlert(response);

          if (response.isSuccess) {
            this.successMessage =
              response.message || 'Location deleted successfully!';
            this.customerForm.reset();
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
            data: null,
          });
        },
      });
    }
  }

  clearForm() {
    this.customerForm.reset();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdownElements = document.querySelectorAll('.dropdown-container');
    let isClickedInside = false;

    dropdownElements.forEach((element) => {
      if (element.contains(target)) {
        isClickedInside = true;
      }
    });

    if (!isClickedInside && this.activeDropdown) {
      this.closeDropdown();
    }
  }
}
