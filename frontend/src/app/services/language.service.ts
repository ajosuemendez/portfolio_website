import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private languageSubject = new BehaviorSubject<'en' | 'de'>('en');
  language$ = this.languageSubject.asObservable();

  toggleLanguage() {
    const current = this.languageSubject.value;
    this.languageSubject.next(current === 'en' ? 'de' : 'en');
  }

  setLanguage(language: 'en' | 'de') {
    this.languageSubject.next(language);
  }

  getCurrentLanguage() {
    return this.languageSubject.value;
  }
}
