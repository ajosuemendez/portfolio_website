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
      title: 'Decision Support App',
      tech: ['React', 'Python', 'MySQL'],
      description: 'App that helps groups to make important decision while traveling on the phone/tablet.',
      expanded: false,
      link: 'https://info.ajosuemendez.com/decision-support/',
      imagePath: 'assets/images/dsp-frontpage.png',
    },
    {
      title: 'Online Training Chatbot',
      tech: ['React', 'Python', 'Rasa', 'Docker'],
      description: 'A simulation platform that uses chatbots to represent individuals with psychological challenges, designed to train users in effective conversational techniques and appropriate communication strategies.',
      expanded: false,
      imagePath: 'assets/images/chatbot-demo.png',
    }
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
