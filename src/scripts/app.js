/* =====================================================
   NEXUS ORBITAL — Mission Control JavaScript
   GS2026.1 — Application Development — FIAP
   Autor: [Seu Nome] — RM: [Seu RM]

   Conteúdos aplicados:
   - Eventos (click, submit, DOMContentLoaded)
   - Manipulação do DOM (getElementById, querySelector, etc.)
   - Alteração dinâmica de conteúdo (innerHTML, textContent, style)
   - Interação com botões
   - Manipulação visual dinâmica (tema, exibição/ocultação, status)
   ===================================================== */

/* ── 1. INICIALIZAÇÃO ── */

// Aguarda o DOM estar completamente carregado antes de executar
document.addEventListener('DOMContentLoaded', function () {
  iniciarContador();
  iniciarSimulacaoTelemetria();
  console.log('[NEXUS ORBITAL] Sistema inicializado com sucesso.');
});


/* ── 2. CONTADOR REGRESSIVO ── */

/**
 * Define uma data alvo fictícia de chegada em Europa
 * e atualiza o contador a cada segundo via setInterval.
 */
function iniciarContador() {
  // Data alvo: 847 dias a partir de hoje (fictício)
  var alvo = new Date();
  alvo.setDate(alvo.getDate() + 847);
  alvo.setHours(alvo.getHours() + 14);
  alvo.setMinutes(alvo.getMinutes() + 32);

  // Atualiza o contador a cada 1 segundo
  setInterval(function () {
    var agora = new Date();
    var diff = alvo - agora; // diferença em milissegundos

    if (diff <= 0) {
      // Missão chegou ao destino
      document.getElementById('countdown').textContent = 'CHEGAMOS EM EUROPA!';
      return;
    }

    // Calcula dias, horas, minutos e segundos restantes
    var dias  = Math.floor(diff / (1000 * 60 * 60 * 24));
    var horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var segs  = Math.floor((diff % (1000 * 60)) / 1000);

    // Atualiza os elementos HTML com os valores calculados
    document.getElementById('cd-days').textContent = String(dias).padStart(3, '0');
    document.getElementById('cd-hours').textContent = String(horas).padStart(2, '0');
    document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
    document.getElementById('cd-secs').textContent = String(segs).padStart(2, '0');
  }, 1000);
}


/* ── 3. ALTERNÂNCIA DE TEMA (Manipulação Visual Dinâmica) ── */

/**
 * Alterna entre tema escuro (dark) e claro (light).
 * Modifica a classe do elemento body e atualiza o ícone do botão.
 */
function toggleTheme() {
  var body      = document.getElementById('body');
  var themeIcon = document.getElementById('theme-icon');

  // Verifica qual tema está ativo e faz a troca
  if (body.classList.contains('dark-theme')) {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    // Troca ícone para lua (modo escuro disponível)
    themeIcon.setAttribute('data-lucide', 'moon');
  } else {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    // Troca ícone para sol (modo claro disponível)
    themeIcon.setAttribute('data-lucide', 'sun');
  }
  // Re-renderiza os ícones Lucide após a troca
  lucide.createIcons();
}


/* ── 4. EXIBIR / OCULTAR LOG (Exibição e ocultação de elementos) ── */

// Controla o estado de visibilidade do painel de log
var logVisivel = false;

/**
 * Exibe ou oculta o painel de log de eventos
 * alterando a propriedade display do elemento aside.
 */
function toggleLog() {
  var logPanel = document.getElementById('event-log');
  var btnLog   = document.querySelector('.btn-log');

  if (logVisivel) {
    logPanel.style.display = 'none';
    btnLog.innerHTML = '<i data-lucide="scroll-text" class="icon-btn"></i> EXIBIR LOG';
    logVisivel = false;
  } else {
    logPanel.style.display = 'block';
    btnLog.innerHTML = '<i data-lucide="scroll-text" class="icon-btn"></i> OCULTAR LOG';
    logVisivel = true;
  }
  lucide.createIcons();
}


/* ── 5. SIMULAÇÃO DE ALERTA (Alteração dinâmica de conteúdo + DOM) ── */

// Lista de alertas fictícios para simular eventos da missão
var alertas = [
  { msg: 'Radiação solar elevada detectada. Escudo reforçado automaticamente.', tipo: 'warn',   card: 'card-shield', statusId: 'shield-status', novoStatus: 'ALERTA', novoTipo: 'warn' },
  { msg: 'Falha temporária no motor 2. Reinicialização em andamento..',          tipo: 'danger', card: 'card-speed',  statusId: 'speed-status',  novoStatus: 'FALHA',  novoTipo: 'danger' },
  { msg: 'Temperatura do casco acima do esperado. Resfriamento ativado.',        tipo: 'warn',   card: 'card-temp',   statusId: 'temp-status',   novoStatus: 'ALERTA', novoTipo: 'warn' },
  { msg: 'Sinal de comunicação instável. Verificando antenas.',                  tipo: 'warn',   card: 'card-comm',   statusId: 'comm-status',   novoStatus: 'INSTÁVEL', novoTipo: 'warn' },
  { msg: 'Nível de oxigênio levemente abaixo do normal. Monitorando.',           tipo: 'warn',   card: 'card-oxygen', statusId: 'oxygen-status', novoStatus: 'ATENÇÃO', novoTipo: 'warn' },
];

var indiceAlerta = 0; // Índice para percorrer os alertas em sequência

/**
 * Simula um alerta na missão:
 * - Adiciona entrada no log
 * - Destaca o card afetado
 * - Atualiza o status global
 * - Reverte o estado após 5 segundos
 */
function simularAlerta() {
  // Seleciona o próximo alerta da lista (ciclicamente)
  var alerta = alertas[indiceAlerta % alertas.length];
  indiceAlerta++;

  // 1. Adiciona a entrada no log de eventos
  adicionarLog(alerta.msg, alerta.tipo);

  // 2. Destaca visualmente o card afetado
  var card = document.getElementById(alerta.card);
  if (card) {
    card.classList.add('alert-card');
  }

  // 3. Atualiza o status do card afetado
  var statusEl = document.getElementById(alerta.statusId);
  if (statusEl) {
    statusEl.textContent = alerta.novoStatus;
    statusEl.className = 'card-status ' + alerta.novoTipo;
  }

  // 4. Atualiza o status global no header
  atualizarStatusGlobal('ALERTA', true);

  // 5. Reverte tudo após 5 segundos
  setTimeout(function () {
    if (card) card.classList.remove('alert-card');
    if (statusEl) {
      statusEl.textContent = 'NORMAL';
      statusEl.className = 'card-status ok';
    }
    atualizarStatusGlobal('NOMINAL', false);
    adicionarLog('Situação normalizada. Sistemas operando dentro dos parâmetros.', 'ok');
  }, 5000);
}

/**
 * Atualiza o status global exibido no header.
 * @param {string} texto - Texto do status (ex: 'ALERTA', 'NOMINAL')
 * @param {boolean} eAlerta - Se true, aplica classe visual de alerta
 */
function atualizarStatusGlobal(texto, eAlerta) {
  var pill       = document.getElementById('global-status');
  var statusText = document.getElementById('status-text');
  var footerSt   = document.getElementById('footer-status');

  statusText.textContent = texto;
  footerSt.textContent   = eAlerta ? 'ALERTA ATIVO' : 'OPERACIONAL';

  if (eAlerta) {
    pill.classList.add('alert');
    footerSt.style.color = 'var(--red)';
  } else {
    pill.classList.remove('alert');
    footerSt.style.color = 'var(--green)';
  }
}


/* ── 6. ADICIONAR ENTRADA NO LOG (Manipulação do DOM) ── */

/**
 * Cria e insere um novo item na lista de log de eventos.
 * @param {string} mensagem - Texto do evento
 * @param {string} tipo - 'ok' | 'warn' | 'danger'
 */
function adicionarLog(mensagem, tipo) {
  var logList = document.getElementById('log-list');

  // Obtém a hora atual formatada HH:MM:SS
  var agora  = new Date();
  var hora   = String(agora.getHours()).padStart(2, '0');
  var minuto = String(agora.getMinutes()).padStart(2, '0');
  var seg    = String(agora.getSeconds()).padStart(2, '0');
  var tempo  = hora + ':' + minuto + ':' + seg;

  // Cria o elemento <li> e define seu conteúdo
  var item = document.createElement('li');
  item.className = 'log-item ' + tipo;
  item.innerHTML =
    '<span class="log-time">' + tempo + '</span>' +
    '<span class="log-msg">' + mensagem + '</span>';

  // Insere no topo da lista (mais recente primeiro)
  logList.insertBefore(item, logList.firstChild);

  // Se o log estava oculto, exibe automaticamente
  if (!logVisivel) {
    toggleLog();
  }
}


/* ── 7. LIMPAR LOG ── */

/**
 * Remove todos os itens do log de eventos.
 */
function limparLog() {
  var logList = document.getElementById('log-list');
  // Remove todos os filhos do elemento ul
  while (logList.firstChild) {
    logList.removeChild(logList.firstChild);
  }
  adicionarLog('Log limpo pelo operador.', 'ok');
}


/* ── 8. ATUALIZAR DADOS DE TELEMETRIA (Alteração dinâmica de conteúdo) ── */

/**
 * Gera um número aleatório entre min e max (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomEntre(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Atualiza todos os valores do dashboard com dados simulados aleatórios.
 * Demonstra manipulação de DOM via textContent e style.width.
 */
function atualizarDados() {
  // Temperatura: entre -220 e -150 (escala 0-220 → 0-100%)
  var temp = randomEntre(-220, -150);
  var tempPct = Math.round(((temp + 220) / 70) * 100);
  document.getElementById('temp-value').textContent = temp + '°C';
  document.getElementById('temp-bar').style.width = tempPct + '%';

  // Energia: entre 55% e 95%
  var energia = randomEntre(55, 95);
  document.getElementById('energy-value').textContent = energia + '%';
  document.getElementById('energy-bar').style.width = energia + '%';
  atualizarStatusCard('energy-status', energia, 70, 55);

  // Comunicação: entre 70% e 99%
  var comm = randomEntre(70, 99);
  document.getElementById('comm-value').textContent = comm + '%';
  document.getElementById('comm-bar').style.width = comm + '%';
  atualizarStatusCard('comm-status', comm, 80, 70, 'LINK ATIVO', 'INSTÁVEL', 'FALHA');

  // Velocidade: entre 40.000 e 55.000 km/h
  var vel = randomEntre(40000, 55000);
  document.getElementById('speed-value').textContent = vel.toLocaleString('pt-BR') + ' km/h';
  var velPct = Math.round(((vel - 40000) / 15000) * 100);
  document.getElementById('speed-bar').style.width = velPct + '%';

  // Oxigênio: entre 19% e 23%
  var o2 = (randomEntre(190, 230) / 10).toFixed(1);
  document.getElementById('oxygen-value').textContent = o2 + '%';
  var o2Pct = Math.round(((parseFloat(o2) - 19) / 4) * 100);
  document.getElementById('oxygen-bar').style.width = Math.min(100, Math.max(0, o2Pct)) + '%';

  // Escudo: entre 80% e 98%
  var escudo = randomEntre(80, 98);
  document.getElementById('shield-value').textContent = 'ATIVO';
  document.getElementById('shield-bar').style.width = escudo + '%';
  document.querySelector('.card-shield .card-range').textContent = 'PROTEÇÃO: ' + escudo + '%';

  // Registra a atualização no log
  adicionarLog('Dados de telemetria atualizados manualmente pelo operador.', 'ok');
}

/**
 * Atualiza o elemento de status de um card com base no valor percentual.
 * @param {string} id - ID do elemento de status
 * @param {number} valor - Valor atual
 * @param {number} limiteOk - Acima desse valor = OK
 * @param {number} limiteWarn - Acima desse valor (e abaixo de limiteOk) = WARN
 * @param {string} txtOk - Texto para status OK
 * @param {string} txtWarn - Texto para status WARN
 * @param {string} txtDanger - Texto para status DANGER
 */
function atualizarStatusCard(id, valor, limiteOk, limiteWarn, txtOk, txtWarn, txtDanger) {
  txtOk     = txtOk     || 'ESTÁVEL';
  txtWarn   = txtWarn   || 'ATENÇÃO';
  txtDanger = txtDanger || 'CRÍTICO';

  var el = document.getElementById(id);
  if (!el) return;

  if (valor >= limiteOk) {
    el.textContent = txtOk;
    el.className = 'card-status ok';
  } else if (valor >= limiteWarn) {
    el.textContent = txtWarn;
    el.className = 'card-status warn';
  } else {
    el.textContent = txtDanger;
    el.className = 'card-status danger';
  }
}


/* ── 9. SIMULAÇÃO AUTOMÁTICA DE TELEMETRIA ── */

/**
 * Inicia uma simulação automática que atualiza os dados
 * de telemetria a cada 15 segundos sem intervenção do usuário.
 */
function iniciarSimulacaoTelemetria() {
  setInterval(function () {
    // Atualiza apenas as barras de energia e comunicação suavemente
    var energiaAtual = parseInt(document.getElementById('energy-value').textContent);
    var variacao = randomEntre(-3, 3);
    var novaEnergia = Math.min(100, Math.max(40, energiaAtual + variacao));
    document.getElementById('energy-value').textContent = novaEnergia + '%';
    document.getElementById('energy-bar').style.width = novaEnergia + '%';
  }, 15000); // a cada 15 segundos
}


/* ── 10. FORMULÁRIO — Submit com validação (Evento + DOM) ── */

/**
 * Processa o envio do formulário.
 * Valida os campos, exibe mensagem de feedback e registra no log.
 * @param {Event} event - Evento de submit do formulário
 */
function submitForm(event) {
  // Impede o comportamento padrão do formulário (recarregar a página)
  event.preventDefault();

  // Captura os valores dos campos via getElementById
  var nome    = document.getElementById('nome').value.trim();
  var idMiss  = document.getElementById('id-missao').value.trim();
  var cargo   = document.getElementById('cargo').value;
  var modulo  = document.getElementById('modulo').value;
  var msgEl   = document.getElementById('form-msg');

  // Validação básica dos campos obrigatórios
  if (!nome || !idMiss || !cargo || !modulo) {
    exibirMensagemForm('⚠ Preencha todos os campos obrigatórios antes de registrar.', 'error');
    return;
  }

  // Validação do formato do ID da missão (ex: AX-001)
  var regexId = /^[A-Z]{2}-\d{3}$/;
  if (!regexId.test(idMiss)) {
    exibirMensagemForm('⚠ ID da missão inválido. Use o formato XX-000 (ex: AX-003).', 'error');
    return;
  }

  // Sucesso: exibe mensagem e registra no log
  var cargoTexto  = document.getElementById('cargo').options[document.getElementById('cargo').selectedIndex].text;
  var moduloTexto = document.getElementById('modulo').options[document.getElementById('modulo').selectedIndex].text;

  exibirMensagemForm(
    '✔ ' + nome + ' registrado(a) com sucesso como ' + cargoTexto + ' no ' + moduloTexto + '.',
    'success'
  );

  // Adiciona entrada no log de eventos
  adicionarLog(
    'Novo registro: ' + nome + ' (' + idMiss + ') — ' + cargoTexto + ' — ' + moduloTexto + '.',
    'ok'
  );

  // Limpa o formulário após 2 segundos
  setTimeout(function () {
    document.getElementById('mission-form').reset();
  }, 2000);
}

/**
 * Exibe uma mensagem de feedback abaixo do formulário.
 * @param {string} texto - Texto da mensagem
 * @param {string} tipo - 'success' | 'error'
 */
function exibirMensagemForm(texto, tipo) {
  var msgEl = document.getElementById('form-msg');
  msgEl.textContent = texto;
  msgEl.className   = 'form-message ' + tipo;
  msgEl.style.display = 'block';

  // Oculta a mensagem automaticamente após 5 segundos
  setTimeout(function () {
    msgEl.style.display = 'none';
  }, 5000);
}


/* ── 11. LIMPAR FORMULÁRIO ── */

/**
 * Reseta todos os campos do formulário manualmente.
 */
function limparForm() {
  document.getElementById('mission-form').reset();
  document.getElementById('form-msg').style.display = 'none';
}