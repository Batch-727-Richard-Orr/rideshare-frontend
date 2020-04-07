import { TestBed } from '@angular/core/testing';

import { RecommendationService } from './recommendation.service';

describe('RecommendationServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecommendationService = TestBed.get(RecommendationService);
    expect(service).toBeTruthy();
  });
});
