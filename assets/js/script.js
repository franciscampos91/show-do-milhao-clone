console.log("Carregou script.js");

let perguntas = {};

/** variáveis globais */
let marcador = 0;
let acertos = 0;
let nivel_pergunta = 1;
let jogador = "Jogador";
let habilita_escolha = true;
let errar = 0;
let parar = 0;
let acertar = "MIL";
let respostaCorreta = null;
let respostaClicada = null;

const texto_pergunta = document.getElementById("pergunta");
const alterUm = document.getElementById("alt-um");
const alterDois = document.getElementById("alt-dois");
const alterTres = document.getElementById("alt-tres");
const alterQuatro = document.getElementById("alt-quatro");
const caixaMensagem = document.getElementById("caixa_mensagem");

novoJogo();

carregarPerguntas();

//carregarPergunta();

function novoJogo() {}

async function carregarPerguntas() {
    let p = {};
    try {
        // Faz a requisição para o arquivo JSON
        const response = await fetch("assets/data/perguntas_nivel_1.json");

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro ao carregar JSON: ${response.status}`);
        }

        // Converte a resposta para JSON
        const dados = await response.json();

        // Exibe os dados no console
        console.table(dados);

        // Verifica se os dados possuem a chave "pergunta" e embaralha o array
        if (dados.pergunta && Array.isArray(dados.pergunta)) {
            for (let i = dados.pergunta.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [dados.pergunta[i], dados.pergunta[j]] = [dados.pergunta[j], dados.pergunta[i]];
            }
        }

        // Atribui os dados à variável 'p'
        p = dados;

    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
    }

    perguntas = p; // Atribui 'p' à variável global 'perguntas'
    carregarPergunta(); // Chama a função para carregar a primeira pergunta após carregar as perguntas
}



// Função para processar as perguntas
function processarPerguntas(dados) {
  dados.pergunta.forEach((pergunta) => {
    console.log(`Pergunta: ${pergunta.pergunta}`);
    pergunta.alternativas.forEach((alt) => {
      console.log(`Alternativa ${alt.id_alt}: ${alt.alternativa}`);
    });



  });
}

function carregarPergunta() {
    console.log("Carregando pergunta...");
  
    nivelPergunta(); // Define o nível da pergunta baseado nos acertos
  
    const perguntaAtual = perguntas.pergunta[marcador]; // Obtém a pergunta atual
  
    // Exibe a pergunta e alternativas na tela
    texto_pergunta.innerHTML = perguntaAtual.pergunta;
    alterUm.innerText = perguntaAtual.alternativas[0].alternativa;
    alterDois.innerText = perguntaAtual.alternativas[1].alternativa;
    alterTres.innerText = perguntaAtual.alternativas[2].alternativa;
    alterQuatro.innerText = perguntaAtual.alternativas[3].alternativa;
  
    respostaCorreta = perguntaAtual.correta; // A resposta correta
    habilita_escolha = true; // Habilita a escolha de alternativas
  }

function voceEstaCertoDisso(cliclado) {
  if (!habilita_escolha) {
    return;
  }

  console.log("Voce esta certo disso?");
  caixaMensagem.innerHTML = `<div id="certo_disso">
                        <p>Você está certo disso?</p>
                        <div class="container__botoes">
                            <button class="btn btn-dark" id="btn-sim" onclick="verificaCorreta();">Sim</button>
                            <button class="btn btn-danger" id="btn-nao" onclick="naoEstaCerto();">Não</button>
                        </div>
                    </div>`;

  respostaClicada = cliclado;

  limpar();

  document.getElementById("num_" + cliclado).classList =
    "alternativa__num alternativa__num_selecionado";

  document.getElementById("btn_" + cliclado).classList =
    "alternativa alternativa__selecionada";
}

function verificaCorreta() {
  document.getElementById("btn_" + respostaCorreta).classList = "alternativa alternativa__correta";

  if (respostaClicada == respostaCorreta) {
    console.log("certa resposta...");
    caixaMensagem.innerHTML = `<div id="certo_disso">
            <p>Certa resposta!</p>
            <button class="btn btn-dark" id="btn-sim" style="width: 200px" onclick="proximaPergunta();">Próxima pergunta</button>
        </div>`;

    marcador++;
    acertos++;
    habilita_escolha = false;
  } else {
    caixaMensagem.innerHTML = `<div id="certo_disso">
            <p>Resposta errada!</p>
            <button class="btn btn-dark" id="btn-sim" style="width: 200px" onclick="novoJogo();">Novo jogo</button>
        </div>`;
    habilita_escolha = false;
  }
}

function naoEstaCerto() {
  caixaMensagem.innerHTML = "";
}

function proximaPergunta() {
  limpar();
  carregarPergunta();
  atualizarValores();
  caixaMensagem.innerHTML = "";
}

function limpar() {
  document.getElementById("btn_1").classList = "alternativa";
  document.getElementById("btn_2").classList = "alternativa";
  document.getElementById("btn_3").classList = "alternativa";
  document.getElementById("btn_4").classList = "alternativa";

  document.getElementById("num_1").classList = "alternativa__num";
  document.getElementById("num_2").classList = "alternativa__num";
  document.getElementById("num_3").classList = "alternativa__num";
  document.getElementById("num_4").classList = "alternativa__num";
}

function atualizarValores() {
  switch (acertos) {
    case 0:
      errar = 0;
      parar = 0;
      acertar = "MIL";
      break;
    case 1:
      errar = "500";
      parar = "MIL";
      acertar = "2 MIL";
      break;
    case 2:
      errar = "MIL";
      parar = "2 MIL";
      acertar = "3 MIL";
      break;
    case 3:
      errar = "1,5 MIL";
      parar = "3 MIL";
      acertar = "4 MIL";
      break;
    case 4:
      errar = "2 MIL";
      parar = "4 MIL";
      acertar = "5 MIL";
      break;
    case 5:
      errar = "2,5 MIL";
      parar = "5 MIL";
      acertar = "10 MIL";
      break;
    case 6:
      errar = "5 MIL";
      parar = "10 MIL";
      acertar = "20 MIL";
      break;
    case 7:
      errar = "10 MIL";
      parar = "20 MIL";
      acertar = "30 MIL";
      break;
    case 8:
      errar = "15 MIL";
      parar = "30 MIL";
      acertar = "40 MIL";
      break;
    case 9:
      errar = "20 MIL";
      parar = "40 MIL";
      acertar = "50 MIL";
      break;
    case 10:
      errar = "25 MIL";
      parar = "50 MIL";
      acertar = "100 MIL";
      break;
    case 11:
      errar = "50 MIL";
      parar = "100 MIL";
      acertar = "200 MIL";
      break;
    case 12:
      errar = "100 MIL";
      parar = "200 MIL";
      acertar = "300 MIL";
      break;
    case 13:
      errar = "150 MIL";
      parar = "300 MIL";
      acertar = "400 MIL";
      break;
    case 14:
      errar = "200 MIL";
      parar = "400 MIL";
      acertar = "500 MIL";
      break;
    case 15:
      errar = "PERDE TUDO";
      parar = "500 MIL";
      acertar = "1 MILHÃO";
      break;

    default:
      errar = "1 MILHÃO";
      parar = "1 MILHÃO";
      acertar = "1 MILHÃO";
      break;
  }

  document.getElementById("se_errar").innerHTML = errar;
  document.getElementById("se_parar").innerHTML = parar;
  document.getElementById("se_acertar").innerHTML = acertar;
}

function nivelPergunta() {
  if (acertos < 5) {
    nivel_pergunta = 1;
  } else if (acertos >= 5 && acertos < 10) {
    nivel_pergunta = 2;
  } else if (acertos >= 10 && acertos < 15) {
    nivel_pergunta = 3;
  } else {
    nivel_pergunta = 4;
  }
}
