import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMontageComponent } from './add-montage.component';

describe('AddMontageComponent', () => {
  let component: AddMontageComponent;
  let fixture: ComponentFixture<AddMontageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMontageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMontageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
