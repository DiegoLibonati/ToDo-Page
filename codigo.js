// Obtengo datos
const tasksContainers = document.querySelectorAll(".list");
const tasksBtnsAccept = document.querySelectorAll(".btnAccept");
const tasksMenus = document.querySelectorAll(".menu");
const tasksBtnsHeader = document.querySelectorAll(".openMenu");
const tasksBtnsCloseHeader = document.querySelectorAll(".closeMenu");
const tasksBtnsClearAllTasks = document.querySelectorAll(".clearAllTasks");


// Al hacer click, obtengo los valores necesarios para agregarlos al LocalStorage
tasksBtnsAccept.forEach(function(tasksBtnAccept){

    tasksBtnAccept.addEventListener("click", ()=>{

        let tasksInputValue = tasksBtnAccept.parentElement.children[0].value;
        let tasksCategory = tasksBtnAccept.parentElement.parentElement.id;
        let tasksId = idGenerator(); 
        let tasksComplete = false;
        
        addLocalStorageItem(tasksId, tasksCategory, tasksInputValue, tasksComplete);

    });

});

// Se crea el localstorage
const addLocalStorageItem = (id, category, text, complete)=>{

    let arrayLocalStorage = getLocalStorage();
    insertTaskInContainer(id, category, text);

    const task = {id: id,category: category, text: text, complete: complete};

    arrayLocalStorage.push(task);

    localStorage.setItem("list", JSON.stringify(arrayLocalStorage));

}

// Se obtiene el localStorage
const getLocalStorage = ()=>{

    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];

}

// Se genera un ID, en base a la longitud del LocalStorage
const idGenerator = ()=>{

    let arrayLocalStorage = getLocalStorage();

    if (arrayLocalStorage.length === 0){
        let contador = 0;
        contador++
        return contador;
    } else {
        let contador = arrayLocalStorage[arrayLocalStorage.length - 1].id;
        contador++
        return contador;
    }
    

};


const deleteTaskMobile = ()=>{

    const btnsDeleteTask = document.querySelectorAll(".deleteTask");

    btnsDeleteTask.forEach(function(btnDeleteTask){

        btnDeleteTask.addEventListener("click", (e)=>{

            let arrayLocalStorage = getLocalStorage();
            const liContainer = e.currentTarget.parentElement.parentElement;
            const idContainer = e.currentTarget.parentElement.parentElement.id.replace( /^\D+/g, '');
            liContainer.remove();

            for (let i = 0; i < arrayLocalStorage.length; i++){
                if (idContainer == arrayLocalStorage[i].id){
                    const index = arrayLocalStorage.indexOf(arrayLocalStorage[i]);

                    arrayLocalStorage.splice(index, 1);

                    localStorage.setItem("list", JSON.stringify(arrayLocalStorage));
                    
                }

            }

        });
    
    });
    

}

const removeAndAddLineThroughInDesktop = ()=>{

    const lisContainers = document.querySelectorAll(".li");


    lisContainers.forEach(function(liContainer){

        liContainer.addEventListener("mousedown", (e)=>{
            switch (e.which){
                case 2:
                    let arrayLocalStorage = getLocalStorage();
                    const idContainer = e.currentTarget.id.replace( /^\D+/g, '');

                    for (let i = 0; i < arrayLocalStorage.length; i++){
                        if (idContainer == arrayLocalStorage[i].id){
                            
                            if (arrayLocalStorage[i].complete == false) {
                                liContainer.classList.add("line");
                                arrayLocalStorage[i].complete = true;
                                localStorage.setItem("list", JSON.stringify(arrayLocalStorage));
                            }

                        }

                    }
                break;

                case 3:
                    let arrayLocalStorage2 = getLocalStorage();
                    const liContainer2 = e.currentTarget;
                    const idContainer2 = e.currentTarget.id.replace( /^\D+/g, '');
        
                    liContainer2.remove();
        
                    for (let i = 0; i < arrayLocalStorage2.length; i++){
                        if (idContainer2 == arrayLocalStorage2[i].id){

                            const index = arrayLocalStorage2.indexOf(arrayLocalStorage2[i]);
        
                            arrayLocalStorage2.splice(index, 1);
        
                            localStorage.setItem("list", JSON.stringify(arrayLocalStorage2));
        
                        }
        
                    }
        
                break;
            }

        });

    });

}

// Con cada click, se genera un LI en la respectiva categoria
const insertTaskInContainer = (id, category,text)=>{

    tasksContainers.forEach(function(tasksContainer){

        const idContainer = tasksContainer.parentElement.parentElement.id;

        if (category === idContainer){
            tasksContainer.innerHTML += `
            
            <li class="li" id="${category}-${id}">
                <div>
                    <h2>${text}</h2>
                    <button type="button" class="deleteTask"><i class="fa-solid fa-trash"></i></button>
                </div>
            </li>

            `;
        }

    });

    deleteTaskMobile();
    removeAndAddLineThroughInDesktop();
    functionsMenuSection();
    dragsFunctions();

}

// lee el LocalStorage, cada vez que se refresca la pagina. En caso de que haya elementos los completa en el DOM, donde corresponde
const loadTasksInLocalStorage = ()=>{

    let arrayLocalStorage = getLocalStorage();

    tasksContainers.forEach(function(tasksContainer){

        const idContainer = tasksContainer.parentElement.parentElement.id;

        for (let i = 0; i < arrayLocalStorage.length; i++){
            
            if (arrayLocalStorage[i].category === idContainer){

                tasksContainer.innerHTML += `
                
                <li class="li" id="${arrayLocalStorage[i].category}-${arrayLocalStorage[i].id}">
                    <div>
                        <h2>${arrayLocalStorage[i].text}</h2>
                        <button type="button" class="deleteTask"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </li>
    
                `;

                if (arrayLocalStorage[i].complete === true){
                    for (let i = 0; i < tasksContainer.children.length; i++){
                        tasksContainer.children[tasksContainer.children.length - 1].classList.add("line");
                    }
                }

            }
            

        }

    });

    deleteTaskMobile();
    removeAndAddLineThroughInDesktop();
    functionsMenuSection();
    dragsFunctions();

}

const functionsMenuSection = () =>{ 



    tasksBtnsHeader.forEach(function(taskBtnHeader){

        taskBtnHeader.addEventListener("click", (e)=>{

            const menuContainer = e.currentTarget.parentElement.parentElement.children[2];

            menuContainer.classList.add("menu");

        });

    });

    tasksBtnsCloseHeader.forEach(function(taskBtnCloseHeader){

        taskBtnCloseHeader.addEventListener("click", (e)=>{

            const menuContainer = e.currentTarget.parentElement.parentElement;

            menuContainer.classList.remove("menu");

        });

    });

    tasksBtnsClearAllTasks.forEach(function(taskBtnClearAllTasks){

        taskBtnClearAllTasks.addEventListener("click", (e)=>{
            let arrayLocalStorage = getLocalStorage();
            const idContainer = e.currentTarget.parentElement.parentElement.parentElement.id;
            const liContainer = e.currentTarget.parentElement.parentElement.parentElement.children[3].children[0];
            
            liContainer.innerHTML = "";

            let filtered = arrayLocalStorage.filter(function(value){

               return value.category != idContainer;

            })

            localStorage.setItem("list", JSON.stringify(filtered));
        });

    });

}

const dragsFunctions = () => {

    const liContainers = document.querySelectorAll(".li");

    liContainers.forEach(function(liContainer){
        liContainer.draggable = true;
        liContainer.addEventListener("dragstart", (e)=>{
            e.dataTransfer.setData("text", e.target.id);
        });

        liContainer.addEventListener("dragend", (e)=>{
            let arrayLocalStorage = getLocalStorage();
            const finalCategoryLiContainer = e.currentTarget.parentElement.parentElement.parentElement.id.replace(/-\d+/g, '');
            const idLiContainer = e.currentTarget.id.replace( /^\D+/g, '');

            liContainer.setAttribute("id", `${finalCategoryLiContainer}-${idLiContainer}`);

            for (let i = 0; i < arrayLocalStorage.length; i++){
                if (idLiContainer == arrayLocalStorage[i].id){
                    arrayLocalStorage[i].category = finalCategoryLiContainer;

                    localStorage.setItem("list", JSON.stringify(arrayLocalStorage));
                }
            }

        });

    });

    tasksContainers.forEach(function(taskContainer){
        taskContainer.addEventListener("dragover", (e)=>{
            e.preventDefault()
        })

        taskContainer.addEventListener("drop", (e)=>{
            e.preventDefault();

            try{
                const data = e.dataTransfer.getData("text");
                e.target.appendChild(document.getElementById(data));
            }catch(e){}

        });

    });
}

    



loadTasksInLocalStorage();

