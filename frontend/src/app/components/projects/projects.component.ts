import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChildren,
  ViewChild,
  HostListener,
} from '@angular/core';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'projects',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements AfterViewInit {
  @ViewChildren(CardComponent, { read: ElementRef }) cards!: QueryList<ElementRef>;
  @ViewChild('titleRef') titleRef!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  projects = [
    {
      title: 'Decision Support App - Slack',
      tech: ['React', 'Python', 'MySQL'],
      description: 'App that helps groups to make important decision while traveling on the phone/tablet.',
      expanded: false,
      link: 'https://info.ajosuemendez.com/decision-support/',
      imagePath: 'assets/images/dsp-frontpage.png',
    },
    {
      title: 'Online Training Chatbot',
      tech: ['React', 'Python', 'Rasa', 'Docker'],
      description: 'Simulation of people with psychological problems using chatbots for training using appropriate conversation methods..',
      expanded: false,
      imagePath: 'assets/images/chatbot-demo.png',
    },
    {
      title: 'Portfolio Website',
      tech: ['Angular', 'TypeScript', 'Nginx', 'Docker'],
      description: 'A personal portfolio showcasing my work and resume.',
      expanded: false,
      imagePath: 'assets/images/portfolio.png',
    },
  ];

  activeIndex = 0;

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (this.titleRef?.nativeElement) observer.observe(this.titleRef.nativeElement);
    this.cards.forEach((card) => observer.observe(card.nativeElement));
  }

  onScroll(): void {
    const container = this.scrollContainer.nativeElement;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.offsetWidth;

    // Each card takes full width (100%), so we can determine the index by scroll position
    const newIndex = Math.round(scrollLeft / containerWidth);

    if (newIndex !== this.activeIndex) {
      this.activeIndex = newIndex;
    }
  }
}
