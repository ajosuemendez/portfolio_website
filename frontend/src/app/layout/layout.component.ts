import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { translations } from '../../translations/translations';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('contentArea') contentArea!: ElementRef<HTMLElement>;

  selectedLang: 'en' | 'de' = 'en';
  navLabels: Record<keyof typeof translations.en.navLabels, string> = translations.en.navLabels;
  uiText: Record<keyof typeof translations.en.uiText, string> = translations.en.uiText;
  mobileMenuOpen = false;
  currentRoute = '/';
  orbitActiveIndex = 0;
  wrapRoutePaths: string[] = [];
  private orbitWheelDelta = 0;
  private orbitWheelLocked = false;

  readonly navItems: { path: string; label: keyof typeof translations.en.navLabels }[] = [
    { path: '/', label: 'home' },
    { path: '/me', label: 'me' },
    { path: '/work', label: 'work' },
    { path: '/email', label: 'email' },
    { path: '/cv', label: 'cv' },
  ];

  readonly socialLinks = {
    linkedin: 'https://www.linkedin.com/in/alejandro-josue-mendez-lopez-a526a321b/',
    github: 'https://github.com/ajosuemendez',
    email: 'ajosuemendez@gmail.com',
  };

  get orbitNavItems(): Array<{
    path: string;
    label: keyof typeof translations.en.navLabels;
    left: number;
    top: number;
    distance: number;
    isCurrent: boolean;
    isWrapping: boolean;
    hoverRotation: number;
  }> {
    const centerX = 40;
    const centerY = 240;
    const radiusX = 190;
    const radiusY = 230;

    return this.navItems.map((item, index) => {
      const relativeIndex = (index - this.orbitActiveIndex + this.navItems.length) % this.navItems.length;
      const slot = relativeIndex > this.navItems.length / 2
        ? relativeIndex - this.navItems.length
        : relativeIndex;
      const angle = (slot * 45 * Math.PI) / 180;
      const hoverRotation = slot === -2 ? -15 : slot === -1 ? -10 : slot === 1 ? 10 : slot === 2 ? 15 : 0;
      return {
        ...item,
        left: centerX + radiusX * Math.cos(angle),
        top: centerY + radiusY * Math.sin(angle),
        distance: Math.abs(slot),
        isCurrent: index === this.orbitActiveIndex,
        isWrapping: this.wrapRoutePaths.includes(item.path),
        hoverRotation,
      };
    });
  }

  private get activeRouteIndex(): number {
    const routePath = this.getRoutePath(this.currentRoute);
    return this.navItems.findIndex((item) => item.path === routePath);
  }

  private getRoutePath(route: string): string {
    return route.split(/[?#]/, 1)[0].replace(/\/+$/, '') || '/';
  }

  trackByNavPath(_index: number, item: { path: string }): string {
    return item.path;
  }

  private languageSubscription?: Subscription;
  private routerSubscription?: Subscription;
  private wrapCleanupTimer?: ReturnType<typeof setTimeout>;
  private orbitWheelTimer?: ReturnType<typeof setTimeout>;

  constructor(private languageService: LanguageService, private router: Router) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.orbitActiveIndex = Math.max(0, this.activeRouteIndex);
    this.languageSubscription = this.languageService.language$.subscribe((lang) => {
      this.selectedLang = lang;
      document.documentElement.lang = lang;
      this.navLabels = translations[lang].navLabels;
      this.uiText = translations[lang].uiText;
    });
  }

  ngAfterViewInit(): void {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const nextIndex = this.navItems.findIndex(
          (item) => item.path === this.getRoutePath(event.urlAfterRedirects)
        );

        this.animateOrbitTo(nextIndex);
        this.currentRoute = event.urlAfterRedirects;
        this.contentArea.nativeElement.scrollTop = 0;
        this.mobileMenuOpen = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
    if (this.wrapCleanupTimer) {
      clearTimeout(this.wrapCleanupTimer);
      this.wrapCleanupTimer = undefined;
    }
    if (this.orbitWheelTimer) {
      clearTimeout(this.orbitWheelTimer);
      this.orbitWheelTimer = undefined;
    }
  }

  private animateOrbitTo(targetIndex: number): void {
    if (targetIndex < 0 || targetIndex === this.orbitActiveIndex) {
      return;
    }

    if (this.wrapCleanupTimer) {
      clearTimeout(this.wrapCleanupTimer);
      this.wrapCleanupTimer = undefined;
    }

    const previousIndex = this.orbitActiveIndex;
    const wrappingPaths = this.navItems
      .filter((_, index) => Math.abs(
        this.getOrbitSlot(index, targetIndex) - this.getOrbitSlot(index, previousIndex)
      ) > 2)
      .map((item) => item.path);

    this.orbitActiveIndex = targetIndex;
    this.wrapRoutePaths = wrappingPaths;

    if (wrappingPaths.length > 0) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.wrapCleanupTimer = setTimeout(() => {
        this.wrapRoutePaths = [];
        this.wrapCleanupTimer = undefined;
      }, reduceMotion ? 0 : 720);
    }
  }

  private getOrbitSlot(routeIndex: number, activeIndex: number): number {
    const relativeIndex = (routeIndex - activeIndex + this.navItems.length) % this.navItems.length;
    return relativeIndex > this.navItems.length / 2
      ? relativeIndex - this.navItems.length
      : relativeIndex;
  }

  onOrbitWheel(event: WheelEvent): void {
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (delta === 0) {
      return;
    }

    event.preventDefault();
    if (this.orbitWheelLocked) {
      return;
    }

    this.orbitWheelDelta += delta;
    if (Math.abs(this.orbitWheelDelta) < 40) {
      return;
    }

    const direction = Math.sign(this.orbitWheelDelta);
    this.orbitWheelDelta = 0;
    const nextIndex = (this.orbitActiveIndex + direction + this.navItems.length) % this.navItems.length;
    if (nextIndex === this.orbitActiveIndex) {
      return;
    }

    this.orbitWheelLocked = true;
    this.orbitWheelTimer = setTimeout(() => {
      this.orbitWheelLocked = false;
      this.orbitWheelTimer = undefined;
    }, 720);
    this.router.navigate([this.navItems[nextIndex].path]);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenu(): void {
    this.mobileMenuOpen = false;
  }

  setLanguage(lang: 'en' | 'de'): void {
    this.languageService.setLanguage(lang);
    this.closeMenu();
  }
}
