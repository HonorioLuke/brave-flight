// Referências dos elementos HTML
const modal = document.getElementById('auth-modal');
const loginView = document.getElementById('login-view');
const cadastroView = document.getElementById('cadastro-view');
const btnLoginHeader = document.getElementById('btn-login-header');
const btnLogout = document.getElementById('btn-logout');
const userGreeting = document.getElementById('user-greeting');

let pacotePendente = null; // Guarda o pacote que o usuário tentou comprar

// Inicialização: Verifica se já tem alguém logado ao carregar a página
window.onload = function() {
    verificarLogin();
    
    // Simulação da busca de passagens (RF02)
    document.getElementById('form-busca').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Buscando as melhores opções na LL Brave Flight... (Simulação)');
    });
};

// --- FUNÇÕES DA INTERFACE ---

function atualizarUI(usuarioLogado) {
    if (usuarioLogado) {
        btnLoginHeader.classList.add('hidden');
        btnLogout.classList.remove('hidden');
        userGreeting.classList.remove('hidden');
        userGreeting.textContent = `Olá, ${usuarioLogado.nome}!`;
    } else {
        btnLoginHeader.classList.remove('hidden');
        btnLogout.classList.add('hidden');
        userGreeting.classList.add('hidden');
    }
}

function abrirModal() {
    modal.classList.remove('hidden');
}

function fecharModal() {
    modal.classList.add('hidden');
    pacotePendente = null; // Cancela a intenção de compra se fechar o modal
}

function alternarTelaAuth(tela) {
    if (tela === 'cadastro') {
        loginView.classList.add('hidden');
        cadastroView.classList.remove('hidden');
    } else {
        cadastroView.classList.add('hidden');
        loginView.classList.remove('hidden');
    }
}

btnLoginHeader.onclick = abrirModal;
btnLogout.onclick = fazerLogout;

// --- LÓGICA DE NEGÓCIO (Requisitos Funcionais) ---

function verificarLogin() {
    const userDB = localStorage.getItem('usuarioViagens');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (userDB && isLoggedIn) {
        atualizarUI(JSON.parse(userDB));
        return true;
    }
    atualizarUI(null);
    return false;
}

function fazerCadastro() {
    const nome = document.getElementById('cad-nome').value;
    const email = document.getElementById('cad-email').value;
    const senha = document.getElementById('cad-senha').value;

    if (!nome || !email || !senha) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Salva no LocalStorage (RF03)
    const usuario = { nome, email, senha };
    localStorage.setItem('usuarioViagens', JSON.stringify(usuario));
    localStorage.setItem('isLoggedIn', 'true');
    
    fecharModal();
    atualizarUI(usuario);
    alert(`Bem-vindo à LL Brave Flight, ${nome}! Cadastro realizado com sucesso.`);
    
    processarCompraPendente();
}

function fazerLogin() {
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    const userDB = JSON.parse(localStorage.getItem('usuarioViagens'));

    // Validação de Login (RF04)
    if (userDB && userDB.email === email && userDB.senha === senha) {
        localStorage.setItem('isLoggedIn', 'true');
        fecharModal();
        atualizarUI(userDB);
        processarCompraPendente();
    } else {
        alert("E-mail ou senha incorretos!");
    }
}

function fazerLogout() {
    localStorage.setItem('isLoggedIn', 'false');
    atualizarUI(null);
    alert('Você saiu da sua conta na LL Brave Flight. Até logo!');
}

// --- FLUXO DE COMPRA (Casos de Uso) ---

function iniciarCompra(nomePacote, valor) {
    // RF05: Restrição de Compra - Se não estiver logado, abre o modal
    if (!verificarLogin()) {
        pacotePendente = { nomePacote, valor };
        alert("Você precisa fazer login ou se cadastrar para comprar passagens.");
        abrirModal();
    } else {
        // Se já está logado, finaliza direto
        finalizarCompra(nomePacote, valor);
    }
}

function processarCompraPendente() {
    // Se o usuário logou/cadastrou APÓS clicar em comprar, o sistema finaliza a compra automaticamente
    if (pacotePendente) {
        finalizarCompra(pacotePendente.nomePacote, pacotePendente.valor);
        pacotePendente = null;
    }
}

function finalizarCompra(nomePacote, valor) {
    // RF06: Simulação de Compra
    alert(`✈️ COMPRA REALIZADA COM SUCESSO!\n\nPacote: ${nomePacote}\nValor total: R$ ${valor},00\n\nObrigado por viajar com a LL Brave Flight!`);
}