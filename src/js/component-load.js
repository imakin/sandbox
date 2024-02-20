;export default function componentLoad(html_file){
    fetch(html_file)
    .then(response => response.text())
    .then(data => {
        let container = document.createElement("div");
        container.classList.add("component");
        container.classList.add("hidden");
        container.innerHTML = data;
        document.body.prepend(container);

        let scripts = container.getElementsByTagName("script");
        for (let i = 0; i < scripts.length; i++) {
            let new_script = document.createElement("script");
            new_script.textContent = scripts[i].textContent;
            if (scripts[i].type) new_script.type = scripts[i].type;
            if (scripts[i].src) new_script.src = scripts[i].src;
            document.head.appendChild(new_script);
            scripts[i].remove();
        }
    });
    return this;
};