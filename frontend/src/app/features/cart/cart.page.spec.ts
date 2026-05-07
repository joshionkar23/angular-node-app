import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CartPageComponent } from './cart.page';

describe('CartPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartPageComponent],
      providers: [provideHttpClient(), provideRouter([])]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CartPageComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
