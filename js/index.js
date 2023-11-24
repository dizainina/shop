//массив, хранящий элементы корзины
let cartItems = [];
let count = 1;
let totalPrice = 0;
let totalQuantity = 0;
let goodsList = [];
let goods = document.querySelector(".goods");


// фильтр по категориям
let categoryList = document.querySelectorAll(".categories li");


categoryList.forEach((category) => {
  category.addEventListener("click", () => {
    //получаем название категории из каждого элемента
    const selectedCategory = category.dataset.category;
    //очищаем каталог
    goods.innerHTML = "";
    //фильтруем все товары по категории кликнутого элемента из сайдбара
    const filteredGoods = goodsList.filter((good) => {
      return selectedCategory == "all" || good.category == selectedCategory
  });
  
    //выводим отфильтрованные товары на экран
    filteredGoods.forEach((good) => {
      goods.innerHTML += new Good(
        good.imagePath,
        good.name,
        good.description,
        good.price,
        good.id,
        good.category
      ).renderGood();
    });
    setListeners();
  });
});


// активные ссылки меню
$("#nav-menu li a").click(function () {
  $(this).closest(".menu").find(".active").removeClass("active");
  $(this).addClass("active");
});


//класс товара
class Good {
  constructor(imagePath, name, description, price, id, category) {
    this.imagePath = imagePath;
    this.name = name;
    this.description = description;
    this.price = price;
    this.id = id;
    this.category = category;
  }

  renderGood() {
    return `
            <div class="good" id="${this.id}" data-category="${this.category}">
                <img src="images/${this.imagePath}" alt="good">
                <h2 class="good-name">${this.name}</h2>
                <p class="good-description">${this.description}</p>
                <button class="product-size" id=${this.product_size}>Выбрать размер</button>
                <button class="product-detales" id=${this.product_detales}>Подробнее</button>
                <p class="good-price">${this.price}</p>
                <button class="add-to-cart-btn product-button">ДОБАВИТЬ</button>
            </div>
    `;
  }
}

//функция отображения количества товаров в корзине на индикаторе.
//можно вызывать при каждом изменении количества товаров в корзине(например, если вызывается метод saveCartItems)
async function showCartLength() {
  // document.querySelector("#cartIndicator").textContent = "0";
  document.querySelector("#cartIndicator").textContent = totalQuantity;
}

function renderGoodsList() {
  goodsList.forEach((good) => {
    goods.innerHTML += new Good(
      good.imagePath,
      good.name,
      good.description,
      good.price,
      good.id,
      good.category
    ).renderGood();
  });
}

//метод добавления товаров в корзину(массив)
function addToCart(event) {
  //находим товар, в котором был совершен клик
  const good = event.target.closest(".good");
  //получаем путь к изображению, обрезаем 'images/'
  const goodImage = good.querySelector("img").getAttribute("src");
  //вытаскиваем название этого товара
  const goodName = good.querySelector("h2").textContent;
  //вытаскиваем цену товара. так как в строке содержатся не только цифры, заменяем их с помощью регулярного выражения на пустоту, т.е. удаляем из строки
  const goodPrice = +good
    .querySelector(".good-price")
    .textContent.replace(/\D/g, "");
  //Элемент массива представляет объект, который хранит название, цену и количество(при добавлении 1)
  //если товар уже есть в массиве, то увеличиваем его количество на 1.
  //если товара нет, то добавляем в массив
  const existingItem = cartItems.find((item) => item.name == goodName);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({ imagePath: goodImage, name: goodName, price: goodPrice, quantity: count });
  }
  totalQuantity++;
  totalPrice += goodPrice;
  var cartIndicator = document.querySelector("#cartIndicator");
  cartIndicator.style.display = cartIndicator.style.display === 'none' ? 'block' : 'block';
  showCartLength();
  saveCartItems(cartItems, totalPrice);
}

//рендер корзины из массива
function renderCart() {
  const cartItemsElement = document.querySelector("#cart-item");
  cartItemsElement.innerHTML = "";
  //метод forEach не закончит работу, пока есть элементы в массиве.
  //.Для каждого элемента массива(item) создается tr, строка таблицы. Создается ячейка для каждого из значений элемента массива(название, цена, количество)
  cartItems.forEach((item) => {
    const tr = document.createElement("tr");
    const tdImage = document.createElement("td");
    const tdName = document.createElement("td");
    const tdPrice = document.createElement("td");
    const tdQuantity = document.createElement("td");
    const tdProductSum = document.createElement("td");

    //кнопки + и - для увеличения/уменьшения количества
    const plusButton = document.createElement("button");
    const minusButton = document.createElement("button");
    plusButton.textContent = "+";
    minusButton.textContent = "-";
    plusButton.addEventListener("click", () => {
      increaseQuantity(item);
      // showCartLength();
    });
    minusButton.addEventListener("click", () => {
      decreaseQuantity(item);
    })
    minusButton.classList.add("quantBtn");
    plusButton.classList.add("quantBtn");
    //--------------------------------------
    //добавляем в ячейку tdImage элемент для отображения картинки
    const imageInCart = document.createElement("img");
    tdImage.appendChild(imageInCart);
    imageInCart.setAttribute("src", item.imagePath);
    imageInCart.style.width = "50px";
    // **********************************************
    tdName.innerText = item.name;
    tdPrice.innerText = `${item.price} руб.`;
    //в одну ячейку размещаем кнопки +, - и количество
    tdQuantity.append(minusButton, item.quantity, plusButton);
    tdQuantity.classList.add("quantityCell");
    tdProductSum.innerText = `${item.price * item.quantity} руб.`;
    tr.append(tdImage, tdName, tdPrice, tdQuantity, tdProductSum);
    cartItemsElement.appendChild(tr);
  });
  document.querySelector(
    "#totalQuantity"
  ).innerText = `Всего товаров в корзине: ${totalQuantity} шт.`;
  document.querySelector(
    "#total-price"
  ).innerText = `Общая стоимость: ${totalPrice} руб.`;
}
//кнопка + увеличивает количество в корзине
function increaseQuantity(item) {
  item.quantity++;
  totalPrice += item.price;
  totalQuantity++;
  showCartLength();
  renderCart();
  saveCartItems(cartItems, totalPrice);
}
//кнопка - уменьшает количество в корзине
function decreaseQuantity(item) {
  if (item.quantity > 1) {
    item.quantity--;
    totalQuantity--;
    totalPrice -= item.price;
    showCartLength();
  } else {
    //удаляем элемент из массива, если текущее колиество при клике 1.
    //используем splice, который удалить элементы массива с указанной позиции и в заданном количестве.
    //позицию находим, получив индекс элемента, найденный при сравнении имен. количество указано вторым параметром
    cartItems.splice(
      cartItems.findIndex((cartItem) => cartItem.name == item.name),
      1
    );
    totalPrice -= item.price;
    totalQuantity--;
    showCartLength();
  }
  renderCart();
  saveCartItems(cartItems, totalPrice);
}

//метод сохранения объектов корзины в локальное хранилище браузера
//первый аргумент - ключ, произвольное имя
//второе - значение, которое будет записано в хранилище
//ключ и значение должны быть переданы в виде строки
function saveCartItems(cartItems, totalPrice) {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  localStorage.setItem("totalPrice", JSON.stringify(totalPrice));
}

async function setListeners() {
  //получаем коллекцию кнопок
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  //вешаем на каждую кнопку слушатель клика, при котором вызовется метод addToCart
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart);

    //слушатель события изменения текста для поля поиска товаров
    const searchInput = document.querySelector("#searchInput");
    searchInput.addEventListener("input", handleSearch);
  });
}

//поиск элемента по имени
function handleSearch() {
  const searchText = searchInput.value.toLowerCase();
  goodsList.forEach((good) => {
    const goodName = good.name.toLowerCase();
    const goodElement = document.getElementById(good.id);
    if (goodName.includes(searchText)) {
      goodElement.style.display = "block";
    } else {
      goodElement.style.display = "none";
    }
  });
}

async function loadFromLocalStorage() {
  const savedCartItems = localStorage.getItem("cartItems");
  const savedTotalPrice = localStorage.getItem("totalPrice");
  // const savedGoods = localStorage.getItem("goods");

  if (savedCartItems) {
    cartItems = JSON.parse(savedCartItems);
    cartItems.forEach((item) => {
      totalQuantity += item.quantity;
    });
    totalPrice = JSON.parse(savedTotalPrice);
    showCartLength();
  }

  try {
    const response = await fetch("goods.json");
    const data = await response.json();

    goodsList = data.map((item) => {
      return new Good(
        item.imagePath,
        item.name,
        item.description,
        item.price,
        item.id,
        item.category
      );
    });
    renderGoodsList();
    setListeners();
  } catch (error) {
    console.error("Ошибка при загрузке данных из JSON-файла:", error);
  }

}

// ----------------------------------------------------поп-ап

let popupBg = document.querySelector('.popup__bg'); // Фон попап окна
let popup = document.querySelector('.popup'); // Само окно
let openPopupButtons = document.querySelectorAll('.open-popup'); // Кнопки для показа окна
let closePopupButton = document.querySelector('.close-popup'); // Кнопка для скрытия окна

openPopupButtons.forEach((button) => { // Перебираем все кнопки
  button.addEventListener('click', (e) => { // Для каждой вешаем обработчик событий на клик
      e.preventDefault(); // Предотвращаем дефолтное поведение браузера
      popupBg.classList.add('active'); // Добавляем класс 'active' для фона
      popup.classList.add('active'); // И для самого окна
      renderCart();
  })
});

closePopupButton.addEventListener('click',() => { // Вешаем обработчик на крестик
  popupBg.classList.remove('active'); // Убираем активный класс с фона
  popup.classList.remove('active'); // И с окна
});

document.addEventListener('click', (e) => { // Вешаем обработчик на весь документ
  if(e.target === popupBg) { // Если цель клика - фот, то:
      popupBg.classList.remove('active'); // Убираем активный класс с фона
      popup.classList.remove('active'); // И с окна
  }
});

//вешаем на кнопку Оформления заказа обработчик клика
const orderBtn = document.querySelector(".order-btn");
orderBtn.addEventListener("click", checkout);

//оформление заказа(пока заглушка). В перспективе отправка данных заказа на сервер с отправкой пользователю сообщения о заказе. Сброс массива корзины, сброс стоимости, отрисовка пустой корзины
function checkout() {
  alert("Заказ оформлен! Спасибо за покупку!");
  cartItems = [];
  totalPrice = 0;
  totalQuantity = 0;
  var cartIndicator = document.querySelector("#cartIndicator");
  cartIndicator.style.display = cartIndicator.style.display === 'block' ? 'none' : 'none';
  renderCart();
  saveCartItems(cartItems, totalPrice);
}

//метод загрузки корзины из локального хранилища.
//полученные json-строки парсим в соответствующие переменные, которые изначально использовались для хранения корзины и стоимости
function loadCartItems() {
  const savedCartItems = localStorage.getItem("cartItems");
  const savedTotalPrice = localStorage.getItem("totalPrice");

  if (savedCartItems) {
    cartItems = JSON.parse(savedCartItems);
    totalPrice = JSON.parse(savedTotalPrice);
    renderCart();
  }
}

//загрузка сохраненных товаров при загрузке страницы
loadCartItems();

// -----------------------------------------------------------


loadFromLocalStorage();

// -------------------------------- летающие частицы на странице---------------
//Создаём класс для частиц
class Particle
{
   //Конструктор принимает положение частицы по трём осям и цвет
   constructor(x, y, z, color)
   {
       this.x = x;
       this.y = y;
       this.z = z;
 
       //Размытие и скорость зависят от положения частицы по оси Z
       //Чем выше частица, тем более размытой она будет и тем быстрее она будет двигаться
       let blurs = [ 0, 2, 1, 0 ];
 
       this.blur = blurs[z];
       this.speed = z;
       this.color = color;
   }
 
   //Метод движения частицы
   Move(d)
   {
       this.y += this.speed * d;
   }
}
 
//Позиция полосы прокрутки
let scrollPosition = 0;
 
//Получаем контейнер для частиц
const particlesContainer = document.getElementById("particles");
 
//Создаём массив с частицами
const particles =
[
   new Particle(1, 1, 3, "#ff5b01"),
   new Particle(1, 2, 6, "#ff5b01"),
   new Particle(1, 1, 4, "#ff5b01"),
   new Particle(1, 1, 5, "#ff5b01"),
   new Particle(2, 2, 2, "#ff5b01"),
   new Particle(2, 2, 1, "#ff5b01"),
   new Particle(96, 2, 3, "#6241af"),
   new Particle(98, 1, 2, "#6241af"),
   new Particle(96, 2, 4, "#6241af"),
   new Particle(98, 1, 5, "#6241af"),
   new Particle(97, 1, 6, "#6241af"),
   new Particle(97, 2, 1, "#6241af"),
];
 
//Это функция вывода частицы на страницу
Fill();
 
//При каждой прокрутке вызываем функцию Scroll(), которая двигает частицы
window.addEventListener("scroll", function (e) { Scroll(e); });
 
function Scroll(e)
{
   //Определяем, в каком направлении была прокрутка
   let d = 0;
 
   if(window.scrollY > scrollPosition)
   {
       d = 1;
   }
   else
   {
       d = -1;
   }
  
   scrollPosition = window.scrollY;
 
   //Двигаем все частицы в заданном направлении
   for(let i = 0; i < particles.length; i++)
   {
       particles[i].Move(d);
   }
 
   //Выводим всё на страницу
   Fill();
}
 
function Fill()
{
   //Очищаем контейнер
   particlesContainer.innerHTML = "";
 
   //Создаём новые элементы с обновлёнными свойствами и помещаем их в контейнер
   for(let i = 0; i < particles.length; i++)
   {
       let div = document.createElement("div");
       div.className = "particle";
 
       div.setAttribute("style", "top: " + particles[i].y + "%; left: " + particles[i].x + "%; z-index: " + particles[i].z + "%; filter: blur(" + particles[i].blur + "%); background: " + particles[i].color + "; ");
       particlesContainer.appendChild(div);
   }
}
// ----------------------------------------------


