import { Routes } from '@angular/router';
import { PokemonPage } from './stories/signals/pokemon-app/pokemon.page';

const routes: Routes = [
    {
        path: 'stories/signals/pokemon',
        component: PokemonPage,
    },
    {
        path: 'stories/signals/pokemon/pidgeotto',
        loadComponent: () => import('./stories/signals/pokemon-app/pokemon.component').then((m) => m.PokemonComponent),
        data: {
            id: 17,
            backgroundColor: 'magenta',
            transformedText: 'magenta',
        }
    },
];

export { routes };
