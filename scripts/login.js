function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateText(valor) {
    if (valor == null || valor.length == 0 || /^\s+$/.test(valor)) {
        return false;
    }
    else {
        return true
    }
}

async function login() {
    let temToken 

    userEmail = document.getElementById('userEmail').value;
    if (validateEmail(userEmail)) {
        userPassword = document.getElementById('userPassword').value;
        if (validateText(userPassword)) {
            let login = { email: userEmail, password: userPassword }

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "email": userEmail,
                "password": userPassword
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'manual'
            };

            fetch("http://localhost:3000/login", requestOptions)
                .then(response => response.text())
                .then(result => {
                    // console.log(result)

                    temToken = result

                })
                .then(() => {
                    if (temToken.length > 34) {
                        localStorage.removeItem("tokenAdmin");
                        localStorage.setItem("token", temToken)
                        console.log(temToken)
                        alert('Bienvenido!!')
                        window.location.href = "./shop.html";
                    }
                    else {
                        alert('No pasas');
                    }
                })
                .catch((error) => { console.log('error', error) });


        } else {
            alert('Introdusca su Contraseña')
        }
    } else {
        alert('Introdusca su Usuario Correctamente')
    }
}

