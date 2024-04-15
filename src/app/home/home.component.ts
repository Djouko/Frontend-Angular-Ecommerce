import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ImageProcessingService } from '../image-processing.service';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';
import {Report} from '../_model/report';
import { StringResult } from '../_model/stringResult';
import { UserAuthService } from '../_services/user-auth.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pageNumber: number = 0;

  productDetails = [];

  showLoadButton = false;

  report: Report = new Report();

  reportName: StringResult = new StringResult();

  constructor(private productService: ProductService,
    private userAuthService: UserAuthService,
    private imageProcessingService: ImageProcessingService,
    private http: HttpClient,
    private router: Router) { }

    printProduct(){
      this.report.name = "ProductsList";
      this.productService.printProduct(this.report).subscribe(
        result => {
          this.reportName = result;
        }
      )
    }

    getReport() {
      this.http.get('http://localhost:9090/pdf', { responseType: 'blob' }).subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        saveAs(file, 'ProductsList.pdf');
      });
    }

    public isAdmin() {
    return this.userAuthService.isAdmin();
  }
  ngOnInit(): void {
    this.getAllProducts();
  }

  searchByKeyword(searchkeyword) {
    console.log(searchkeyword);
    this.pageNumber = 0;
    this.productDetails = [];
    this.getAllProducts(searchkeyword);
  }

  public getAllProducts(searchKey: string = "") {
    this.productService.getAllProducts(this.pageNumber, searchKey)
    .pipe(
      map((x: Product[], i) => x.map((product: Product) => this.imageProcessingService.createImages(product)))
    )
    .subscribe(
      (resp: Product[]) => {
        console.log(resp);
        if(resp.length == 12) {
          this.showLoadButton = true;
        } else {
          this.showLoadButton = false;
        }
        resp.forEach(p => this.productDetails.push(p));
      }, (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  public loadMoreProduct() {
    this.pageNumber = this.pageNumber + 1;
    this.getAllProducts();
  }

  showProductDetails(productId) {
    this.router.navigate(['/productViewDetails', {productId: productId}]);
  }
}
