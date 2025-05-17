// product-list.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'projects',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent {
  projects = [
    {
      title: 'Portfolio Website',
      tech: ['Angular', 'SCSS', 'TypeScript'],
      description: 'A personal portfolio showcasing my work and resume.',
      expanded: false
    },
    {
      title: 'E-commerce Store',
      tech: ['React', 'Node.js', 'MongoDB'],
      description: 'An online store with user authentication and shopping cart.',
      expanded: false
    },
  ];
}
