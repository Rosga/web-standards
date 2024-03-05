import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PokemonComponent } from './pokemon.component';

@Component({
  selector: 'app-pokemon-page',
  templateUrl: './pokemon.page.html',
  styleUrls: ['./pokemon.page.scss'],
  standalone: true,
  imports: [CommonModule, PokemonComponent],
})
export class PokemonPage {
  // Add your component logic here
}
