console.log("Carregou script.js");

let perguntas = {};
let perguntas_nivel1 = {};
let perguntas_nivel2 = {};
let perguntas_nivel3 = {};
let perguntas_milhao = {};


/** variáveis globais */
let acertos = 0;
let nivel_pergunta = 1;
let indice_pergunta = 0;
let jogador = "Jogador";
let habilita_escolha = true;
let errar = 0;
let parar = 0;
let acertar = "MIL";
let pulos = 3;
let seq_cartas = [0, 1, 2, 3];
let respostaCorreta = null;
let respostaClicada = null;

const texto_pergunta = document.getElementById("pergunta");
const alterUm = document.getElementById("alt-um");
const alterDois = document.getElementById("alt-dois");
const alterTres = document.getElementById("alt-tres");
const alterQuatro = document.getElementById("alt-quatro");
const caixaMensagem = document.getElementById("caixa_mensagem");

novoJogo();

//carregarPerguntas();
carregaPerguntasNivel1();
carregaPerguntasNivel2();
carregaPerguntasNivel3();
carregaPerguntasMilhao();

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
        [dados.pergunta[i], dados.pergunta[j]] = [
          dados.pergunta[j],
          dados.pergunta[i],
        ];
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

  habilitaAlternativas();

  nivelPergunta(); // Define o nível da pergunta baseado nos acertos

  if (nivel_pergunta == 1 ){
    perguntaAtual = perguntas_nivel1[indice_pergunta];
  } else if (nivel_pergunta == 2){
    perguntaAtual = perguntas_nivel2[indice_pergunta];
  } else if (nivel_pergunta == 3){
    perguntaAtual = perguntas_nivel3[indice_pergunta];
  } else {
    perguntaAtual = perguntas_milhao[indice_pergunta];
  }


  // Exibe a pergunta e alternativas na tela
  texto_pergunta.innerHTML = perguntaAtual.pergunta;
  alterUm.innerText = perguntaAtual.alternativas[0].alternativa;
  alterDois.innerText = perguntaAtual.alternativas[1].alternativa;
  alterTres.innerText = perguntaAtual.alternativas[2].alternativa;
  alterQuatro.innerText = perguntaAtual.alternativas[3].alternativa;

  respostaCorreta = perguntaAtual.correta; // A resposta correta
  habilita_escolha = true; // Habilita a escolha de alternativas
  console.log(`Nível pergunta: ${perguntaAtual.nivel}`);
  console.log(`ID pergunta: ${perguntaAtual.id}`);
  console.log(`Indice pergunta: ${indice_pergunta}`);

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
  document.getElementById("btn_" + respostaCorreta).classList =
    "alternativa alternativa__correta";

  if (respostaClicada == respostaCorreta) {
    console.log("certa resposta...");
    
    caixaMensagem.innerHTML = `<div id="certo_disso">
    <p>Certa resposta!</p>
    <button class="btn btn-dark" id="btn-sim" style="width: 200px" onclick="proximaPergunta();">Próxima pergunta</button>
    </div>`;
    
    acertos++;
    console.log(`Acertos: ${acertos}`);
    habilita_escolha = false;

    //caso troque de nível, o índice da pergunta será zerado
    if (acertos==5 || acertos==10 || acertos==15) {
      indice_pergunta = 0;
    } else {
      indice_pergunta++;
    }
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

function cartas() {
  //embaralhar array das cartas
  for (let i = seq_cartas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [seq_cartas[i], seq_cartas[j]] = [seq_cartas[j], seq_cartas[i]];
  }
  console.log(seq_cartas);

  caixaMensagem.innerHTML = `
                        <div id="cartas">
                            <div class="carta" id="carta1" onclick="selecionarCarta(${seq_cartas[0]}, 1)"></div>
                            <div class="carta" id="carta2" onclick="selecionarCarta(${seq_cartas[1]}, 2)"></div>
                            <div class="carta" id="carta3" onclick="selecionarCarta(${seq_cartas[2]}, 3)"></div>
                            <div class="carta" id="carta4" onclick="selecionarCarta(${seq_cartas[3]}, 4)"></div>
                        </div>`;
}

function selecionarCarta(carta, posicao) {
  console.log("Selecionou: " + carta + " posição: " + posicao);

  //virar todas
  document.getElementById(`carta1`).classList = `carta carta_${seq_cartas[0]}`;
  document.getElementById(`carta2`).classList = `carta carta_${seq_cartas[1]}`;
  document.getElementById(`carta3`).classList = `carta carta_${seq_cartas[2]}`;
  document.getElementById(`carta4`).classList = `carta carta_${seq_cartas[3]}`;

  document.getElementById(
    `carta${posicao}`
  ).classList = `carta carta__selecionada carta_${carta}`;

  document.getElementById("btn-cartas").setAttribute("disabled", "");
  document.getElementById("btn-cartas").classList = "ajuda btn_disabled";

  desabilitarAlternativa(carta);
}

function desabilitarAlternativa(carta) {
  // Inicia o índice da alternativa
  let i = 1;

  console.log("Desabilita alternativa....");

  // Laço para percorrer as alternativas
  let alternativasDesabilitadas = 0;

  while (alternativasDesabilitadas < carta) {
    // Verifica se a alternativa não é a resposta correta
    if (i !== respostaCorreta) {
      // Desabilita a alternativa
      document.getElementById(`btn_` + i).style.visibility = "hidden";
      alternativasDesabilitadas++; // Conta apenas as alternativas escondidas
    }
    // Incrementa o índice para evitar o loop infinito
    i++;

    // Verifica se atingimos o final das alternativas
    if (i > 4) break; // Supondo que há apenas 4 alternativas (0 a 4)
  }
}

function habilitaAlternativas() {
  document.getElementById("btn_1").style.visibility = "visible";
  document.getElementById("btn_2").style.visibility = "visible";
  document.getElementById("btn_3").style.visibility = "visible";
  document.getElementById("btn_4").style.visibility = "visible";
}

function ajudaPlacas() {
  caixaMensagem.innerHTML = `
                            <div id="placas">
                                <h5> Placas</h5>
                                <div class="placas__participantes">
                                    <div class="linha__placas_participantes">
                                        <div><span id="pp_1"></span></div>
                                        <div><span id="pp_2"></span></div>
                                        <div><span id="pp_3"></span></div>
                                        <div><span id="pp_4"></span></div>
                                    </div>
                                    <div class="linha__placas_participantes">
                                        <div><span id="pp_5"></span></div>
                                        <div><span id="pp_6"></span></div>
                                        <div><span id="pp_7"></span></div>
                                        <div><span id="pp_8"></span></div>                                
                                    </div>
                                    <div class="linha__placas_participantes">
                                        <div><span id="pp_9"></span></div>
                                        <div><span id="pp_10"></span></div>
                                        <div><span id="pp_11"></span></div>                                
                                    </div>
                                </div>
                            </div>
                            `;

  decisaoPlacas();
}

function decisaoPlacas() {
  // Definir a probabilidade de acerto de acordo com o nível da pergunta
  let probabilidadeAcerto;

  // Definir a probabilidade com base no nível da pergunta
  switch (nivelPergunta) {
    case 1:
      probabilidadeAcerto = Math.random() * 0.3 + 0.7; // entre 70% e 100%
      break;
    case 2:
      probabilidadeAcerto = Math.random() * 0.35 + 0.6; // entre 60% e 95%
      break;
    case 3:
      probabilidadeAcerto = Math.random() * 0.3 + 0.5; // entre 50% e 80%
      break;
    default:
      probabilidadeAcerto = 0.7; // Por padrão, 70% para níveis não esperados
  }

  // Contadores para cada alternativa
  let contador1 = 0;
  let contador2 = 0;
  let contador3 = 0;
  let contador4 = 0;

  // Loop para preencher as 11 placas
  for (let i = 1; i <= 11; i++) {
    let escolha = Math.random(); // Gera um número aleatório entre 0 e 1

    // Determina a escolha do participante na placa
    let alternativaEscolhida;
    if (escolha < probabilidadeAcerto) {
      // Se o número aleatório for menor que a probabilidade de acerto, escolhe a resposta correta
      alternativaEscolhida = respostaCorreta;
    } else {
      // Caso contrário, escolhe uma alternativa incorreta aleatória
      alternativaEscolhida = Math.floor(Math.random() * 4) + 1;

      // Se a alternativa escolhida for a correta, escolhe novamente até ser errada
      while (alternativaEscolhida === respostaCorreta) {
        alternativaEscolhida = Math.floor(Math.random() * 4) + 1;
      }
    }

    // Preencher o innerHTML da placa com o número da alternativa escolhida
    document.getElementById(`pp_${i}`).innerHTML = alternativaEscolhida;

    // Contabilizar as escolhas
    switch (alternativaEscolhida) {
      case 1:
        contador1++;
        break;
      case 2:
        contador2++;
        break;
      case 3:
        contador3++;
        break;
      case 4:
        contador4++;
        break;
    }
  }

  // Calcular a porcentagem de cada escolha
  const totalParticipantes = 11; // Total de placas (participantes)
  const percentual1 = (contador1 / totalParticipantes) * 100;
  const percentual2 = (contador2 / totalParticipantes) * 100;
  const percentual3 = (contador3 / totalParticipantes) * 100;
  const percentual4 = (contador4 / totalParticipantes) * 100;

  // Encontrar a maior escolha
  const maiorPorcentagem = Math.max(
    percentual1,
    percentual2,
    percentual3,
    percentual4
  );
  let escolhaMaioria;
  if (maiorPorcentagem === percentual1) escolhaMaioria = 1;
  if (maiorPorcentagem === percentual2) escolhaMaioria = 2;
  if (maiorPorcentagem === percentual3) escolhaMaioria = 3;
  if (maiorPorcentagem === percentual4) escolhaMaioria = 4;

  // Exibir no console
  console.log(
    `A maioria escolheu: ${escolhaMaioria} (${maiorPorcentagem.toFixed(2)}%)`
  );

  // Desabilitar o botão após a execução
  document.getElementById("btn-placas").setAttribute("disabled", "");
  document.getElementById("btn-placas").classList = "ajuda btn_disabled";
}

function ajudaConvidados() {
  caixaMensagem.innerHTML = `
                                <div id="convidados" >
                                    <h5>Convidados</h5>
                                    <div class="placas__convidados">
                                        <div class="convidado tooltip-top">
                                            <h3 id="convidado_1"></h3>
                                        </div>
                                        <div class="convidado tooltip-top">
                                            <h3 id="convidado_2"></h3>
                                        </div>
                                        <div class="convidado tooltip-top">
                                            <h3 id="convidado_3"></h3>
                                        </div>
                                    </div>
                                </div>
                                `;
  decisaoConvidados();
  // Desabilitar o botão após a execução
  document.getElementById("btn-convidados").setAttribute("disabled", "");
  document.getElementById("btn-convidados").classList = "ajuda btn_disabled";
}

function decisaoConvidados() {
  // Probabilidade de acerto de acordo com o nível da pergunta
  let acertoProbabilidade = [];

  // Definir a probabilidade com base no nível da pergunta
  switch (nivelPergunta) {
    case 1: // Nível fácil (tudo correto)
      acertoProbabilidade = [respostaCorreta, respostaCorreta, respostaCorreta];
      break;
    case 2: // Nível médio (distribuição equilibrada)
      acertoProbabilidade = [
        respostaCorreta,
        respostaCorreta,
        Math.floor(Math.random() * 4) + 1,
      ];
      while (acertoProbabilidade[2] === respostaCorreta) {
        acertoProbabilidade[2] = Math.floor(Math.random() * 4) + 1;
      }
      break;
    case 3: // Nível difícil (maioria errada)
      acertoProbabilidade = [
        respostaCorreta,
        respostaCorreta,
        Math.floor(Math.random() * 4) + 1,
      ];
      while (acertoProbabilidade[2] === respostaCorreta) {
        acertoProbabilidade[2] = Math.floor(Math.random() * 4) + 1;
      }
      break;
    default:
      acertoProbabilidade = [respostaCorreta, respostaCorreta, respostaCorreta];
      break;
  }

  // Preencher as respostas dos convidados
  for (let i = 1; i <= 3; i++) {
    document.getElementById(`convidado_${i}`).innerHTML =
      acertoProbabilidade[i - 1];
  }
}

function pular() {
  if (pulos == 3) {
    document.getElementById("pular3").setAttribute("disabled", "");
    document.getElementById("pular3").classList = "ajuda btn_disabled";
    pulos--;
    indice_pergunta++;
    carregarPergunta();
  } else if (pulos == 2) {
    document.getElementById("pular2").setAttribute("disabled", "");
    document.getElementById("pular2").classList = "ajuda btn_disabled";
    pulos--;
    indice_pergunta++;
    carregarPergunta();
  } else if (pulos == 1) {
    document.getElementById("pular1").setAttribute("disabled", "");
    document.getElementById("pular1").classList = "ajuda btn_disabled";
    pulos--;
    indice_pergunta++;
    carregarPergunta();
  }

  caixaMensagem.innerHTML = ``;
}



async function carregaPerguntasNivel1()
{
  let p = {};  // Inicializa 'p' como objeto vazio
  try {
    // Faz a requisição para o arquivo JSON
    const response = await fetch("assets/data/perguntas_nivel_1.json");

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro ao carregar JSON: ${response.status}`);
    }

    // Converte a resposta para JSON
    const dados = await response.json();

    // Verifica se os dados possuem a chave "pergunta" e embaralha o array
    if (dados.pergunta && Array.isArray(dados.pergunta)) {
      // Embaralha o array de perguntas
      for (let i = dados.pergunta.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dados.pergunta[i], dados.pergunta[j]] = [dados.pergunta[j], dados.pergunta[i]];
      }

      // Atribui as perguntas ao 'p'
      p = dados.pergunta;  // 'p' agora é um array
    }

  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
  }

  // Aqui usamos slice() diretamente em 'p', que agora é um array
  perguntas_nivel1 = p.slice(0, 8);  // Pega os primeiros oito elementos
  console.log(perguntas_nivel1);  // Exibe o primeiro item da lista
  carregarPergunta(); // Chama a função para carregar a primeira pergunta após carregar as perguntas
  
  
}


async function carregaPerguntasNivel2()
{
  let p = {};  // Inicializa 'p' como objeto vazio
  try {
    // Faz a requisição para o arquivo JSON
    const response = await fetch("assets/data/perguntas_nivel_2.json");

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro ao carregar JSON: ${response.status}`);
    }

    // Converte a resposta para JSON
    const dados = await response.json();

    // Verifica se os dados possuem a chave "pergunta" e embaralha o array
    if (dados.pergunta && Array.isArray(dados.pergunta)) {
      // Embaralha o array de perguntas
      for (let i = dados.pergunta.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dados.pergunta[i], dados.pergunta[j]] = [dados.pergunta[j], dados.pergunta[i]];
      }

      // Atribui as perguntas ao 'p'
      p = dados.pergunta;  // 'p' agora é um array
    }

  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
  }

  // Aqui usamos slice() diretamente em 'p', que agora é um array
  perguntas_nivel2 = p.slice(0, 8);  // Pega os primeiros oito elementos
  console.log(perguntas_nivel2);  // Exibe o primeiro item da lista
}


async function carregaPerguntasNivel3()
{
  let p = {};  // Inicializa 'p' como objeto vazio
  try {
    // Faz a requisição para o arquivo JSON
    const response = await fetch("assets/data/perguntas_nivel_3.json");

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro ao carregar JSON: ${response.status}`);
    }

    // Converte a resposta para JSON
    const dados = await response.json();

    // Verifica se os dados possuem a chave "pergunta" e embaralha o array
    if (dados.pergunta && Array.isArray(dados.pergunta)) {
      // Embaralha o array de perguntas
      for (let i = dados.pergunta.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dados.pergunta[i], dados.pergunta[j]] = [dados.pergunta[j], dados.pergunta[i]];
      }

      // Atribui as perguntas ao 'p'
      p = dados.pergunta;  // 'p' agora é um array
    }

  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
  }

  // Aqui usamos slice() diretamente em 'p', que agora é um array
  perguntas_nivel3 = p.slice(0, 8);  // Pega os primeiros oito elementos
  console.log(perguntas_nivel3);  // Exibe o primeiro item da lista
}


async function carregaPerguntasMilhao() {
  let p = {};  // Inicializa 'p' como objeto vazio
  try {
    // Faz a requisição para o arquivo JSON
    const response = await fetch("assets/data/perguntas_nivel_4.json");

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro ao carregar JSON: ${response.status}`);
    }

    // Converte a resposta para JSON
    const dados = await response.json();

    // Verifica se os dados possuem a chave "pergunta" e embaralha o array
    if (dados.pergunta && Array.isArray(dados.pergunta)) {
      // Embaralha o array de perguntas
      for (let i = dados.pergunta.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dados.pergunta[i], dados.pergunta[j]] = [dados.pergunta[j], dados.pergunta[i]];
      }

      // Atribui as perguntas ao 'p'
      p = dados.pergunta;  // 'p' agora é um array
    }

  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
  }

  // Aqui usamos slice() diretamente em 'p', que agora é um array
  perguntas_milhao = p.slice(0, 1);  // Pega o primeiro elemento
  console.log(perguntas_milhao);  // Exibe o primeiro item da lista
}