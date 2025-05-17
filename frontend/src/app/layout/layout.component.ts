import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements AfterViewInit {
  @ViewChild('contentArea') contentArea!: ElementRef<HTMLElement>;

  isScrolled = false;
  isHome = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHome = this.router.url === '/' || this.router.url === '/home';
      }
    });
  }

  ngOnInit() {
    this.setViewportHeight();
    window.addEventListener('resize', this.setViewportHeight);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.setViewportHeight);
  }

  setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  ngAfterViewInit(): void {
  this.contentArea.nativeElement.addEventListener('scroll', () => {
    this.isScrolled = this.contentArea.nativeElement.scrollTop > 440;
    console.log('ScrollTop:', this.contentArea.nativeElement.scrollTop, 'isScrolled:', this.isScrolled);
  });
}
  navigate(path: string): void {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
