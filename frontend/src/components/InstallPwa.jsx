import React, { useEffect, useState } from 'react';

export default function InstallPwa() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    const standalone = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (standalone) setInstalled(true);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function installApp() {
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
      return;
    }
    window.alert('Para instalar: no Android, abra o menu do navegador e escolha "Instalar aplicativo". No iPhone, use Safari > Compartilhar > Adicionar à Tela de Início.');
  }

  if (installed) return null;

  return (
    <button type="button" className="install-nav-button" onClick={installApp} title="Instalar aplicativo" aria-label="Instalar aplicativo">
      <span aria-hidden="true">⇩</span> Instalar
    </button>
  );
}
