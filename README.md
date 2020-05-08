Mapeamento das funcionalidades que serão necessárias na aplicação.

Isso serve para poder guiar o desenvolvimento.

# Recuperação de senha

**RF (Requisitos Funcionais)**

- O usuário deve poder recuperar sua senha informando seu e-mail.
- O usuário deve receber um e-mail com instruções de recuperação de senha.
- O usuário deve poder resetar sua senha.

**RNF (Requisitos Não Funcionais)**

- Utilizar Mailtrap para testar envios de e-mail em ambiente de desenvolvimento.
- Utilizar Amazon SES para envios em produção.
- O envio de e-mails deve acontecer em segundo plano (background job - fila).

**RN (Requisitos de Negócios)**

- O link enviado por email para resetar a senha, deve expirar em 2h.
- O usuário precisa confirmar a nova senha ao resetar sua senha.

# Atualização do perfil

**RF (Requisitos Funcionais)**

- O usuário deve poder atualizar seu nome, email e senha.

**RN (Requisitos de Negócios)**

- O usuário não pode alterar seu e-mail para um e-mail já utilizado.
- Para atualizar sua senha, o usuário deve informar a senha antiga.
- Para atualizar sua senha, o usuário precisa confirmar sua nova senha.

# Painel do prestador

**RF (Requisitos Funcionais)**

- O usuário deve poder listar seus agendamentos de um dia especifico.
- O usuário deve poder receber uma notificação sempre que houver um novo agendamento.
- O usuário deve poder visualizar as notificações não lidas.

**RNF (Requisitos Não Funcionais)**

- O agendamentos do prestador no dia devem ser armazenados em cache.
- As notificações do prestador devem ser armazenadas no MongoDB.
- As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io.

**RN (Requisitos de Negócios)**

- A notificação deve ter um status de lida ou não-lida para que o prestador possa controlar.

# Agendamento de serviços

**RF (Requisitos Funcionais)**

- O usuário deve poder listar todos os prestadores de serviços cadastrados.
- O usuário deve poder listar os dias de um mês com pelo menos um horários disponível de um prestador.
- O usuário deve poder listar os horários disponíveis em um dia de um prestador.
- O usuário deve poder realizar um novo agendamento com um prestador.

**RNF (Requisitos Não Funcionais)**

- A listagem de prestadores deve ser armazenada em cache.

**RN (Requisitos de Negócios)**

- Cada agendamento deve durar 1h exatamente.
- Os agendamentos dem estar disponíveis entre 8h às 18h (Primeiro ás 8h, ultimo às 17h).
- O usuário não pode agendar em um horário já ocupado.
- O usuário não pode agendar em um horário que já passou.
- O usuário não pode agendar serviços consigo mesmo.
