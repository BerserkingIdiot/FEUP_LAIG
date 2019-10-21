/**
 * MyAnimation
 * Abstract class that every animation should extend.
 * Methods update() and apply() must be defined on subclasses.
 */
class MyAnimation {
    constructor() {
        // Following condition disables this class instantiation
        if(new.target === MyAnimation){
            throw new TypeError('Abstract class MyAnimation cannot be instantiated directly.');
        }
        // Following condition forces subclasses to instantiate update()
        if(typeof this.update !== 'function'){
            throw new TypeError('Class must override method update() from MyAnimation.')
        }
        // Following condition forces subclasses to instantiate apply()
        if(typeof this.apply !== 'function'){
            throw new TypeError('Class must override method update() from MyAnimation.')
        }
    }
}