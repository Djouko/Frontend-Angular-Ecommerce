import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  displayedColumns: string[] = ['Id', 'Product Name', 'Name', 'Address', 'Contact No.', 'Status', 'Action'];
  dataSource = [];

  status: string = 'All';

  constructor(private productService: ProductService,
              private http: HttpClient
    ) { }

  ngOnInit(): void {
    this.getAllOrderDetailsForAdmin(this.status);
  }

  getReport() {
    this.http.get('http://localhost:9090/pdfOrder', { responseType: 'blob' }).subscribe(res => {
      const file = new Blob([res], { type: 'application/pdf' });
      saveAs(file, 'OrderList.pdf');
    });
  }

  getAllOrderDetailsForAdmin(statusParameter: string) {
    this.productService.getAllOrderDetailsForAdmin(statusParameter).subscribe(
      (resp) => {
        this.dataSource = resp;
        console.log(resp);
      }, (error) => {
        console.log(error);
      }
    );
  }

  markAsDelivered(orderId) {
    console.log(orderId);
    this.productService.markAsDelivered(orderId).subscribe(
      (response) => {
        this.getAllOrderDetailsForAdmin(this.status);
        console.log(response);
      }, (error) => {
        console.log(error);
      }
    );
  }

}
