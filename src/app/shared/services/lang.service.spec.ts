import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { LangService } from './lang.service';

describe('LangService', () => {
  let service: LangService;
  let translate: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    localStorage.clear();
    translate = jasmine.createSpyObj<TranslateService>('TranslateService', ['use']);
    translate.use.and.returnValue(of({}));
    TestBed.configureTestingModule({ providers: [LangService, { provide: TranslateService, useValue: translate }] });
    service = TestBed.inject(LangService);
  });

  it('does not emit until the initial translation is ready', async () => {
    const emitted: string[] = [];
    service.langChanged$.subscribe(lang => emitted.push(lang));
    expect(emitted).toEqual([]);
    await service.initialize();
    expect(translate.use).toHaveBeenCalledWith('en-US');
    expect(emitted).toEqual(['en-US']);
    expect(document.documentElement.lang).toBe('en');
  });

  it('loads a valid stored locale before emitting it', async () => {
    localStorage.setItem('app-lang', 'vi-VN');
    await service.initialize();
    expect(translate.use).toHaveBeenCalledWith('vi-VN');
    expect(service.getLang()).toBe('vi-VN');
    expect(document.documentElement.lang).toBe('vi');
  });

  it('falls back to English when the stored locale cannot be loaded', async () => {
    localStorage.setItem('app-lang', 'vi-VN');
    translate.use.and.callFake(lang => lang === 'vi-VN' ? throwError(() => new Error('load failed')) : of({}));
    const emitted: string[] = [];
    service.langChanged$.subscribe(lang => emitted.push(lang));
    await service.initialize();
    expect(translate.use.calls.allArgs()).toEqual([['vi-VN'], ['en-US']]);
    expect(emitted).toEqual(['en-US']);
    expect(localStorage.getItem('app-lang')).toBe('en-US');
  });

  it('emits a new locale only after switching succeeds', async () => {
    const emitted: string[] = [];
    service.langChanged$.subscribe(lang => emitted.push(lang));
    await service.initialize();
    await service.setLang('vi-VN');
    expect(emitted).toEqual(['en-US', 'vi-VN']);
    expect(service.getLang()).toBe('vi-VN');
  });
});
