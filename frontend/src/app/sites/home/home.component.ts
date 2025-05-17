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
export class HomeComponent {}
