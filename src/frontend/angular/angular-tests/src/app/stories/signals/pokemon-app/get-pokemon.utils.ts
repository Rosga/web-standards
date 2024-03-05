import { HttpClient } from '@angular/common/http';
import { assertInInjectionContext, inject } from '@angular/core';

export type PokemonType = {
  id: number;
  name: string;
  sprites: { [key: string]: string };
};


export function getPokemonFn() {
    assertInInjectionContext(getPokemonFn);
    const httpClient = inject(HttpClient);
    const URL = `https://pokeapi.co/api/v2/pokemon`;

    return function (id: number) {
      return httpClient.get<PokemonType>(`${URL}/${id}/`)
    }
}
