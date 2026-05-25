import { Category } from './types';

export const DATA_VERSION = '2.0-spanish';

export const categories: Category[] = [
  {
    id: 'actors',
    name: 'Actores y Actrices',
    group: 'entertainment',
    icon: 'user',
    color: 'oklch(0.65 0.20 330)'
  },
  {
    id: 'movies',
    name: 'Películas',
    group: 'entertainment',
    icon: 'film',
    color: 'oklch(0.60 0.22 20)'
  },
  {
    id: 'musicians',
    name: 'Músicos',
    group: 'entertainment',
    icon: 'music-notes',
    color: 'oklch(0.68 0.20 280)'
  },
  {
    id: 'songs',
    name: 'Canciones',
    group: 'entertainment',
    icon: 'microphone',
    color: 'oklch(0.70 0.18 140)'
  },
  {
    id: 'albums',
    name: 'Álbumes',
    group: 'entertainment',
    icon: 'disc',
    color: 'oklch(0.62 0.24 50)'
  },
  {
    id: 'cities',
    name: 'Ciudades',
    group: 'places',
    icon: 'buildings',
    color: 'oklch(0.55 0.18 240)'
  },
  {
    id: 'restaurants',
    name: 'Restaurantes',
    group: 'places',
    icon: 'fork-knife',
    color: 'oklch(0.70 0.22 80)'
  },
  {
    id: 'streets',
    name: 'Calles',
    group: 'places',
    icon: 'signpost',
    color: 'oklch(0.58 0.15 220)'
  },
  {
    id: 'clothing-brands',
    name: 'Marcas de Ropa',
    group: 'brands',
    icon: 't-shirt',
    color: 'oklch(0.65 0.20 160)'
  },
  {
    id: 'shoe-brands',
    name: 'Marcas de Calzado',
    group: 'brands',
    icon: 'sneaker',
    color: 'oklch(0.60 0.22 200)'
  },
  {
    id: 'watch-brands',
    name: 'Marcas de Relojes',
    group: 'brands',
    icon: 'watch',
    color: 'oklch(0.50 0.18 260)'
  },
  {
    id: 'perfume-brands',
    name: 'Marcas de Perfumes',
    group: 'brands',
    icon: 'drop',
    color: 'oklch(0.72 0.18 320)'
  },
  {
    id: 'luxury-brands',
    name: 'Marcas de Lujo',
    group: 'brands',
    icon: 'diamond',
    color: 'oklch(0.58 0.20 40)'
  }
];

export { spanishMemoryItems as sampleMemoryItems } from './spanish-data';
