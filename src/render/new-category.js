const form = document.querySelector('form');

form.addEventListener('submit', e =>{
    e.preventDefault();

    const name = 
        document.querySelector(
            '#category-name'
        ).value;
    ipcRenderer.send(
        'category:new',
        name
    );    
});