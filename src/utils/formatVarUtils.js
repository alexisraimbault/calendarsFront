export const formatApostrophe = (s) => {
    if(!_.isString(s)) {
        return s;
    }
    
    const regex = /\'/gi;
    const regex2 = /\n/gi;
    return s.replace(regex, "''").replace(regex2, "<br>")
}