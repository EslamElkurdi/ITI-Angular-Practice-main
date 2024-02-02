import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CartItem, ProductComponent } from '../../product/product.component';
import { CommonModule } from '@angular/common';
import { Icategory } from '../../../models/icategory';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutComponent } from '../../checkOut/checkout/checkout.component';
import { IdCardComponent } from '../../id-card/id-card.component';
import { ApiService } from '../../../servics/api.service';

@Component({
  selector: 'app-order',
  standalone: true,

  imports: [
    ProductComponent,
    CheckoutComponent,
    CommonModule,
    FormsModule,
    IdCardComponent,
    ReactiveFormsModule
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent  implements OnInit{
  @ViewChild(ProductComponent) child!: ProductComponent;

  ngAfterViewInit() {
    //this.callChildMethod(); // Now the childComponent reference is ready
  }
  categories!: Icategory[];
  cartProducts: CartItem[];
  totalPrice: number = 0;
  selectedCatId: number = 0;

  // @Output() onDeleteProduct: EventEmitter<{ name: Iproduct, quantity: number }> ;

  constructor(private apiService: ApiService) {
    // this.onDeleteProduct = new EventEmitter<{ name: Iproduct, quantity: number }>()

    this.cartProducts = [];

    // this.categories = [
    //   { id: 10, name: 'Mobile' },
    //   { id: 20, name: 'Laptop' },
    //   { id: 30, name: 'Tablet' },
    //   { id: 40, name: 'Camera' },
    //   { id: 50, name: 'Headphones' },
    //   { id: 60, name: 'Smartwatch' },
    // ];


  }
  ngOnInit(): void {
    this.apiService.getAllCategories().subscribe((data)=>{
      this.categories = data;
    })
  }

  callChildMethodToRemoveProduct(product: CartItem) {
    this.child.deleteProduct(product);
    this.removeProduct(product);
  }

  viewTotalProducts(cartItems: CartItem[]) {
    this.cartProducts = cartItems.map((cartItem) => ({
      product: {
        id: cartItem.product.id,
        name: cartItem.product.name,
        quantity: cartItem.product.quantity,
        price: cartItem.product.price,
        imgUrl: cartItem.product.imgUrl,
        catId: cartItem.product.catId,
      },
      quantity: cartItem.quantity,
    }));

    this.calculateTotalPrice(this.cartProducts);
  }

  calculateTotalPrice(cartItems: CartItem[]) {
    this.totalPrice = 0;

    for (let i = 0; i < cartItems.length; i++) {
      this.totalPrice += cartItems[i].product.price * cartItems[i].quantity;
    }

    // console.log(`Total: ${this.totalPrice}`);
  }

  removeProduct(productToRemove: CartItem): void {
    const index = this.cartProducts.findIndex(
      (item) => item.product.id === productToRemove.product.id
    );

    if (index !== -1 && productToRemove.quantity > 1) {
      this.cartProducts[index].quantity -= 1;
      this.calculateTotalPrice(this.cartProducts);
    } else if (index !== -1) {
      this.cartProducts.splice(index, 1);
      this.calculateTotalPrice(this.cartProducts); // Recalculate total price
    }
    console.log(this.cartProducts);
  }

  updatedQuantityOfProducts() {
    this.child.NotifyToUpdate();
  }
}
