import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { UserMaster } from '../../../Models/UserMaster';
import { ButtonsComponent } from '../../../Component/buttons/buttons.component';
import { AlertService } from '../../../Services/alert.service';
import { LocationService } from '../../../Services/location.service';
import { ApiResponse } from '../../../Models/ApiResponse';
import { AlertComponent } from "../../../Component/alert/alert.component";
import { ConfirmationComponent } from "../../../Component/confirmation/confirmation.component";
import { ConformationService } from '../../../Services/conformation.service';
import { Location } from '../../../Models/Location';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonsComponent, AlertComponent, ConfirmationComponent],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent implements OnInit {
  
  public locationForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  currentUser: UserMaster | null = null;
  locations: Location[] = [];
  showCodeDropdown = false;
  showNameDropdown = false;
  activeDropdown: 'code' | 'name' | null = null;
  filteredCodes: Location[] = [];
  filteredNames: Location[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private locationService: LocationService,
    private confirmationService : ConformationService
  ){}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
          this.currentUser = user;
    
          this.locationForm = this.formBuilder.group({
            loca_Code: ['', [Validators.required]],
            loca_Name:  ['', [Validators.required]],
            contact_No :  ['', [Validators.required]],
            contact_Name :  ['', [Validators.required]],
            ref_Code :  ['', [Validators.required]],
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

        
        
        this.loadLocations();
        this.AutoComplete();
        this.closeDropdown();
  }


  AutoComplete(){
    this.locationForm.get('loca_Code')?.valueChanges.subscribe(value => {
      this.filterCodes(value);
    });

    this.locationForm.get('loca_Name')?.valueChanges.subscribe(value => {
      this.filterNames(value);
    });
  }

  loadLocations() {
    this.locationService.getLocations(0, true).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          debugger;
          this.locations = response.data;
          this.filteredCodes = this.locations;
          this.filteredNames = this.locations;
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
      this.filteredCodes = this.locations;
    } else {
      this.filteredCodes = this.locations.filter(locations => 
        locations.loca_Code.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  filterNames(value: string) {
    if (!value) {
      this.filteredNames = this.locations;
    } else {
      this.filteredNames = this.locations.filter(locations => 
        locations.loca_Name.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  openDropdown(type: 'code' | 'name') {
    this.activeDropdown = type;
  }

  closeDropdown() {
    this.activeDropdown = null;
  }

  selectCode(location: Location) {
    this.locationForm.patchValue({
      loca_Code: location.loca_Code,
      loca_Name: location.loca_Name,
      contact_No : location.contact_No ,
      contact_Name : location.contact_Name ,
      ref_Code :  location.ref_Code,
      address_1 : location.address1,
      address_2 : location.address2 ,
      address_3: location.address3 ,
      phone_1 : location.phone1 ,
      phone_2 : location.phone2 ,
      phone_3 : location.phone3 ,
      email : location.email ,
      fax : location.fax ,
      web_site: location.web_site 

    });
    this.closeDropdown();
  }

  selectName(location: Location) {
    this.locationForm.patchValue({
      loca_Code: location.loca_Code,
      loca_Name: location.loca_Name,
      contact_No : location.contact_No ,
      contact_Name : location.contact_Name ,
      ref_Code :  location.ref_Code,
      address_1 : location.address1,
      address_2 : location.address2 ,
      address_3: location.address3 ,
      phone_1 : location.phone1 ,
      phone_2 : location.phone2 ,
      phone_3 : location.phone3 ,
      email : location.email ,
      fax : location.fax ,
      web_site: location.web_site 
    });
    this.closeDropdown();
  }


  isFieldInvalid(fieldName: string): boolean {
    const field = this.locationForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }


  postData(): void {
  
      if (this.locationForm.invalid) return;
      
      if (this.locationForm.valid) {
        const locationData = {
          loca_Name: this.locationForm.value.loca_Name.trim(),
          loca_Code: this.locationForm.value.loca_Code.toUpperCase().trim(),
          contact_No: this.locationForm.value.contact_No.trim(),
          contact_Name: this.locationForm.value.contact_Name.trim(),
          ref_Code: this.locationForm.value.ref_Code.trim(),
          address1: this.locationForm.value.address_1.trim(),
          address2: this.locationForm.value.address_2.trim(),
          address3: this.locationForm.value.address_3.trim(),
          phone1: this.locationForm.value.phone_1.trim(),
          phone2: this.locationForm.value.phone_2.trim(),
          phone3: this.locationForm.value.phone_3.trim(),
          email: this.locationForm.value.email.trim(),
          fax: this.locationForm.value.fax.trim(),
          web_site: this.locationForm.value.web_site.trim(),
          State:this.locationForm.value.state,      
           CreatedUser:this.currentUser?.firstName || 'Unknown'
        };
  
  debugger;
        this.locationService.createLocation(locationData).subscribe({
          next: (response: ApiResponse<any>) => {
            this.alertService.showAlert(response);
            if (response.isSuccess) {
              this.successMessage = response.message || 'Location created successfully!';
              this.locationForm.reset();
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
      
      const catCode = this.locationForm.value.cat_Code?.toUpperCase().trim();
      debugger;
      if (confirmed) {
        this.locationService.deleteLocations(catCode).subscribe({
          next: (response: ApiResponse<any>) => {
            this.alertService.showAlert(response);
            
            if (response.isSuccess) {
              this.successMessage = response.message || 'Location deleted successfully!';
              this.locationForm.reset();
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
      this.locationForm.reset();
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
