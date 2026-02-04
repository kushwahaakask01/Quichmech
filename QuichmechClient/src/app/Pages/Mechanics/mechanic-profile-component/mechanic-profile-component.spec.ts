import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicProfileComponent } from './mechanic-profile-component';

describe('MechanicProfileComponent', () => {
  let component: MechanicProfileComponent;
  let fixture: ComponentFixture<MechanicProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MechanicProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechanicProfileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
