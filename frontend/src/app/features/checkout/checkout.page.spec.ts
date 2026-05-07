import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CheckoutPageComponent } from './checkout.page';

describe('CheckoutPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutPageComponent],
      providers: [provideHttpClient(), provideRouter([])]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
