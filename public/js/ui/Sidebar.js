/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');

    sidebarToggle.onclick = () => {
      document.body.classList.toggle('sidebar-open');
      document.body.classList.toggle('sidebar-collapse');
    }
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const login = document.querySelector(".menu-item_login");
    const register = document.querySelector(".menu-item_register");
    const logout = document.querySelector(".menu-item_logout");

    login.onclick = () => {
      App.getModal('login').open();
    }

    register.onclick = () => {
      App.getModal('register').open();
    }

    logout.onclick = () => {
      User.logout((err, response) => {
        if ( response.success ) {
          App.setState('init');
        }
      })
    }
  }
}
