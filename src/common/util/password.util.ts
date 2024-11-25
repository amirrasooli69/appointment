import {hashSync} from "bcrypt"
export function randomPassword(lenght: number){
    let result="";
    const characters = "sdfjguer04-dskjhsdf=dfjsdf-dfhgsdfjhjvs";
    const charactersLenght = characters.length;
    let counter = 0;
    while(counter < lenght){
        result += characters.charAt(Math.floor(Math.random() * charactersLenght))
        counter += 1;
    }

    return {
        password: result,
        hashed: hashSync(result, 12)
    }
}

export function hashPassword(data: string){
    return hashSync(data, 12)
}