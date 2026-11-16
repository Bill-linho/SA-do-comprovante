import React, { useEffect, useState } from 'react';

let installPrompt = null;
let appInstalled = false;
const subscribers = new Set();

function notifySubscribers() {
  subscribers.forEach(subscriber => subscriber());
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    notifySubscribers();
  });
  window.addEventListener('appinstalled', () => {
    appInstalled = true;
    installPrompt = null;
    notifySubscribers();
  });
}

export default function InstallPwa() {
  const [promptAvailable, setPromptAvailable] = useState(Boolean(installPrompt));
  const [installed, setInstalled] = useState(() => {
    const standalone = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
    return appInstalled || standalone;
  });

  useEffect(() => {
    const syncInstallationState = () => {
      setPromptAvailable(Boolean(installPrompt));
      setInstalled(appInstalled);
    };
    subscribers.add(syncInstallationState);
    syncInstallationState();
    return () => subscribers.delete(syncInstallationState);
  }, []);

  async function installApp() {
    if (installPrompt) {
      const promptEvent = installPrompt;
      await promptEvent.prompt();
      await promptEvent.userChoice;
      installPrompt = null;
      notifySubscribers();
      return;
    }
    window.alert('Para instalar: no Android, abra o menu do navegador e escolha "Instalar aplicativo". No iPhone, use Safari > Compartilhar > Adicionar à Tela de Início.');
  }

  if (installed) return null;

  return (
    <button type="button" className="install-nav-button" onClick={installApp} title="Instalar aplicativo" aria-label="Instalar aplicativo">
      <span aria-hidden="true">⇩</span> {promptAvailable ? 'Instalar app' : 'Como instalar'}
    </button>
  );
}
