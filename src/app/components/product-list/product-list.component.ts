import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  currentCategoryName!: string;
  searchMode: boolean = false;
  
  constructor(private productService: ProductService, 
              private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has("keyword");

    if(this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {

    const theKeyword: string = this.route.snapshot.paramMap.get("keyword")!;

    // Now to search for the products using the Keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    );
  }

  handleListProducts()
  {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");

    if(hasCategoryId)
    {
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id")!; // Using + to convert from string to number(integer) and Using ! to tell the compiler that it is not null.
      this.currentCategoryName = this.route.snapshot.paramMap.get("name")!;
    }
    else{
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    }

    // this.productService.getProductList().subscribe(
    //   data => {
    //     this.products = data;
    //   }
    // )          NOW WE WILL HAVE TO UPDATE THIS METHOD TO UPDATE THE PARAMETER CURRENTCATEGORYID

    // NOW To Get The Products For The Given Category Id
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

}
