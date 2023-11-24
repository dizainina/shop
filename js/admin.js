let request;
var existingGoods = [];
if(window.XMLHttpRequest) {
    request = new XMLHttpRequest();
} else {
    request = new ActiveXObject("Microsoft.XMLHTTP");
}
request.open("GET", "goods.json");
request.responseType = "json";
request.onreadystatechange = function() {
    if(request.readyState == 4 && request.status == 200) {
        existingGoods = request.response;
        console.log(existingGoods);
    }
}
request.send();



// -------------открытие формы ДОБАВЛЕНИЯ товара---------------------------------------------
let FormAddGood = document.querySelector('.add-form'); // Фон попап окна
let openFormAddGood = document.querySelectorAll('.open-form'); // Кнопки для показа окна
let closeFormAddGood = document.querySelectorAll('.close-form'); // Кнопки для показа окна


openFormAddGood.forEach((button) => { // Перебираем все кнопки
  button.addEventListener('click', (e) => { // Для каждой вешаем обработчик событий на клик
      e.preventDefault(); // Предотвращаем дефолтное поведение браузера
      FormAddGood.classList.add('active'); // Добавляем класс 'active' для фона
  })
});

closeFormAddGood.forEach((button) => { // Перебираем все кнопки
  button.addEventListener('click', (e) => { // Для каждой вешаем обработчик событий на клик
      e.preventDefault(); // Предотвращаем дефолтное поведение браузера
      FormAddGood.classList.remove('active'); // Добавляем класс 'active' для фона
      FormAddGood.classList.add('disp_none'); // Добавляем класс 'active' для фона
  })
});



document
  .querySelector("#add-product-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Получение значений полей формы
    let image = document.querySelector("#image-path");
    const selectedFile = image.files[0];
    const imagePath = selectedFile.name;
    let name = document.querySelector("#name").value;
    let description = document.querySelector("#description").value;
    let price = +document.querySelector("#price").value;
    let category = document.querySelector("#category").value;

    // Генерация уникального идентификатора для нового товара
    const id = existingGoods.length + 1;


    // Создание нового товара (объект класса Good)
    const good = { id, category, imagePath, name, description, price };

    // Добавление нового товара
    existingGoods.push(good);
    console.log(existingGoods);


    // Очистка полей формы
    document.querySelector("#image-path").value = "";
    document.querySelector("#name").value = "";
    document.querySelector("#description").value = "";
    document.querySelector("#price").value = "";
    document.querySelector("#category").value;
  });

function saveToJson() {
  const jsonData = JSON.stringify(existingGoods);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "goods.json";
  link.click();
}  


// -------------открытие ТАБЛИЦЫ каталога--------------------------------------------------
let TableManageGood = document.querySelector('.manage-form'); // Само окно
let openTableManageGood = document.querySelectorAll('.open-catalog'); // Кнопки для показа окна
let closeTableManageGood = document.querySelectorAll('.close-catalog'); // Кнопка для скрытия окна



openTableManageGood.forEach((button) => { // Перебираем все кнопки
  button.addEventListener('click', (e) => { // Для каждой вешаем обработчик событий на клик
      e.preventDefault(); // Предотвращаем дефолтное поведение браузера
      TableManageGood.classList.add('active'); // Добавляем класс 'active' для фона
      // popup.classList.add('active'); // И для самого окна
      renderGoods();
  })
});

closeTableManageGood.forEach((button) => { // Перебираем все кнопки
  button.addEventListener('click', (e) => { // Для каждой вешаем обработчик событий на клик
      e.preventDefault(); // Предотвращаем дефолтное поведение браузера
      TableManageGood.classList.remove('active'); // Добавляем класс 'active' для фона
      // popup.classList.add('active'); // И для самого окна
      TableManageGood.classList.add('disp_none'); // Добавляем класс 'active' для фона
  })
});


//------------------------------рендер каталога из json-файла---------------------------------------
function renderGoods() {
  const goodsItemsElement = document.querySelector("#good-item");
  goodsItemsElement.innerHTML = "";
  //метод forEach не закончит работу, пока есть элементы в массиве.
  //.Для каждого элемента массива(item) создается tr, строка таблицы. Создается ячейка для каждого из значений элемента массива(название, цена, количество)
  existingGoods.forEach((item) => {
    const tr = document.createElement("tr");
    const tdId = document.createElement("td");
    const tdImage = document.createElement("td");
    const tdName = document.createElement("td");
    const tdPrice = document.createElement("td");
    const tdDescription = document.createElement("td");
    const tdButtons = document.createElement("td");

    //кнопки для изменения карточки товара или удаление товара из каталога
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    editButton.textContent = "Изменить";
    deleteButton.textContent = "Удалить";
    editButton.addEventListener("click", () => editGood(item));
    deleteButton.addEventListener("click", () => deleteGood(item));
    editButton.classList.add("quantBtn");
    deleteButton.classList.add("quantBtn");
    //--------------------------------------
    //добавляем в ячейку tdImage элемент для отображения картинки
    const imageInCart = document.createElement("img");
    tdImage.appendChild(imageInCart);
    imageInCart.setAttribute("src", `images/${item.imagePath}`);
    imageInCart.style.width = "50px";
    // **********************************************
    tdId.innerText = item.id;
    tdName.innerText = item.name;
    tdPrice.innerText = `${item.price} руб.`;
    tdDescription.innerText = item.description;
    //в одну ячейку размещаем кнопки +, - и количество
    tdButtons.append(editButton, deleteButton);
    tr.append(tdId, tdImage, tdName, tdPrice, tdDescription, tdButtons);
    goodsItemsElement.appendChild(tr);
  });
}

//-------------------------------------удаление товара---------------------------------------------
function deleteGood(item) {
  //удаляем элемент из массива.
  //используем splice, который удалить элементы массива с указанной позиции и в заданном количестве.
  //позицию находим, получив индекс элемента, найденный при сравнении имен. количество указано вторым параметром
  existingGoods.splice(
    existingGoods.findIndex((goodItem) => goodItem.name == item.name),
    1
  );
  renderGoods();
}


// ---------------------Функция обработчика события кнопки "Изменить"----------------------------------
function editGood(item) {
  const dialog = document.createElement("dialog");
  const form = document.createElement("form");
  const titleLabel = document.createElement("label");
  const titleInput = document.createElement("input");
  const descriptionLabel = document.createElement("label");
  const descriptionInput = document.createElement("input");
  const priceLabel = document.createElement("label");
  const priceInput = document.createElement("input");
  const saveButton = document.createElement("button");

  titleInput.value = item.name;
  descriptionInput.value = item.description;
  priceInput.value = item.price;

  titleLabel.textContent = "Название товара:";
  titleInput.type = "text";
  descriptionLabel.textContent = "Описание:";
  descriptionInput.type = "text";
  priceLabel.textContent = "Цена:";
  priceInput.type = "number";
  saveButton.textContent = "Сохранить";

  saveButton.addEventListener("click", (event) => {
    event.preventDefault();
    const updatedName = titleInput.value;
    const updatedDescription = descriptionInput.value;
    const updatedPrice = parseFloat(priceInput.value);

    if (updatedName && updatedDescription && !isNaN(updatedPrice)) {
      item.name = updatedName;
      item.description = updatedDescription;
      item.price = updatedPrice;

      dialog.close();

      renderGoods();
    } else {
      alert("Пожалуйста, введите корректные данные.");
    }
  });

  form.append(
    titleLabel,
    titleInput,
    descriptionLabel,
    descriptionInput,
    priceLabel,
    priceInput,
    saveButton
  );

  dialog.appendChild(form);
  document.body.appendChild(dialog);
  dialog.showModal();
}


// --------------------------------------сохранение каталога ---------------------------------------
async function loadFromLocalStorage() {
  try {
    const response = await fetch("goods.json");
    const data = await response.json();

    existingGoods = data.map((item) => ({
      imagePath: item.imagePath,
      name: item.name,
      description: item.description,
      price: item.price,
      id: item.id,
      category: item.category,
    }));
    console.log(existingGoods);
    // saveFromHtml();
    renderGoods();
    const saveToJsonButton = document.querySelector("#saveToJsonButton");
    saveToJsonButton.addEventListener("click", saveToJson);
  } catch (error) {
    console.error("Ошибка при загрузке данных из JSON-файла:", error);
  }
}

loadFromLocalStorage();
