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
      tech: ['Angular', 'TypeScript', 'Nginx', 'Docker'],
      description: 'A personal portfolio showcasing my work and resume.',
      expanded: false
    },
    {
      title: 'Online Chatbot Escape Room',
      tech: ['React', 'Python', 'Rasa', 'Docker'],
      description: 'An online chatbot for playing escape rooms.',
      expanded: false
    },
    {
      title: 'Feelinguo',
      tech: ['Angular', 'TypeScript', 'Node.js'],
      description: 'A platform for learning languages in a fun and easy way.',
      expanded: false
    },
    {
      title: 'Decision Support App - Slack',
      tech: ['React', 'Python', 'MySQL'],
      description: 'App that helps groups to make important decision while traveling on the phone/tablet.',
      expanded: false
    },
    {
      title: '3 Player Chess App',
      tech: ['React', 'Java'],
      description: 'App for scanning rooms and generate 3d models.',
      expanded: false
    },
  ];
}
