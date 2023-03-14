(function () {
    let listArrey = [];
    let listName = '';
    // создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        // присваиваем внутреннему содержимому innerHTML title
        appTitle.innerHTML = title;
        return appTitle;
    }

    // создаем и возвращаем форму для создания дел
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить новое дело';
        button.disabled = true;

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        input.addEventListener('input', function () {
            if (input.value !== '') {
                button.disabled = false;
            } else {
                button.disabled = true;
            };
        })

        // возвращаем return объект, не сам элеиент, чтоб можно было обращаться к этим кнопкам и вводам
        return {
            form,
            input,
            button,
        };
    }

    // создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(obj) {
        let item = document.createElement('li');
        // кнопки помещаем в элемент, который красиво их объединит
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // устанавливаем стили для элемента списка, а также
        // для размещения кнопок в его правой части с помощью flex

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = obj.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';


        if (obj.done == true) {
            item.classList.add('list-group-item-success');
        }

        // добавдяем обработчики на кнопки
        doneButton.addEventListener('click', function () {
            item.classList.toggle('list-group-item-success');

            for (const listItem of listArrey) {
                if (listItem.id == obj.id) {
                    listItem.done = !listItem.done;
                }
            }
            saveList(listArrey, listName);
        });

        deleteButton.addEventListener('click', function () {
            if (confirm('Вы уверены?')) {
                item.remove();

                for (i = 0; i < listArrey.length; i++) {
                    if (listArrey[i].id == obj.id) {
                        listArrey.splice(i, 1)
                    };
                }
                saveList(listArrey, listName);
            }
        });

        // вкладываем кнопки в отдельные элементы, чтобы они объединились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    function getNewId(arr) {
        let max = 0;
        for (const item of arr) {
            if (item.id > max) {
                max = item.id;
            }
        }
        return max + 1;

    }

    // функция для сохранения дел
    function saveList(arr, keyName) {
        // записываем в localStorage массив как строку для хранения по ключу
        localStorage.setItem(keyName, JSON.stringify(arr));
        // выводимм в консоль массив как строку
        console.log(JSON.stringify(arr));
    };

    function createTodoApp(container, title = 'Список дел', keyName, defArrey = []) {

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        // присваиваем переменной listName наш ключ для глобального доступа
        listName = keyName;
        // помещаем список запланированых дел сразу при загрузке в listArrey
        listArrey = defArrey;

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        //    получаем данные из localStorage
        let localData = localStorage.getItem(listName);
        // проверяем localData на пустоту и переводим данные из строки обратно в массив
        if (localData !== null && localData !== '') {
            listArrey = JSON.parse(localData);
            // console.log(listArrey);
        };
        for (const itemList of listArrey) {
            todoItem = createTodoItem(itemList);
            // создаем и добавляем в список дел новое дело из поля для ввода
            todoList.append(todoItem.item);
        }

        // браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function (e) {
            // эта строчка необходима, чтобы предотвратить стандартное действуие браузера
            // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
            e.preventDefault();


            // игнорируем создание элемента, если пользователь ничего не ввел в поле формы
            if (!todoItemForm.input.value) {
                return;
            }

            // создаем объект со списком дел из input
            let newItem = {
                id: getNewId(listArrey),
                name: todoItemForm.input.value,
                done: false,
            }

            let todoItem = createTodoItem(newItem);

            // Добавляем новую запись(обект) в массив списка дел
            listArrey.push(newItem);
            // console.log(listArrey);

            saveList(listArrey, listName);
            todoList.append(todoItem.item)


            todoItemForm.button.disabled = true;

            // обнуляем занчение в поле, чтобы не пришлось стирать его вручную
            todoItemForm.input.value = '';
        });
    }
    // регистрируем функцию createTodoApp глобально, чтоб получить к ней доступ из других скриптов
    window.createTodoApp = createTodoApp;
})();