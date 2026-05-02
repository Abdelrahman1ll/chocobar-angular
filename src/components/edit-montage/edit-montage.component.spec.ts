import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMontageComponent } from './edit-montage.component';

describe('EditMontageComponent', () => {
  let component: EditMontageComponent;
  let fixture: ComponentFixture<EditMontageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMontageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMontageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
