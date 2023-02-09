/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    let currentUser = User.current();
    const selectItem = this.element.querySelector( '.accounts-select' );
    if (currentUser) {
      Account.list(currentUser, (err, response) => {
        if (response.success) {
          while (selectItem.options.length > 0) {
            selectItem.remove(0);
          }
          Array.from(response.data, el => {
            let optionHtml = `<option value="${el.id}">${el.name}</option>`;
            selectItem.insertAdjacentHTML('beforeend', optionHtml);
          })
        }
      })
    }
  }


  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response.success) {
        App.update();
        this.element.reset();
        if (this.element.id === 'new-income-form') {
          App.getModal('newIncome').close();
        } else if (this.element.id === 'new-expense-form') {
          App.getModal('newExpense').close();
        }
      } else if (err) {
        console.error('Элемент не найден')
      }
    })
  }
}
