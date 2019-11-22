module.exports.emailValidator =  (emailIds) => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        regex = new RegExp(regex);
        let valid = false;
        for(let id of emailIds){
            if(!regex.test(id.value)){
                valid = false;
            }else {
                valid = true;
            }
        }
        return valid;    
}


module.exports.checkDuplicates = (array) => {
    this.setArray = [];    
    for(let x of array){
        this.setArray.push(x.value);   
    }
    return new Set(this.setArray).size != array.length;
}