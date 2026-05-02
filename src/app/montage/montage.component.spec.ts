import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MontageComponent } from './montage.component';

describe('MontageComponent', () => {
  let component: MontageComponent;
  let fixture: ComponentFixture<MontageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MontageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MontageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
