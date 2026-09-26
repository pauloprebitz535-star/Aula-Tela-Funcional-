document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCliente');
    const mensagemEl = document.getElementById('mensagem');
    const listaClientes = document.getElementById('listaClientes');

    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const cidadeInput = document.getElementById('cidade');

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let mensagemTimeout = null;

    function mostrarMensagem(texto, tipo) {
        mensagemEl.textContent = texto;
        mensagemEl.className = 'mensagem ' + tipo;

        if (mensagemTimeout) {
            clearTimeout(mensagemTimeout);
        }

        mensagemTimeout = setTimeout(() => {
            mensagemEl.textContent = '';
            mensagemEl.className = 'mensagem';
        }, 4000);
    }

    function validarFormulario(dados) {
        if (!dados.nome) return 'Preencha o nome.';
        if (!dados.email) return 'Preencha o e-mail.';
        if (!EMAIL_REGEX.test(dados.email)) return 'Informe um e-mail válido.';
        if (!dados.telefone) return 'Preencha o telefone.';
        if (!dados.cidade) return 'Preencha a cidade.';
        return null;
    }

    function criarLinhaCliente(cliente) {
        const tr = document.createElement('tr');
        const campos = ['nome', 'email', 'telefone', 'cidade'];

        campos.forEach((campo) => {
            const td = document.createElement('td');
            td.textContent = cliente[campo];
            tr.appendChild(td);
        });

        listaClientes.appendChild(tr);
    }

    async function carregarClientes() {
        try {
            const resposta = await fetch('/api/clientes');

            if (!resposta.ok) {
                throw new Error('Erro ao buscar clientes');
            }

            const clientes = await resposta.json();

            listaClientes.innerHTML = '';
            clientes.forEach(criarLinhaCliente);

        } catch (erro) {
            mostrarMensagem('Não foi possível carregar os clientes.', 'erro');
        }
    }

    async function cadastrarCliente(dados) {
        try {
            const resposta = await fetch('/api/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            const resultado = await resposta.json();

            if (!resposta.ok || !resultado.success) {
                mostrarMensagem(resultado.message || 'Erro ao cadastrar cliente.', 'erro');
                return;
            }

            criarLinhaCliente(resultado.cliente);
            mostrarMensagem(resultado.message, 'sucesso');
            form.reset();
            nomeInput.focus();

        } catch (erro) {
            mostrarMensagem('Erro ao conectar ao servidor.', 'erro');
        }
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const dados = {
            nome: nomeInput.value.trim(),
            email: emailInput.value.trim(),
            telefone: telefoneInput.value.trim(),
            cidade: cidadeInput.value.trim()
        };

        const erro = validarFormulario(dados);

        if (erro) {
            mostrarMensagem(erro, 'erro');
            return;
        }

        cadastrarCliente(dados);
    });

    carregarClientes();
});