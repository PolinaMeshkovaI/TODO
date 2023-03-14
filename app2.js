todo-app.js
(function() {

    let listArray = [],
        listName = '';

    function createAppTitle(title) {
        let appTitle = document.createElement("h2");
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement("form");
        let input = document.createElement("input");
        let buttonWrapper = document.createElement("div");
        let button = document.createElement("button");

        form.classList.add("input-group", "mb-3");
        input.classList.add("form-control");
        input.placeholder = "Введите название нового дела";
        buttonWrapper.classList.add("input-group-append");
        button.classList.add("btn", "btn-primary");
        button.textContent = "Добавить дело";
        button.disabled = true;

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        input.addEventListener("input", function() {
            button.disabled = false;
            if (input.value.length == 0) {
                button.disabled = true;
            }
        });

        return {
            form,
            input,
            button
        };
    }

    function createTodoList() {
        let list = document.createElement("ul");
        list.classList.add("list-group");
        return list;
    }

    function createTodoItem(obj) {
        let item = document.createElement("li");
        let buttonGroup = document.createElement("div");
        let doneButton = document.createElement("button");
        let deleteButton = document.createElement("button");


        item.classList.add(
            "list-group-item",
            "d-flex",
            "justify-content-between",
            "align-items-ceter"
        );
        item.textContent = obj.name;

        buttonGroup.classList.add("btn-group", "btn-group-sm");
        doneButton.classList.add("btn", "btn-success");
        doneButton.textContent = "Готово";
        deleteButton.classList.add("btn", "btn-danger");
        deleteButton.textContent = "Удалить";

        if (obj.done == true) {
            item.classList.add('list-group-item-success')
        }

        doneButton.addEventListener("click", function() {
            item.classList.toggle("list-group-item-success");

            obj.done = !obj.done;

            saveList(listArray, listName)
        });

        deleteButton.addEventListener("click", function() {
            if (confirm('Вы уверяны?')) {
                item.remove();

                for (let i = 0; i < listArray.length; i++) {
                    if (listArray[i].id == obj.id) {
                        listArray.splice(i, 1)
                    }
                }
                saveList(listArray, listName)
            }
        });

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

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
                max = item.id
            }
        }
        return max + 1
    }

    function saveList(arr, keyName) {
        localStorage.setItem(keyName, JSON.stringify(arr))
    }

    function createTodoApp(container, title = "Список дел", keyName, defArray = []) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        listName = keyName;
        listArray = defArray;


        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        let localData = localStorage.getItem(listName);
        if (localData !== null && localData !== '') listArray = JSON.parse(localData)
        for (const itemList of listArray) {
            todoItem = createTodoItem(itemList)
            todoList.append(todoItem.item)
        }


        todoItemForm.form.addEventListener("submit", function(e) {
            e.preventDefault();

            if (!todoItemForm.input.value) {
                return;
            }

            let newItem = {
                id: getNewId(listArray),
                name: todoItemForm.input.value,
                done: false
            }

            let todoItem = createTodoItem(newItem);

            listArray.push(newItem);
            saveList(listArray, listName)
            todoList.append(todoItem.item)
            todoItemForm.button.disabled = true;
            todoItemForm.input.value = '';

        });
    }

    window.createTodoApp = createTodoApp;
})();
