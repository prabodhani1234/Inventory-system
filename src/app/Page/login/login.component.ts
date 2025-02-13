import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserMaster } from '../../Models/UserMaster';
import { AuthService } from '../../Services/auth.service';
import { take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  implements OnInit{
  loginForm: FormGroup=new FormGroup({});
  submitted=false;
  errorMessages: string[]=[];
  returnUrl : string |null = null;

  http = inject(HttpClient);
  constructor(private authService:AuthService,private formBuilder: FormBuilder, private router:Router, private activatedRoute: ActivatedRoute){
    this.authService.user$.pipe(take(1)).subscribe({
      next:(user:UserMaster |null)=>{
        if(user){
          this.router.navigate(['admin/dashboard']);
          window.location.assign('admin/dashboard');
        } else {
          this.activatedRoute.queryParamMap.subscribe({
            next: (params: any) => {
              if (params) {
                this.returnUrl = params.get('returnUrl');
              }
            }
          })
        }
      }
    })
  }
  
  ngOnInit(): void {
    this.loginForm=this.formBuilder.group({
      username:['', Validators.required],
      password:['', Validators.required]

    })
  }
  // constructor(private fb: FormBuilder) {
  //   this.loginForm = this.fb.group({
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', Validators.required],
  //     rememberMe: [false]
  //   });
  // }

  login(){
    this.submitted = true;
    this.errorMessages=[]
    debugger;
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next:(response:any)=> {
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl).then(() => {
              window.location.reload(); 
            });
            // this.router.navigateByUrl(this.returnUrl);
            // window.location.assign(this.returnUrl);
            // window.location.reload();
          } else {
            console.log(response)
            this.router.navigate(['admin']).then(() => {
              window.location.reload();
            });
          // this.router.navigate(['admin']);
          // window.location.assign('admin');
          // window.location.reload();
          }
        },
        error: error => {
          if (error.error.errors) {
            this.errorMessages = error.error.errors;
          } else {
            this.errorMessages.push(error.error);
          }
        }
      })
    }
  }
  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
      // Add your login logic here
    }
  }
}
