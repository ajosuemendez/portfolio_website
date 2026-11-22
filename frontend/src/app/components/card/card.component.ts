import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { translations } from '../../../translations/translations';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit, OnDestroy {
  @Input() project: any;
  @Input() index = 0;

  visitSiteText = translations.en.uiText.visitSite;
  imageLabel = translations.en.uiText.projectImage;
  externalLinkLabel = translations.en.uiText.externalLink;

  private languageSubscription?: Subscription;

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languageSubscription = this.languageService.language$.subscribe((lang) => {
      this.visitSiteText = translations[lang].uiText.visitSite;
      this.imageLabel = translations[lang].uiText.projectImage;
      this.externalLinkLabel = translations[lang].uiText.externalLink;
    });
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
  }
}
