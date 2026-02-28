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
            createItem("Feijão", 1, 0),
            createItem("Leite de coco", 1, 0),
            createItem("Açúcar", 1, 0),
            createItem("Sucos", 1, 0),
            createItem("Macarrão", 1, 0),
            createItem("Farinha de mesa", 1, 0),
            createItem("Farinha de Trigo", 1, 0),
            createItem("Queijo ralado", 1, 0),
            createItem("Molho de tomate", 1, 0),
            createItem("Azeite", 1, 0),
            createItem("Azeitona", 1, 0),
            createItem("Óleo de soja", 1, 0),
            createItem("Ketchup", 1, 0),
            createItem("Mostarda", 1, 0),
            createItem("Maionese", 1, 0),
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
            createItem("Biscoito Salgado", 1, 0),
            createItem("Biscoito Doce", 1, 0),
            createItem("Flocão de milho", 1, 0),
            createItem("Feijão vermelho", 1, 0),
            createItem("Feijão fradinho", 1, 0),
            createItem("Farinha de kibe", 1, 0),
            createItem("Ervilha seca", 1, 0),
            createItem("Feijão mulatinho", 1, 0),
            createItem("Farinha panko", 1, 0),
            createItem("Sal", 1, 0),
            createItem("Tempero de pipoca", 1, 0),
            createItem("Fermento em pó", 1, 0),
            createItem("Vinagre de álcool", 1, 0),
            createItem("Vinagre de maçã", 1, 0),
            createItem("Pipoca", 1, 0),
            createItem("Tapioca (Kg)", 1, 0),
            createItem("Polvilho azedo (Gr)", 1, 0),
            createItem("Pão integral (unidade)", 1, 0)
        ]
    },
    {
        id: 2,
        name: "Limpeza",
        items: [
            createItem("Detergente", 1, 0),
            createItem("Sabão Líquido (5l)", 1, 0),
            createItem("Amaciante", 1, 0),
            createItem("Absorvente", 1, 0),
            createItem("Água sanitária", 1, 0),
            createItem("Inseticida", 1, 0),
            createItem("Saco para freezer", 1, 0),
            createItem("Shampoo E condicionador", 1, 0),
            createItem("Papel manteiga", 1, 0),
            createItem("Lenço umedecido", 1, 0),
            createItem("Papel alumínio", 1, 0),
            createItem("Papel toalha", 1, 0),
            createItem("Guardanapo", 1, 0),
            createItem("Perfex", 1, 0),
            createItem("Papel higiênico", 1, 0),
            createItem("Pasta de dente", 1, 0),
            createItem("Esponja pra pia", 1, 0),
            createItem("Pedra sanitária", 1, 0),
            createItem("Enxaguante bucal", 1, 0),
            createItem("Desodorante André", 1, 0),
            createItem("Desodorante", 1, 0),
            createItem("Sabonete líquido", 1, 0),
            createItem("Sabonete", 1, 0),
            createItem("Sabonete phebo", 1, 0),
            createItem("Coala", 1, 0),
            createItem("Veja", 1, 0),
            createItem("Bom ar do banheiro", 1, 0)
        ]
    },
    {
        id: 3,
        name: "Carnes",
        items: [
            createItem("Filé de sobrecoxa", 1, 0),
            createItem("Contra file", 1, 0),
            createItem("Peito de Frango (Kg)", 1, 0),
            createItem("Carne Moída (Kg)", 1, 0),
            createItem("Peixe", 1, 0),
            createItem("Linguiça calabresa (Kg)", 1, 0),
            createItem("Linguiça paio", 1, 0),
            createItem("Carne seca", 1, 0),
            createItem("Costela suína (Kg)", 1, 0),
            createItem("Galeto", 1, 0),
            createItem("Copa lombo", 1, 0),
            createItem("Fraldinha suína", 1, 0)
        ]
    },
    {
        id: 4,
        name: "Ovos",
        items: [
            createItem("Ovos (Dúzia)", 1, 0)
        ]
    },
    {
        id: 5,
        name: "Laticínios",
        items: [
            createItem("Queijo mussarela (Kg)", 1, 0),
            createItem("Presunto", 1, 0),
            createItem("Iogurte", 1, 0),
            createItem("Margarina", 1, 0)
        ]
    },
    {
        id: 6,
        name: "Verduras e Legumes",
        items: [
            createItem("Alface (Unidade)", 1, 0),
            createItem("Tomate (Kg)", 1, 0),
            createItem("Cenoura (Kg)", 1, 0),
            createItem("Cebola (Kg)", 1, 0),
            createItem("Batata (Kg)", 1, 0)
        ]
    },
    {
        id: 7,
        name: "Frutas",
        items: [
            createItem("Banana (Kg)", 1, 0),
            createItem("Maçã (Kg)", 1, 0),
            createItem("Laranja (Kg)", 1, 0),
            createItem("Mamão (Kg)", 1, 0),
            createItem("Abacaxi (Unidade)", 1, 0)
        ]
    }
];

// Sort items alphabetically within each category
categoriesData.forEach(category => {
  category.items.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
});

export const INITIAL_CATEGORIES: Category[] = categoriesData;
