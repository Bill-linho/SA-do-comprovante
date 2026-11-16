import React from 'react';
import { useAppearance } from '../contexts/AppearanceContext';

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useAppearance();

  return (
    <section className="settings-page">
      <div className="settings-heading">
        <span className="eyebrow">PREFERÊNCIAS DO APLICATIVO</span>
        <h1>Configurações</h1>
        <p className="muted">Personalize a aparência e a leitura do sistema neste dispositivo.</p>
      </div>

      <section className="panel settings-card">
        <div className="settings-title"><span className="settings-icon">◐</span><div><h2>Aparência</h2><p className="muted">Escolha como deseja visualizar o aplicativo.</p></div></div>
        <label htmlFor="theme">Tema</label>
        <select id="theme" value={settings.theme} onChange={event => updateSettings({ theme: event.target.value })}>
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
          <option value="system">Automático (seguir navegador/dispositivo)</option>
        </select>
        <p className="settings-help">No modo automático, o sistema acompanha a preferência de tema do celular ou computador.</p>
      </section>

      <section className="panel settings-card">
        <div className="settings-title"><span className="settings-icon">Aa</span><div><h2>Leitura</h2><p className="muted">Ajuste o tamanho dos textos.</p></div></div>
        <label htmlFor="font-size">Tamanho da fonte</label>
        <select id="font-size" value={settings.fontSize} onChange={event => updateSettings({ fontSize: event.target.value })}>
          <option value="small">Pequena</option>
          <option value="medium">Média</option>
          <option value="large">Grande</option>
          <option value="xlarge">Muito grande</option>
        </select>
        <p className="settings-preview">Exemplo de texto para visualizar o tamanho escolhido.</p>
      </section>

      <section className="panel settings-card">
        <div className="settings-title"><span className="settings-icon">◒</span><div><h2>Acessibilidade</h2><p className="muted">Melhore a distinção entre textos e fundos.</p></div></div>
        <label className="settings-switch">
          <span><strong>Alto contraste</strong><small>Realça bordas, textos e elementos interativos.</small></span>
          <input type="checkbox" checked={settings.highContrast} onChange={event => updateSettings({ highContrast: event.target.checked })} />
        </label>
      </section>

      <div className="settings-actions">
        <button type="button" className="secondary" onClick={resetSettings}>Restaurar padrão</button>
      </div>
    </section>
  );
}
