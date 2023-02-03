/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if ( element ) {
      this.element = element;
      this.registerEvents();
    } else {
      throw new Error( 'Пустой элемент!' );
    }
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const incomeBtn = this.element.querySelector('.create-income-button');
    const expenseBtn = this.element.querySelector('.create-expense-button');

    incomeBtn.onclick = () => {
      App.getModal('newIncome').open();
    }

    expenseBtn.onclick = () => {
      App.getModal('newExpense').open();
    }
  }
}
