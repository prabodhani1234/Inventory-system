import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AlertComponent } from "./Component/alert/alert.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, AlertComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isExpanded = true;
  menuItems = [
    { 
      icon: 'home', 
      label: 'Home', 
      path: '/home',
      isExpanded: false,
      children: [
        { icon: 'users', label: 'Dashboard', path: '/home/dashboard' }
      ]
    },
    { icon: 'users', label: 'Users', path: '/users' },
    { icon: 'settings', label: 'Settings', path: '/settings' },
    { icon: 'help', label: 'Help', path: '/help' }
  ];

  
  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
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
}
