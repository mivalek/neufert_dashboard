// https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
export const makeLabel = (string: string) => {
    string = string.replace("largest_room", "living room")
    string = string.replace("room_kitchen", "room-kitchen")
    return (string.charAt(0).toUpperCase() + string.slice(1)).replaceAll("_", " ");
}