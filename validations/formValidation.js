module.exports.registerValidation =(name,lastname,email,password,phone) =>{
    const errors =[];
    if(name === "") {
        errors.push({message:"Lütfen isim giriniz"})
    }
    if(password === "") {
        errors.push({message:"lütfen şifre giriniz"})
    }
    if(password.length < 6) {
        errors.push({message:"şifre en az 6 haneli olmalı"})
    }
    if(lastname === "") {
        errors.push({message:"lütfen soyisim  giriniz"})
    }
    if(email === "") {
        errors.push({message:"lütfen eposta  giriniz"})
    }
    if(phone === "") {
        errors.push({message:"lütfen telefon no  giriniz"})
    }


 
    return errors
}