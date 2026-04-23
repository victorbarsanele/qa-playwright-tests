# Test Cases

## Auth - Register

| ID      | Type | Title                                         | Preconditions                  | Steps                                            | Expected Result                                       |
| ------- | ---- | --------------------------------------------- | ------------------------------ | ------------------------------------------------ | ----------------------------------------------------- |
| REG-001 | E2E  | Register with valid data                      | User is on login page          | Fill register fields with unique user and submit | Account created screen is shown                       |
| REG-002 | E2E  | Register blocked when password is blank       | User reached account info form | Leave password empty, click Create Account       | Browser native required validation shown for password |
| REG-003 | E2E  | Register blocked when step 1 name is blank    | User is on login page          | Leave name blank in step 1 and submit            | Browser native required validation shown for name     |
| REG-004 | E2E  | Register blocked when step 1 email is blank   | User is on login page          | Fill name, leave email blank, submit             | Browser native required validation shown for email    |
| REG-005 | E2E  | Register blocked when step 1 email is invalid | User is on login page          | Fill invalid email, submit                       | Browser typeMismatch validation shown                 |
| REG-006 | E2E  | Register blocked for duplicate email          | Account already exists         | Attempt register with existing email             | Duplicate email error message is shown                |

## Auth - Login

| ID      | Type | Title                                  | Preconditions         | Steps                                       | Expected Result                                       |
| ------- | ---- | -------------------------------------- | --------------------- | ------------------------------------------- | ----------------------------------------------------- |
| LOG-001 | E2E  | Login with valid credentials           | Account exists        | Fill valid email and password, submit       | User is logged in and Logout link appears             |
| LOG-002 | E2E  | Login fails for invalid credentials    | None                  | Fill unknown email and password, submit     | Invalid credentials error is shown                    |
| LOG-003 | E2E  | Login fails for wrong password         | Account exists        | Fill valid email and wrong password, submit | Invalid credentials error is shown                    |
| LOG-004 | E2E  | Login blocked when email is blank      | User is on login page | Leave email blank and submit                | Browser native required validation shown for email    |
| LOG-005 | E2E  | Login blocked when password is blank   | User is on login page | Fill email, leave password blank, submit    | Browser native required validation shown for password |
| LOG-006 | E2E  | Login blocked for invalid email format | User is on login page | Fill invalid email format and submit        | Browser typeMismatch validation shown                 |

## API - Auth

| ID           | Type | Title                               | Preconditions           | Steps                                                | Expected Result                        |
| ------------ | ---- | ----------------------------------- | ----------------------- | ---------------------------------------------------- | -------------------------------------- |
| API-AUTH-001 | API  | Create, verify, and delete account  | None                    | Create account via API, verify login, delete account | Response codes: 201, 200, 200          |
| API-AUTH-002 | API  | Reject invalid login password       | Account created via API | Verify login with wrong password                     | Response code is not 200               |
| API-AUTH-003 | API  | Update account details              | Account created via API | Update account payload fields via `updateAccount`    | Response code is 200                   |
| API-AUTH-004 | API  | Get user detail by email            | Account created via API | Call `getUserDetailByEmail` with account email       | Response code is 200 and email matches |
| API-AUTH-005 | API  | Verify login with valid credentials | Account created via API | Call `verifyLogin` with valid email/password         | Response code is 200                   |
| API-AUTH-006 | API  | Reject verify login invalid creds   | None                    | Call `verifyLogin` with unknown email/password       | Response code is not 200               |
| API-AUTH-007 | API  | Reject DELETE on verifyLogin        | None                    | Call `DELETE /verifyLogin`                           | Response code is 405                   |

## Products

| ID       | Type | Title                                     | Preconditions               | Steps                                                  | Expected Result                                    |
| -------- | ---- | ----------------------------------------- | --------------------------- | ------------------------------------------------------ | -------------------------------------------------- |
| PROD-001 | E2E  | Display all products page and listing     | User is on site             | Navigate to products page                              | All Products heading and product cards are visible |
| PROD-002 | E2E  | Search product by keyword                 | User is on products page    | Search for a keyword (e.g., Blue Top)                  | Searched Products section shows matching result    |
| PROD-003 | E2E  | Filter products by category               | User is on products page    | Expand category and select category item               | Category products URL/heading is shown             |
| PROD-004 | E2E  | Open product details from listing         | User is on products page    | Click View Product on first item                       | Product details page opens                         |
| PROD-005 | E2E  | Verify key fields on product details page | Product details page opened | Validate Category, Availability, Condition, Brand text | Product metadata fields are visible                |
| PROD-006 | E2E  | Add product to cart from products page    | User is on products page    | Add first product and open cart                        | Cart contains added item                           |

## Cart

| ID       | Type | Title                                    | Preconditions            | Steps                                                      | Expected Result                                  |
| -------- | ---- | ---------------------------------------- | ------------------------ | ---------------------------------------------------------- | ------------------------------------------------ |
| CART-001 | E2E  | Add single product to cart               | Cart is empty            | Add one product from products page and open cart           | Cart contains one item                           |
| CART-002 | E2E  | Add multiple products to cart            | Cart is empty            | Add first product, continue shopping, add second product   | Cart contains two items                          |
| CART-003 | E2E  | Remove product from cart                 | Cart has item(s)         | Remove first item from cart                                | Cart empty state is shown                        |
| CART-004 | E2E  | Verify cart price, quantity, and total   | Cart has item(s)         | Capture unit price, quantity, total and validate math      | Total equals unit price × quantity               |
| CART-005 | E2E  | Continue shopping from add-to-cart modal | User is on products page | Add product, click Continue Shopping, add again, open cart | User remains in products flow and cart has items |

## Checkout

| ID      | Type | Title                                     | Preconditions                  | Steps                                           | Expected Result                                      |
| ------- | ---- | ----------------------------------------- | ------------------------------ | ----------------------------------------------- | ---------------------------------------------------- |
| CHK-001 | E2E  | Complete checkout flow until payment page | Logged-in user, cart has item  | Proceed checkout and click Place Order          | Payment page is opened                               |
| CHK-002 | E2E  | Place order and show confirmation         | Logged-in user, cart has item  | Fill payment fields and submit payment          | Order Placed and confirmation message are shown      |
| CHK-003 | E2E  | Verify delivery address in checkout       | Logged-in user, cart has item  | Open checkout and validate user address details | Delivery address section contains user data          |
| CHK-004 | E2E  | Show empty-cart behavior on checkout path | Cart is empty                  | Open cart page without items                    | Empty cart state shown, no checkout action available |
| CHK-005 | E2E  | Validate required payment field           | Logged-in user on payment page | Submit payment with blank required field        | Native validation blocks submission                  |

## API - Products

| ID       | Type | Title                                           | Preconditions | Steps                                      | Expected Result                          |
| -------- | ---- | ----------------------------------------------- | ------------- | ------------------------------------------ | ---------------------------------------- |
| PROD-007 | API  | Get products list                               | None          | Call `GET /productsList`                   | Response code 200 and non-empty products |
| PROD-008 | API  | Reject POST on productsList                     | None          | Call `POST /productsList`                  | Response code 405 (method not supported) |
| PROD-009 | API  | Get brands list                                 | None          | Call `GET /brandsList`                     | Response code 200 and non-empty brands   |
| PROD-010 | API  | Reject PUT on brandsList                        | None          | Call `PUT /brandsList`                     | Response code 405 (method not supported) |
| PROD-011 | API  | Search products with parameter                  | None          | Call `POST /searchProduct` with term       | Response code 200 and matching products  |
| PROD-012 | API  | Reject searchProduct without required parameter | None          | Call `POST /searchProduct` without payload | Response code 400                        |

## Smoke

| ID      | Type  | Title                                  | Preconditions  | Steps                                              | Expected Result                           |
| ------- | ----- | -------------------------------------- | -------------- | -------------------------------------------------- | ----------------------------------------- |
| SMK-001 | Smoke | Home page loads                        | None           | Navigate to `/`                                    | Home page loads with expected title/nav   |
| SMK-002 | Smoke | Login succeeds with valid credentials  | Account exists | Create account via API, login via UI               | Logout link is visible                    |
| SMK-003 | Smoke | Products page content is visible       | None           | Open products page                                 | Products listing is visible               |
| SMK-004 | Smoke | Add product to cart                    | Cart empty     | Add first product from products page and open cart | Cart has at least one item                |
| SMK-005 | Smoke | API health check for products endpoint | None           | Call `GET /productsList`                           | Response code 200 and product data exists |

---

## Casos de Teste (Versão em Português - Brasil)

## Auth - Cadastro

| ID      | Tipo | Título                                                  | Pré-condições                         | Passos                                          | Resultado Esperado                                         |
| ------- | ---- | ------------------------------------------------------- | ------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------- |
| REG-001 | E2E  | Cadastrar com dados válidos                             | Usuário está na página de login       | Preencher campos com usuário único e enviar     | Tela de conta criada exibida                               |
| REG-002 | E2E  | Cadastro bloqueado quando a senha está vazia            | Usuário chegou ao formulário da conta | Deixar a senha vazia e clicar em Create Account | Validação nativa de campo obrigatório para senha é exibida |
| REG-003 | E2E  | Cadastro bloqueado quando o nome da etapa 1 está vazio  | Usuário está na página de login       | Deixar o nome vazio na etapa 1 e enviar         | Validação nativa de campo obrigatório para nome é exibida  |
| REG-004 | E2E  | Cadastro bloqueado quando o email da etapa 1 está vazio | Usuário está na página de login       | Preencher nome, deixar email vazio e enviar     | Validação nativa de campo obrigatório para email é exibida |
| REG-005 | E2E  | Cadastro bloqueado com email inválido                   | Usuário está na página de login       | Preencher email inválido e enviar               | Validação nativa de typeMismatch é exibida                 |
| REG-006 | E2E  | Cadastro bloqueado para email duplicado                 | Conta já existe                       | Tentar cadastrar com email existente            | Mensagem de erro de email duplicado é exibida              |

## Auth - Login

| ID      | Tipo | Título                                         | Pré-condições                   | Passos                                            | Resultado Esperado                                         |
| ------- | ---- | ---------------------------------------------- | ------------------------------- | ------------------------------------------------- | ---------------------------------------------------------- |
| LOG-001 | E2E  | Login com credenciais válidas                  | Conta existe                    | Preencher email e senha válidos e enviar          | Usuário autenticado e link Logout visível                  |
| LOG-002 | E2E  | Login falha para credenciais inválidas         | Nenhuma                         | Preencher email e senha desconhecidos e enviar    | Erro de credenciais inválidas exibido                      |
| LOG-003 | E2E  | Login falha para senha incorreta               | Conta existe                    | Preencher email válido e senha incorreta e enviar | Erro de credenciais inválidas exibido                      |
| LOG-004 | E2E  | Login bloqueado quando o email está vazio      | Usuário está na página de login | Deixar email vazio e enviar                       | Validação nativa de campo obrigatório para email é exibida |
| LOG-005 | E2E  | Login bloqueado quando a senha está vazia      | Usuário está na página de login | Preencher email, deixar senha vazia e enviar      | Validação nativa de campo obrigatório para senha é exibida |
| LOG-006 | E2E  | Login bloqueado para formato de email inválido | Usuário está na página de login | Preencher formato de email inválido e enviar      | Validação nativa de typeMismatch é exibida                 |

## API - Auth

| ID           | Tipo | Título                                          | Pré-condições        | Passos                                               | Resultado Esperado                         |
| ------------ | ---- | ----------------------------------------------- | -------------------- | ---------------------------------------------------- | ------------------------------------------ |
| API-AUTH-001 | API  | Criar, verificar e excluir conta                | Nenhuma              | Criar conta via API, verificar login e excluir conta | Códigos de resposta: 201, 200, 200         |
| API-AUTH-002 | API  | Rejeitar login com senha inválida               | Conta criada via API | Verificar login com senha incorreta                  | Código de resposta não é 200               |
| API-AUTH-003 | API  | Atualizar detalhes da conta                     | Conta criada via API | Atualizar campos do payload via `updateAccount`      | Código de resposta é 200                   |
| API-AUTH-004 | API  | Obter detalhe do usuário por email              | Conta criada via API | Chamar `getUserDetailByEmail` com email da conta     | Código de resposta é 200 e o email confere |
| API-AUTH-005 | API  | Verificar login com credenciais válidas         | Conta criada via API | Chamar `verifyLogin` com email/senha válidos         | Código de resposta é 200                   |
| API-AUTH-006 | API  | Rejeitar verify login com credenciais inválidas | Nenhuma              | Chamar `verifyLogin` com email/senha desconhecidos   | Código de resposta não é 200               |
| API-AUTH-007 | API  | Rejeitar DELETE em verifyLogin                  | Nenhuma              | Chamar `DELETE /verifyLogin`                         | Código de resposta é 405                   |

## Produtos

| ID       | Tipo | Título                                              | Pré-condições                      | Passos                                                     | Resultado Esperado                                  |
| -------- | ---- | --------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------- | --------------------------------------------------- |
| PROD-001 | E2E  | Exibir página de produtos e listagem                | Usuário está no site               | Navegar para página de produtos                            | Título All Products e cards de produto visíveis     |
| PROD-002 | E2E  | Buscar produto por palavra-chave                    | Usuário está na página de produtos | Buscar por termo (ex.: Blue Top)                           | Seção Searched Products mostra resultado compatível |
| PROD-003 | E2E  | Filtrar produtos por categoria                      | Usuário está na página de produtos | Expandir categoria e selecionar item                       | URL/título de produtos da categoria exibido         |
| PROD-004 | E2E  | Abrir detalhes de produto pela listagem             | Usuário está na página de produtos | Clicar em View Product no primeiro item                    | Página de detalhes do produto é aberta              |
| PROD-005 | E2E  | Verificar campos-chave na página de detalhes        | Página de detalhes aberta          | Validar textos de Category, Availability, Condition, Brand | Campos de metadados do produto visíveis             |
| PROD-006 | E2E  | Adicionar produto ao carrinho na página de produtos | Usuário está na página de produtos | Adicionar primeiro produto e abrir carrinho                | Carrinho contém o item adicionado                   |

## Carrinho

| ID       | Tipo | Título                                          | Pré-condições                      | Passos                                                                               | Resultado Esperado                                            |
| -------- | ---- | ----------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| CART-001 | E2E  | Adicionar um produto ao carrinho                | Carrinho vazio                     | Adicionar um produto na página de produtos e abrir carrinho                          | Carrinho contém um item                                       |
| CART-002 | E2E  | Adicionar múltiplos produtos ao carrinho        | Carrinho vazio                     | Adicionar primeiro produto, continuar comprando, adicionar segundo                   | Carrinho contém dois itens                                    |
| CART-003 | E2E  | Remover produto do carrinho                     | Carrinho com item(ns)              | Remover primeiro item do carrinho                                                    | Estado de carrinho vazio exibido                              |
| CART-004 | E2E  | Verificar preço, quantidade e total no carrinho | Carrinho com item(ns)              | Capturar preço unitário, quantidade e total e validar conta                          | Total igual a preço unitário x quantidade                     |
| CART-005 | E2E  | Continuar comprando no modal add-to-cart        | Usuário está na página de produtos | Adicionar produto, clicar em Continue Shopping, adicionar novamente e abrir carrinho | Usuário permanece no fluxo de produtos e o carrinho tem itens |

## Checkout

| ID      | Tipo | Título                                                      | Pré-condições                         | Passos                                           | Resultado Esperado                                     |
| ------- | ---- | ----------------------------------------------------------- | ------------------------------------- | ------------------------------------------------ | ------------------------------------------------------ |
| CHK-001 | E2E  | Completar fluxo de checkout até a página de pagamento       | Usuário logado, carrinho com item     | Prosseguir no checkout e clicar em Place Order   | Página de pagamento aberta                             |
| CHK-002 | E2E  | Finalizar pedido e exibir confirmação                       | Usuário logado, carrinho com item     | Preencher pagamento e enviar                     | Mensagem de confirmação (Order Placed) exibida         |
| CHK-003 | E2E  | Verificar endereço de entrega no checkout                   | Usuário logado, carrinho com item     | Abrir checkout e validar dados de endereço       | Seção de endereço de entrega contém dados do usuário   |
| CHK-004 | E2E  | Exibir comportamento de carrinho vazio no fluxo de checkout | Carrinho vazio                        | Abrir página do carrinho sem itens               | Estado de carrinho vazio exibido, sem ação de checkout |
| CHK-005 | E2E  | Validar campo obrigatório de pagamento                      | Usuário logado na página de pagamento | Enviar pagamento com campo obrigatório em branco | Validação nativa bloqueia o envio                      |

## API - Produtos

| ID       | Tipo | Título                                           | Pré-condições | Passos                                   | Resultado Esperado                |
| -------- | ---- | ------------------------------------------------ | ------------- | ---------------------------------------- | --------------------------------- |
| PROD-007 | API  | Obter lista de produtos                          | Nenhuma       | Chamar `GET /productsList`               | Código 200 e produtos não vazios  |
| PROD-008 | API  | Rejeitar POST em productsList                    | Nenhuma       | Chamar `POST /productsList`              | Código 405 (método não suportado) |
| PROD-009 | API  | Obter lista de marcas                            | Nenhuma       | Chamar `GET /brandsList`                 | Código 200 e marcas não vazias    |
| PROD-010 | API  | Rejeitar PUT em brandsList                       | Nenhuma       | Chamar `PUT /brandsList`                 | Código 405 (método não suportado) |
| PROD-011 | API  | Buscar produtos com parâmetro                    | Nenhuma       | Chamar `POST /searchProduct` com termo   | Código 200 e produtos compatíveis |
| PROD-012 | API  | Rejeitar searchProduct sem parâmetro obrigatório | Nenhuma       | Chamar `POST /searchProduct` sem payload | Código 400                        |

## Smoke

| ID      | Tipo  | Título                                 | Pré-condições  | Passos                                                            | Resultado Esperado                         |
| ------- | ----- | -------------------------------------- | -------------- | ----------------------------------------------------------------- | ------------------------------------------ |
| SMK-001 | Smoke | Home page carrega                      | Nenhuma        | Navegar para `/`                                                  | Home page carrega com título/nav esperados |
| SMK-002 | Smoke | Login funciona com credenciais válidas | Conta existe   | Criar conta via API e fazer login via UI                          | Link Logout visível                        |
| SMK-003 | Smoke | Conteúdo da página de produtos visível | Nenhuma        | Abrir página de produtos                                          | Listagem de produtos visível               |
| SMK-004 | Smoke | Adicionar produto ao carrinho          | Carrinho vazio | Adicionar primeiro produto na página de produtos e abrir carrinho | Carrinho possui ao menos um item           |
| SMK-005 | Smoke | Health check da API de produtos        | Nenhuma        | Chamar `GET /productsList`                                        | Código 200 e dados de produtos existem     |
