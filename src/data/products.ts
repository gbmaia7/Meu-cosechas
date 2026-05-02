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
  glutenFree?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryKey;
  description: string;
  priceDisplay: string;
  points: number;
  image?: string;
  volume?: string;
  sizes?: {
    label: string;
    price: number;
    volume?: string;
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

export const EXTRA_ACAI: Extra[] = [
  { id: 'extra-granola', name: 'Granola', description: 'Crocante e nutritiva', price: 3.00, icon: 'nutrition', glutenFree: false },
  { id: 'extra-aveia', name: 'Aveia', description: 'Fibra natural', price: 3.00, icon: 'grain', glutenFree: false },
  { id: 'extra-mel', name: 'Mel de Abelha', description: 'Adoçante natural', price: 3.00, icon: 'health_and_safety' },
];

export const EXTRA_MILKSHAKE: Extra[] = [
  { id: 'extra-leite-desnatado', name: 'Leite Desnatado', description: 'Mais leve', price: 3.00, icon: 'local_drink' },
  { id: 'extra-leite-soja', name: 'Leite de Soja', description: 'Alternativa vegetal', price: 3.00, icon: 'eco' },
  { id: 'extra-mel', name: 'Mel de Abelha', description: 'Adoçante natural', price: 3.00, icon: 'health_and_safety' },
  { id: 'extra-iogurte', name: 'Iogurte', description: 'Mais cremosidade', price: 3.00, icon: 'icecream' },
  { id: 'extra-granola', name: 'Granola', description: 'Crocante e nutritiva', price: 3.00, icon: 'nutrition', glutenFree: false },
  { id: 'extra-sorvete', name: 'Sorvete', description: 'Super cremoso', price: 3.00, icon: 'icecream' },
  { id: 'extra-aveia', name: 'Aveia', description: 'Fibra natural', price: 3.00, icon: 'grain', glutenFree: false },
  { id: 'extra-whey', name: 'Whey Protein', description: 'Mais músculo e saciedade', price: 6.00, icon: 'bolt' },
  { id: 'extra-colageno', name: 'Colágeno', description: 'Pele, cabelo e articulações', price: 5.00, icon: 'local_florist' },
  { id: 'extra-creatina', name: 'Creatina', description: 'Mais energia e desempenho', price: 5.00, icon: 'sync_alt' },
];

export const EXTRA_FITNESS: Extra[] = [
  { id: 'extra-whey', name: 'Whey Protein', description: 'Mais músculo e saciedade', price: 6.00, icon: 'bolt' },
  { id: 'extra-colageno', name: 'Colágeno', description: 'Pele, cabelo e articulações', price: 5.00, icon: 'local_florist' },
  { id: 'extra-creatina', name: 'Creatina', description: 'Mais energia e desempenho', price: 5.00, icon: 'sync_alt' },
];

export const EXTRA_CARIBE: Extra[] = [
  { id: 'extra-colageno', name: 'Colágeno', description: 'Pele, cabelo e articulações', price: 5.00, icon: 'local_florist' },
  { id: 'extra-creatina', name: 'Creatina', description: 'Mais energia e desempenho', price: 5.00, icon: 'sync_alt' },
];

export const LINHA_CARIBE: Product[] = [
  {
    id: 'caribe-1',
    name: 'Limonada de Coco',
    category: 'Linha Caribe',
    description: 'Limão, creme de coco e coco ralado. Cremosa e refrescante.',
    priceDisplay: 'a partir de R$ 20,00',
    points: 1,
    image: 'https://i.imgur.com/oe8Cfvb.png',
    sizes: [
      { label: 'M', price: 20.00, volume: '500ml' },
      { label: 'G', price: 22.00, volume: '700ml' },
    ],
    extras: EXTRA_CARIBE
  }
];

export const EXTRA_MIX_FRUTAS: Extra[] = [
  { id: 'extra-cha-verde', name: 'Chá Verde', description: 'Mais energia e antioxidante', price: 3.00, icon: 'leaf' },
  { id: 'extra-suco-laranja', name: 'Suco de Laranja', description: 'Vitamina C extra', price: 3.00, icon: 'citrus' },
  { id: 'extra-whey', name: 'Whey Protein', description: 'Mais músculo e saciedade', price: 6.00, icon: 'bolt' },
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
      { label: 'M', price: 21.50, volume: '500ml' },
      { label: 'G', price: 23.50, volume: '700ml' },
    ],
    extras: EXTRA_FITNESS
  },
  {
    id: '2',
    name: 'Trio Açaí',
    category: 'Açaí',
    description: 'Açaí cremoso com banana, morango, 3 bolas de sorvete e granola.',
    priceDisplay: 'R$ 24,90',
    points: 1,
    volume: '700ml',
    image: 'https://i.imgur.com/VkTJsar.png',
    extras: EXTRA_ACAI
  },
  {
    id: '3',
    name: 'Açaí Médio',
    category: 'Açaí',
    description: 'Açaí batido com banana ou morango, granola e leite em pó.',
    priceDisplay: 'R$ 22,90',
    points: 1,
    volume: '500ml',
    image: 'https://i.imgur.com/vuCVqBo.png',
    extras: EXTRA_ACAI
  },
  {
    id: '4',
    name: 'Açaí Bowl',
    category: 'Açaí',
    description: 'Morango picado, rodelas de banana e granola premium.',
    priceDisplay: 'a partir de R$ 20,50',
    points: 1,
    image: 'https://i.imgur.com/WmTLF3W.png',
    sizes: [
      { label: 'M', price: 20.50, volume: '500ml' },
      { label: 'G', price: 24.50, volume: '700ml' },
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
    image: 'https://i.imgur.com/oe8Cfvb.png',
    sizes: [
      { label: 'M', price: 20.00, volume: '500ml' },
      { label: 'G', price: 22.00, volume: '700ml' },
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
      { label: 'M', price: 15.50, volume: '500ml' },
      { label: 'G', price: 17.50, volume: '700ml' },
    ],
    extras: EXTRA_MIX_FRUTAS
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
      { label: 'M', price: 15.50, volume: '500ml' },
      { label: 'G', price: 17.50, volume: '700ml' },
    ],
    extras: EXTRA_MIX_FRUTAS
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
      { label: 'M', price: 15.50, volume: '500ml' },
      { label: 'G', price: 19.50, volume: '700ml' },
    ],
    extras: EXTRA_MIX_FRUTAS
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
      { label: 'M', price: 16.50, volume: '500ml' },
      { label: 'G', price: 21.50, volume: '700ml' },
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
      { label: 'M', price: 15.50, volume: '500ml' },
      { label: 'G', price: 19.50, volume: '700ml' },
    ],
    extras: EXTRA_MIX_FRUTAS
  },
  {
    id: '11',
    name: 'Abacaxi + Laranja + Mamão',
    category: 'Mix de Frutas',
    description: 'Tropical e cheio de vitamina C.',
    priceDisplay: 'a partir de R$ 15,50',
    points: 1,
    sizes: [
      { label: 'M', price: 15.50, volume: '500ml' },
      { label: 'G', price: 17.50, volume: '700ml' },
    ],
    extras: EXTRA_MIX_FRUTAS
  },
  {
    id: '12',
    name: 'Banana + Mamão + Laranja',
    category: 'Mix de Frutas',
    description: 'Cremoso, doce e rico em potássio.',
    priceDisplay: 'a partir de R$ 15,50',
    points: 1,
    sizes: [
      { label: 'M', price: 15.50, volume: '500ml' },
      { label: 'G', price: 17.50, volume: '700ml' },
    ],
    extras: EXTRA_MIX_FRUTAS
  },
  {
    id: '13',
    name: 'Maçã + Banana + Laranja',
    category: 'Mix de Frutas',
    description: 'Leve e equilibrado, para qualquer hora do dia.',
    priceDisplay: 'a partir de R$ 15,50',
    points: 1,
    sizes: [
      { label: 'M', price: 15.50, volume: '500ml' },
      { label: 'G', price: 17.50, volume: '700ml' },
    ],
    extras: EXTRA_MIX_FRUTAS
  },
  {
    id: '14',
    name: 'Berrynana com Iogurte',
    category: 'Premium',
    description: 'Morango, banana e amora batidos com iogurte.',
    priceDisplay: 'a partir de R$ 21,50',
    points: 1,
    sizes: [
      { label: 'M', price: 21.50, volume: '500ml' },
      { label: 'G', price: 23.50, volume: '700ml' },
    ],
    extras: EXTRA_FITNESS
  },
  {
    id: '15',
    name: 'Borboleta Laranja com Iogurte',
    category: 'Premium',
    description: 'Laranja, manga e pêssego batidos com iogurte.',
    priceDisplay: 'a partir de R$ 21,50',
    points: 1,
    sizes: [
      { label: 'M', price: 21.50, volume: '500ml' },
      { label: 'G', price: 23.50, volume: '700ml' },
    ],
    extras: EXTRA_FITNESS
  },
  {
    id: '16',
    name: 'Colibri Roxo com Sorvete',
    category: 'Premium',
    description: 'Amora, blueberry, morango e cranberry batidos com sorvete.',
    priceDisplay: 'a partir de R$ 21,50',
    points: 1,
    image: 'https://i.imgur.com/NTA4Y3s.png',
    sizes: [
      { label: 'M', price: 21.50, volume: '500ml' },
      { label: 'G', price: 23.50, volume: '700ml' },
    ],
    extras: EXTRA_FITNESS
  },
  {
    id: '17',
    name: 'Berrynana com Sorvete',
    category: 'Premium',
    description: 'Morango, banana e amora batidos com sorvete.',
    priceDisplay: 'a partir de R$ 21,50',
    points: 1,
    sizes: [
      { label: 'M', price: 21.50, volume: '500ml' },
      { label: 'G', price: 23.50, volume: '700ml' },
    ],
    extras: EXTRA_FITNESS
  },
  {
    id: '18',
    name: 'Arara Vermelha',
    category: 'Premium',
    description: 'Kiwi, uvas e melancia. Leve e refrescante.',
    priceDisplay: 'a partir de R$ 19,50',
    points: 1,
    sizes: [
      { label: 'M', price: 19.50, volume: '500ml' },
      { label: 'G', price: 20.90, volume: '700ml' },
    ],
    extras: EXTRA_FITNESS
  },
  {
    id: '19',
    name: 'Tartaruga Verde',
    category: 'Premium',
    description: 'Kiwi, uvas verdes e abacaxi. Leve e hidratante.',
    priceDisplay: 'a partir de R$ 19,50',
    points: 1,
    sizes: [
      { label: 'M', price: 19.50, volume: '500ml' },
      { label: 'G', price: 20.90, volume: '700ml' },
    ],
    extras: EXTRA_FITNESS
  },
  {
    id: '20',
    name: 'Melancia + Banana + Coco',
    category: 'Milkshake',
    description: 'Refrescante e cremoso com toque tropical.',
    priceDisplay: 'a partir de R$ 19,50',
    points: 1,
    sizes: [
      { label: 'M', price: 19.50, volume: '500ml' },
      { label: 'G', price: 21.00, volume: '700ml' },
    ],
    extras: EXTRA_MILKSHAKE
  },
  {
    id: '21',
    name: 'Manga + Banana + Mamão',
    category: 'Milkshake',
    description: 'Tropical e cremoso, cheio de vitaminas.',
    priceDisplay: 'a partir de R$ 19,50',
    points: 1,
    sizes: [
      { label: 'M', price: 19.50, volume: '500ml' },
      { label: 'G', price: 21.00, volume: '700ml' },
    ],
    extras: EXTRA_MILKSHAKE
  },
  {
    id: '22',
    name: 'Morango + Graviola',
    category: 'Milkshake',
    description: 'Agridoce e cremoso, combinação surpreendente.',
    priceDisplay: 'a partir de R$ 19,50',
    points: 1,
    sizes: [
      { label: 'M', price: 19.50, volume: '500ml' },
      { label: 'G', price: 21.00, volume: '700ml' },
    ],
    extras: EXTRA_MILKSHAKE
  },
  {
    id: '23',
    name: 'Melancia + Maracujá',
    category: 'Milkshake',
    description: 'Refrescante e levemente ácido.',
    priceDisplay: 'a partir de R$ 19,50',
    points: 1,
    sizes: [
      { label: 'M', price: 19.50, volume: '500ml' },
      { label: 'G', price: 21.00, volume: '700ml' },
    ],
    extras: EXTRA_MILKSHAKE
  },
  {
    id: '24',
    name: 'Abacaxi + Coco',
    category: 'Milkshake',
    description: 'Tropical e refrescante com toque de coco.',
    priceDisplay: 'a partir de R$ 19,50',
    points: 1,
    sizes: [
      { label: 'M', price: 19.50, volume: '500ml' },
      { label: 'G', price: 21.00, volume: '700ml' },
    ],
    extras: EXTRA_MILKSHAKE
  },
];
