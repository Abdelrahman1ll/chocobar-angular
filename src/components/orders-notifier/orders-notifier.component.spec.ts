import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersNotifierComponent } from './orders-notifier.component';

describe('OrdersNotifierComponent', () => {
  let component: OrdersNotifierComponent;
  let fixture: ComponentFixture<OrdersNotifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersNotifierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersNotifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
