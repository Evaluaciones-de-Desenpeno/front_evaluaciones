export const login = (req, res) => {
    res.render("views.login.ejs");
}


export const menu = (req, res) => {
    res.render("views.menu.ejs");
}

export const objetivo = (req, res) => {
    res.render("views.objetivo.principal.ejs");
}

export const registro = (req, res) => {
    res.render("views.registro.ejs");
}

export const coorporativas = (req, res) => {
    res.render("views.competencias.coorporativas.ejs");
}

export const blandas = (req, res) => {
    res.render("views.competencias.blandas.ejs");
}
