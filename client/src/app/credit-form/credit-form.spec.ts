import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditForm } from './credit-form';

describe('CreditForm', () => {
  let component: CreditForm;
  let fixture: ComponentFixture<CreditForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
