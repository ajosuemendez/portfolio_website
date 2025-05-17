// product-list.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProjectsComponent } from '../../components/projects/projects.component';

@Component({
  selector: 'home',
  standalone: true,
  imports: [CommonModule, ProjectsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  selectedLang: 'en' | 'de' = 'en';

  toggleLanguage() {
    this.selectedLang = this.selectedLang === 'en' ? 'de' : 'en';
    // You can add logic here to update translations or store preference
  }
}
