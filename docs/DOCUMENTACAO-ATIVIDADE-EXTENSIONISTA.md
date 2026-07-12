# ATIVIDADES EXTENSIONISTAS
## Proposta de Tema / Trabalho Final

---

**Curso**

(    ) Bacharelado em Ciência da Computação  
(    ) Bacharelado em Engenharia da Computação  
(    ) Bacharelado em Engenharia de Software  
(    ) Bacharelado em Sistemas de Informação  
(  X  ) CST em Análise e Desenvolvimento de Sistemas  
(    ) CST em Banco de Dados  
(    ) CST em Ciência de Dados  
(    ) CST em Desenvolvimento Mobile  
(    ) CST em Gestão da Tecnologia da Informação  
(    ) CST em Jogos Digitais  
(    ) CST em Redes de Computadores  
(    ) CST em Segurança da Informação  

> *Ajuste o curso conforme o cadastro do aluno na UNINTER.*

---

**Disciplina**

(  X  ) Atividade Extensionista I: Tecnologia Aplicada à Inclusão Digital – Levantamento  
(    ) Atividade Extensionista II: Tecnologia Aplicada à Inclusão Digital – Projeto  
(    ) Atividade Extensionista III: Tecnologia Aplicada à Inclusão Digital – Análise  
(    ) Atividade Extensionista IV: Tecnologia Aplicada à Inclusão Digital – Implementação  

---

**Etapa**

(  X  ) Validação da proposta  
(    ) Trabalho final  

---

**Aluno(s) e RU(s)**

| Aluno | RU |
|-------|-----|
| *(preencher)* | *(preencher)* |

**Professora orientadora / parceira de campo (ensino médio)**  
Silvana Siqueira da Silva — Tecnologia da Informação  

---

**Título**

**School Game: Quiz Gamificado de Tecnologia da Informação para o Ensino Médio**

---

**Setor de Aplicação**

O projeto será aplicado no **setor educacional**, especificamente em turmas de **Ensino Médio** com foco em **Tecnologia da Informação (TI)**, vinculadas à professora Silvana Siqueira da Silva. A plataforma busca apoiar alunos e docentes na **avaliação, recuperação e revisão** de conteúdos de TI de forma **lúdica, acessível e digital**, substituindo ou complementando provas tradicionais por uma experiência interativa no navegador, sem necessidade de instalação de software.

---

**Objetivos de Desenvolvimento Sustentável (ODS)**

(    ) 01. Erradicação da pobreza  
(    ) 02. Fome zero e agricultura sustentável  
(    ) 03. Saúde e bem-estar  
(  X  ) 04. Educação de qualidade  
(    ) 05. Igualdade de gênero  
(    ) 06. Água potável e saneamento  
(    ) 07. Energia limpa e acessível  
(    ) 08. Trabalho decente e crescimento econômico  
(   ) 09. Indústria, inovação e infraestrutura  
(  X  ) 10. Redução das desigualdades  
(    ) 11. Cidades e comunidades sustentáveis  
(    ) 12. Consumo e produção responsáveis  
(    ) 13. Ação contra a mudança global do clima  
(    ) 14. Vida na água  
(    ) 15. Vida terrestre  
(    ) 16. Paz, justiça e instituições eficazes  
(    ) 17. Parcerias e meios de implementação  

---

## Objetivos

1. Desenvolver uma **plataforma web gamificada**, utilizando **HTML, CSS e JavaScript**, para que alunos do ensino médio respondam a um quiz de TI de forma interativa e acessível pelo navegador.
2. Implementar **mecanismos de gamificação** (timer por pergunta, pontuação com bônus por rapidez, nota de 0 a 10 e ranking) para aumentar o engajamento e a motivação dos estudantes.
3. Criar um **painel da professora** com login seguro, permitindo **editar perguntas**, **acompanhar desempenho dos alunos** e **definir situação pedagógica** (Aprovado, Recuperação ou Revisar).
4. Disponibilizar **gráficos e indicadores** (média por turma, distribuição de notas, respostas por dia e maiores pontuações) para apoiar a tomada de decisão da docente.
5. Promover a **inclusão digital** ao oferecer uma ferramenta simples, responsiva e utilizável offline após o carregamento inicial, ampliando o acesso à avaliação formativa em TI.
6. Mapear o desempenho dos alunos por turma e por tema (Hardware, Programação, Redes e Segurança), orientando ações de reforço e recuperação de conteúdo.

---

## Metodologia

A metodologia do projeto será dividida em etapas práticas, seguindo um processo lógico de desenvolvimento:

1. **Levantamento das necessidades:** Identificar com a professora de TI como ocorre hoje a avaliação dos conteúdos e quais dificuldades os alunos enfrentam em provas tradicionais.
2. **Planejamento da plataforma:** Definir telas (início, quiz, resultado, ranking e dashboard), fluxo do aluno (identificação → quiz → feedback) e fluxo da professora (login → gestão → avaliação).
3. **Desenvolvimento da interface do aluno:** Criar páginas com HTML e CSS responsivo, formulário de identificação (nome, RU e turma) e tela de quiz com alternativas visuais (estilo Kahoot).
4. **Implementação da lógica do jogo:** Programar em JavaScript o embaralhamento das perguntas, timer de 20 segundos, cálculo de pontos e nota, persistência local do ranking e navegação entre telas.
5. **Desenvolvimento do painel da professora:** Criar área administrativa com CRUD de perguntas (criar, editar, excluir e restaurar banco padrão), tabela de alunos com filtros e gráficos estatísticos (Chart.js).
6. **Testes e ajustes:** Testar o sistema com dados fictícios de demonstração e simulações de respostas reais, corrigindo falhas de usabilidade, validação e visualização.
7. **Entrega e apresentação:** Disponibilizar o sistema para avaliação da professora e demonstrar seu funcionamento em contexto escolar.

---

## Resultados Esperados / Obtidos

### Resultados Esperados

- Criar um **quiz gamificado funcional** de Tecnologia da Informação, acessível pelo navegador, para alunos do ensino médio;
- Facilitar o **acompanhamento pedagógico** da professora por meio de dashboard com KPIs, tabela de alunos e gráficos de desempenho;
- Contribuir para uma **avaliação mais dinâmica e inclusiva**, incentivando a participação e a revisão de conteúdos de TI;
- Entregar **16 perguntas** organizadas por categorias (Hardware, Programação, Redes e Segurança), com possibilidade de edição pela docente;
- Entregar **ranking local** com registro de tentativas (nome, RU, turma, nota, percentual, pontos e data).

### Resultados Obtidos

- Plataforma **School Game** implementada com HTML, CSS e JavaScript puro, sem dependência de frameworks;
- Interface do aluno com identificação, quiz interativo, feedback imediato, tela de resultado e ranking;
- Área da professora com login (`silvana` / `ti2026`), gestão completa de perguntas e avaliação de situação dos alunos;
- Dashboard com **6 indicadores (KPIs)** e **4 gráficos** na visão geral (média por turma, distribuição de notas, respostas por dia e top pontuações);
- Aba **Alunos** com filtros por turma, gráficos de média e situação pedagógica, e opção de incluir dados de demonstração;
- Armazenamento local no navegador (`localStorage`) para ranking, perguntas personalizadas e avaliações da professora;
- Documentação técnica básica (`README.md`) e proposta extensionista (este documento).

---

## Questionário – School Game: Quiz de Tecnologia da Informação

**Instruções para o aluno:** Informe seu **nome**, **RU** e **turma** antes de iniciar. Você terá **20 segundos** por pergunta. As alternativas são apresentadas em ordem aleatória a cada partida.

**Turmas disponíveis:** 1º A · 1º B · 2º A · 2º B · 3º TI

---

### Bloco 1 — Hardware e Sistemas

**1.** O que significa a sigla CPU em um computador?  
( ) Central Processing Unit (Unidade Central de Processamento)  
( ) Computer Personal Unit  
( ) Central Program Utility  
( ) Control Processing User  

**2.** Qual componente armazena dados de forma permanente (mesmo com o PC desligado)?  
( ) Memória RAM  
( ) HD ou SSD  
( ) Placa de vídeo  
( ) Processador  

**3.** Qual é a função principal da memória RAM?  
( ) Armazenar arquivos para sempre  
( ) Guardar dados temporários em uso pelo sistema  
( ) Conectar o PC à internet  
( ) Imprimir documentos  

**4.** Exemplos de sistemas operacionais são:  
( ) Windows, Linux e macOS  
( ) HTML, CSS e JavaScript  
( ) Excel e Word  
( ) Chrome e Firefox  

---

### Bloco 2 — Programação e Lógica

**5.** Em programação, o que é uma variável?  
( ) Um espaço na memória para guardar um valor  
( ) Um tipo de cabo de rede  
( ) Um vírus de computador  
( ) Um arquivo de imagem  

**6.** Qual linguagem é usada principalmente para criar a estrutura de páginas web?  
( ) Python  
( ) HTML  
( ) Java  
( ) SQL  

**7.** Em lógica de programação, o resultado de VERDADEIRO E FALSO é:  
( ) Verdadeiro  
( ) Falso  
( ) Nulo  
( ) Erro  

**8.** O que significa "debugar" um programa?  
( ) Encontrar e corrigir erros no código  
( ) Apagar o computador  
( ) Instalar um antivírus  
( ) Formatizar o disco rígido  

---

### Bloco 3 — Redes e Internet

**9.** O que significa a sigla URL?  
( ) Uniform Resource Locator (endereço de um recurso na web)  
( ) Universal Remote Link  
( ) User Registration Login  
( ) United Router Line  

**10.** Qual protocolo garante navegação segura (ícone de cadeado no navegador)?  
( ) HTTP  
( ) FTP  
( ) HTTPS  
( ) SMTP  

**11.** O que é um endereço IP?  
( ) Identificação numérica de um dispositivo em uma rede  
( ) Nome de usuário do e-mail  
( ) Senha do Wi-Fi  
( ) Tipo de impressora  

**12.** Para que serve um roteador em uma rede doméstica?  
( ) Distribuir conexão de internet entre dispositivos  
( ) Aumentar a memória RAM  
( ) Editar vídeos  
( ) Compilar programas em C++  

---

### Bloco 4 — Segurança e Dados

**13.** O que é phishing?  
( ) Golpe online para roubar senhas e dados pessoais  
( ) Um tipo de memória RAM  
( ) Linguagem de programação  
( ) Cabo de fibra óptica  

**14.** Qual prática ajuda a proteger suas contas na internet?  
( ) Usar senhas fortes e diferentes em cada serviço  
( ) Compartilhar senha com colegas  
( ) Desativar o antivírus  
( ) Clicar em qualquer link desconhecido  

**15.** O que significa SQL em banco de dados?  
( ) Structured Query Language (linguagem de consulta estruturada)  
( ) System Quick Login  
( ) Secure Quality Link  
( ) Software Query List  

**16.** O que é um backup de arquivos?  
( ) Cópia de segurança dos dados para recuperação em caso de perda  
( ) Vírus que apaga o computador  
( ) Tipo de placa de rede  
( ) Atalho de teclado do Windows  

---

## Considerações Finais

O projeto **"School Game: Quiz Gamificado de Tecnologia da Informação para o Ensino Médio"** permitiu compreender como a tecnologia pode auxiliar no processo de **ensino-aprendizagem em TI** no ambiente escolar. Com a criação de uma plataforma web interativa e o desenvolvimento de um painel administrativo para a professora Silvana Siqueira da Silva, foi possível construir uma solução prática que facilita a avaliação formativa, a recuperação de conteúdos e o acompanhamento do desempenho da turma.

Durante o desenvolvimento, foi possível organizar as etapas do projeto, aplicar conceitos de **HTML, CSS e JavaScript**, além de perceber a importância de criar ferramentas **acessíveis, responsivas e de fácil utilização** para estudantes do ensino médio. A gamificação — com timer, pontuação, ranking e feedback imediato — mostrou-se relevante para aumentar o engajamento e reduzir a ansiedade associada a avaliações tradicionais.

O dashboard da professora, com edição de perguntas, filtros por turma, definição de situação pedagógica e gráficos estatísticos, amplia a capacidade de monitoramento e tomada de decisão da docente, alinhando-se ao propósito extensionista de **aplicar a tecnologia em favor da inclusão digital e da educação de qualidade**.

Conclui-se que a plataforma proposta tem potencial para auxiliar a escola a **avaliar e reforçar conteúdos de TI** com mais agilidade e interatividade, oferecendo um meio digital moderno para que alunos pratiquem, revisem e acompanhem seu próprio desempenho, enquanto a professora dispõe de recursos para personalizar o quiz e acompanhar a turma de forma visual e organizada.

---

## Anexo Técnico (referência rápida)

| Item | Descrição |
|------|-----------|
| **Arquivo principal** | `index.html` |
| **Estrutura** | `css/`, `js/`, `assets/`, `docs/` |
| **Tecnologias** | HTML5, CSS3, JavaScript (ES6+), Chart.js |
| **Perguntas padrão** | 16 (4 categorias × 4 perguntas) |
| **Timer** | 20 segundos por questão |
| **Nota** | Escala de 0 a 10 |
| **Login professora** | Usuário: `silvana` · Senha: `ti2026` |
| **Persistência** | `localStorage` (ranking, perguntas customizadas, avaliações) |

---

*Documento elaborado para a Atividade Extensionista I — UNINTER · Prof. Silvana Siqueira da Silva · 2026*
