import { Category, Product } from '../models/index.js';

export async function listProducts(req, res) {
  const products = await Product.findAll({
    where: { ...(req.query.all === 'true' ? {} : { available: true }) },
    include: [{ model: Category, as: 'category' }],
    order: [['name', 'ASC']]
  });
  res.json(products);
}

export async function createCategory(req, res) {
  const { name, description } = req.body;
  if (!name?.trim()) return res.status(400).json({ message: 'Informe o nome da categoria.' });
  const category = await Category.create({ name: name.trim(), description });
  res.status(201).json(category);
}

export async function listCategories(req, res) {
  const categories = await Category.findAll({
    where: { ...(req.query.all === 'true' ? {} : { active: true }) },
    order: [['name', 'ASC']]
  });
  res.json(categories);
}

export async function updateCategory(req, res) {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ message: 'Categoria não encontrada.' });
  const { name, description, active } = req.body;
  if (name !== undefined && !name.trim()) return res.status(400).json({ message: 'Nome inválido.' });
  await category.update({
    ...(name !== undefined ? { name: name.trim() } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(active !== undefined ? { active: Boolean(active) } : {})
  });
  res.json(category);
}

export async function createProduct(req, res) {
  const product = await Product.create(req.validated.body);
  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Produto não encontrado.' });
  const allowed = ['name', 'description', 'imageUrl', 'price', 'categoryId', 'available'];
  const changes = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  if (changes.name !== undefined && !String(changes.name).trim()) {
    return res.status(400).json({ message: 'Nome inválido.' });
  }
  if (changes.price !== undefined && !(Number(changes.price) > 0)) {
    return res.status(400).json({ message: 'Preço inválido.' });
  }
  await product.update(changes);
  res.json(product);
}
