import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { translations } from '../../../translations/translations';
import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit, OnDestroy {
  @Input() project: any;  // Accepts a single project object

  @ViewChild('cardRef') cardRef!: ElementRef<HTMLDivElement>;

  isMobile = false;

  visitSiteText = 'Visit Site';
  private langSub!: Subscription;

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.langSub = this.languageService.language$.subscribe(lang => {
      this.visitSiteText = translations[lang].uiText.visitSite;
    });
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkMobile);
    this.langSub.unsubscribe();
  }

  checkMobile = () => {
    this.isMobile = window.innerWidth <= 768;
  }

  // toggleDetails() {
  //   this.project.expanded = !this.project.expanded;

  //   if (this.project.expanded) {
  //     setTimeout(() => {
  //       this.cardRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //     }, 300); // Adjust delay to match CSS transition duration
  //   }
  // }
}
