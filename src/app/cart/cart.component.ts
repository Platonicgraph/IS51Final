import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { LocalStorageService } from '../localStorageService';

export interface IBike {
  id?: number;
  image: string;
  description: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  bikes: Array<IBike> = [];
  name = '';
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    this.bikes = await this.loadbikes();
  }


  calculate() {
    const total = this.bikes.reduce((inc, item, i, arr) => {
      inc += item.price * item.quantity;
      return inc;
    }, 0);
    // const taxAmount = total * .1;
    console.log('test for total: ', total);
    // const subTotal = total - taxAmount;
    return {
      total: total,
      taxAmount: total * .1,
      subTotal: total + (total * .10)
    };
  }

  // calculate() {
  //   let owed = 0;
  //   for (let i = 0; i < this.bikes.length; i++) {
  //     // console.log('i---->', i, 'this.contacts[i]', this.contacts[i]);
  //     owed += this.bikes[i].price;
  //   }
  //   return {
  //     numberOfContacts: this.bikes.length,
  //     subTotal: owed,
  //     taxAmount: owed * .10,
  //     total: owed + (owed * .10)
  //   };
  // }

  checkout() {
    const commaIndex = this.name.indexOf(', ');
    let error = false;

    if (this.name === '') {
      // this.errorMessage = 'Name must not be empty!';
      this.toastService.showToast('warning', 5000, 'Name must not be null');
      error = true;
    } else if (commaIndex === -1) {
      // this.errorMessage = 'Name must have a comma and a space!';
      this.toastService.showToast('warning', 5000, 'Name must contain a comma and a space');
      error = true;
    }

    if (!error) {
      const firstName = this.name.slice(commaIndex + 1, this.name.length);
      const lastName = this.name.slice(0, commaIndex);
      const fullName = firstName + ' ' + lastName;
      console.log('full name is: ', fullName);
      // const data = this.calculate();
      // localStorage.setItem('calculatedData', JSON.stringify(data));
      const data = this.calculate();
      localStorage.setItem('calculatedData', JSON.stringify(data));
      this.router.navigate(['invoice', data]);
    }
  }

  addItem(item: string) {
    if (item === 'bikeModel1') {
      this.bikes.unshift({
        'id': 1,
        'image': '../../assets/bike1.jpeg',
        'description': 'Bike Model 1',
        'price': 5000,
        'quantity': 1
      });
    } else if (item === 'bikeModel2') {
      this.bikes.unshift({
        'id': 2,
        'image': '../../assets/bike2.jpeg',
        'description': 'Bike Model 2',
        'price': 4000,
        'quantity': 2
      });
    } else if (item === 'bikeModel3') {
      this.bikes.unshift({
        'id': 3,
        'image': '../../assets/bike3.jpeg',
        'description': 'Bike Model 3',
        'price': 3000,
        'quantity': 3
      });
    }
  }

  removeFromCart(index: number) {
    this.bikes.splice(index, 1);
  }

  saveToLocalStorage() {
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
  }

  async loadbikes() {
    let bikes = JSON.parse(localStorage.getItem('bikes'));
    if (bikes && bikes.length > 0) {
      bikes = bikes;
    } else {
      bikes = await this.loadbikesFromJson();
    }
    this.bikes = bikes;
    return bikes;
  }

  async loadbikesFromJson() {
    const contacts = await this.http.get('assets/inventory.json').toPromise();
    return contacts.json();
  }

}
