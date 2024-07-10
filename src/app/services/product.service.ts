import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = "http://localhost:8080/api/product-category";

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]> { 

    // NOW WE NEED TO build The URL based on category id
    // Will Have To Add The findByCategoryId URL Method In The Spring Boot ProductRepository File Class In The Dao Package Folder
    // Spring Data REST Will Expose the /api/products/search/findByCategoryId?id=1 URL So we can use that URL to get the products for a given Category Id

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    // return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
    //   map(response => response._embedded.products)
    // );

    // return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
    //   map(response => response._embedded.products)
    // );
    return this.getProducts(searchUrl); 
  }

  // We Call An API It returns An Observable Then We Map That JSON Data From the Spring Data REST To ProductCategory Array
  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    // Now We Have To Build The URL Using The Keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;


    // This method is the same as the method in the getProductList method so we can also REFACTOR It and create a method and call it to execute these Statements
    return this.getProducts(searchUrl);
  }


  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
}

// We Use The Interface To Unwrap The JSON From Spring Data REST _embedded Entry

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}