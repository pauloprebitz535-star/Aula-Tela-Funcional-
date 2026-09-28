document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCliente');
    const mensagemEl = document.getElementById('mensagem');
    const listaClientes = document.getElementById('listaClientes');

    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const cidadeInput = document.getElementById('cidade');

    // Só aceita e-mails no formato usuario@gmail.com
    const GMAIL_REGEX = /^[^\s@]+@gmail\.com$/i;

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

    function validarEmail(email) {
        return GMAIL_REGEX.test(email);
    }

    // Retorna null se o telefone for válido, ou a mensagem de erro específica
    // (recebe o telefone já sem máscara, só com dígitos)
    function validarTelefone(telefone) {
        if (/[^0-9]/.test(telefone)) {
            return 'Telefone deve conter apenas números.';
        }
        if (telefone.length < 11) {
            return 'Telefone inválido. Digite o DDD + número com 11 dígitos.';
        }
        if (telefone.length > 11) {
            return 'Telefone inválido. Digite somente 11 números.';
        }
        return null;
    }

    function validarFormulario(dados) {
        if (!dados.nome) {
            return 'Preencha o nome.';
        }
        if (!dados.email) {
            return 'Preencha o e-mail.';
        }
        if (!validarEmail(dados.email)) {
            return 'E-mail inválido. Utilize um endereço Gmail, por exemplo: exemplo@gmail.com';
        }
        if (!dados.telefone) {
            return 'Preencha o telefone.';
        }
        const erroTelefone = validarTelefone(dados.telefone);
        if (erroTelefone) {
            return erroTelefone;
        }
        if (!dados.cidade) {
            return 'Preencha a cidade.';
        }
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
            atualizarBloqueios();
            nomeInput.focus();

        } catch (erro) {
            mostrarMensagem('Erro ao conectar ao servidor.', 'erro');
        }
    }

    // Aplica a máscara (00) 00000-0000 enquanto o usuário digita no telefone
    function aplicarMascaraTelefone() {
        const digitos = telefoneInput.value.replace(/\D/g, '').slice(0, 11);
        let formatado = '';

        if (digitos.length > 0) {
            formatado = '(' + digitos.substring(0, 2);
        }
        if (digitos.length >= 3) {
            formatado += ') ' + digitos.substring(2, 7);
        }
        if (digitos.length >= 8) {
            formatado += '-' + digitos.substring(7, 11);
        }

        telefoneInput.value = formatado;
    }

    // Libera cada campo só depois que o anterior foi preenchido corretamente:
    // Nome preenchido -> libera E-mail
    // E-mail válido   -> libera Telefone
    // Telefone completo (11 dígitos) -> libera Cidade
    function atualizarBloqueios() {
        const nomePreenchido = nomeInput.value.trim().length > 0;
        const emailValidoAtual = validarEmail(emailInput.value.trim());
        const telefoneCompleto = telefoneInput.value.replace(/\D/g, '').length === 11;

        emailInput.disabled = !nomePreenchido;
        telefoneInput.disabled = !(nomePreenchido && emailValidoAtual);
        cidadeInput.disabled = !(nomePreenchido && emailValidoAtual && telefoneCompleto);
    }

    nomeInput.addEventListener('input', atualizarBloqueios);
    emailInput.addEventListener('input', atualizarBloqueios);

    telefoneInput.addEventListener('input', () => {
        aplicarMascaraTelefone();
        atualizarBloqueios();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const dados = {
            nome: nomeInput.value.trim(),
            email: emailInput.value.trim(),
            telefone: telefoneInput.value.replace(/\D/g, ''),
            cidade: cidadeInput.value.trim()
        };

        const erro = validarFormulario(dados);

        if (erro) {
            mostrarMensagem(erro, 'erro');
            return;
        }

        cadastrarCliente(dados);
    });

    atualizarBloqueios();
    carregarClientes();
});