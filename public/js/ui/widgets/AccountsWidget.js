/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if ( element ) {
      this.element = element;
      this.registerEvents();
      this.update();
    } else {
      throw new Error( 'Элемент не найден!' )
    }
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.querySelector( '.create-account' ).onclick = () => {
      App.getModal( 'createAccount' ).open();
    }
    this.element.onclick = e => {
      // console.log(e.target.closest('.account'));
      this.onSelectAccount(e.target.closest('.account'))
    };
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    let currentUser = User.current();
    if (currentUser) {
      Account.list(currentUser, (err, response) => {
        if (response.success) {
          this.clear();
          // console.log(response);
          Array.from(response.data, item => this.renderItem(item))
        }
        if (err) {
          console.error(err);
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    Array.from(this.element.querySelectorAll( '.account' ), item => {
      item.remove();
    })
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    Array.from(this.element.querySelectorAll( '.account' ), item => {
      item.classList.remove( 'active' );
    });

    element.classList.add('active');
    // console.log(element);
    App.showPage( 'transactions', { account_id: element.dataset.id })
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML( item ){
    let newAccountHtml = `
    <li class="active account" data-id=${ item.id }>
      <a href="#">
        <span>${ item.name }</span> /
        <span>${ item.sum } ₽</span>
      </a>
    </li>
    `;
    return newAccountHtml;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem( data ){
    const sidebarAccounts = document.querySelector('.accounts-panel');
    sidebarAccounts.insertAdjacentHTML('beforeend', this.getAccountHTML(data));
  }
}
