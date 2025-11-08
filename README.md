### **User Stories da API — Pesquisa do Mercado de Teste de Software (Júlio de Lima)**

---

#### **1. Registro de Usuário por Perfil**

**User Story:**
Como **usuário**,
eu quero **me registrar na plataforma informando meu perfil (ex: estudante, profissional de QA, gestor ou recrutador)**,
para que **eu possa acessar e participar da pesquisa do mercado de testes de software de forma personalizada conforme meu perfil**.

**Regras de Negócio:**

- Não pode haver **duplicidade de cadastro** (e-mail e CPF devem ser únicos).
- O campo **perfil de usuário** é obrigatório e deve aceitar apenas valores pré-definidos.
- A senha deve ter **mínimo de 8 caracteres**, incluindo letras maiúsculas, minúsculas e números.
- O sistema deve **armazenar a data e hora do registro**.

---

#### **2. Login por Perfil**

**User Story:**
Como **usuário registrado**,
eu quero **realizar login conforme meu perfil**,
para que **eu possa acessar as funcionalidades da API de acordo com as permissões do meu tipo de usuário**.

**Regras de Negócio:**

- O login deve ser feito com **e-mail e senha válidos**.
- Após **três tentativas de login incorretas**, a conta deve ser **bloqueada temporariamente**.
- Ao efetuar login com sucesso, o sistema deve **gerar um token de autenticação (JWT)** contendo o perfil do usuário e tempo de expiração.
- O token deve ser **obrigatório para acessar rotas protegidas** da API.
- Usuários só poderão **acessar rotas correspondentes ao seu perfil** (por exemplo, recrutadores não podem registrar informações de profissionais).

---

#### **3. Registrar Informações da Pesquisa do Mercado de Testes de Software**

**User Story:**
Como **usuário autenticado**,
eu quero **registrar informações sobre o mercado de teste de software (ex: cargo, nível de experiência, salário, ferramentas utilizadas, localização)**,
para que **os dados possam ser analisados e contribuam para o mapeamento do cenário atual da área de QA**.

**Regras de Negócio:**

- Somente **usuários autenticados** podem registrar informações.
- Cada registro deve ser **associado ao usuário e ao perfil**.
- O sistema deve validar **campos obrigatórios**, como área de atuação, nível de experiência e localização.
- Não deve haver **registros duplicados** do mesmo usuário para a mesma coleta de pesquisa.
- Os dados devem ser **armazenados de forma anônima ou pseudonimizada** para garantir privacidade.
- O usuário pode **atualizar ou excluir** suas próprias informações.

---

#### **4. Listar e Filtrar Informações Registradas**

**User Story:**
Como **administrador ou usuário autenticado com permissão**,
eu quero **listar e filtrar as informações registradas na pesquisa**,
para que **eu possa analisar os dados e gerar relatórios personalizados sobre o mercado de testes de software**.

**Regras de Negócio:**

- O sistema deve permitir **listagem completa** das informações registradas, exibindo apenas **dados anonimizados**.
- Deve ser possível **filtrar por cargo, nível, região, faixa salarial, ferramentas ou perfil**.
- Apenas **usuários com permissão específica (ex: administrador, gestor de pesquisa)** podem visualizar todos os dados agregados.
- O sistema deve **retornar resultados paginados** para otimizar a consulta.
- Os filtros aplicados devem ser **combináveis** (ex: cargo + região + ferramenta).

---

