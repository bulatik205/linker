<?php
$main_host = "localhost";
$main_user = "root";
$main_pass = "root";
$main_db = "linker";

$main_pdo = new PDO(
    "mysql:host=$main_host;dbname=$main_db;charset=utf8mb4",
    $main_user,
    $main_pass,
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => true,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]
);

if (!isset($_COOKIE['userHash'])) {
    $token = md5(rand() . time());
    setcookie("userHash", $token, time() + (30 * 24 * 60 * 60), "/");
} else {
    $stmt = $main_pdo->prepare("SELECT id, link, title FROM linker WHERE userHash = ?");
    $stmt->execute([$_COOKIE["userHash"]]);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Linkers</title>
    <link rel="stylesheet" href="css/index.css">
</head>

<body>
    <!-- Кастомное контекстное меню -->
    <div class="custom-context-menu" id="contextMenu">
        <div class="menu-item" onclick="deleteLinker()">Удалить</div>
    </div>

    <div class="links">
        <div class="links--body">
            <?php if (isset($_COOKIE['userHash'])): ?>
                <?php if (empty($data)): ?>
                    <h1>Тут ничего нет! Добавим что нибудь?</h1>
                <?php else: ?>
                    <?php
                    foreach ($data as $linker) {
                        echo
                        "
                            <linker 
                                onclick=\"window.open('{$linker["link"]}', '_blank');\" 
                                oncontextmenu=\"showContextMenu(event, {$linker["id"]})\"
                                data-id='{$linker["id"]}'
                                data-title='{$linker["title"]}'
                                data-url='{$linker["link"]}'
                            >
                                <linker-title>{$linker["title"]}</linker-title>
                            </linker>
                        ";
                    }
                    ?>
                <?php endif ?>
            <?php else: ?>
                <h1>Тут ничего нет! Добавим что нибудь?</h1>
            <?php endif ?>
        </div>

        <div class="add--window">
            <h1>Добавить новую кнопку</h1>
            <label for="nameLinker">Название</label>
            <input type="text" id="nameLinker" maxlength="16" minlength="1" name="nameLinker" placeholder="exemple.com">
            <label for="urlLinker">Url</label>
            <input type="url" id="urlLinker" name="urlLinker" placeholder="https://">
            <button onclick="linkerConfirm()">Подтвердить</button>
        </div>
    </div>

    <script src="js/ajax.js"></script>
    <script src="js/menu.js"></script>
    <script src="js/color.js"></script>
</body>

</html>