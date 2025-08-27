const btn = document.getElementById("btn")
const taskInput = document.getElementById("taskInput") // поле ввода
const taskList = document.getElementById("taskList")  // список задач
const filterAll = document.getElementById("filterAll")
const filterActive = document.getElementById("filterActive")
const filterCompleted = document.getElementById("filterCompleted")

let inputedTask = ""


function renderTaskElement(element) {
  const el = document.createElement('li');
  const innerLi = document.createElement('span');
  const checkbox = document.createElement("input");
  const deleteBtn = document.createElement('button');
  
  deleteBtn.type = "submit";
  deleteBtn.textContent = "Удалить";
  checkbox.type = "checkbox";
  checkbox.checked = element.completed; // 💡 отражает состояние
  innerLi.textContent = element.text;
  innerLi.style.marginRight = "40px";
  innerLi.style.textDecoration = element.completed ? "line-through" : "none";

  el.appendChild(innerLi);
  el.appendChild(deleteBtn);
  el.appendChild(checkbox);
  taskList.append(el);
}



filterAll.addEventListener("click", function(){
  const arr = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.replaceChildren();
  arr.forEach(renderTaskElement);
});

filterActive.addEventListener("click", function(){
  const arr = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.replaceChildren();
  arr.filter(t => !t.completed).forEach(renderTaskElement);
});

filterCompleted.addEventListener("click", function(){
  const arr = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.replaceChildren();
  arr.filter(t => t.completed).forEach(renderTaskElement);
});







function toggleCompleted(text, isCompleted, spanElement) {
  const arr = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = arr.find(item => item.text === text);
  if (task) {
    task.completed = isCompleted;
    localStorage.setItem("tasks", JSON.stringify(arr));
    spanElement.style.textDecoration = isCompleted ? "line-through" : "none";
  }
}

btn.addEventListener("click", function(event){ //кнопка по добавлению задач
    event.preventDefault()
    const trimmed = taskInput.value.trim() // удаляет лишние пробелы
    
    if(trimmed.length == 0){
        throw new Error("Введите задачу")
    } else {
      if (!JSON.parse(localStorage.getItem("tasks") || "[]").find(e => e.text === taskInput.value)) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const newId = tasks.length+1; 
        const newTask = {
        id: newId,
        text: trimmed,
        completed: false
        };
        inputedTask = trimmed
// добавляет полученный input в localStorage

        tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        JSON.parse(localStorage.getItem("tasks"))

        const el = document.createElement('li');
        const checkbox = document.createElement("input");
        const innerLi = document.createElement('span');
        const deleteBtn = document.createElement('button');
        deleteBtn.type = "submit";
        deleteBtn.textContent = "Удалить"
        innerLi.style.marginRight = "40px"

        checkbox.type = "checkbox";
        innerLi.textContent = trimmed

        el.appendChild(innerLi);
        el.appendChild(deleteBtn);
        el.appendChild(checkbox);
        taskList.append(el)
        taskInput.value = ""
      }
      else {
        console.log(JSON.parse(localStorage.getItem("tasks") || "[]").find(e => e.text === taskInput.value))
    }}
})

const data = localStorage.getItem('tasks');
// Проверяем, есть ли данные
if (data) {
  // Преобразуем строку в массив
  const array = JSON.parse(data);
  array.forEach(element => {
    
  const el = document.createElement('li');
  const innerLi = document.createElement('span');
  const checkbox = document.createElement("input");
  const deleteBtn = document.createElement('button');
  deleteBtn.type = "submit";
  deleteBtn.textContent = "Удалить"

if (element.completed) {
  innerLi.style.textDecoration = "line-through";
} else {
  innerLi.style.textDecoration = "none";
}
  checkbox.type = "checkbox";
  innerLi.textContent = element.text
  innerLi.style.marginRight = "40px"
  
  el.appendChild(innerLi)
  el.appendChild(deleteBtn);
  el.appendChild(checkbox);

  taskList.append(el)
  });
} else {
  console.log('Данные отсутствуют в localStorage');
}

taskList.addEventListener("click", function (e) {
  const li = e.target.closest("li"); // находим <li>, к которому относится клик
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const span = li?.querySelector("span");
  const text = span?.textContent;

  // Найдём задачу по тексту
  const task = tasks.find(t => t.text === text);

  if (!task) return;

  // ✅ Клик по кнопке "Удалить"
  if (e.target.tagName === "BUTTON") {
    li.remove();
    const index = tasks.findIndex(t => t.text === text);
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // ✅ Клик по <span> — редактирование (по одному клику)
  else if (e.target.tagName === "SPAN") {
    const input = document.createElement("input");
    input.value = task.text;
    input.type = "text";
    input.size = task.text.length + 2;
    li.replaceChild(input, span); // заменили span на input

    // Когда пользователь нажмёт Enter — сохранить текст
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        const newText = input.value.trim();

        if (newText.length === 0) return;

        task.text = newText;
        localStorage.setItem("tasks", JSON.stringify(tasks));

        span.textContent = newText;
        li.replaceChild(span, input); // вернули span обратно
      }
    });

    // Или когда input теряет фокус — тоже сохранить
    input.addEventListener("blur", function () {
      span.textContent = input.value.trim() || task.text;
      task.text = span.textContent;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      li.replaceChild(span, input);
    });

    input.focus(); // сразу фокус на input
  }
});







taskList.addEventListener("change", function (e) {
 if (e.target.matches('input[type="checkbox"]')) {
  const li = e.target.closest("li");
  const textSpan = li.querySelector("span").textContent;
  toggleCompleted(textSpan, e.target.checked, li.querySelector("span"));
}});










function renderTasks(filter = "all") {
  // 1. Получить массив задач из localStorage
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // 2. Очистить список задач на странице
  taskList.replaceChildren();

  // 3. Отфильтровать задачи в зависимости от параметра filter
  let filteredTasks;
if (filter === "all") {
  filteredTasks = tasks;
} else if (filter === "completed") {
  filteredTasks = tasks.filter(task => task.completed === true);
} else if (filter === "active") {
  filteredTasks = tasks.filter(task => task.completed === false);
}


  // 4. Для каждой задачи из filteredTasks создать элемент списка и добавить на страницу
  filteredTasks.forEach(element => {
    const el = document.createElement('li');
    const innerLi = document.createElement('span');
    const checkbox = document.createElement("input");
    const deleteBtn = document.createElement('button');
    
    deleteBtn.type = "submit";
    deleteBtn.textContent = "Удалить";
    checkbox.type = "checkbox";
    checkbox.checked = element.completed; // 💡 отражает состояние
    innerLi.textContent = element.text;
    innerLi.style.marginRight = "40px";
    innerLi.style.textDecoration = element.completed ? "line-through" : "none";

    el.appendChild(innerLi);
    el.appendChild(deleteBtn);
    el.appendChild(checkbox);
    taskList.append(el);
  });
}


taskList.addEventListener("dblclick", function (e) {
  if (e.target.tagName === "SPAN") {
    const span = e.target;
    const oldText = span.textContent;

    const input = document.createElement("input");
    input.type = "text";
    input.value = oldText;
    input.style.marginRight = "40px";
    input.style.width = "60%";

    span.replaceWith(input);
    input.focus();

    // Функция сохранения
    function saveEdit() {
      const newText = input.value.trim();
      if (newText === "") {
        input.replaceWith(span); // Отмена, если пусто
        return;
      }

      // Обновляем localStorage
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const task = tasks.find(t => t.text === oldText);
      if (task) {
        task.text = newText;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks(); // Перерисовка
      }
    }

    input.addEventListener("blur", saveEdit); // Потеря фокуса
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") saveEdit();
    });
  }
});







