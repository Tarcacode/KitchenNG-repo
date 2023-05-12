import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecipeService } from './recipe.service';
import { IRecipe } from './recipe';
import { Subscription } from 'rxjs';
import { IXPagination } from '../shared/xpagination';

@Component({ templateUrl: './recipe-list.component.html' })
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: IRecipe[] = [];
  searchString: string = '';
  errorMessage: string = '';
  currentPage: number = 1;
  pageNumber: number = 1;
  pageSize: number = 2;
  totalPages: number = 1;
  totalItems: number = 1;
  sub!: Subscription;
  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.getRecipes();
  }

  private extractPaginationHeader(paginationHeader: string | null): void {
    if (paginationHeader !== null) {
      let xPagination: IXPagination = JSON.parse(paginationHeader);
      this.totalPages = xPagination.TotalPageCount;
      this.totalItems = xPagination.TotalItemCount;
      this.currentPage = xPagination.PageNumber;
    }
  }

  private getRecipes(): void {
    this.sub = this.recipeService
      .getRecipes(this.pageNumber, this.pageSize)
      .subscribe({
        next: (response) => {
          let responseBody: IRecipe[] | null = response.body;
          if (responseBody !== null) {
            this.recipes = responseBody;
          }
          let paginationHeader: string | null =
            response.headers.get('X-Pagination');
          this.extractPaginationHeader(paginationHeader);
        },
        error: (err) => (this.errorMessage = err),
      });
  }

  changePage(page: number): void {
    this.pageNumber = page;
    this.getRecipes();
  }
  
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
