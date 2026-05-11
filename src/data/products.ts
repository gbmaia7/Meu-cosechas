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
  glutenWarning?: boolean;
}

export type CategoryKey = 
  | 'Premium' 
  | 'Açaí' 
  | 'Bowl' 
  | 'Linha Caribe' 
  | 'Mix de Frutas' 
  | 'Funcional' 
  | 'Milkshake' 
  | 'Especial'
  | 'Comece Bem Seu Dia'
  | 'Boa de Hoje'
  | 'Promoção Seu Cosechas';

export const CATEGORY_COLORS: Record<CategoryKey, string> = {
  'Premium': 'bg-purple-500 text-white',
  'Açaí': 'bg-purple-900 text-white',
  'Bowl': 'bg-green-500 text-white',
  'Linha Caribe': 'bg-cyan-500 text-white',
  'Mix de Frutas': 'bg-pink-500 text-white',
  'Funcional': 'bg-green-800 text-white',
  'Milkshake': 'bg-yellow-500 text-black',
  'Especial': 'bg-red-600 text-white',
  'Comece Bem Seu Dia': 'bg-orange-500 text-white',
  'Boa de Hoje': 'bg-red-500 text-white',
  'Promoção Seu Cosechas': 'bg-orange-600 text-white',
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

export const FUNCIONAL_EXTRAS: Extra[] = [
  { id: 'extra-whey-f', name: 'Whey Protein', description: 'Mais músculo e saciedade', price: 6.00, icon: 'bolt' },
  { id: 'extra-colageno-f', name: 'Colágeno', description: 'Pele, cabelo e articulações', price: 5.00, icon: 'local_florist' },
  { id: 'extra-creatina-f', name: 'Creatina', description: 'Mais energia e desempenho', price: 5.00, icon: 'sync_alt' },
];

export const FUNCIONAL: Product[] = [
  {
    id: 'func-1',
    name: 'Pura Energia',
    category: 'Funcional',
    description: 'Espinafre, beterraba, abacaxi e banana. Rico em energia natural.',
    priceDisplay: 'a partir de R$ 16,50',
    points: 1,
    image: 'https://i.imgur.com/RbwNnzm.png',
    sizes: [
      { label: 'M', price: 16.50, volume: '500ml' },
      { label: 'G', price: 18.50, volume: '700ml' },
    ],
    extras: FUNCIONAL_EXTRAS,
    glutenWarning: true
  },
  {
    id: 'func-2',
    name: 'Protéico',
    category: 'Funcional',
    description: 'Laranja, banana e proteína de soja. Ideal para ganho muscular.',
    priceDisplay: 'a partir de R$ 16,50',
    points: 1,
    image: 'https://i.imgur.com/45JiPk2.png',
    sizes: [
      { label: 'M', price: 16.50, volume: '500ml' },
      { label: 'G', price: 18.50, volume: '700ml' },
    ],
    extras: FUNCIONAL_EXTRAS,
    glutenWarning: true
  },
  {
    id: 'func-3',
    name: 'Controle de Peso',
    category: 'Funcional',
    description: 'Abacaxi, aipo, pepino e salsa. Leve e detox.',
    priceDisplay: 'a partir de R$ 16,50',
    points: 1,
    image: 'https://i.imgur.com/7HX7lxK.png',
    sizes: [
      { label: 'M', price: 16.50, volume: '500ml' },
      { label: 'G', price: 18.50, volume: '700ml' },
    ],
    extras: FUNCIONAL_EXTRAS,
    glutenWarning: true
  },
  {
    id: 'func-4',
    name: 'Pouco Colesterol',
    category: 'Funcional',
    description: 'Aipo, abacaxi, cenoura e gengibre. Cuida do seu coração.',
    priceDisplay: 'a partir de R$ 16,50',
    points: 1,
    image: 'https://i.imgur.com/vFvCxyP.png',
    sizes: [
      { label: 'M', price: 16.50, volume: '500ml' },
      { label: 'G', price: 18.50, volume: '700ml' },
    ],
    extras: FUNCIONAL_EXTRAS,
    glutenWarning: true
  },
  {
    id: 'func-5',
    name: 'Cardio Frutas',
    category: 'Funcional',
    description: 'Banana, abacaxi, manga e abacate. Para um coração saudável.',
    priceDisplay: 'a partir de R$ 16,50',
    points: 1,
    image: 'https://i.imgur.com/PpfaARD.png',
    sizes: [
      { label: 'M', price: 16.50, volume: '500ml' },
      { label: 'G', price: 18.50, volume: '700ml' },
    ],
    extras: FUNCIONAL_EXTRAS,
    glutenWarning: true
  },
  {
    id: 'func-6',
    name: 'Max Fibra',
    category: 'Funcional',
    description: 'Mamão, gérmen de trigo, aipo e laranja. Rico em fibras.',
    priceDisplay: 'a partir de R$ 16,50',
    points: 1,
    image: 'https://i.imgur.com/CjDFB4f.png',
    sizes: [
      { label: 'M', price: 16.50, volume: '500ml' },
      { label: 'G', price: 18.50, volume: '700ml' },
    ],
    extras: FUNCIONAL_EXTRAS,
    glutenWarning: true
  },
];

export const COMECE_BEM: Product[] = [
  {
    id: 'comece-1',
    name: 'Banana + Pasta de Amendoim + Aveia + Leite',
    category: 'Comece Bem Seu Dia',
    description: 'Fonte de energia, disposição e proteínas. Ideal para começar o dia com força.',
    priceDisplay: 'a partir de R$ 18,50',
    points: 1,
    image: 'https://i.imgur.com/hDlcDOD.png',
    sizes: [
      { label: 'M', price: 18.50, volume: '500ml' },
      { label: 'G', price: 19.90, volume: '700ml' },
    ],
    extras: FUNCIONAL_EXTRAS,
  },
  {
    id: 'comece-2',
    name: 'Morango + Banana + Chia + Granola + Leite',
    category: 'Comece Bem Seu Dia',
    description: 'Nutritivo e saboroso, perfeito para começar o dia com energia.',
    priceDisplay: 'a partir de R$ 18,50',
    points: 1,
    image: 'https://i.imgur.com/Es6Xt2S.png',
    sizes: [
      { label: 'M', price: 18.50, volume: '500ml' },
      { label: 'G', price: 19.90, volume: '700ml' },
    ],
    extras: FUNCIONAL_EXTRAS,
  }
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
    image: 'https://i.imgur.com/O87fzXw.png',
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

export const EXTRA_ESPECIAIS: Extra[] = [
  { id: 'extra-whey-e', name: 'Whey Protein', description: 'Mais músculo e saciedade', price: 6.00, icon: 'bolt' },
  { id: 'extra-colageno-e', name: 'Colágeno', description: 'Pele, cabelo e articulações', price: 5.00, icon: 'local_florist' },
  { id: 'extra-creatina-e', name: 'Creatina', description: 'Mais energia e desempenho', price: 5.00, icon: 'sync_alt' },
];

export const ESPECIAIS: Product[] = [
  {
    id: 'shake-special-1',
    name: 'Shaketive',
    category: 'Especial',
    description: 'Framboesa, morango e banana batidos com sorvete, iogurte grego e toque de hortelã. Único e irresistível.',
    priceDisplay: 'a partir de R$ 21,90',
    points: 1,
    image: 'https://i.imgur.com/0YbDnPU.png',
    sizes: [
      { label: 'M', price: 21.90, volume: '500ml' },
      { label: 'G', price: 24.50, volume: '700ml' },
    ],
    extras: EXTRA_ESPECIAIS
  }
];

export const BOA_DE_DIA: Record<number, Product> = {
  1: {
    id: 'boa-seg',
    name: 'Caju com Morango',
    category: 'Boa de Hoje',
    description: 'Refrescante união do sabor tropical do caju com a doçura do morango.',
    priceDisplay: 'R$ 13,00',
    points: 1,
    image: 'https://i.imgur.com/m4efUQm.png',
    extras: EXTRA_MIX_FRUTAS
  },
  2: {
    id: 'boa-ter',
    name: 'Melancia + Abacaxi + Hortelã',
    category: 'Boa de Hoje',
    description: 'Leve, hidratante e com o frescor inconfundível da hortelã.',
    priceDisplay: 'R$ 13,00',
    points: 1,
    image: 'https://i.imgur.com/GZFVTjI.png',
    extras: EXTRA_MIX_FRUTAS
  },
  4: {
    id: 'boa-qui',
    name: 'Maçã + Banana + Laranja',
    category: 'Boa de Hoje',
    description: 'Energia equilibrada e sabor familiar para sua tarde.',
    priceDisplay: 'R$ 13,00',
    points: 1,
    image: 'https://i.imgur.com/qrdatQR.png',
    extras: EXTRA_MIX_FRUTAS
  }
};

export const PROMOCAO_SEU_COSECHAS: Product[] = [
  {
    id: 'promo-1',
    name: 'Melancia + Limão',
    category: 'Promoção Seu Cosechas',
    description: 'O cítrico do limão encontra a doçura da melancia.',
    priceDisplay: 'a partir de R$ 12,50',
    points: 1,
    image: 'https://i.imgur.com/wuKBZej.png',
    sizes: [
      { label: 'M', price: 12.50, volume: '500ml' },
      { label: 'G', price: 14.00, volume: '700ml' },
    ],
    extras: EXTRA_MIX_FRUTAS
  },
  {
    id: 'promo-2',
    name: 'Abacaxi + Hortelã',
    category: 'Promoção Seu Cosechas',
    description: 'Um clássico refrescante para qualquer momento.',
    priceDisplay: 'a partir de R$ 12,50',
    points: 1,
    image: 'https://i.imgur.com/GZFVTjI.png',
    sizes: [
      { label: 'M', price: 12.50, volume: '500ml' },
      { label: 'G', price: 14.00, volume: '700ml' },
    ],
    extras: EXTRA_MIX_FRUTAS
  },
  {
    id: 'promo-3',
    name: 'Manga + Abacaxi',
    category: 'Promoção Seu Cosechas',
    description: 'Combinação tropical intensa e nutritiva.',
    priceDisplay: 'a partir de R$ 12,50',
    points: 1,
    image: 'https://i.imgur.com/3I72MuT.png',
    sizes: [
      { label: 'M', price: 12.50, volume: '500ml' },
      { label: 'G', price: 14.00, volume: '700ml' },
    ],
    extras: EXTRA_MIX_FRUTAS
  },
  {
    id: 'promo-4',
    name: 'Laranja + Acerola',
    category: 'Promoção Seu Cosechas',
    description: 'Explosão de Vitamina C e refrescância.',
    priceDisplay: 'a partir de R$ 12,50',
    points: 1,
    image: 'https://i.imgur.com/RD9y72q.png',
    sizes: [
      { label: 'M', price: 12.50, volume: '500ml' },
      { label: 'G', price: 14.00, volume: '700ml' },
    ],
    extras: EXTRA_MIX_FRUTAS
  }
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Colibri Roxo com Iogurte',
    category: 'Premium',
    description: 'Amora, blueberry, morango e cranberry batidos com iogurte.',
    priceDisplay: 'a partir de R$ 21,50',
    points: 1,
    image: 'https://i.imgur.com/snuE7CH.png',
    sizes: [
      { label: 'M', price: 21.50, volume: '500ml' },
      { label: 'G', price: 23.50, volume: '700ml' },
    ],
    extras: EXTRA_FITNESS
  },
  {
    id: '2',
    name: 'Trio Açaí (Açaí de 700ml)',
    category: 'Açaí',
    description: 'Açaí batido com banana, morango, granola e leite em pó.',
    priceDisplay: 'R$ 24,90',
    points: 1,
    volume: '700ml',
    image: 'https://i.imgur.com/Y1YLUiG.png',
    extras: EXTRA_ACAI
  },
  {
    id: '3',
    name: 'Açaí Médio (Açaí de 500ml)',
    category: 'Açaí',
    description: 'Açaí batido com banana, morango, granola e leite em pó.',
    priceDisplay: 'R$ 22,90',
    points: 1,
    volume: '500ml',
    image: 'https://i.imgur.com/Y1YLUiG.png',
    extras: EXTRA_ACAI
  },
  {
    id: '4',
    name: 'Açaí Bowl',
    category: 'Açaí',
    description: 'Morango picado, rodelas de banana e granola premium.',
    priceDisplay: 'a partir de R$ 20,50',
    points: 1,
    image: 'https://i.imgur.com/m3o810O.png',
    sizes: [
      { label: 'M', price: 20.50, volume: '350ml' },
      { label: 'G', price: 24.50, volume: '500ml' },
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
    image: 'https://i.imgur.com/O87fzXw.png',
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
    image: 'https://i.imgur.com/3I72MuT.png',
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
    image: 'https://i.imgur.com/wuKBZej.png',
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
    image: 'https://i.imgur.com/RD9y72q.png',
    sizes: [
      { label: 'M', price: 15.50, volume: '500ml' },
      { label: 'G', price: 19.50, volume: '700ml' },
    ],
    extras: EXTRA_MIX_FRUTAS
  },
  {
    id: '9',
    name: 'Banana + Pasta de Amendoim + Aveia + Leite',
    category: 'Comece Bem Seu Dia',
    description: 'Energético e nutritivo, ideal para antes ou depois do treino.',
    priceDisplay: 'a partir de R$ 16,50',
    points: 1,
    image: 'https://i.imgur.com/hDlcDOD.png',
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
    image: 'https://i.imgur.com/GZFVTjI.png',
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
    image: 'https://i.imgur.com/YAE0nt6.png',
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
    image: 'https://i.imgur.com/1MIAWns.png',
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
    image: 'https://i.imgur.com/qrdatQR.png',
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
    image: 'https://i.imgur.com/vx5gjRR.png',
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
    image: 'https://i.imgur.com/22fcwYg.png',
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
    image: 'https://i.imgur.com/snuE7CH.png',
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
    image: 'https://i.imgur.com/vx5gjRR.png',
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
    image: 'https://i.imgur.com/yaUSVPU.png',
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
    image: 'https://i.imgur.com/PIqTjLl.png',
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
    image: 'https://i.imgur.com/R6v8Yyg.png',
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
    image: 'https://i.imgur.com/xHTQpB4.png',
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
    image: 'https://i.imgur.com/BEXJZCK.png',
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
    image: 'https://i.imgur.com/VTRLGza.png',
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
    image: 'https://i.imgur.com/vF4a3JZ.png',
    sizes: [
      { label: 'M', price: 19.50, volume: '500ml' },
      { label: 'G', price: 21.00, volume: '700ml' },
    ],
    extras: EXTRA_MILKSHAKE
  },
];
