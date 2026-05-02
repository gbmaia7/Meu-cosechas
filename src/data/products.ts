/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Extra {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryKey;
  description: string;
  priceDisplay: string;
  points: number;
  image?: string;
  sizes?: {
    label: string;
    price: number;
  }[];
  extras?: Extra[];
}

export type CategoryKey = 
  | 'Premium' 
  | 'Açaí' 
  | 'Bowl' 
  | 'Linha Caribe' 
  | 'Mix de Frutas' 
  | 'Funcional' 
  | 'Milkshake' 
  | 'Especial';

export const CATEGORY_COLORS: Record<CategoryKey, string> = {
  'Premium': 'bg-purple-500 text-white',
  'Açaí': 'bg-purple-900 text-white',
  'Bowl': 'bg-green-500 text-white',
  'Linha Caribe': 'bg-cyan-500 text-white',
  'Mix de Frutas': 'bg-pink-500 text-white',
  'Funcional': 'bg-green-800 text-white',
  'Milkshake': 'bg-yellow-500 text-black',
  'Especial': 'bg-red-600 text-white',
};

const EXTRA_ACAI: Extra[] = [
  { id: 'extra-granola', name: 'Granola', description: 'Crocante e nutritiva', price: 3.00, icon: 'nutrition' },
  { id: 'extra-aveia', name: 'Aveia', description: 'Fibra natural', price: 3.00, icon: 'grain' },
  { id: 'extra-mel', name: 'Mel de Abelha', description: 'Adoçante natural', price: 3.00, icon: 'health_and_safety' },
];

const EXTRA_FITNESS: Extra[] = [
  { id: 'extra-whey', name: 'Whey Protein', description: 'Mais músculo e saciedade', price: 6.00, icon: 'bolt' },
  { id: 'extra-colageno', name: 'Colágeno', description: 'Pele, cabelo e articulações', price: 5.00, icon: 'local_florist' },
  { id: 'extra-creatina', name: 'Creatina', description: 'Mais energia e desempenho', price: 5.00, icon: 'sync_alt' },
];

const EXTRA_CARIBE: Extra[] = [
  { id: 'extra-colageno', name: 'Colágeno', description: 'Pele, cabelo e articulações', price: 5.00, icon: 'local_florist' },
  { id: 'extra-creatina', name: 'Creatina', description: 'Mais energia e desempenho', price: 5.00, icon: 'sync_alt' },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Colibri Roxo com Iogurte',
    category: 'Premium',
    description: 'Amora, blueberry, morango e cranberry batidos com iogurte.',
    priceDisplay: 'a partir de R$ 21,50',
    points: 1,
    image: 'https://i.imgur.com/NTA4Y3s.png',
    sizes: [
      { label: 'M', price: 21.50 },
      { label: 'G', price: 26.50 },
    ],
    extras: EXTRA_FITNESS
  },
  {
    id: '2',
    name: 'Trio Açaí',
    category: 'Açaí',
    description: 'Açaí cremoso com banana, morango, 3 bolas de sorvete e granola. 700ml.',
    priceDisplay: 'R$ 24,90',
    points: 1,
    extras: EXTRA_ACAI
  },
  {
    id: '3',
    name: 'Açaí Médio',
    category: 'Açaí',
    description: 'Açaí batido com banana ou morango, granola e leite em pó. 500ml.',
    priceDisplay: 'R$ 22,90',
    points: 1,
    extras: EXTRA_ACAI
  },
  {
    id: '4',
    name: 'Açaí Bowl',
    category: 'Bowl',
    description: 'Morango picado, rodelas de banana e granola premium.',
    priceDisplay: 'a partir de R$ 20,50',
    points: 1,
    sizes: [
      { label: 'M', price: 20.50 },
      { label: 'G', price: 25.50 },
    ],
    extras: EXTRA_ACAI
  },
  {
    id: '5',
    name: 'Limonada de Coco',
    category: 'Linha Caribe',
    description: 'Limão, creme de coco e coco ralado. Cremosa e refrescante.',
    priceDisplay: 'a partir de R$ 20,00',
    points: 1,
    sizes: [
      { label: 'M', price: 20.00 },
      { label: 'G', price: 25.00 },
    ],
    extras: EXTRA_CARIBE
  },
  {
    id: '6',
    name: 'Manga + Morango + Abacaxi',
    category: 'Mix de Frutas',
    description: 'Trio tropical batido na hora, sem adição de açúcar.',
    priceDisplay: 'a partir de R$ 15,50',
    points: 1,
    image: 'https://i.imgur.com/CJAF9uZ.png',
    sizes: [
      { label: 'M', price: 15.50 },
      { label: 'G', price: 19.50 },
    ],
    extras: EXTRA_FITNESS
  },
  {
    id: '7',
    name: 'Melancia + Morango + Limão',
    category: 'Mix de Frutas',
    description: 'Refrescante e levinho, perfeito para o calor.',
    priceDisplay: 'a partir de R$ 15,50',
    points: 1,
    image: 'https://i.imgur.com/vB3X9EN.png',
    sizes: [
      { label: 'M', price: 15.50 },
      { label: 'G', price: 19.50 },
    ],
    extras: EXTRA_FITNESS
  },
  {
    id: '8',
    name: 'Acerola + Manga + Laranja',
    category: 'Mix de Frutas',
    description: 'Rico em vitamina C, doce e cítrico na medida certa.',
    priceDisplay: 'a partir de R$ 15,50',
    points: 1,
    image: 'https://i.imgur.com/elWE6s9.png',
    sizes: [
      { label: 'M', price: 15.50 },
      { label: 'G', price: 19.50 },
    ],
    extras: EXTRA_FITNESS
  },
  {
    id: '9',
    name: 'Banana + Pasta de Amendoim + Aveia + Leite',
    category: 'Funcional',
    description: 'Energético e nutritivo, ideal para antes ou depois do treino.',
    priceDisplay: 'a partir de R$ 16,50',
    points: 1,
    image: 'https://i.imgur.com/4flsEjI.png',
    sizes: [
      { label: 'M', price: 16.50 },
      { label: 'G', price: 21.50 },
    ],
    extras: EXTRA_FITNESS
  },
  {
    id: '10',
    name: 'Melancia + Abacaxi + Hortelã',
    category: 'Mix de Frutas',
    description: 'Leve, hidratante e com toque de hortelã.',
    priceDisplay: 'a partir de R$ 15,50',
    points: 1,
    image: 'https://i.imgur.com/dHyfW4u.png',
    sizes: [
      { label: 'M', price: 15.50 },
      { label: 'G', price: 19.50 },
    ],
    extras: EXTRA_FITNESS
  },
];
