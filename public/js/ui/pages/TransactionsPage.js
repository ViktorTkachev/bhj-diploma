/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */


  constructor( element ) {
    if ( element ) {
      this.element = element;
      this.registerEvents();
    } else {
      throw new Error( 'Элемент не найден!' );
    }
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.onclick = (e) => {
      if (e.target.closest('.remove-account')) {
        this.removeAccount();
      } else if (e.target.closest('.transaction__remove')) {
        this.removeTransaction(e.target.closest('.transaction__remove').dataset.id);
      }
    }
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      if (confirm('Вы точно хотите удалить этот счет?')) {
        let formData = new FormData();
        formData.append('id', this.lastOptions.account_id);
        Account.remove(formData, (err, response) => {
          if (response.success) {
            this.clear();
            App.updateWidgets();
            App.updateForms();
          } else if (err) {
            console.error('Ошибка удаления счета');
          }
        });
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if (confirm('Вы точно хотите удалить эту транзакцию?')) {
      let formData = new FormData();
      formData.append('id', id);
      Transaction.remove(formData, (error, response) => {
          if (response.success) {
            App.update();
          };
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render( options ) {
    if ( options ) {
      console.log(options);
      this.lastOptions = options;
      Account.get(options.account_id, (err, response) => {
        if (response.success) {
          console.log(response);
          this.renderTitle(response.data.name);
        } else if (err) {
          console.error('Error 11');
        }
      });
      Transaction.list(options, (err, response) => {
        if (response.success) {
          this.renderTransactions(response.data)
        } else if (err) {
          console.error('Error 12');
        }
      })
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const accountTitle = this.element.querySelector('.content-title');
    accountTitle.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const getDate = new Date().toLocaleString('ru', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
    return getDate;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const addTransactionHtml = `
    <div class="transaction transaction_${item.type} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <!-- дата -->
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
      <!--  сумма -->
          ${item.sum} <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
      <!-- в data-id нужно поместить id -->
      <button class="btn btn-danger transaction__remove" data-id="${item.id}">
        <i class="fa fa-trash"></i>
      </button>
    </div>
    </div>
    `
    return addTransactionHtml;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const contentTransactions = this.element.querySelector('.content');
    // console.log(contentTransactions);
    // Array.from(data, item => {
    //   let currentTransaction = this.getTransactionHTML(item);
    //   contentTransactions.insertAdjacentHTML('beforeend', currentTransaction);
    // })
    // for (let i = 0; i < data.length; i++) {
    //   let currentTransaction = this.getTransactionHTML(data[i]);
    //   contentTransactions.insertAdjacentHTML('beforeend', currentTransaction);
    // }
    let currentTransaction = this.getTransactionHTML(data);
    contentTransactions.insertAdjacentHTML('beforeend', currentTransaction);
  }
}
