## Добавление бранчей в прокрутку

Это делает функция ```javascript stdf2_roullete.createBranch(?fake, html); ```
- Аргумент fake в данном виде прокрутке не нужен, он создает блок, который играет роль отступа
- Аргумент html задаёт разметку в бранче
Чтобы было легче задавать разметку есть ещё одна функция ```javascript stdf2_roullete.branchHTML($img/argument1, $color); ```

Примеры:
```javascript
stdf2_roullete.createBranch(false, stdf2_roullete.branchHTML({
    image: "assets/img/player3.png",
    color: "purple",
}));

stdf2_roullete.createBranch(false, stdf2_roullete.branchHTML("assets/img/player3.png", "purple"));
```


Можно создать блоки с помощью PHP с номерами, при этом нужно будет тогда изменить переменную счётчика в JS
После создания блоков, лучше прописать ```javascript stdf2_roullete.default() или stdf2_roullete.calc(); ```
Скрипт работает с учётом ширины бранчей, можно изменить ширину бранчей


## Прокрутка к блоку

Каждый элемент имеет номер, чтобы прокрутить к блоку нужно использовать функцию ```javascript stdf2_roullete.move_to_id(id, duration); ```
- Аргумент id, тут и так понятно
- Аргумент duration задаёт скорость прокрутки к бранчу, можно указать 0 чтобы мгновенно переместиться к блоку
