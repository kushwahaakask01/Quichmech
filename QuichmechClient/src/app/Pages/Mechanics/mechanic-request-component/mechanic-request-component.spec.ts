import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicRequestComponent } from './mechanic-request-component';

describe('MechanicRequestComponent', () => {
  let component: MechanicRequestComponent;
  let fixture: ComponentFixture<MechanicRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MechanicRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechanicRequestComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
