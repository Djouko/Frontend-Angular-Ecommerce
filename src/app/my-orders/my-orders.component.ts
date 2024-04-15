import { Component, OnInit } from '@angular/core';
import { MyOrderDetails } from '../_model/order.model';
import { ProductService } from '../_services/product.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  displayedColumns = ["Name", "Address", "Contact No.", "Amount", "Status", "Action"];

  myOrderDetails: MyOrderDetails[] = [];

  constructor(private productService: ProductService,
              private http: HttpClient
    ) { }

  ngOnInit(): void {
    this.getOrderDetails();
  }

  facture(orderId: any) {
    this.http.get('http://localhost:9090/pdfInvoice/'+orderId, { responseType: 'blob' }).subscribe(res => {
      const file = new Blob([res], { type: 'application/pdf' });
      saveAs(file, 'Invoice.pdf');
    });
  }

  getOrderDetails() {
    this.productService.getMyOrders().subscribe(
      (resp: MyOrderDetails[]) => {
        console.log(resp);
        this.myOrderDetails = resp;
      }, (err)=> {
        console.log(err);
      }
    );
  }

}
