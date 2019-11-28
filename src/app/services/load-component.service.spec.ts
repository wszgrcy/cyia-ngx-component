/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LoadComponentService } from './load-component.service';

describe('Service: LoadComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadComponentService]
    });
  });

  it('should ...', inject([LoadComponentService], (service: LoadComponentService) => {
    expect(service).toBeTruthy();
  }));
});
