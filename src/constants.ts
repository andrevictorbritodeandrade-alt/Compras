import { Category } from './types';

let idCounter = 1;

const createItem = (name: string, quantity: number, price: number) => ({
    id: idCounter++,
    name,
    quantity,
    price,
});

const categoriesData: Category[] = [
    {
        id: 1,
        name: "Grãos e Derivados",
        items: [
            createItem("Arroz", 1, 0),
            createItem("Pão", 1, 0),
            createItem("Pãozinho", 1, 0),
            createItem("Pão de forma", 1, 0),
            createItem("Pão integral", 1, 0),
            createItem("Feijão", 1, 0),
            createItem("Feijão branco", 1, 0),
            createItem("Feijão branco (1kg)", 1, 0),
            createItem("Feijão vermelho", 1, 0),
            createItem("Feijão fradinho", 1, 0),
            createItem("Feijão mulatinho", 1, 0),
            createItem("Leite de coco", 1, 0),
            createItem("Açúcar", 1, 0),
            createItem("Açúcar (1kg)", 1, 0),
            createItem("Sucos", 1, 0),
            createItem("Suco de uva integral", 1, 0),
            createItem("Macarrão", 1, 0),
            createItem("Farinha de mesa", 1, 0),
            createItem("Farinha de Trigo", 1, 0),
            createItem("Queijo ralado", 1, 0),
            createItem("Molho de tomate", 1, 0),
            createItem("Azeite", 1, 0),
            createItem("Azeitona", 1, 0),
            createItem("Óleo de soja", 1, 0),
            createItem("Óleo de soja (900ml)", 1, 0),
            createItem("Ketchup", 1, 0),
            createItem("Mostarda", 1, 0),
            createItem("Maionese", 1, 0),
            createItem("Milho Verde", 1, 0),
            createItem("Milho Verde (Lata)", 1, 0),
            createItem("Ervilha (Lata)", 1, 0),
            createItem("Leite em Pó", 1, 0),
            createItem("Creme de Leite", 1, 0),
            createItem("Gelatina", 1, 0),
            createItem("Leite Condensado", 1, 0),
            createItem("Leite zero lactose", 1, 0),
            createItem("Adoçante em pó", 1, 0),
            createItem("Adoçante", 1, 0),
            createItem("Café", 1, 0),
            createItem("Café (500g)", 1, 0),
            createItem("Biscoito salgado", 1, 0),
            createItem("Biscoito Doce", 1, 0),
            createItem("Flocão de milho", 1, 0),
            createItem("Farinha de kibe", 1, 0),
            createItem("Ervilha seca", 1, 0),
            createItem("Farinha panko", 1, 0),
            createItem("Sal", 1, 0),
            createItem("Temperos", 1, 0),
            createItem("Tempero de pipoca", 1, 0),
            createItem("Fermento em pó", 1, 0),
            createItem("Fermento biológico", 1, 0),
            createItem("Vinagre de álcool", 1, 0),
            createItem("Vinagre de maçã", 1, 0),
            createItem("Pipoca", 1, 0),
            createItem("Tapioca", 1, 0),
            createItem("Tapioca (Kg)", 1, 0),
            createItem("Polvilho azedo (Gr)", 1, 0)
        ]
    },
    {
        id: 2,
        name: "Limpeza e Higiene",
        items: [
            createItem("Detergente", 1, 0),
            createItem("Detergente (500ml)", 1, 0),
            createItem("Sabão Líquido (5l)", 1, 0),
            createItem("Sabão em pó", 1, 0),
            createItem("Amaciante", 1, 0),
            createItem("Amaciante (5L)", 1, 0),
            createItem("Absorvente", 1, 0),
            createItem("Água sanitária", 1, 0),
            createItem("Água sanitária (2L)", 1, 0),
            createItem("Inseticida", 1, 0),
            createItem("Saco para freezer", 1, 0),
            createItem("Shampoo e condicionador", 1, 0),
            createItem("Papel manteiga", 1, 0),
            createItem("Lenço umedecido", 1, 0),
            createItem("Papel alumínio", 1, 0),
            createItem("Papel toalha", 1, 0),
            createItem("Guardanapo", 1, 0),
            createItem("Perfex", 1, 0),
            createItem("Pano de prato", 1, 0),
            createItem("Papel higiênico", 1, 0),
            createItem("Pasta de dente", 1, 0),
            createItem("Esponja pra pia", 1, 0),
            createItem("Esponja pra pratos", 1, 0),
            createItem("Pedra sanitária", 1, 0),
            createItem("Enxaguante bucal", 1, 0),
            createItem("Desodorante André", 1, 0),
            createItem("Desodorante", 1, 0),
            createItem("Sabonete líquido", 1, 0),
            createItem("Sabonete", 1, 0),
            createItem("Sabonete phebo", 1, 0),
            createItem("Creme corporal", 1, 0),
            createItem("Talco", 1, 0),
            createItem("Barbeador", 1, 0),
            createItem("Coala", 1, 0),
            createItem("Veja", 1, 0),
            createItem("Veja Gold (500ml)", 1, 0),
            createItem("Diabo verde", 1, 0),
            createItem("Bom ar do banheiro", 1, 0)
        ]
    },
    {
        id: 3,
        name: "Carnes",
        items: [
            createItem("Filé de sobrecoxa", 1, 0),
            createItem("Filé de sobrecoxa (kg)", 1, 0),
            createItem("Contra filé", 1, 0),
            createItem("Contra filé (kg)", 1, 0),
            createItem("Peito de Frango", 1, 0),
            createItem("Peito de Frango (kg)", 1, 0),
            createItem("Carne Moída", 1, 0),
            createItem("Carne Moída (500g)", 1, 0),
            createItem("Peixe", 1, 0),
            createItem("Peixe (Filé)", 1, 0),
            createItem("Drumet", 1, 0),
            createItem("Drumet (kg)", 1, 0),
            createItem("Linguiça calabresa", 1, 0),
            createItem("Linguiça calabresa (kg)", 1, 0),
            createItem("Linguiça de churrasco", 1, 0),
            createItem("Linguiça fina", 1, 0),
            createItem("Linguiça paio", 1, 0),
            createItem("Carne seca", 1, 0),
            createItem("Costela suína (Kg)", 1, 0),
            createItem("Galeto", 1, 0),
            createItem("Copa lombo", 1, 0),
            createItem("Fraldinha suína", 1, 0),
            createItem("Fraldinha suína (kg)", 1, 0)
        ]
    },
    {
        id: 4,
        name: "Ovos",
        items: [
            createItem("Ovos (Dúzia)", 1, 0),
            createItem("Ovos (30 unid)", 1, 0)
        ]
    },
    {
        id: 5,
        name: "Laticínios",
        items: [
            createItem("Queijo mussarela", 1, 0),
            createItem("Queijo mussarela (kg)", 1, 0),
            createItem("Presunto", 1, 0),
            createItem("Peito de peru", 1, 0),
            createItem("Iogurte", 1, 0),
            createItem("Iogurte natural", 1, 0),
            createItem("Margarina", 1, 0),
            createItem("Margarina (500g)", 1, 0)
        ]
    },
    {
        id: 6,
        name: "Verduras e Legumes",
        items: [
            createItem("Alface (Unidade)", 1, 0),
            createItem("Tomate (Kg)", 1, 0),
            createItem("Tomate (kg)", 1, 0),
            createItem("Cenoura (Kg)", 1, 0),
            createItem("Cenoura (kg)", 1, 0),
            createItem("Cebola (Kg)", 1, 0),
            createItem("Cebola (kg)", 1, 0),
            createItem("Batata (Kg)", 1, 0),
            createItem("Batata inglesa", 1, 0),
            createItem("Batata inglesa (kg)", 1, 0),
            createItem("Aipim (Kg)", 1, 0),
            createItem("Alho", 1, 0),
            createItem("Alho (kg)", 1, 0)
        ]
    },
    {
        id: 7,
        name: "Frutas",
        items: [
            createItem("Banana (Kg)", 1, 0),
            createItem("Banana (kg)", 1, 0),
            createItem("Maçã (Kg)", 1, 0),
            createItem("Maçã (kg)", 1, 0),
            createItem("Laranja (Kg)", 1, 0),
            createItem("Laranja (kg)", 1, 0),
            createItem("Mamão (Kg)", 1, 0),
            createItem("Abacaxi (Unidade)", 1, 0),
            createItem("Abacate (Kg)", 1, 0)
        ]
    }
];

// Sort items alphabetically within each category
categoriesData.forEach(category => {
  category.items.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
});

export const INITIAL_CATEGORIES: Category[] = categoriesData;

export const MARKET_PRICES: Record<string, { [market: string]: number | null }> = {
  "Carne Moída (500g)": { "Atacadão": 9.90, "Supermarket": 10.98, "Dom Atacadista": 9.49 },
  "Contra filé (kg)": { "Atacadão": 49.90, "Supermarket": 52.90, "Dom Atacadista": 49.90 },
  "Drumet (kg)": { "Atacadão": 12.49, "Supermarket": 11.98, "Dom Atacadista": 12.90 },
  "Filé de sobrecoxa (kg)": { "Atacadão": null, "Supermarket": 16.97, "Dom Atacadista": 15.90 },
  "Fraldinha suína (kg)": { "Atacadão": 18.89, "Supermarket": null, "Dom Atacadista": 17.99 },
  "Linguiça calabresa (kg)": { "Atacadão": 17.90, "Supermarket": 19.98, "Dom Atacadista": 18.49 },
  "Peito de Frango (kg)": { "Atacadão": 15.35, "Supermarket": 14.97, "Dom Atacadista": 15.90 },
  "Peixe (Filé)": { "Atacadão": 16.90, "Supermarket": 15.97, "Dom Atacadista": null },
  "Ovos (30 unid)": { "Atacadão": 18.98, "Supermarket": 19.90, "Dom Atacadista": 17.99 },
  "Margarina (500g)": { "Atacadão": 5.39, "Supermarket": 5.99, "Dom Atacadista": 5.49 },
  "Queijo mussarela (kg)": { "Atacadão": 32.90, "Supermarket": 29.97, "Dom Atacadista": 32.99 },
  "Alho (kg)": { "Atacadão": 24.90, "Supermarket": 26.90, "Dom Atacadista": 24.90 },
  "Batata inglesa (kg)": { "Atacadão": 3.49, "Supermarket": 3.98, "Dom Atacadista": 3.25 },
  "Cebola (kg)": { "Atacadão": 3.15, "Supermarket": 3.45, "Dom Atacadista": 3.25 },
  "Cenoura (kg)": { "Atacadão": 4.20, "Supermarket": 4.49, "Dom Atacadista": null },
  "Tomate (kg)": { "Atacadão": 7.90, "Supermarket": 8.49, "Dom Atacadista": 7.50 },
  "Banana (kg)": { "Atacadão": 4.98, "Supermarket": 4.49, "Dom Atacadista": 4.80 },
  "Laranja (kg)": { "Atacadão": 3.90, "Supermarket": 3.85, "Dom Atacadista": 3.90 },
  "Maçã (kg)": { "Atacadão": 9.90, "Supermarket": 10.90, "Dom Atacadista": null },
  "Açúcar (1kg)": { "Atacadão": 3.39, "Supermarket": 3.99, "Dom Atacadista": 3.49 },
  "Café (500g)": { "Atacadão": 23.50, "Supermarket": 25.90, "Dom Atacadista": 22.90 },
  "Óleo de soja (900ml)": { "Atacadão": 7.98, "Supermarket": 8.39, "Dom Atacadista": 7.99 },
  "Leite em Pó": { "Atacadão": 22.00, "Supermarket": 18.90, "Dom Atacadista": 21.50 },
  "Feijão branco (1kg)": { "Atacadão": null, "Supermarket": 12.90, "Dom Atacadista": null },
  "Flocão de milho": { "Atacadão": 2.99, "Supermarket": 3.29, "Dom Atacadista": 2.89 },
  "Pão de forma": { "Atacadão": 4.29, "Supermarket": 5.49, "Dom Atacadista": 4.59 },
  "Água sanitária (2L)": { "Atacadão": 4.99, "Supermarket": 5.49, "Dom Atacadista": 4.89 },
  "Amaciante (5L)": { "Atacadão": 17.90, "Supermarket": null, "Dom Atacadista": 18.90 },
  "Detergente (500ml)": { "Atacadão": 2.35, "Supermarket": 2.59, "Dom Atacadista": 2.25 },
  "Papel toalha": { "Atacadão": 5.35, "Supermarket": 5.99, "Dom Atacadista": null },
  "Veja Gold (500ml)": { "Atacadão": 4.99, "Supermarket": 5.98, "Dom Atacadista": 5.19 },
};

export const EXTRACTED_ITEMS = [
  "Carne Moída (500g)", "Contra filé (kg)", "Drumet (kg)", "Filé de sobrecoxa (kg)", "Fraldinha suína (kg)", "Linguiça calabresa (kg)", "Linguiça de churrasco", "Linguiça fina", "Peito de Frango (kg)", "Peixe (Filé)",
  "Ovos (30 unid)",
  "Iogurte", "Iogurte natural", "Margarina (500g)", "Peito de peru", "Queijo mussarela (kg)",
  "Aipim (Kg)", "Alface (Unidade)", "Alho (kg)", "Batata inglesa (kg)", "Cebola (kg)", "Cenoura (kg)", "Tomate (kg)",
  "Abacate (Kg)", "Banana (kg)", "Laranja (kg)", "Maçã (kg)", "Mamão (Kg)",
  "Água sanitária (2L)", "Amaciante (5L)", "Barbeador", "Coala", "Creme corporal", "Desodorante", "Detergente (500ml)", "Diabo verde", "Enxaguante bucal", "Esponja pra pratos", "Inseticida", "Pano de prato", "Papel alumínio", "Papel toalha", "Pasta de dente", "Pedra sanitária", "Perfex", "Sabão em pó", "Shampoo e condicionador", "Talco", "Veja Gold (500ml)",
  "Açúcar (1kg)", "Adoçante", "Biscoito salgado", "Café (500g)", "Creme de Leite", "Ervilha (Lata)", "Feijão branco (1kg)", "Fermento biológico", "Fermento em pó", "Flocão de milho", "Gelatina", "Leite de coco", "Leite em Pó", "Milho Verde", "Molho de tomate", "Óleo de soja (900ml)", "Pão de forma", "Pão integral", "Pipoca", "Queijo ralado", "Sal",
  "Suco de uva integral", "Sucos", "Tapioca", "Temperos", "Vinagre de maçã"
];
