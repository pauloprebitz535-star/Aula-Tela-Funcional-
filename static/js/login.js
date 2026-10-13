document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formLogin');
    const mensagemEl = document.getElementById('mensagem');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const btnVerSenha = document.getElementById('btnVerSenha');
    const btnEntrar = document.getElementById('btnEntrar');

    // Só aceita e-mails no formato usuario@gmail.com
    const EMAIL_REGEX = /^[^\s@]+@gmail\.com$/i;

    // Mínimo 6 caracteres, com 1 minúscula, 1 maiúscula, 1 número e 1 caractere especial
    const SENHA_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

    let mensagemTimeout = null;
    let enviando = false;

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
        return EMAIL_REGEX.test(email);
    }

    function validarSenha(senha) {
        return SENHA_REGEX.test(senha);
    }

    function validarFormulario(dados) {
        if (!dados.email) {
            return 'Preencha o e-mail.';
        }
        if (!validarEmail(dados.email)) {
            return 'E-mail inválido. Utilize um endereço Gmail, por exemplo: exemplo@gmail.com';
        }
        if (!dados.senha) {
            return 'Preencha a senha.';
        }
        if (!validarSenha(dados.senha)) {
            return 'Senha deve ter no mínimo 6 caracteres, com letra maiúscula, minúscula, número e caractere especial.';
        }
        return null;
    }

    btnVerSenha.addEventListener('click', () => {
        const visivel = senhaInput.type === 'text';
        senhaInput.type = visivel ? 'password' : 'text';
        btnVerSenha.setAttribute('aria-label', visivel ? 'Mostrar senha' : 'Esconder senha');
        btnVerSenha.textContent = visivel ? '👁' : '🙈';
    });

    async function realizarLogin(dados) {
        try {
            const resposta = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            const resultado = await resposta.json();

            if (!resposta.ok || !resultado.success) {
                mostrarMensagem(resultado.message || 'Não foi possível entrar.', 'erro');
                return;
            }

            mostrarMensagem(resultado.message, 'sucesso');
            window.location.href = '/cadastro';

        } catch (erro) {
            mostrarMensagem('Erro ao conectar ao servidor.', 'erro');
        }
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (enviando) {
            return;
        }

        const dados = {
            email: emailInput.value.trim(),
            senha: senhaInput.value
        };

        const erro = validarFormulario(dados);

        if (erro) {
            mostrarMensagem(erro, 'erro');
            return;
        }

        enviando = true;
        btnEntrar.disabled = true;
        btnEntrar.textContent = 'ENTRANDO...';

        realizarLogin(dados).finally(() => {
            enviando = false;
            btnEntrar.disabled = false;
            btnEntrar.textContent = 'ENTRAR';
        });
    });
});
