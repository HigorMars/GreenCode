function validarSenha(senha) {
  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(senha);
}

function limparErros() {
  document.querySelectorAll('.error-msg').forEach(el => el.innerText = '');
  document.querySelectorAll('input').forEach(input => input.classList.remove('input-error'));
}

function verificarLogin() {
  limparErros();
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  let temErro = false;
  if (!username) {
    usernameInput.classList.add('input-error');
    document.getElementById('login-user-error').innerText = 'Digite o usuário.';
    temErro = true;
  }
  if (!password) {
    passwordInput.classList.add('input-error');
    document.getElementById('login-pass-error').innerText = 'Digite a senha.';
    temErro = true;
  }
  if (temErro) return;

  fetch('usuarios.json')
    .then(response => response.json())
    .then(data => {
      let usuarioValido = data.find(user => user.username === username && user.password === password);

      if (!usuarioValido) {
        const usuariosLS = JSON.parse(localStorage.getItem('TP1-2026')) || [];
        usuarioValido = usuariosLS.find(user => user.username === username && user.password === password);
      }

      if (usuarioValido) {
        localStorage.setItem('usuario', username);
        window.location.href = 'catalogo.html';
      } else {
        passwordInput.classList.add('input-error');
        document.getElementById('login-pass-error').innerText = 'Usuário ou senha incorretos!';
      }
    })
    .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));
}

function cadastrarUsuario() {
  limparErros();
  const newUsernameInput = document.getElementById('new-username');
  const newPasswordInput = document.getElementById('new-password');
  const newUsername = newUsernameInput.value.trim();
  const newPassword = newPasswordInput.value.trim();

  let temErro = false;

  if (!newUsername) {
    newUsernameInput.classList.add('input-error');
    document.getElementById('reg-user-error').innerText = 'Preencha o nome de usuário.';
    temErro = true;
  }

  if (!validarSenha(newPassword)) {
    newPasswordInput.classList.add('input-error');
    document.getElementById('reg-pass-error').innerText = 'A senha deve ter no mínimo 8 caracteres, 1 letra maiúscula e 1 número.';
    temErro = true;
  }

  if (temErro) return;

  fetch('usuarios.json')
    .then(response => response.json())
    .then(data => {
      const usuariosLS = JSON.parse(localStorage.getItem('TP1-2026')) || [];
      const existeNoJson = data.some(u => u.username === newUsername);
      const existeNoLS = usuariosLS.some(u => u.username === newUsername);

      if (existeNoJson || existeNoLS) {
        newUsernameInput.classList.add('input-error');
        document.getElementById('reg-user-error').innerText = 'Nome de usuário já existe!';
      } else {
        usuariosLS.push({ username: newUsername, password: newPassword });
        localStorage.setItem('TP1-2026', JSON.stringify(usuariosLS));

        alert('Usuário cadastrado com sucesso! Redirecionando...');
        window.location.href = 'index.html';
      }
    })
    .catch(error => console.error('Erro ao verificar usuários:', error));
}