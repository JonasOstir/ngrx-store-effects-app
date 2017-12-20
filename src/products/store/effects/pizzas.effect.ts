import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Pizza } from '../../models/pizza.model';
import * as pizzaActions from './../actions/pizzas.action';
import * as fromServices from '../../services';

@Injectable()
export class PizzasEffects {
  @Effect()
  loadPizzas$: Observable<Action> = this.actions$.ofType(pizzaActions.LOAD_PIZZAS).pipe(
    switchMap(() => {
      return this.pizzaService
        .getPizzas()
        .pipe(
          map(
            pizzas => new pizzaActions.LoadPizzasSuccess(pizzas),
            catchError(error => of(new pizzaActions.LoadPizzasFail(error)))
          )
        );
    })
  );

  @Effect()
  createPizza$: Observable<Action> = this.actions$
    .ofType(pizzaActions.CREATE_PIZZA)
    .pipe(
      map((action: pizzaActions.CreatePizza) => action.payload),
      switchMap((pizza: Pizza) =>
        this.pizzaService
          .createPizza(pizza)
          .pipe(
            map(pizza => new pizzaActions.CreatePizzaSuccess(pizza)),
            catchError(error => of(new pizzaActions.CreatePizzaFail(error)))
          )
      )
    );

  @Effect()
  updatePizza$: Observable<Action> = this.actions$.ofType(pizzaActions.UPDATE_PIZZA).pipe(
    map((action: pizzaActions.UpdatePizza) => action.payload),
    switchMap((pizza: Pizza) => {
      return this.pizzaService
        .updatePizza(pizza)
        .pipe(
          map(pizza => new pizzaActions.UpdatePizzaSuccess(pizza)),
          catchError(error => of(new pizzaActions.UpdatePizzaFail(error)))
        );
    })
  );

  @Effect()
  deletePizza$: Observable<Action> = this.actions$.ofType(pizzaActions.DELETE_PIZZA).pipe(
    map((action: pizzaActions.DeletePizza) => action.payload),
    switchMap((pizza: Pizza) => {
      return this.pizzaService
        .removePizza(pizza)
        .pipe(
          map(() => new pizzaActions.DeletePizzaSuccess(pizza)),
          catchError(error => of(new pizzaActions.DeletePizzaFail(error)))
        );
    })
  );

  constructor(private actions$: Actions, private pizzaService: fromServices.PizzasService) {}
}
