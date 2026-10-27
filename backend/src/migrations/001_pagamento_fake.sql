-- Execute uma única vez em bancos existentes antes de iniciar a versão atualizada.
-- O modelo Pedido já é a fonte de verdade do pedido; não cria tabela duplicada.
ALTER TABLE pedidos
  ADD COLUMN IF NOT EXISTS pagamento_status VARCHAR(20) NOT NULL DEFAULT 'pendente',
  ADD COLUMN IF NOT EXISTS pagamento_metodo VARCHAR(30),
  ADD COLUMN IF NOT EXISTS pagamento_fake_id VARCHAR(40),
  ADD COLUMN IF NOT EXISTS pago_em TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS pedidos_pagamento_fake_id_unique
  ON pedidos (pagamento_fake_id)
  WHERE pagamento_fake_id IS NOT NULL;

ALTER TABLE pedidos DROP CONSTRAINT IF EXISTS pedidos_pagamento_status_check;
ALTER TABLE pedidos ADD CONSTRAINT pedidos_pagamento_status_check
  CHECK (pagamento_status IN ('pendente', 'aprovado', 'recusado', 'estornado'));

ALTER TABLE pedidos DROP CONSTRAINT IF EXISTS pedidos_pagamento_metodo_check;
ALTER TABLE pedidos ADD CONSTRAINT pedidos_pagamento_metodo_check
  CHECK (pagamento_metodo IS NULL OR pagamento_metodo IN ('dinheiro', 'pix', 'cartao_credito', 'cartao_debito')); 