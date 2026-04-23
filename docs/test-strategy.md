# QA Test Strategy Document

## Playwright TypeScript E2E Testing for Automation Exercise

---

## 1. Executive Summary

This document outlines the comprehensive quality assurance strategy for testing the Automation Exercise platform using Playwright with TypeScript. The strategy focuses on end-to-end (E2E) testing with complementary smoke and API tests to ensure product reliability, user workflows, and API functionality.

---

## 2. Scope

### In Scope

- **User Authentication & Register** â€“ validate user registration workflows, validation rules, and error handling
- **Product Catalog** â€“ verify product listings, filtering, sorting, and search functionality
- **Shopping Cart** â€“ test add/remove items, quantity updates, and cart persistence
- **Checkout & Payment** â€“ validate order placement, form validation, and confirmation flows
- **User Account Management** â€“ profile updates, order history, and preferences
- **Navigation & UI** â€“ verify page navigation, responsive design (desktop), and accessibility basics
- **Form Validation** â€“ client-side and server-side validation across all user input forms
- **API Endpoints** â€“ critical API routes supporting E2E workflows (authentication, products, orders)
- **Error Handling** â€“ network errors, invalid inputs, and edge cases

### Out of Scope

- **Mobile/Tablet Testing** â€“ limited to desktop (1920x1080) in initial phase
- **Performance Testing** â€“ load testing, stress testing, and performance benchmarking
- **Security Testing** â€“ penetration testing, vulnerability scanning (handled separately)
- **Visual Regression Testing** â€“ pixel-perfect screenshot comparisons
- **Third-Party Integrations** â€“ payment gateways, shipping providers (mocked in tests)
- **Database Testing** â€“ direct database queries and data integrity testing
- **Accessibility Compliance (WCAG)** â€“ full accessibility testing deferred to dedicated phase

---

## 3. Approach

### Testing Pyramid

```
        API Tests (Unit-like)
      /                        \
   Smoke Tests (Quick Sanity)
 /                              \
E2E Tests (Critical User Journeys)
```

### Strategy Overview

1. **E2E Tests** â€“ Focus on complete user journeys covering main features
2. **Smoke Tests** â€“ Quick validation of core functionality; run frequently
3. **API Tests** â€“ Validate REST endpoints in isolation; support E2E test setup
4. **Manual Testing** â€“ Edge cases, exploratory testing, and production verification

### Test Execution Priority

| Level | Type        | Run Frequency   | Purpose                           |
| ----- | ----------- | --------------- | --------------------------------- |
| 1     | Smoke (E2E) | Every commit    | Catch critical regressions        |
| 2     | E2E         | Daily (nightly) | Comprehensive workflow validation |
| 3     | API         | Daily (nightly) | Backend contract verification     |
| 4     | Manual      | Weekly          | Exploratory testing & edge cases  |

---

## 4. Test Types & Coverage

### 4.1 E2E Tests

**Goal:** Validate complete user workflows through the UI

**Key Test Suites:**

| Feature                 | Critical Flows                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| **Authentication**      | Register/login with valid and invalid data, email validation, duplicate and credential failures |
| **Product Browsing**    | View products, filter by category, search functionality, product details                        |
| **Shopping Experience** | Add items to cart, update quantities, remove items, persist cart across sessions                |
| **Checkout**            | Proceed through multi-step form, address validation, order confirmation                         |
| **Account Management**  | Update profile, view order history, manage preferences                                          |
| **Error Scenários**     | Missing required fields, duplicate emails, invalid inputs, network timeouts                     |

**Test Data:**

- Generated via shared user factory (`utils/user-factory.ts`)
- Fresh, unique users created per execution to avoid collisions
- Account setup can be done via auth helper (`requests/auth.api.ts`) for stable preçonditions

**Page Object Model (POM):**

- Centralized locators and methods in `pages/` directory
- Reusable page actions (`RegisterPage`, `LoginPage`, etc.)
- Reduces test maintenance; improves readability

**Current Suite Split:**

- UI auth journeys: `tests/e2e/auth/login.spec.ts`, `tests/e2e/auth/register.spec.ts`
- UI feature suites: `tests/e2e/products.spec.ts`, `tests/e2e/cart.spec.ts`, `tests/e2e/checkout.spec.ts`
- UI shop regression suites: `tests/e2e/shop/products.spec.ts`, `tests/e2e/shop/cart.spec.ts`
- Smoke suite: `tests/smoke/smoke.spec.ts`
- API auth checks: `tests/api/auth.api.spec.ts`
- API product checks: `tests/api/products.api.spec.ts`
- API clients: `requests/auth.api.ts`, `requests/user.api.ts`, `requests/products.api.ts`

---

### 4.2 Smoke Tests

**Goal:** Quick validation that critical functionality works

**Characteristics:**

- Lightweight; run in minutes
- Cover happy paths only (no error scenários)
- Execute on every merge to main/develop branches
- Alert immediately on failure

**Scope:**

- Home page availability
- User login
- Product listing visibility
- Add product to cart
- Products API health check

---

### 4.3 API Tests

**Goal:** Verify REST endpoints independent of UI

**Coverage:**

- Authentication endpoints (create account, verify login, delete account, update account, get user detail)
- Product endpoints (list, brands, search, unsupported methods)
- User endpoints (profile, orders)
- Cart endpoints (add, remove, update)
- Order endpoints (create, retrieve)

**Approach:**

- Use Playwright's `APIRequestContext` for direct HTTP calls
- Send API request bodies as form data (`form`) for AutomationExercise endpoints (not JSON `data`)
- Validate response status codes, headers, and JSON schema
- Verify error responses (4xx, 5xx)
- Test rate limiting and authentication failures

**Payload Example (AutomationExercise):**

```ts
// Incorrect for this API
await request.post('/api/createAccount', {
    data: { name: user.name, email: user.email },
});

// Correct for this API
await request.post('/api/createAccount', {
    form: { name: user.name, email: user.email },
});
```

---

## 5. Tools & Technology Stack

| Component             | Tool                      | Version      | Purpose                          |
| --------------------- | ------------------------- | ------------ | -------------------------------- |
| **Framework**         | Playwright                | Latest       | Cross-browser E2E automation     |
| **Language**          | TypeScript                | Latest       | Type-safe test code              |
| **Test Runner**       | Playwright Test           | Built-in     | Test execution & reporting       |
| **Assertion Library** | Expect (built-in)         | Built-in     | Test assertions                  |
| **Page Objects**      | Custom                    | N/A          | Centralized UI interaction layer |
| **Reporting**         | Playwright HTML Report    | Built-in     | Test results & artifacts         |
| **CI/CD Platform**    | GitHub Actions            | (configured) | Automated test execution         |
| **Browsers**          | Chromium, Firefox, WebKit | Latest       | Multi-browser validation         |

---

## 6. CI/CD Integration

### Build Pipeline Stages

```
Code Push
    ↓
Lint & Type Check
    ↓
Unit Tests (if applicable)
    ↓
Smoke E2E Tests (fast, blocking)
    ↓
Full E2E + API Tests (parallel, async)
    ↓
Generate Reports & Upload Artifacts
    ↓
TODO: Notifications (deferred)
```

### GitHub Actions Workflow

- **Triggers:** Push to main/develop, Pull Requests
- **Browsers Tested:** Chromium (primary), Firefox, WebKit (nightly)
- **Parallelization:** Tests run across multiple workers for speed
- **Artifact Retention:** HTML reports, screenshots, videos (14 days)
- **Failure Handling:** Automatic retry on flaky tests (up to 2 retries)

### Execution Tiers (Phase 4)

| Trigger       | Suite                                                          | Purpose                                      | Expected Duration |
| ------------- | -------------------------------------------------------------- | -------------------------------------------- | ----------------- |
| Pull Request  | `tests/e2e/auth/**` + `tests/api/auth.api.spec.ts` on Chromium | Fast signal on highest-risk flows            | < 10 min          |
| Merge to main | Full e2e + API + smoke on Chromium                             | Broader regression safety                    | < 25 min          |
| Nightly       | Full suite on Chromium, Firefox, WebKit                        | Cross-browser confidence and drift detection | < 45 min          |

### Test Data Policy (Phase 4)

- Generate unique user data with `createRandomSignupUser` for register/login flows.
- Prefer API preçonditions via `createAccountViaApi` for stable setup.
- Every API test that creates an account must attempt cleanup with `deleteAccount`.
- Never share static credentials across parallel tests.
- Use static fixtures only for deterministic boundary contracts.

### Flaky Test Handling Policy (Phase 4)

1. A flaky failure is a test that fails and then passes on retry without code change.
2. Quarantine threshold: 2 flaky occurrences in 7 days.
3. Quarantined tests are tagged and excluded from PR gating until fixed.
4. Fix SLA: 48 hours for critical flows, 5 business days for non-critical.
5. Every flaky incident should log root cause and remediation in `docs/bugs-found.md`.

### Test Environment

- **Dev/Staging:** Run all tests; validate before production deployment
- **Production:** Smoke tests only; scheduled post-deployment checks
- **Schedule:** Nightly runs for comprehensive test coverage

---

## 7. Quality Metrics & Reporting

### Key Metrics

- **Pass Rate:** Target â‰¥ 95%
- **Coverage:** Critical user journeys (product browsing, checkout, account management)
- **Flakiness:** < 2% of tests; investigate root causes
- **Execution Time:** Smoke tests < 5min; Full suite < 30min

### Reports

- **HTML Report:** Published after each run; includes screenshots/videos
- **Dashboard:** Real-time CI/CD metrics and test trends
- **Regression Analysis:** Track pass/fail patterns over time

---

## 8. Best Practices

### Test Authoring

- âœ… Use Page Object Model for maintainability
- âœ… Clear, descriptive test names (what + expected result)
- âœ… One assertion focus per test when possible
- âœ… Use test fixtures for setup/teardown
- âœ… Avoid hard-coded waits; use Playwright's built-in waits (`waitFor`, `toBeVisible`, etc.)
- âœ… Test from user perspective; avoid testing implementation details

### Maintenance

- âœ… Review and update locators quarterly
- âœ… Remove duplicate/obsolete tests
- âœ… Document complex test scenários in comments
- âœ… Track and resolve flaky tests immediately
- âœ… Keep test data and fixtures up-to-date

### Debugging

- ðŸ“¸ Capture screenshots on failure (automatic)
- ðŸŽ¥ Record videos of failed tests for analysis
- ðŸž Use `page.pause()` during local debugging
- ðŸ“‹ Review detailed error logs in CI/CD artifacts

---

## 9. Risks & Mitigation

| Risk                            | Likelihood | Impact   | Mitigation                                                     |
| ------------------------------- | ---------- | -------- | -------------------------------------------------------------- |
| **Flaky Tests (timing issues)** | High       | Medium   | Use explicit waits; avoid `setTimeout`; retry logic in CI      |
| **Test Data Pollution**         | Medium     | High     | Isolate test data; clean up after each run; use fresh accounts |
| **Selector Breakage**           | Medium     | High     | Use stable `data-testid` attributes; avoid CSS/XPath fragility |
| **Environment Outages**         | Low        | Critical | Maintain test environment health; ping checks in CI            |
| **Maintenance Burden**          | High       | Medium   | Invest in Page Objects; document patterns; code review tests   |

---

## 10. Future Enhancements

- **Visual Testing:** Add screenshot comparison for design validation
- **Performance Monitoring:** Integrate Lighthouse or Web Vitals metrics
- **Mobile Testing:** Extend to iOS and Android via Playwright Mobile
- **Cloud Execution:** Consider cloud-based browser testing (BrowserStack, Sauce Labs)
- **Test Analytics:** ML-based flakiness detection and trend analysis
- **Accessibility:** Full WCAG 2.1 AA compliance testing
- **Integration Testing:** Expand API test coverage; add contract testing

---

## 11. Glossary

| Term                 | Definition                                                     |
| -------------------- | -------------------------------------------------------------- |
| **E2E (End-to-End)** | Testing complete user workflows from start to finish           |
| **Smoke Test**       | Quick, lightweight test validating critical functionality      |
| **Flaky Test**       | Test that passes/fails inconsistently without code changes     |
| **Artifact**         | Test output files: screenshots, videos, reports                |
| **Page Object**      | Abstraction layer encapsulating page interactions and locators |
| **CI/CD**            | Continuous Integration/Continuous Deployment automation        |

---

## 12. References & Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices for E2E Testing](https://playwright.dev/docs/best-practices)
- [Page Object Model Pattern](https://playwright.dev/docs/testing-intro#use-page-fixtures)
- [GitHub Actions for CI/CD](https://docs.github.com/en/actions)

---

**Document Version:** 1.1  
**Last Updated:** April 23, 2026  
**Owner:** QA Team  
**Review Frequency:** Quarterly

---

# Documento de Estratégia de Testes QA (Versão em Português - Brasil)

## Testes E2E em Playwright TypeScript para Automation Exercise

---

## 1. Resumo Executivo

Este documento descreve a estratégia abrangente de garantia de qualidade para testar a plataforma Automation Exercise usando Playwright com TypeScript. A estratégia foca em testes end-to-end (E2E), com suítes complementares de smoke e API para garantir confiabilidade do produto, fluidez dos fluxos de usuário e funcionamento dos endpoints.

---

## 2. Escopo

### Dentro do Escopo

- **Autenticação e Cadastro de Usuário** - validar fluxo de registro, regras de validação e tratamento de erros
- **Catálogo de Produtos** - verificar listagem, filtros, ordenação e busca
- **Carrinho de Compras** - testar adicionar/remover itens, atualização de quantidade e persistência do carrinho
- **Checkout e Pagamento** - validar criação do pedido, validação de formulário e fluxo de confirmação
- **Gestão de Conta de Usuário** - atualização de perfil, histórico de pedidos e preferências
- **Navegação e UI** - verificar navegação entre páginas, responsividade desktop e acessibilidade básica
- **Validação de Formulários** - validação no cliente e no servidor em formulários de entrada
- **Endpoints de API** - rotas críticas que suportam fluxos E2E (autenticação, produtos, pedidos)
- **Tratamento de Erros** - erros de rede, entradas inválidas e casos de borda

### Fora do Escopo

- **Testes Mobile/Tablet** - limitado a desktop (1920x1080) nesta fase inicial
- **Testes de Performance** - carga, estresse e benchmark de desempenho
- **Testes de Segurança** - pentest e varredura de vulnerabilidades (tratado separadamente)
- **Teste de Regressão Visual** - comparação pixel a pixel
- **Integrações de Terceiros** - gateways de pagamento e provedores de envio (mockados)
- **Testes de Banco de Dados** - queries diretas e integridade de dados
- **Conformidade Completa de Acessibilidade (WCAG)** - adiada para fase dedicada

---

## 3. Abordagem

### Pirâmide de Testes

```
        Testes de API (estilo unitário)
      /                                \
   Testes Smoke (sanidade rápida)
 /                                    \
Testes E2E (jornadas críticas de usuário)
```

### Visão Geral da Estratégia

1. **Testes E2E** - foco em jornadas completas de usuário cobrindo funcionalidades principais
2. **Testes Smoke** - validação rápida de funcionalidades essenciais; execução frequente
3. **Testes de API** - validação isolada de endpoints REST; suporte ao setup do E2E
4. **Testes Manuais** - casos de borda, testes exploratórios e verificação em produção

### Prioridade de Execução

| Nível | Tipo        | Frequência       | Objetivo                                 |
| ----- | ----------- | ---------------- | ---------------------------------------- |
| 1     | Smoke (E2E) | A cada commit    | Detectar regressão crítica rapidamente   |
| 2     | E2E         | Diário (noturno) | Validação abrangente de fluxos           |
| 3     | API         | Diário (noturno) | Verificação de contrato do backend       |
| 4     | Manual      | Semanal          | Exploração e cobertura de casos de borda |

---

## 4. Tipos de Teste e Cobertura

### 4.1 Testes E2E

**Objetivo:** Validar fluxos completos de usuário pela interface

**Suítes-chave:** autenticação, navegação de produtos, experiência de carrinho, checkout, gestão de conta e cenários de erro.

**Dados de teste:**

- Gerados por factory compartilhada em `utils/user-factory.ts`
- Usuários únicos por execução para evitar colisão
- Setup de conta via helper de auth em `requests/auth.api.ts` para pré-condições estáveis

**Page Object Model (POM):**

- Locators e métodos centralizados em `pages/`
- Ações de página reutilizáveis (`RegisterPage`, `LoginPage`, etc.)
- Menor custo de manutenção e maior legibilidade

**Divisão atual das suítes:**

- Jornadas UI de auth: `tests/e2e/auth/login.spec.ts`, `tests/e2e/auth/register.spec.ts`
- Suítes de features UI: `tests/e2e/products.spec.ts`, `tests/e2e/cart.spec.ts`, `tests/e2e/checkout.spec.ts`
- Suítes de regressão da loja: `tests/e2e/shop/products.spec.ts`, `tests/e2e/shop/cart.spec.ts`
- Smoke: `tests/smoke/smoke.spec.ts`
- Auth API: `tests/api/auth.api.spec.ts`
- Products API: `tests/api/products.api.spec.ts`
- Clientes de API: `requests/auth.api.ts`, `requests/user.api.ts`, `requests/products.api.ts`

### 4.2 Testes Smoke

**Objetivo:** Validar rapidamente que funcionalidades críticas estão operacionais.

**Características:** leves, executam em minutos, cobrem caminho feliz, executam em merge para branch principal e alertam imediatamente em caso de falha.

### 4.3 Testes de API

**Objetivo:** Verificar endpoints REST sem dependência da UI.

**Cobertura:** autenticação, produtos, usuários, carrinho e pedidos.

**Abordagem:**

- Usar `APIRequestContext` do Playwright
- Enviar corpo de request como `form` (não `data`) para endpoints AutomationExercise
- Validar códigos de resposta, headers e schema JSON
- Validar respostas de erro e cenários de falha de autenticação

**Exemplo de payload:**

```ts
// Incorreto para esta API
await request.post('/api/createAccount', {
    data: { name: user.name, email: user.email },
});

// Correto para esta API
await request.post('/api/createAccount', {
    form: { name: user.name, email: user.email },
});
```

---

## 5. Ferramentas e Stack Tecnológica

| Componente       | Ferramenta                | Versão      | Objetivo                            |
| ---------------- | ------------------------- | ----------- | ----------------------------------- |
| **Framework**    | Playwright                | Latest      | Automação E2E cross-browser         |
| **Linguagem**    | TypeScript                | Latest      | Código de testes com tipagem        |
| **Runner**       | Playwright Test           | Built-in    | Execução e relatório                |
| **Asserts**      | Expect                    | Built-in    | Asserções de teste                  |
| **Page Objects** | Custom                    | N/A         | Camada centralizada de interação UI |
| **Relatórios**   | Playwright HTML Report    | Built-in    | Resultados e artefatos              |
| **CI/CD**        | GitHub Actions            | Configurado | Execução automática                 |
| **Browsers**     | Chromium, Firefox, WebKit | Latest      | Validação multi-browser             |

---

## 6. Integração CI/CD

### Etapas do Pipeline

```
Push de Código
    ↓
Lint e Type Check
    ↓
Testes Unitários (se aplicável)
    ↓
Smoke E2E (rápido, bloqueante)
    ↓
E2E Completo + API (paralelo/assíncrono)
    ↓
Geração de Relatórios e Upload de Artefatos
    ↓
TODO: Notificações (adiado)
```

### Workflow no GitHub Actions

- **Triggers:** push e pull request
- **Browsers:** Chromium (principal), Firefox e WebKit (noturno)
- **Paralelização:** execução com workers
- **Retenção de artefatos:** relatórios HTML, screenshots e vídeos (14 dias)
- **Falhas:** retry automático para testes instáveis (até 2 tentativas)

### Política de Dados de Teste (Fase 4)

- Gerar usuário único com `createRandomSignupUser`
- Preferir pré-condições via `createAccountViaApi`
- Todo teste de API que cria conta deve tentar cleanup com `deleteAccount`
- Não compartilhar credenciais estáticas entre testes paralelos
- Usar fixture estática apenas para contratos determinísticos

### Política para Flaky Tests (Fase 4)

1. Flaky: teste que falha e depois passa no retry sem alteração de código.
2. Limite para quarentena: 2 ocorrências em 7 dias.
3. Testes em quarentena saem do gate de PR até correção.
4. SLA de correção: 48h para fluxos críticos, 5 dias úteis para não-críticos.
5. Registrar causa raiz e remediação em `docs/bugs-found.md`.

---

## 7. Métricas de Qualidade e Relatórios

### Métricas

- **Taxa de aprovação:** meta >= 95%
- **Cobertura:** jornadas críticas de usuário
- **Flakiness:** < 2%
- **Tempo de execução:** smoke < 5 min; suíte completa < 30 min

### Relatórios

- **HTML Report:** publicado após cada execução
- **Dashboard:** métricas CI/CD e tendências
- **Análise de regressão:** padrões históricos de pass/fail

---

## 8. Boas Práticas

### Escrita de Testes

- Usar POM para manutenção
- Nomes de teste claros e descritivos
- Foco em uma intenção principal por teste, quando possível
- Usar fixtures para setup/teardown
- Evitar waits fixos; preferir esperas nativas do Playwright
- Testar a perspectiva do usuário, não detalhes de implementação

### Manutenção

- Revisar locators periodicamente
- Remover testes duplicados/obsoletos
- Documentar cenários complexos
- Tratar flaky tests com prioridade
- Manter dados e fixtures atualizados

### Debug

- Capturar screenshot em falha
- Gravar vídeo em falha
- Usar `page.pause()` localmente
- Revisar logs detalhados dos artefatos CI/CD

---

## 9. Riscos e Mitigação

| Risco                             | Probabilidade | Impacto | Mitigação                                                         |
| --------------------------------- | ------------- | ------- | ----------------------------------------------------------------- |
| **Flaky tests (timing)**          | Alta          | Médio   | Esperas explícitas, evitar `setTimeout`, retry no CI              |
| **Poluição de dados de teste**    | Média         | Alto    | Isolar dados, limpar após execução, usar contas novas             |
| **Quebra de seletores**           | Média         | Alto    | Preferir seletores estáveis (`data-testid`) e reduzir fragilidade |
| **Indisponibilidade de ambiente** | Baixa         | Crítico | Monitorar saúde de ambiente e ping checks no CI                   |
| **Custo de manutenção**           | Alta          | Médio   | Investir em POM, padronização e revisão de código                 |

---

## 10. Melhorias Futuras

- Testes visuais com comparação de screenshots
- Monitoramento de performance (Lighthouse/Web Vitals)
- Extensão para mobile
- Execução em nuvem
- Analíticos de teste e detecção de flakiness
- Cobertura completa de acessibilidade
- Ampliação de cobertura de integração/contrato de API

---

## 11. Glossário

| Termo                | Definição                                                   |
| -------------------- | ----------------------------------------------------------- |
| **E2E (End-to-End)** | Teste de fluxo completo de usuário do início ao fim         |
| **Smoke Test**       | Teste rápido para validar funcionalidade crítica            |
| **Flaky Test**       | Teste com comportamento inconsistente sem mudança de código |
| **Artefato**         | Arquivos gerados: screenshots, vídeos e relatórios          |
| **Page Object**      | Camada de abstração para interações e locators de página    |
| **CI/CD**            | Integração/entrega contínua automatizada                    |

---

## 12. Referências

- [Documentação do Playwright](https://playwright.dev)
- [Boas práticas para testes E2E](https://playwright.dev/docs/best-practices)
- [Padrão Page Object Model](https://playwright.dev/docs/testing-intro#use-page-fixtures)
- [GitHub Actions para CI/CD](https://docs.github.com/en/actions)

---

**Versão do Documento:** 1.1  
**Última Atualização:** 23 de abril de 2026  
**Responsável:** QA Team  
**Frequência de Revisão:** Trimestral
