async function linkerConfirm() {
    const name = document.getElementById('nameLinker').value;
    const url = document.getElementById('urlLinker').value;
    
    if (!name || !url) {
        alert('Заполните все поля!');
        return;
    }

    try {
        const response = await fetch('handler.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                nameLinker: name,
                urlLinker: url
            })
        });

        const result = await response.json();
        
        if (result.success) {
            alert('Ссылка добавлена!');
            location.reload();
        } else {
            alert('Ошибка: ' + result.message);
        }
    } catch (error) {
        alert('Ошибка сети: ' + error.message);
    }
}