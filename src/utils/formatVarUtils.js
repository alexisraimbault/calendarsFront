export const formatApostrophe = (s) => {
    if(!_.isString(s)) {
        return s;
    }
    
    const regex = /\'/gi;
    return s.replace(regex, "''")
}