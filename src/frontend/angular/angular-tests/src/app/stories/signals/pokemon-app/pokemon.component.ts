import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { PokemonCardComponent } from './pokemon-card.component';
import { PokemonType, getPokemonFn } from './get-pokemon.utils';
import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule } from '@angular/common/http';

@Component({
  selector: 'pokemon',
  standalone: true,
  imports: [CommonModule, PokemonCardComponent],
  template: `
    <p>Pokemon id: {{ id() }}, Next Pokemon id: {{ nextId() }}</p>
    <p [style.background]="bgColor()">
      Background color: {{ bgColor() }}
    </p>
    <p>Transformed: {{ text() }}</p>

    <div class="container">
       @if (pokemon(); as pokemon) {
           <pokemon-card [pokemon]="pokemon" />
        }

        @if (nextPokemon(); as pokemon) {
             <pokemon-card [pokemon]="pokemon" />
        }
    </div>
    <hr />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonComponent {
  id = input.required<number>();
  nextId = computed(() => this.id() + 1);

  bgColor = input('cyan', { alias: 'backgroundColor' });

  text = input<string, string>('', {
    alias: 'transformedText',
    transform: (v) => `transformed ${v}!`,
  });

  pokemon = signal<PokemonType | undefined>(undefined);
  nextPokemon = signal<PokemonType | undefined>(undefined);

  getPokemon = getPokemonFn();

  constructor() {
    effect((onCleanup) => {
      const sub = this.getPokemon(this.id())
        .subscribe((pokemon) => this.pokemon.set(pokemon));
      const sub2 = this.getPokemon(this.nextId())
        .subscribe((pokemon) => this.nextPokemon.set(pokemon));

      onCleanup(() => {
        sub.unsubscribe();
        sub2.unsubscribe();
      });
    });
  }

}
