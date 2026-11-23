import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { translations } from '../../../translations/translations';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit, OnDestroy {
  contactCopy: any = translations.en.contact;
  readonly email = 'ajosuemendez@gmail.com';
  readonly linkedinUrl = 'https://www.linkedin.com/in/alejandro-josue-mendez-lopez-a526a321b/';
  copyState: 'copied' | 'unavailable' | null = null;

  private languageSubscription?: Subscription;
  private copyTimer?: ReturnType<typeof setTimeout>;

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languageSubscription = this.languageService.language$.subscribe((lang) => {
      this.contactCopy = translations[lang].contact;
    });
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
    if (this.copyTimer) {
      clearTimeout(this.copyTimer);
    }
  }

  get copyFeedback(): string {
    if (this.copyState === 'copied') {
      return this.contactCopy.copiedMessage;
    }
    if (this.copyState === 'unavailable') {
      return this.contactCopy.copyFallbackMessage;
    }
    return '';
  }

  async copyEmail(): Promise<void> {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard unavailable');
      }
      await navigator.clipboard.writeText(this.email);
      this.copyState = 'copied';
    } catch {
      this.copyState = 'unavailable';
    }

    if (this.copyTimer) {
      clearTimeout(this.copyTimer);
    }
    this.copyTimer = setTimeout(() => {
      this.copyState = null;
      this.copyTimer = undefined;
    }, 2600);
  }
}
