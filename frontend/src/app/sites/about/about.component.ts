import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { translations } from '../../../translations/translations';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('aboutContent') private aboutContent?: ElementRef<HTMLElement>;

  aboutCopy: any = translations.en.about;
  activeTab: 'intro' | 'capabilities' | 'experience' | 'education' = 'intro';

  private readonly tabOrder: Array<'intro' | 'capabilities' | 'experience' | 'education'> = [
    'intro',
    'experience',
    'capabilities',
    'education',
  ];
  private languageSubscription?: Subscription;
  private revealObserver?: IntersectionObserver;
  private revealMutationObserver?: MutationObserver;
  private observedRevealTargets = new WeakSet<Element>();

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languageSubscription = this.languageService.language$.subscribe((lang) => {
      this.aboutCopy = translations[lang].about;
    });
  }

  ngAfterViewInit(): void {
    const content = this.aboutContent?.nativeElement;
    if (!content) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      content.querySelectorAll('.scroll-reveal').forEach((element) => element.classList.add('is-in-view'));
      return;
    }

    this.revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
          this.revealObserver?.unobserve(entry.target);
        }
      });
    }, {
      root: content,
      threshold: 0.12,
      rootMargin: '0px 0px -48px 0px',
    });

    this.observeRevealTargets();

    if (typeof MutationObserver !== 'undefined') {
      this.revealMutationObserver = new MutationObserver(() => this.observeRevealTargets());
      this.revealMutationObserver.observe(content, { childList: true, subtree: true });
    }
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
    this.revealObserver?.disconnect();
    this.revealMutationObserver?.disconnect();
  }

  private observeRevealTargets(): void {
    const content = this.aboutContent?.nativeElement;
    if (!content || !this.revealObserver) {
      return;
    }

    content.querySelectorAll('.scroll-reveal').forEach((element) => {
      if (!this.observedRevealTargets.has(element)) {
        this.observedRevealTargets.add(element);
        this.revealObserver?.observe(element);
      }
    });
  }

  selectTab(tab: 'intro' | 'capabilities' | 'experience' | 'education'): void {
    this.activeTab = tab;
    this.centerActiveTab(tab);
  }

  scrollToSection(event: Event, tab: 'intro' | 'capabilities' | 'experience' | 'education'): void {
    event.preventDefault();
    this.selectTab(tab);

    const panel = document.getElementById('about-content');
    const section = document.getElementById(`about-section-${tab}`);
    if (!panel || !section) {
      return;
    }

    const top = section.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop;
    panel.scrollTo({ top, behavior: 'smooth' });
  }

  private centerActiveTab(tab: 'intro' | 'capabilities' | 'experience' | 'education'): void {
    const tabBar = document.getElementById('about-tabs');
    const tabLink = document.getElementById(`about-tab-${tab}`);
    if (!tabBar || !tabLink) {
      return;
    }

    const tabBarRect = tabBar.getBoundingClientRect();
    const tabLinkRect = tabLink.getBoundingClientRect();
    const cue = tabBar.querySelector<HTMLElement>('.about-tabs-overflow-cue');
    const cueWidth = cue?.getBoundingClientRect().width ?? 0;
    const usableWidth = tabBar.clientWidth - cueWidth;
    const left = tabBar.scrollLeft + tabLinkRect.left - tabBarRect.left - (usableWidth - tabLinkRect.width) / 2;
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

    tabBar.scrollTo({ left, behavior });
  }

  onPanelScroll(event: Event): void {
    const panel = event.currentTarget as HTMLElement;
    const activationLine = panel.getBoundingClientRect().top + Math.min(150, panel.clientHeight * 0.3);
    const sections = panel.querySelectorAll<HTMLElement>('[data-about-section]');
    let activeTab = this.tabOrder[0];

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= activationLine) {
        activeTab = section.dataset['aboutSection'] as typeof activeTab;
      }
    });

    if (this.activeTab !== activeTab) {
      this.selectTab(activeTab);
    }
  }
}
