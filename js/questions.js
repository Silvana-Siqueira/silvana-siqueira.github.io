/**
 * School Game - Banco de perguntas (TI)
 * Conteúdos de Tecnologia da Informação para a turma da Prof. Silvana.
 */

const QUESTIONS = [
  // --- HARDWARE E SISTEMAS ---
  {
    category: "Hardware",
    question: "O que significa a sigla CPU em um computador?",
    options: [
      "Central Processing Unit (Unidade Central de Processamento)",
      "Computer Personal Unit",
      "Central Program Utility",
      "Control Processing User"
    ],
    correct: 0
  },
  {
    category: "Hardware",
    question: "Qual componente armazena dados de forma permanente (mesmo com o PC desligado)?",
    options: ["Memória RAM", "HD ou SSD", "Placa de vídeo", "Processador"],
    correct: 1
  },
  {
    category: "Hardware",
    question: "Qual é a função principal da memória RAM?",
    options: [
      "Armazenar arquivos para sempre",
      "Guardar dados temporários em uso pelo sistema",
      "Conectar o PC à internet",
      "Imprimir documentos"
    ],
    correct: 1
  },
  {
    category: "Hardware",
    question: "Exemplos de sistemas operacionais são:",
    options: ["Windows, Linux e macOS", "HTML, CSS e JavaScript", "Excel e Word", "Chrome e Firefox"],
    correct: 0
  },

  // --- PROGRAMAÇÃO E LÓGICA ---
  {
    category: "Programação",
    question: "Em programação, o que é uma variável?",
    options: [
      "Um espaço na memória para guardar um valor",
      "Um tipo de cabo de rede",
      "Um vírus de computador",
      "Um arquivo de imagem"
    ],
    correct: 0
  },
  {
    category: "Programação",
    question: "Qual linguagem é usada principalmente para criar a estrutura de páginas web?",
    options: ["Python", "HTML", "Java", "SQL"],
    correct: 1
  },
  {
    category: "Programação",
    question: "Em lógica de programação, o resultado de VERDADEIRO E FALSO é:",
    options: ["Verdadeiro", "Falso", "Nulo", "Erro"],
    correct: 1
  },
  {
    category: "Programação",
    question: "O que significa 'debugar' um programa?",
    options: [
      "Encontrar e corrigir erros no código",
      "Apagar o computador",
      "Instalar um antivírus",
      "Formatar o disco rígido"
    ],
    correct: 0
  },

  // --- REDES E INTERNET ---
  {
    category: "Redes",
    question: "O que significa a sigla URL?",
    options: [
      "Uniform Resource Locator (endereço de um recurso na web)",
      "Universal Remote Link",
      "User Registration Login",
      "United Router Line"
    ],
    correct: 0
  },
  {
    category: "Redes",
    question: "Qual protocolo garante navegação segura (ícone de cadeado no navegador)?",
    options: ["HTTP", "FTP", "HTTPS", "SMTP"],
    correct: 2
  },
  {
    category: "Redes",
    question: "O que é um endereço IP?",
    options: [
      "Identificação numérica de um dispositivo em uma rede",
      "Nome de usuário do e-mail",
      "Senha do Wi-Fi",
      "Tipo de impressora"
    ],
    correct: 0
  },
  {
    category: "Redes",
    question: "Para que serve um roteador em uma rede doméstica?",
    options: [
      "Distribuir conexão de internet entre dispositivos",
      "Aumentar a memória RAM",
      "Editar vídeos",
      "Compilar programas em C++"
    ],
    correct: 0
  },

  // --- SEGURANÇA E DADOS ---
  {
    category: "Segurança",
    question: "O que é phishing?",
    options: [
      "Golpe online para roubar senhas e dados pessoais",
      "Um tipo de memória RAM",
      "Linguagem de programação",
      "Cabo de fibra óptica"
    ],
    correct: 0
  },
  {
    category: "Segurança",
    question: "Qual prática ajuda a proteger suas contas na internet?",
    options: [
      "Usar senhas fortes e diferentes em cada serviço",
      "Compartilhar senha com colegas",
      "Desativar o antivírus",
      "Clicar em qualquer link desconhecido"
    ],
    correct: 0
  },
  {
    category: "Segurança",
    question: "O que significa SQL em banco de dados?",
    options: [
      "Structured Query Language (linguagem de consulta estruturada)",
      "System Quick Login",
      "Secure Quality Link",
      "Software Query List"
    ],
    correct: 0
  },
  {
    category: "Segurança",
    question: "O que é um backup de arquivos?",
    options: [
      "Cópia de segurança dos dados para recuperação em caso de perda",
      "Vírus que apaga o computador",
      "Tipo de placa de rede",
      "Atalho de teclado do Windows"
    ],
    correct: 0
  }
];
