# QA Playwright Tests

End-to-end test suite for Automation Exercise using Playwright + TypeScript.

## CI Status

[![Playwright Tests](https://github.com/victorbarsanele/qa-playwright-tests/actions/workflows/playwright.yml/badge.svg)](https://github.com/victorbarsanele/qa-playwright-tests/actions/workflows/playwright.yml)

## Project Structure

- `tests/e2e/auth/` contains UI auth journeys (login, register)
- `tests/e2e/products.spec.ts` contains products page coverage
- `tests/e2e/cart.spec.ts` contains cart page coverage
- `tests/e2e/checkout.spec.ts` contains checkout and payment coverage
- `tests/e2e/shop/` contains earlier shop-focused UI journeys kept for broader regression coverage
- `tests/api/` contains API-focused contract and lifecycle checks
- `tests/smoke/` contains critical-path smoke coverage
- `pages/` stores UI page objects
- `requests/` stores API clients and helpers

## Test Data Strategy

This project uses a hybrid test-data model.

- Use dynamic data by default for E2E flows.
- Use a shared factory to generate unique users per run: `utils/user-factory.ts`.
- Use API setup helpers to create stable preconditions quickly: `requests/auth.api.ts`.
- Avoid static account credentials for signup/login happy paths.

### When to use dynamic factory data

- Happy-path E2E scenarios (signup, login, checkout).
- Parallel or cross-browser runs where uniqueness matters.
- Any test sensitive to duplicate emails or state pollution.

### When to use static fixtures

- Deterministic boundary/regression cases.
- Known payload snapshots and contract checks.
- Edge cases that require exact, repeatable values.

## Current Convention in This Repo

- Register tests generate users with the factory.
- Login success tests create users via API, then log in via UI.
- Static JSON user fixture for register/login was removed to reduce flakiness.
- API helpers use form payloads (`form`) for request bodies, not JSON (`data`).
- UI auth specs are grouped under `tests/e2e/auth/`.
- UI feature specs are split across `tests/e2e/products.spec.ts`, `tests/e2e/cart.spec.ts`, and `tests/e2e/checkout.spec.ts`.
- UI shop specs are also grouped under `tests/e2e/shop/` for broader product/cart regression coverage.
- API auth checks are grouped under `tests/api/auth.api.spec.ts`.
- API product checks are grouped under `tests/api/products.api.spec.ts`.
- Smoke checks are grouped under `tests/smoke/smoke.spec.ts`.

### API Payload Example

```ts
// Incorrect for AutomationExercise API
await request.post('/api/searchProduct', {
    data: { search_product: 'shirt' },
});

// Correct for AutomationExercise API
await request.post('/api/searchProduct', {
    form: { search_product: 'shirt' },
});
```

## Run Tests

```bash
npm test
```

Run only auth e2e specs:

```bash
npm run test:auth:e2e
```

Run auth API specs:

```bash
npm run test:api:auth
```

Run products/cart e2e specs:

```bash
npm run test:shop:e2e
```

Run the feature E2E specs added after auth:

```bash
npx playwright test tests/e2e/products.spec.ts tests/e2e/cart.spec.ts tests/e2e/checkout.spec.ts --project=chromium
```

Run products API specs:

```bash
npx playwright test tests/api/products.api.spec.ts --project=chromium
```

Run smoke specs:

```bash
npx playwright test tests/smoke/smoke.spec.ts --project=chromium
```

## Script Matrix

- `npm run test:auth:smoke`: PR smoke suite (auth e2e + auth api) on Chromium
- `npm run test:full:chromium`: Full suite on Chromium (main branch gate)
- `npm run test:full`: Full suite on all configured projects
- `npm run test:auth:e2e`: Auth UI journeys only
- `npm run test:shop:e2e`: Shop UI journeys (products + cart)
- `npm run test:api:auth`: Auth API suite only

## Implemented Coverage

- Auth UI: login and register happy-path, validation, duplicate, and credential failure scenarios
- Products UI: listing, search, category filter, product details, add to cart
- Cart UI: single add, multiple add, remove, continue shopping, price/quantity/total validation
- Checkout UI: checkout flow, delivery address, payment validation, order confirmation, empty-cart behavior
- Auth API: account lifecycle, login verification, account update, user detail retrieval
- Products API: products list, brands list, search behavior, and unsupported-method checks
- Smoke: homepage, login, products visibility, add to cart, products API health

---

## Versão em Português (Brasil)

Suíte de testes end-to-end para Automation Exercise usando Playwright + TypeScript.

## Status do CI

[![Playwright Tests](https://github.com/victorbarsanele/qa-playwright-tests/actions/workflows/playwright.yml/badge.svg)](https://github.com/victorbarsanele/qa-playwright-tests/actions/workflows/playwright.yml)

## Estrutura do Projeto

- `tests/e2e/auth/` contém jornadas de autenticação da UI (login, cadastro)
- `tests/e2e/products.spec.ts` contém cobertura da página de produtos
- `tests/e2e/cart.spec.ts` contém cobertura de carrinho
- `tests/e2e/checkout.spec.ts` contém cobertura de checkout e pagamento
- `tests/e2e/shop/` contém jornadas anteriores focadas em loja para regressão mais ampla
- `tests/api/` contém verificações de contrato e ciclo de vida da API
- `tests/smoke/` contém cobertura de caminho crítico (smoke)
- `pages/` armazena page objects da UI
- `requests/` armazena clientes de API e utilitários

## Estratégia de Dados de Teste

Este projeto usa um modelo híbrido de dados de teste.

- Use dados dinâmicos por padrão para fluxos E2E.
- Use uma factory compartilhada para gerar usuários únicos por execução: `utils/user-factory.ts`.
- Use helpers de setup via API para criar pré-condições estáveis rapidamente: `requests/auth.api.ts`.
- Evite credenciais estáticas para caminhos felizes de cadastro/login.

### Quando usar dados dinâmicos da factory

- Cenários E2E de caminho feliz (cadastro, login, checkout).
- Execuções paralelas ou cross-browser em que unicidade importa.
- Qualquer teste sensível a emails duplicados ou poluição de estado.

### Quando usar fixtures estáticas

- Casos determinísticos de fronteira/regressão.
- Snapshots de payload conhecidos e verificações de contrato.
- Casos de borda que exigem valores exatos e repetíveis.

## Convenções Atuais Neste Repositório

- Testes de cadastro geram usuários com a factory.
- Testes de login com sucesso criam usuários via API e depois fazem login via UI.
- Fixture JSON estática de usuário para cadastro/login foi removida para reduzir flakiness.
- Helpers de API usam payload `form` nos corpos de requisição, não JSON `data`.
- Specs de autenticação da UI ficam em `tests/e2e/auth/`.
- Specs de features da UI ficam em `tests/e2e/products.spec.ts`, `tests/e2e/cart.spec.ts` e `tests/e2e/checkout.spec.ts`.
- Specs da UI focadas em loja também ficam em `tests/e2e/shop/` para regressão de produtos/carrinho.
- Verificações de auth API ficam em `tests/api/auth.api.spec.ts`.
- Verificações de products API ficam em `tests/api/products.api.spec.ts`.
- Verificações smoke ficam em `tests/smoke/smoke.spec.ts`.

### Exemplo de Payload de API

```ts
// Incorreto para a API do AutomationExercise
await request.post('/api/searchProduct', {
    data: { search_product: 'shirt' },
});

// Correto para a API do AutomationExercise
await request.post('/api/searchProduct', {
    form: { search_product: 'shirt' },
});
```

## Executar Testes

```bash
npm test
```

Executar apenas specs E2E de auth:

```bash
npm run test:auth:e2e
```

Executar specs de auth API:

```bash
npm run test:api:auth
```

Executar specs E2E de produtos/carrinho:

```bash
npm run test:shop:e2e
```

Executar specs de features E2E adicionadas após auth:

```bash
npx playwright test tests/e2e/products.spec.ts tests/e2e/cart.spec.ts tests/e2e/checkout.spec.ts --project=chromium
```

Executar specs da API de produtos:

```bash
npx playwright test tests/api/products.api.spec.ts --project=chromium
```

Executar specs smoke:

```bash
npx playwright test tests/smoke/smoke.spec.ts --project=chromium
```

## Matriz de Scripts

- `npm run test:auth:smoke`: suíte smoke de PR (auth e2e + auth api) no Chromium
- `npm run test:full:chromium`: suíte completa no Chromium (gate da branch main)
- `npm run test:full`: suíte completa em todos os projetos configurados
- `npm run test:auth:e2e`: apenas jornadas de auth UI
- `npm run test:shop:e2e`: jornadas de UI da loja (produtos + carrinho)
- `npm run test:api:auth`: apenas suíte de auth API

## Cobertura Implementada

- Auth UI: cenários de sucesso e falha para login e cadastro, validações e duplicidade
- Products UI: listagem, busca, filtro por categoria, detalhes do produto, adicionar ao carrinho
- Cart UI: adicionar item único, adicionar múltiplos, remover, continuar comprando, validação de preço/quantidade/total
- Checkout UI: fluxo de checkout, endereço de entrega, validação de pagamento, confirmação do pedido, comportamento de carrinho vazio
- Auth API: ciclo de vida de conta, verificação de login, atualização de conta, recuperação de detalhe do usuário
- Products API: lista de produtos, lista de marcas, comportamento de busca e verificação de método não suportado
- Smoke: homepage, login, visibilidade de produtos, adicionar ao carrinho, health check da API de produtos
