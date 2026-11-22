import { AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { translations } from '../../../translations/translations';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'projects',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements AfterViewInit, OnDestroy {
  @ViewChildren(CardComponent, { read: ElementRef }) cards!: QueryList<ElementRef>;
  @ViewChild('titleRef') titleRef!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  projects: any[] = [];
  projectsTitle = '';
  activeIndex = 0;

  private langSub!: Subscription;
  private observer!: IntersectionObserver;

  constructor(private languageService: LanguageService) {
    this.langSub = this.languageService.language$.subscribe(lang => {
      this.projects = translations[lang].projects;
      this.projectsTitle = translations[lang].projectsTitle;

      // Re-observe cards after language change
      setTimeout(() => this.observeCards(), 0);
    });
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe title
    if (this.titleRef?.nativeElement) {
      this.observer.observe(this.titleRef.nativeElement);
    }

    // Observe initial cards
    this.observeCards();

    // Subscribe to cards changes in case of dynamic updates
    this.cards.changes.subscribe(() => this.observeCards());
  }

  private observeCards() {
    if (!this.cards || !this.observer) return;
    this.cards.forEach(card => this.observer.observe(card.nativeElement));
  }

  onScroll(): void {
    const container = this.scrollContainer.nativeElement;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.offsetWidth;
    const newIndex = Math.round(scrollLeft / containerWidth);
    if (newIndex !== this.activeIndex) {
      this.activeIndex = newIndex;
    }
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
