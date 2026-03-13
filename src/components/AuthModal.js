import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from '../services/firebase.js';

export class AuthModal {
  constructor(container, onAuthSuccess) {
    this.container = container;
    this.onAuthSuccess = onAuthSuccess;
    this.mode = 'login'; // 'login' | 'register' | 'verify'
    
    // Create DOM elements
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay auth-overlay';
    this.overlay.style.display = 'none';
    this.overlay.innerHTML = this.getTemplate();
    
    this.container.appendChild(this.overlay);
    this.bindEvents();
  }

  getTemplate() {
    return `
      <div class="modal auth-modal">
        <div class="modal-header">
          <h3 id="auth-title">Acesso Restrito</h3>
        </div>
        <div class="modal-body">
          <div id="auth-error" class="auth-error" style="display: none;"></div>
          <div id="auth-success" class="auth-success" style="display: none;"></div>

          <form id="auth-form">
            <div class="tabs auth-tabs" id="auth-tabs">
              <div class="tab active" data-mode="login">Entrar</div>
              <div class="tab" data-mode="register">Criar Conta</div>
            </div>

            <div class="form-group" id="group-email">
              <label for="auth-email">E-mail</label>
              <input type="email" id="auth-email" class="input" placeholder="seu@email.com" required />
            </div>

            <div class="form-group" id="group-password">
              <label for="auth-password">Senha</label>
              <input type="password" id="auth-password" class="input" placeholder="••••••••" required />
            </div>

            <button type="submit" class="btn btn-gradient btn-lg w-100" id="btn-auth-submit">Entrar</button>
          </form>
          
          <div id="verify-block" style="display: none; text-align: center;">
             <p class="help-text">Um link foi enviado para o seu e-mail. Por favor, verifique sua caixa de entrada (e spam) e clique no link para ativar sua conta.</p>
             <button class="btn btn-secondary w-100 mt-3" id="btn-auth-resend">Reenviar E-mail</button>
             <button class="btn btn-ghost w-100 mt-2" id="btn-auth-back-login">Voltar ao Login</button>
          </div>
        </div>
      </div>
    `;
  }

  setMode(mode) {
    this.mode = mode;
    const form = this.overlay.querySelector('#auth-form');
    const verifyBlock = this.overlay.querySelector('#verify-block');
    const title = this.overlay.querySelector('#auth-title');
    const submitBtn = this.overlay.querySelector('#btn-auth-submit');
    const tabs = this.overlay.querySelectorAll('.auth-tabs .tab');
    
    this.clearMessages();

    if (mode === 'verify') {
      form.style.display = 'none';
      verifyBlock.style.display = 'block';
      title.textContent = 'Verifique seu E-mail';
      return;
    }

    form.style.display = 'block';
    verifyBlock.style.display = 'none';

    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.mode === mode);
    });

    if (mode === 'login') {
      title.textContent = 'Acesso ARCHON';
      submitBtn.textContent = 'Entrar';
    } else if (mode === 'register') {
      title.textContent = 'Criar Conta ARCHON';
      submitBtn.textContent = 'Criar Conta';
    }
  }

  showError(msg) {
    const el = this.overlay.querySelector('#auth-error');
    el.textContent = msg;
    el.style.display = 'block';
    this.overlay.querySelector('#auth-success').style.display = 'none';
  }

  showSuccess(msg) {
    const el = this.overlay.querySelector('#auth-success');
    el.textContent = msg;
    el.style.display = 'block';
    this.overlay.querySelector('#auth-error').style.display = 'none';
  }

  clearMessages() {
    this.overlay.querySelector('#auth-error').style.display = 'none';
    this.overlay.querySelector('#auth-success').style.display = 'none';
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.clearMessages();
    
    const email = this.overlay.querySelector('#auth-email').value.trim();
    const password = this.overlay.querySelector('#auth-password').value;
    const submitBtn = this.overlay.querySelector('#btn-auth-submit');
    
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Aguarde...';
    submitBtn.disabled = true;

    try {
      if (this.mode === 'login') {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        if (!userCred.user.emailVerified) {
          this.setMode('verify');
        } else {
          this.hide();
          if (this.onAuthSuccess) this.onAuthSuccess(userCred.user);
        }
      } else if (this.mode === 'register') {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCred.user);
        this.setMode('verify');
      }
    } catch (error) {
      console.error(error);
      this.showError(this.translateError(error.code));
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  translateError(code) {
    switch (code) {
      case 'auth/invalid-email': return 'E-mail inválido.';
      case 'auth/user-disabled': return 'Este usuário foi desativado.';
      case 'auth/user-not-found': return 'Usuário não encontrado. Crie uma conta.';
      case 'auth/wrong-password': return 'Senha incorreta.';
      case 'auth/email-already-in-use': return 'Este e-mail já está em uso.';
      case 'auth/weak-password': return 'A senha deve ter pelo menos 6 caracteres.';
      case 'auth/invalid-credential': return 'Credenciais inválidas. Verifique seu e-mail e senha.';
      default: return 'Ocorreu um erro na autenticação.';
    }
  }

  bindEvents() {
    const form = this.overlay.querySelector('#auth-form');
    form.addEventListener('submit', (e) => this.handleSubmit(e));

    const tabs = this.overlay.querySelectorAll('.auth-tabs .tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.setMode(tab.dataset.mode);
      });
    });

    const btnResend = this.overlay.querySelector('#btn-auth-resend');
    btnResend.addEventListener('click', async () => {
       if (auth.currentUser) {
         try {
           btnResend.disabled = true;
           btnResend.textContent = 'Enviando...';
           await sendEmailVerification(auth.currentUser);
           this.showSuccess('E-mail reenviado com sucesso!');
         } catch (e) {
           this.showError('Aguarde um momento antes de reenviar.');
         } finally {
           btnResend.textContent = 'Reenviar E-mail';
           btnResend.disabled = false;
         }
       }
    });

    const btnBack = this.overlay.querySelector('#btn-auth-back-login');
    btnBack.addEventListener('click', () => {
      this.overlay.querySelector('#auth-password').value = '';
      this.setMode('login');
      // If user is not verified, signing out prevents automatic login attempts
      if (auth.currentUser && !auth.currentUser.emailVerified) {
          auth.signOut();
      }
    });
  }

  show() {
    this.overlay.style.display = 'flex';
  }

  hide() {
    this.overlay.style.display = 'none';
  }
}
