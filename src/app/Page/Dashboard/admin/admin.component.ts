import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  constructor(public authService:AuthService){}
  isExpanded = true;
  isOpen = false;
  menuItems = [
    { 
      icon: 'home', 
      label: 'Dashboard', 
      path: '#',
      isExpanded: false,
      children: [
        { icon: 'users', label: 'Dashboard', path: '/admin/dashboard' }
      ]
    },
    { 
      icon: 'users', 
      label: 'Master File', 
      path: '#',
      isExpanded: false,
      children: [
        { icon: 'users', label: 'Category', path: '/admin/category' },
        { icon: 'users', label: 'Sub Category', path: '/admin/subCategory' },
        { icon: 'settings', label: 'Location', path: '/admin/location' },
        { icon: 'users', label: 'Supplier', path: '/admin/supplier' }
      ]
    },
    { icon: 'settings', label: 'Settings', path: '/settings' },
    { icon: 'help', label: 'Help', path: '/help' }
  ];

  
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
  
  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
    console.log(this.menuItems)
  }

  isUserMenuOpen = true;
  isFullscreen = false;
  currentDate = new Date();
  userProfileImage: any;
  
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        this.isFullscreen = true;
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        this.isFullscreen = false;
      }).catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  }

  logout(){
    this.authService.logout();
  }
}
