import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicCardComponent } from './mechanic-card-component';

describe('MechanicCardComponent', () => {
  let component: MechanicCardComponent;
  let fixture: ComponentFixture<MechanicCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MechanicCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechanicCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
