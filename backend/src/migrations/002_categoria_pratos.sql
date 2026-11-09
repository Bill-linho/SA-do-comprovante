-- Execute uma vez em bancos existentes para habilitar as categorias no cardápio.
ALTER TABLE pratos
  ADD COLUMN IF NOT EXISTS categoria VARCHAR(60) NOT NULL DEFAULT 'Pratos';
