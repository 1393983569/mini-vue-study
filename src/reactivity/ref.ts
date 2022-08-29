
import { trackEffects, triggerEffects } from './effect'

class RefImpl {
    private _value
    public dep
    constructor(value) {
        this._value = value
        this.dep = new Set()
    }

    get value() {
        trackEffects(this.dep)
        return  this._value
    }

    set value(val) {
        triggerEffects(this.dep)
    }
}

function ref(value) {
    return new RefImpl(value)
}

