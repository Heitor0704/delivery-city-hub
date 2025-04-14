
export interface Category {
  id: number | string;
  nome: string;
  descricao: string;
  imagem: string;
  ativo: boolean;
}

export const initialCategories: Category[] = [
  { id: 1, nome: "Hambúrgueres", descricao: "Hambúrgueres artesanais", imagem: "burger.jpg", ativo: true },
  { id: 2, nome: "Pizzas", descricao: "Pizzas tradicionais e premium", imagem: "pizza.jpg", ativo: true },
  { id: 3, nome: "Bebidas", descricao: "Refrigerantes, sucos e bebidas alcoólicas", imagem: "drinks.jpg", ativo: true },
  { id: 4, nome: "Sobremesas", descricao: "Doces e sobremesas", imagem: "dessert.jpg", ativo: true },
  { id: 5, nome: "Combos", descricao: "Combos promocionais", imagem: "combo.jpg", ativo: false },
];
