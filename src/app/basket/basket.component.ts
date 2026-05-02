import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BackComponent } from '../../components/back/back.component';
import { BasketService } from './basket.service';
import { NgFor } from '@angular/common';
import { BasketProject } from './basket.type';
import { Router } from '@angular/router';
@Component({
  selector: 'app-basket',
  imports: [HeaderComponent, FooterComponent, BackComponent, NgFor],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css',
})
export class BasketComponent {
  constructor(private basketService: BasketService, private router: Router) {}
  basket: BasketProject[] = [];
  Basket() {
    this.basketService.getBasket().subscribe((data) => {
      this.basket = data.basket.Projects as BasketProject[];
      this.basketService.updateBasketCount(this.basket.length);
    });
  }

  deleteBasket(id: string) {
    this.basketService.deleteBasket(id).subscribe(() => {
      this.Basket();
      this.basketService.updateBasketCount(this.basket.length - 1);
    });
  }

  ngOnInit() {
    this.Basket();
  }

  goToPayment() {
    if (this.basket.length > 0) {
      this.router.navigate(['/payment-page']);
    }
  }
}
