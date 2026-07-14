import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ContentLoaderService } from './content-loader.service';

describe('ContentLoaderService', () => {
  let service: ContentLoaderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContentLoaderService],
    });

    service = TestBed.inject(ContentLoaderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads JSON from the requested language folder', async () => {
    const payload = [{ label: 'Demo' }];
    const promise = service.loadJson<typeof payload>('en-US', 'fixture.json');

    const request = httpMock.expectOne('assets/params/json/en-US/fixture.json');
    expect(request.request.method).toBe('GET');
    request.flush(payload);

    const result = await promise;
    expect(result).toEqual(payload);
  });
});
