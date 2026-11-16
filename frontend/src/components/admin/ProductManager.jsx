import React, { useEffect, useState } from 'react';
import { productService } from '../../services/productService';

const emptyForm = { name: '', description: '', imageUrl: '', price: '', categoryId: '', available: true };

export default function ProductManager({ notify }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    const [productList, categoryList] = await Promise.all([
      productService.list(true), productService.listCategories(true)
    ]);
    setProducts(productList);
    setCategories(categoryList);
  }

  useEffect(() => { load().catch(error => notify(error.message)); }, []);

  function change(field, value) { setForm(current => ({ ...current, [field]: value })); }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        categoryId: Number(form.categoryId),
        imageUrl: form.imageUrl || ''
      };
      if (editingId) await productService.update(editingId, payload);
      else await productService.create(payload);
      setForm(emptyForm);
      setEditingId(null);
      await load();
      notify(editingId ? 'Prato atualizado.' : 'Prato cadastrado no cardápio.');
    } catch (error) { notify(error.message); }
    finally { setBusy(false); }
  }

  function edit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name || '', description: product.description || '',
      imageUrl: product.imageUrl || '', price: String(product.price),
      categoryId: String(product.categoryId || product.category?.id || ''),
      available: Boolean(product.available)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function toggleAvailability(product) {
    try {
      await productService.update(product.id, { available: !product.available });
      await load();
      notify(product.available ? 'Prato ocultado do cardápio.' : 'Prato disponibilizado.');
    } catch (error) { notify(error.message); }
  }

  async function addCategory(event) {
    event.preventDefault();
    try {
      await productService.createCategory({ name: categoryName.trim() });
      setCategoryName('');
      await load();
      notify('Categoria criada.');
    } catch (error) { notify(error.message); }
  }

  return (
    <section className="panel admin-panel">
      <h2>Gerenciar cardápio</h2>
      <p className="muted">Cadastre pratos, ajuste preços e controle o que aparece para os clientes.</p>
      <form className="admin-form" onSubmit={submit}>
        <h3>{editingId ? 'Editar prato' : 'Adicionar prato'}</h3>
        <label>Nome do prato<input value={form.name} onChange={e => change('name', e.target.value)} required minLength="2" /></label>
        <label>Descrição<textarea value={form.description} onChange={e => change('description', e.target.value)} rows="3" /></label>
        <label>URL da imagem<input type="url" value={form.imageUrl} onChange={e => change('imageUrl', e.target.value)} placeholder="https://..." /></label>
        <div className="admin-grid">
          <label>Preço (R$)<input type="number" min="0.01" step="0.01" value={form.price} onChange={e => change('price', e.target.value)} required /></label>
          <label>Categoria<select value={form.categoryId} onChange={e => change('categoryId', e.target.value)} required><option value="">Selecione</option>{categories.filter(c => c.active).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        </div>
        <label className="check-label"><input type="checkbox" checked={form.available} onChange={e => change('available', e.target.checked)} /> Disponível no cardápio</label>
        <div className="actions">
          <button disabled={busy || !categories.some(c => c.active)}>{busy ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Cadastrar prato'}</button>
          {editingId && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancelar edição</button>}
        </div>
      </form>

      <form className="category-form" onSubmit={addCategory}>
        <h3>Nova categoria</h3>
        <label>Nome da categoria<input value={categoryName} onChange={e => setCategoryName(e.target.value)} required /></label>
        <button type="submit">Adicionar categoria</button>
      </form>

      <h3>Pratos cadastrados ({products.length})</h3>
      <div className="admin-list">
        {products.map(product => (
          <article className="admin-list-row" key={product.id}>
            <div className="admin-product-info">
              {product.imageUrl ? <img src={product.imageUrl} alt="" /> : <span className="admin-thumb">🍽️</span>}
              <div><strong>{product.name}</strong><p>{product.category?.name || 'Sem categoria'} · R$ {Number(product.price).toFixed(2)}</p><small>{product.available ? 'Disponível' : 'Indisponível'}</small></div>
            </div>
            <div className="actions">
              <button type="button" className="secondary" onClick={() => edit(product)}>Editar</button>
              <button type="button" className="secondary" onClick={() => toggleAvailability(product)}>{product.available ? 'Ocultar' : 'Disponibilizar'}</button>
            </div>
          </article>
        ))}
        {!products.length && <p className="muted">Nenhum prato cadastrado.</p>}
      </div>
      <h3>Categorias</h3>
      <div className="admin-list">{categories.map(category => (
        <article className="admin-list-row" key={category.id}>
          <span className={!category.active ? 'inactive-chip' : ''}>{category.name} {!category.active ? '(inativa)' : ''}</span>
          <button type="button" className="secondary" onClick={async () => {
            try {
              await productService.updateCategory(category.id, { active: !category.active });
              await load();
              notify(category.active ? 'Categoria desativada.' : 'Categoria reativada.');
            } catch (error) { notify(error.message); }
          }}>{category.active ? 'Desativar' : 'Reativar'}</button>
        </article>
      ))}</div>
    </section>
  );
}
