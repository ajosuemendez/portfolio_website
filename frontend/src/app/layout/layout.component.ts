import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { LanguageService } from '../services/language.service'; // adjust path as needed

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('contentArea') contentArea!: ElementRef<HTMLElement>;

  isScrolled = false;
  isHome = false;

  selectedLang: 'en' | 'de' = 'en';

  private languageSubscription: any;

  constructor(private router: Router, private languageService: LanguageService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHome = this.router.url === '/' || this.router.url === '/home';
      }
    });
  }

  ngOnInit() {
    this.setViewportHeight();
    window.addEventListener('resize', this.setViewportHeight);

    // Subscribe to language changes
    this.languageSubscription = this.languageService.language$.subscribe(lang => {
      this.selectedLang = lang;
    });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.setViewportHeight);
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  ngAfterViewInit(): void {
    this.contentArea.nativeElement.addEventListener('scroll', () => {
      this.isScrolled = this.contentArea.nativeElement.scrollTop > 440;
    });
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  toggleLanguage() {
    this.languageService.toggleLanguage();
  }
}
